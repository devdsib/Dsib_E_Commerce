"use client";

import React, { useState, useEffect } from "react";
import { productApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shared/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, Heart, Zap, Star, Truck, ShieldCheck, FileText, ChevronRight, Minus, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem, openCart, updateQuantity, items } = useCartStore();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const { product: data } = await productApi.getProductBySlug(slug);
        setProduct(data);
        
        // Fetch related products
        if (data.categoryId) {
          const { products: related } = await productApi.getProducts({ category: data.category.slug });
          setRelatedProducts(related.filter((p: any) => p.id !== data.id).slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Analyzing product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
        <Link href="/products"><Button className="mt-6">Browse All Products</Button></Link>
      </div>
    );
  }

  const stock = product.stockQuantity ?? product.stock ?? 0;
  const imageUrl = product.imageUrl ?? (product.images && product.images.length > 0 ? product.images[0] : "");
  const rating = product.rating ?? 5;
  const reviewsCount = product.reviewsCount ?? product._count?.reviews ?? 0;
  const discountPercent = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      updateQuantity(product.id, Math.min(existing.quantity + qty, stock));
    } else {
      addItem({ 
        id: product.id, 
        slug: product.slug, 
        name: product.name, 
        price: product.price, 
        discountPrice: product.discountPrice || undefined, 
        imageUrl: imageUrl, 
        brand: product.brand || "", 
        stock: stock 
      });
      if (qty > 1) updateQuantity(product.id, Math.min(qty, stock));
    }
    openCart();
  };

  // Product JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand || "DSIB Tech" },
    offers: {
      "@type": "Offer",
      price: product.discountPrice ?? product.price,
      priceCurrency: "INR",
      availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "DSIB Tech" },
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: rating, reviewCount: reviewsCount },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl border border-border bg-muted/20 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-lg text-center px-8">
                {product.name}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(product.images && product.images.length > 0 ? product.images : [imageUrl]).slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-lg border border-border bg-muted/10 flex items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden">
                {img ? <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" /> : <span className="text-muted-foreground/30 text-xs">Img {i}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--accent))" }}>{product.brand || "DSIB Tech"}</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="flex" style={{ color: "hsl(var(--cta))" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-current" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({reviewsCount} reviews)</span>
            {product.skillLevel && <span className="text-xs px-2 py-0.5 rounded-full ml-2" style={{ backgroundColor: "hsl(var(--accent) / 0.1)", color: "hsl(var(--accent))" }}>{product.skillLevel}</span>}
          </div>

          <div className="flex items-end gap-3 mb-4">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold" style={{ color: "hsl(var(--accent))" }}>₹{product.discountPrice.toLocaleString()}</span>
                <span className="text-lg text-muted-foreground line-through mb-0.5">₹{product.price.toLocaleString()}</span>
                <span className="text-sm font-semibold px-2 py-0.5 rounded-sm mb-0.5" style={{ backgroundColor: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>{discountPercent}% OFF</span>
              </>
            ) : (
              <span className="text-3xl font-bold" style={{ color: "hsl(var(--accent))" }}>₹{product.price.toLocaleString()}</span>
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-6">Inclusive of all taxes. GST invoice available ({product.gstPercentage || 18}% GST).</p>

          <div className="flex items-center gap-6 text-sm mb-6">
            <span className="text-muted-foreground">SKU: <span className="text-foreground font-mono">{product.sku}</span></span>
            <span className={`font-medium ${stock > 0 ? "text-green-600" : ""}`} style={stock <= 0 ? { color: "hsl(var(--destructive))" } : {}}>
              {stock > 0 ? `${stock > 20 ? "In Stock" : `Only ${stock} left`}` : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
            <div className="flex items-center border border-input rounded-md overflow-hidden">
              <button className="px-3 py-2 hover:bg-muted transition-colors" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="w-4 h-4" /></button>
              <span className="px-5 py-2 border-x border-input text-sm font-medium min-w-[3rem] text-center">{qty}</span>
              <button className="px-3 py-2 hover:bg-muted transition-colors" onClick={() => setQty(Math.min(stock, qty + 1))}><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button size="lg" className="flex-1 text-white font-bold h-12 text-base" style={{ backgroundColor: "hsl(var(--cta))" }} onClick={handleAddToCart} disabled={stock <= 0}>
              <Zap className="w-5 h-5 mr-2" /> Buy Now
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-12 text-base font-semibold" onClick={handleAddToCart} disabled={stock <= 0}>
              <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12 shrink-0"><Heart className="w-5 h-5" /></Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30">
              <Truck className="w-5 h-5 mb-1" style={{ color: "hsl(var(--accent))" }} /><span className="text-xs text-muted-foreground">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30">
              <ShieldCheck className="w-5 h-5 mb-1" style={{ color: "hsl(var(--accent))" }} /><span className="text-xs text-muted-foreground">{product.warranty || "1 Year Warranty"}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30">
              <FileText className="w-5 h-5 mb-1" style={{ color: "hsl(var(--accent))" }} /><span className="text-xs text-muted-foreground">GST Invoice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto flex-wrap">
          <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent px-6 py-3">Description</TabsTrigger>
          <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent px-6 py-3">Specifications</TabsTrigger>
          <TabsTrigger value="contents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent px-6 py-3">Package Contents</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent px-6 py-3">Reviews ({product._count?.reviews ?? product.reviewsCount ?? 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-6">
          <p className="text-base leading-relaxed text-foreground/80">{product.description}</p>
          {product.compatibility && product.compatibility.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Compatibility</h3>
              <div className="flex flex-wrap gap-2">
                {product.compatibility.map((item) => (
                  <span key={item} className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: "hsl(var(--accent) / 0.1)", color: "hsl(var(--accent))" }}>{item}</span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="specs" className="pt-6">
          {product.specifications && (
            <div className="border border-border rounded-lg overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <div key={key} className={`flex ${idx % 2 === 0 ? "bg-muted/30" : "bg-background"}`}>
                  <div className="w-1/3 px-4 py-3 font-medium text-sm text-foreground/80 border-r border-border">{key}</div>
                  <div className="flex-1 px-4 py-3 text-sm text-muted-foreground">{value}</div>
                </div>
              ))}
            </div>
          )}
          {product.datasheetUrl && <Button variant="outline" className="mt-4"><FileText className="w-4 h-4 mr-2" /> Download Datasheet</Button>}
        </TabsContent>
        <TabsContent value="contents" className="pt-6">
          {product.packageContents && (
            <ul className="space-y-2">
              {product.packageContents.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                  <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--accent))" }} />{item}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-semibold mb-2">Customer Reviews Coming Soon</p>
            <p className="text-sm">Be the first to review this product.</p>
            <Button className="mt-4 text-white" style={{ backgroundColor: "hsl(var(--accent))" }}>Write a Review</Button>
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}
    </div>
  );
}
