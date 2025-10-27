"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import ProductFormSection from "../AddProductForm";
import AddVariant from "./AddVariant";
import ProductImageAndCategories from "./configurable-product";
import {
  ConfigurableProductProvider,
  useConfigurableProduct,
} from "@/context/ConfigurableProductContext";
import { toast } from "sonner";
import AddAttribute from "./AddAttribute";

interface ProductFormContentProps {
  isSimpleProduct: boolean;
  isEdit?: boolean;
  productId?: string;
}

function ProductFormContent({ isSimpleProduct }: ProductFormContentProps) {
  const { baseProduct, variants, setVariants, resetBaseProduct } =
    useConfigurableProduct();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (!baseProduct.name.trim()) {
        toast.error("Product name is required");
        return;
      }

      if (!baseProduct.categoryId) {
        toast.error("Category is required");
        return;
      }

      if (!baseProduct.subCategoryId) {
        toast.error("Sub-category is required");
        return;
      }

      if (!baseProduct.mainImage) {
        toast.error("Main product image is required");
        return;
      }

      if (baseProduct.basePrice <= 0) {
        toast.error("Base price must be greater than 0");
        return;
      }

      if (variants.length === 0) {
        toast.error("At least one variant is required");
        return;
      }

      // Validate each variant has attributes
      for (let i = 0; i < variants.length; i++) {
        if (variants[i].attributes.length === 0) {
          toast.error(`Variant ${i + 1} must have at least one attribute`);
          return;
        }
      }

      // Prepare FormData
      const formData = new FormData();

      // Add base product data
      formData.append("name", baseProduct.name);
      formData.append("description", baseProduct.description);
      formData.append("basePrice", baseProduct.basePrice.toString());
      formData.append("baseQuantity", baseProduct.baseQuantity.toString());
      formData.append("baseDiscountPrice", baseProduct.baseDiscountPrice.toString());
      formData.append("categoryId", baseProduct.categoryId);
      formData.append("subCategoryId", baseProduct.subCategoryId);
      
      if (baseProduct.brandId) {
        formData.append("brandId", baseProduct.brandId);
      }

      // Add main image
      if (baseProduct.mainImage) {
        formData.append("mainImage", baseProduct.mainImage);
      }

      // Add thumbnails (base/fallback images)
      baseProduct.thumbnails.forEach((file, index) => {
        formData.append(`thumbnails[${index}]`, file);
      });

      // Prepare variants data (without File objects)
      const variantsData = variants.map((v) => ({
        price: v.price,
        qty: v.qty,
        offerPrice: v.offerPrice,
        attributes: v.attributes.map((a) => ({
          attributeId: a.attributeId,
          valueId: a.valueId,
        })),
      }));

      formData.append("variants", JSON.stringify(variantsData));

      // Add variant images separately
      variants.forEach((variant, variantIndex) => {
        variant.images.forEach((file, imgIndex) => {
          formData.append(`variantImages[${variantIndex}][${imgIndex}]`, file);
        });
      });

      // Submit to API
      const response = await fetch("/api/product/withvariant", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create product");
      }

      const result = await response.json();

      toast.success("Product created successfully!");
      console.log("Created product:", result.product);

      // Reset form
      resetBaseProduct();
      setVariants([]);

    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-9 px-4 cursor-pointer"
        >
          {loading ? "Saving..." : "Add Product"}
        </Button>
      </div>

      <div className="flex gap-3 w-full items-start">
        <div className="w-1/2">
          <ProductFormSection />
        </div>
        <div className="w-1/2">
          <ProductImageAndCategories />
        </div>
      </div>
      {isSimpleProduct ? <AddAttribute /> : <AddVariant />}
    </div>
  );
}

function ProductFormLayout({ isSimpleProduct }: { isSimpleProduct: boolean }) {
  return (
    <ConfigurableProductProvider>
      <ProductFormContent isSimpleProduct={isSimpleProduct} />
    </ConfigurableProductProvider>
  );
}

export default ProductFormLayout;