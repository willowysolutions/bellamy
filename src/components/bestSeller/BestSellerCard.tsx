"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { rupee } from "@/constants/values";
import { isLoggedIn } from "@/lib/utils";
import { addLocalCartItem } from "@/lib/local-cart";
import { useCart, useWishlist } from "@/context/cartContext";
import { addToWishlist } from "@/server/actions/wishlist-action";

type BestSellerCardProps = {
  id: string;
  name: string;
  price: string;
  image: string;
  variantId: string;
  isInCart?: boolean;
  isInWishlist?: boolean;
};

export default function BestSellerCard({
  id,
  name,
  price,
  image,
  variantId,
  isInCart,
  isInWishlist,
}: BestSellerCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isInCartState, setIsInCartState] = useState(isInCart);
  const [isInWishlistState, setIsInWishlistState] = useState(isInWishlist);

  const router = useRouter();
  const { updateCartCount } = useCart();
  const { updateWishlistCount } = useWishlist();

  /* -------------------------------- handlers -------------------------------- */

  const handleMouseDown = () => setIsDragging(false);
  const handleMouseMove = () => setIsDragging(true);

  const handleCardClick = () => {
    if (!isDragging) router.push(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsCartLoading(true);

    startTransition(async () => {
      try {
        if (isLoggedIn()) {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ variantId, quantity: 1 }),
          });
        } else {
          addLocalCartItem(variantId, 1);
        }

        setIsInCartState(true);
        await updateCartCount();
        toast.success(`Added "${name}" to cart`);
      } catch {
        toast.error("Failed to add to cart");
      } finally {
        setIsCartLoading(false);
      }
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlistLoading(true);

    startTransition(async () => {
      try {
        if (!isLoggedIn()) {
          router.push("/login");
          return;
        }

        await addToWishlist({ variantId });
        setIsInWishlistState(true);
        await updateWishlistCount();
        toast.success(`Added "${name}" to wishlist`);
      } catch {
        toast.error("Failed to update wishlist");
      } finally {
        setIsWishlistLoading(false);
      }
    });
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <div
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onDragStart={(e) => e.preventDefault()}
      className="group cursor-pointer flex-shrink-0 w-full sm:w-[300px] md:w-[310px] lg:w-[320px]"
    >
      {/* Image */}
      <div className="relative w-full h-[480px] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          draggable={false}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}

        {/* Action buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {/* Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isPending || isCartLoading || isInCartState}
            className="group/btn h-12 px-4 rounded-full bg-white shadow-lg backdrop-blur-sm flex items-center gap-2 transition-all"
          >
            {isCartLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ShoppingCart size={18} />
            )}
            <span className="max-w-0 group-hover/btn:max-w-xs overflow-hidden transition-all text-sm">
              {isInCartState ? "In Cart" : "Add"}
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={handleToggleWishlist}
            disabled={isPending || isWishlistLoading}
            className="group/btn h-12 px-4 rounded-full bg-white shadow-lg backdrop-blur-sm flex items-center gap-2 transition-all"
          >
            {isWishlistLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Heart
                size={18}
                fill={isInWishlistState ? "currentColor" : "none"}
                className={isInWishlistState ? "text-amber-600" : ""}
              />
            )}
            <span className="max-w-0 group-hover/btn:max-w-xs overflow-hidden transition-all text-sm">
              Wishlist
            </span>
          </button>

          {/* View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${id}`);
            }}
            className="group/btn h-12 px-4 rounded-full bg-white shadow-lg backdrop-blur-sm flex items-center gap-2 transition-all"
          >
            <Eye size={18} />
            <span className="max-w-0 group-hover/btn:max-w-xs overflow-hidden transition-all text-sm">
              View
            </span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 flex flex-col gap-1">
        <h3 className="text-sm text-gray-500 line-clamp-2">{name}</h3>
        <div className="font-bold text-base">
          {rupee}
          {price}
        </div>
      </div>
    </div>
  );
}
