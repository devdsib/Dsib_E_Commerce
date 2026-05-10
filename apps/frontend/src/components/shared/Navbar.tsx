"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

function NavbarContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalItems() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && router) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter" style={{ color: "hsl(var(--primary))" }}>
              DSIB <span style={{ color: "hsl(var(--accent))" }}>TECH</span>
            </span>
          </Link>
        </div>

        {/* Search Bar (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search components, robotics kits, modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 py-2 pr-10 rounded-full border border-input bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-muted-foreground hover:text-accent">
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative group">
              <Heart className="h-5 w-5 transition-colors group-hover:text-red-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: "hsl(var(--cta))" }}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="relative group" onClick={openCart}>
            <ShoppingCart className="h-5 w-5 transition-colors group-hover:text-accent" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: "hsl(var(--cta))" }}>
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Button>
          <Link href="/account" className="hidden md:block">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Mega Menu Bar (Hidden on Mobile) */}
      <nav className="hidden md:block border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 h-10 flex items-center gap-6 text-sm font-medium text-muted-foreground overflow-x-auto">
          <Link href="/products" className="hover:text-accent transition-colors whitespace-nowrap font-semibold">All Products</Link>
          <Link href="/products?cat=arduino" className="hover:text-accent transition-colors whitespace-nowrap">Arduino</Link>
          <Link href="/products?cat=raspberry-pi" className="hover:text-accent transition-colors whitespace-nowrap">Raspberry Pi</Link>
          <Link href="/products?cat=esp32" className="hover:text-accent transition-colors whitespace-nowrap">ESP32 & IoT</Link>
          <Link href="/products?cat=sensors" className="hover:text-accent transition-colors whitespace-nowrap">Sensors</Link>
          <Link href="/products?cat=robotics" className="hover:text-accent transition-colors whitespace-nowrap">Robotics</Link>
          <Link href="/products?cat=displays" className="hover:text-accent transition-colors whitespace-nowrap">Displays</Link>
          <Link href="/products?cat=motors" className="hover:text-accent transition-colors whitespace-nowrap">Motors</Link>
          <Link href="/products?cat=power" className="hover:text-accent transition-colors whitespace-nowrap">Power Modules</Link>
          <Link href="/products?cat=stem-kits" className="hover:text-accent transition-colors whitespace-nowrap font-semibold" style={{ color: "hsl(var(--cta))" }}>STEM Kits</Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background py-4 px-4 space-y-3">
          <form onSubmit={handleSearch} className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 py-2 pr-10 rounded-full border border-input bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-muted-foreground hover:text-accent">
              <Search className="h-5 w-5" />
            </button>
          </form>
          {[
            { label: "All Products", href: "/products" },
            { label: "Arduino", href: "/products?cat=arduino" },
            { label: "Raspberry Pi", href: "/products?cat=raspberry-pi" },
            { label: "ESP32 & IoT", href: "/products?cat=esp32" },
            { label: "Sensors", href: "/products?cat=sensors" },
            { label: "Robotics", href: "/products?cat=robotics" },
            { label: "STEM Kits", href: "/products?cat=stem-kits" },
            { label: "My Account", href: "/account" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 px-3 text-sm font-medium text-muted-foreground hover:text-accent hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-background animate-pulse" />}>
      <NavbarContent />
    </Suspense>
  );
}
