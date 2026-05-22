"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, PackageOpen } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    rating?: number;
    reviewsCount?: number;
    imageUrl?: string;
    images?: string[];
    stock?: number;
    stockQuantity?: number;
    brand?: string | null;
    gstPercentage?: number;
    _count?: {
      reviews: number;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  
  // Normalize data from mock vs API
  const stock = product.stockQuantity ?? product.stock ?? 0;
  const imageUrl = product.imageUrl ?? (product.images && product.images.length > 0 ? product.images[0] : "");
  const rating = product.rating ?? 5; // Default to 5 for now
  const reviewsCount = product.reviewsCount ?? product._count?.reviews ?? 0;
  const brand = product.brand || "";
  const discountPrice = product.discountPrice ?? undefined;

  const isOutOfStock = stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        discountPrice: discountPrice || undefined,
        imageUrl: imageUrl,
        brand: brand,
        stock: stock,
        gstPercentage: product.gstPercentage || 18,
      });
      openCart();
    }
  };

  return (
    <Card className="group relative overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 hover:border-accent/40">
      {/* Discount Badge */}
      {discountPrice && (
        <div className="absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 py-1 rounded-sm" style={{ backgroundColor: "hsl(var(--destructive))" }}>
          {Math.round(((product.price - discountPrice) / product.price) * 100)}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
        <Heart className="w-4 h-4" />
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted/20">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:scale-105 transition-transform duration-500 text-center px-4">
            <PackageOpen className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">{product.name}</span>
          </div>
        )}
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Brand */}
        {brand && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            {brand}
          </span>
        )}
        
        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1 mt-2 mb-3">
          <div className="flex" style={{ color: "hsl(var(--cta))" }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-current" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewsCount})</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-2 flex items-end gap-2">
          {discountPrice ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold" style={{ color: "hsl(var(--accent))" }}>₹{Math.round(discountPrice * (1 + (product.gstPercentage || 18) / 100)).toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground">(Incl. GST)</span>
              </div>
              <span className="text-xs text-muted-foreground line-through mb-0.5 ml-1">₹{Math.round(product.price * (1 + (product.gstPercentage || 18) / 100)).toLocaleString()}</span>
            </>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold" style={{ color: "hsl(var(--accent))" }}>₹{Math.round(product.price * (1 + (product.gstPercentage || 18) / 100)).toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground">(Incl. GST)</span>
            </div>
          )}
        </div>

        {/* Stock indicator */}
        {stock > 0 && stock <= 20 && (
          <span className="text-xs text-orange-500 mt-1">Only {stock} left!</span>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full font-semibold transition-all text-white"
          style={{ backgroundColor: isOutOfStock ? undefined : "hsl(var(--cta))" }}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
