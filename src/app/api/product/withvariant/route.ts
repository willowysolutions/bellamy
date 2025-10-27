// ============================================
// API ROUTE: app/api/products/route.ts (Optimized)
// ============================================
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client
import uploadPhoto from "@/lib/upload"; // Assuming this is your image upload utility
import { Prisma } from "@prisma/client";

// Simple function to generate a unique SKU
function generateSKU(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`.toUpperCase();
}

interface VariantInput {
  price?: number;
  qty?: number;
  offerPrice?: number;
  // NOTE: This interface now expects File objects for processing
  images: File[];
  attributes: {
    attributeId: string;
    valueId: string;
  }[];
}

// --- MAIN OPTIMIZED HANDLER ---
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 1. Parse all input data from FormData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    // Safely parse numbers, coercing null/NaN to 0 or undefined
    const basePrice = parseFloat(formData.get("basePrice") as string) || 0;
    const baseQuantity = parseInt(formData.get("baseQuantity") as string) || 0;
    const baseDiscountPrice = parseFloat(formData.get("baseDiscountPrice") as string) || 0;

    const brandId = (formData.get("brandId") as string) || null;
    const categoryId = formData.get("categoryId") as string;
    const subCategoryId = formData.get("subCategoryId") as string;

    const mainImage = formData.get("mainImage") as File;

    const thumbnails: File[] = [];
    let thumbnailIndex = 0;
    while (formData.has(`thumbnails[${thumbnailIndex}]`)) {
      thumbnails.push(formData.get(`thumbnails[${thumbnailIndex}]`) as File);
      thumbnailIndex++;
    }

    const variantsData = JSON.parse(formData.get("variants") as string);
    const variants: VariantInput[] = variantsData.map((v: VariantInput, index: number) => {
      const variantImages: File[] = [];
      let imgIndex = 0;
      while (formData.has(`variantImages[${index}][${imgIndex}]`)) {
        variantImages.push(formData.get(`variantImages[${index}][${imgIndex}]`) as File);
        imgIndex++;
      }
      return {
        price: v.price,
        qty: v.qty,
        offerPrice: v.offerPrice,
        images: variantImages,
        attributes: v.attributes,
      };
    });

    // 2. Initial Validation (Quick exit for essential fields)
    if (!name || !categoryId || !subCategoryId || !mainImage || basePrice <= 0 || variants.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid required product data (name, category, price, or variants)" },
        { status: 400 }
      );
    }

    // 3. 🚀 OPTIMIZATION: UPLOAD ALL IMAGES OUTSIDE THE TRANSACTION 🚀
    // The main bottleneck (network I/O) is now separated.

    // Upload main image
    const mainImageUrl = await uploadPhoto(mainImage);
    
    // Upload thumbnails (concurrently)
    const thumbnailUrls = await Promise.all(
      thumbnails.map((img) => uploadPhoto(img))
    );

    // Prepare all variant data, including uploading their specific images (concurrently per variant)
    const processedVariantsPromises = variants.map(async (variant) => {
      let variantImageUrls: string[];

      if (variant.images && variant.images.length > 0) {
        // Upload variant-specific images concurrently
        variantImageUrls = await Promise.all(
          variant.images.map((img) => uploadPhoto(img))
        );
      } else {
        // Fallback to base thumbnails
        variantImageUrls = thumbnailUrls;
      }

      return {
        ...variant,
        // The images field now holds the URLs (strings) instead of File objects
        imageUrls: variantImageUrls, 
        finalPrice: variant.price ?? basePrice,
        finalQty: variant.qty ?? baseQuantity,
        // Only set offerPrice if it's a positive number, otherwise it's undefined (NULL in DB)
        finalOfferPrice: (variant.offerPrice ?? baseDiscountPrice) > 0 
          ? (variant.offerPrice ?? baseDiscountPrice) 
          : undefined, 
      };
    });

    const processedVariants = await Promise.all(processedVariantsPromises);


    // 4. 🚀 OPTIMIZATION: Increase Transaction Timeout 🚀
    // Set a higher timeout (e.g., 20 seconds/20000ms) to accommodate multiple slow inserts.
    const product = await prisma.$transaction(async (tx) => {
      
      // 1. Create the parent product
      const newProduct = await tx.product.create({
        data: {
          name,
          description,
          image: mainImageUrl,
          brandId: brandId || undefined,
          categoryId,
          subCategoryId,
        },
      });

      // 2. Create variants
      for (const variant of processedVariants) {
        
        // Generate unique SKU
        const sku = `SKU-${generateSKU()}`;

        // Create variant
        const newVariant = await tx.productVariant.create({
          data: {
            productId: newProduct.id,
            sku,
            price: variant.finalPrice,
            offerPrice: variant.finalOfferPrice,
            qty: variant.finalQty,
            images: variant.imageUrls,
          },
        });

        // 3. Prepare Variant Options for Batch Insert
        // Instead of individual creates, we'll collect them for one 'createMany' later (if possible with MongoDB)
        // For MongoDB, createMany is not fully supported for nested writes or unique constraints like this,
        // so we'll collect the data and use individual createMany calls per variant, 
        // which is better than individual 'create' calls.
        
        // 🚀 OPTIMIZATION: Use createMany for attributes PER VARIANT 🚀
        const variantOptionsData = variant.attributes.map((attr) => ({
          productVariantId: newVariant.id,
          attributeId: attr.attributeId,
          valueId: attr.valueId,
        }));

        await tx.variantOption.createMany({
            data: variantOptionsData,
        });
      }

      return newProduct;
    }, {
        // The previous error suggested 5488ms, so 20000ms is a safe value.
        timeout: 20000, 
    });


    // 5. Fetch complete product with relations (outside the transaction)
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        brand: true,
        category: true,
        subCategory: true,
        variants: {
          include: {
            options: {
              include: {
                attribute: true,
                attributeValue: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: completeProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    // Check for unique constraint violation (P2002) or transaction timeout (P2028)
    const details = error instanceof Error ? error.message : "Unknown error";
    
    console.error("Product creation error:", error);
    
    // A specific check for the timeout error (P2028 is for the general transaction timeout)
    if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2028') {
        return NextResponse.json(
            { error: "Transaction timed out. Please try again or reduce the number of variants." },
            { status: 503 }
        );
    }

    return NextResponse.json(
      {
        error: "Failed to create product",
        details: details,
      },
      { status: 500 }
    );
  }
}