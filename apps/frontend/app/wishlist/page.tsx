"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (item: any) => {
    addItem(item);
    removeItem(item.id);
    toast.success(`${item.name} moved to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
        >
          <Heart className="w-12 h-12" style={{ color: "hsl(var(--accent))" }} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Save your favourite items here and come back to them anytime.
        </p>
        <Link href="/products">
          <Button
            className="text-white font-semibold"
            style={{ backgroundColor: "hsl(var(--cta))" }}
          >
            Browse Products <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearWishlist} className="text-destructive border-destructive/30 hover:bg-destructive/10">
          <Trash2 className="w-4 h-4 mr-2" /> Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden border-border/50 hover:border-accent/30 transition-colors">
            <CardContent className="p-0">
              <Link href={`/products/${item.slug}`}>
                <div className="relative h-48 bg-muted/30 overflow-hidden flex items-center justify-center">
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-muted-foreground/20 text-sm">No Image</div>
                  )}
                  {item.discountPrice && (
                    <span className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "hsl(var(--cta))" }}>
                      {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-accent transition-colors mb-2">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold" style={{ color: "hsl(var(--accent))" }}>
                    ₹{(item.discountPrice ?? item.price).toLocaleString()}
                  </span>
                  {item.discountPrice && (
                    <span className="text-xs text-muted-foreground line-through">₹{item.price.toLocaleString()}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 text-white text-xs"
                    style={{ backgroundColor: "hsl(var(--cta))" }}
                    onClick={() => handleMoveToCart(item)}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Move to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => { removeItem(item.id); toast.info("Removed from wishlist"); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
