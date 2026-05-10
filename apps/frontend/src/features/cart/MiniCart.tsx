"use client";

import React from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

export function MiniCart() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, totalItems, subtotal, gstAmount, total } = useCartStore();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold">Your Cart</h2>
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{totalItems()} items</span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Add some electronic components to get started!</p>
              <Link href="/products" onClick={closeCart}>
                <Button className="mt-6 bg-accent hover:bg-accent/90 text-white">Browse Products</Button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 rounded-lg border border-border bg-card group">
                {/* Image */}
                <div className="w-20 h-20 rounded-md bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground/30">IMG</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} onClick={closeCart}>
                    <h4 className="text-sm font-semibold line-clamp-2 hover:text-accent transition-colors">{item.name}</h4>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.brand}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-accent">
                      ₹{((item.discountPrice ?? item.price) * item.quantity).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium">₹{Math.round(gstAmount()).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base">
                <span className="font-bold">Total</span>
                <span className="font-bold text-accent">₹{Math.round(total()).toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full h-12 bg-cta hover:bg-cta/90 text-white font-bold text-base">
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/products" onClick={closeCart}>
              <Button variant="ghost" className="w-full text-sm text-muted-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
