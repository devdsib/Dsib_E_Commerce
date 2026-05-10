"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductFilters } from "@/features/products/ProductFilters";
import { productApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, List, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

// ── Sample fallback data shown instantly while the real API loads ─────────────
const SAMPLE_PRODUCTS = [
  { id: "s1", slug: "arduino-uno-r3-development-board", name: "Arduino Uno R3 ATmega328P", sku: "ARD-UNO-R3", price: 899, discountPrice: 549, stockQuantity: 150, brand: "Arduino", images: [], isFeatured: true, category: { name: "Arduino", slug: "arduino" }, _count: { reviews: 42 } },
  { id: "s2", slug: "esp32-devkit-v1-wifi-bluetooth", name: "ESP32 DevKit V1 WiFi + Bluetooth", sku: "ESP32-DEVKIT-V1", price: 599, discountPrice: 399, stockQuantity: 230, brand: "Espressif", images: [], isFeatured: true, category: { name: "ESP32 & IoT", slug: "esp32" }, _count: { reviews: 38 } },
  { id: "s3", slug: "raspberry-pi-4-model-b-4gb", name: "Raspberry Pi 4 Model B – 4GB RAM", sku: "RPI4-4GB", price: 5499, discountPrice: 4799, stockQuantity: 45, brand: "Raspberry Pi Foundation", images: [], isFeatured: true, category: { name: "Raspberry Pi", slug: "raspberry-pi" }, _count: { reviews: 55 } },
  { id: "s4", slug: "ultrasonic-sensor-hc-sr04", name: "HC-SR04 Ultrasonic Distance Sensor", sku: "SEN-US-04", price: 99, discountPrice: 59, stockQuantity: 500, brand: "Generic", images: [], isFeatured: false, category: { name: "Sensors", slug: "sensors" }, _count: { reviews: 27 } },
  { id: "s5", slug: "universal-robotics-trainer-kit-v01", name: "Universal Robotics Trainer Kit V0.1", sku: "DSIB-URTK-V01", price: 7999, discountPrice: 4999, stockQuantity: 32, brand: "DSIB Tech", images: [], isFeatured: true, category: { name: "Robotics Kits", slug: "robotics" }, _count: { reviews: 20 } },
  { id: "s6", slug: "servo-motor-sg90-micro", name: "SG90 Micro Servo Motor 9g", sku: "MOT-SG90", price: 149, discountPrice: 89, stockQuantity: 800, brand: "TowerPro", images: [], isFeatured: false, category: { name: "Motors", slug: "motors" }, _count: { reviews: 31 } },
  { id: "s7", slug: "oled-display-128x64-i2c-ssd1306", name: '0.96" OLED Display Module 128x64 I2C', sku: "DISP-OLED-128x64", price: 249, discountPrice: 159, stockQuantity: 340, brand: "Generic", images: [], isFeatured: true, category: { name: "Displays", slug: "displays" }, _count: { reviews: 18 } },
  { id: "s8", slug: "lm2596-dc-dc-buck-converter", name: "LM2596 DC-DC Step Down Buck Converter", sku: "PWR-LM2596", price: 79, discountPrice: 49, stockQuantity: 620, brand: "Generic", images: [], isFeatured: false, category: { name: "Power Modules", slug: "power" }, _count: { reviews: 14 } },
  { id: "s9", slug: "stem-iot-smart-home-kit", name: "STEM IoT Smart Home Learning Kit", sku: "DSIB-STEM-IOT-01", price: 3999, discountPrice: 2999, stockQuantity: 55, brand: "DSIB Tech", images: [], isFeatured: true, category: { name: "STEM Kits", slug: "stem-kits" }, _count: { reviews: 9 } },
  { id: "s10", slug: "jumper-wire-kit-120pcs", name: "Jumper Wire Kit 120pcs (M-M / M-F / F-F)", sku: "WIRE-JMP-120", price: 199, discountPrice: 129, stockQuantity: 1200, brand: "Generic", images: [], isFeatured: false, category: { name: "Connectors", slug: "connectors" }, _count: { reviews: 61 } },
  { id: "s11", slug: "drone-frame-f450-quadcopter", name: "F450 Quadcopter Drone Frame Kit", sku: "DRN-F450", price: 799, discountPrice: 599, stockQuantity: 67, brand: "DJI Compatible", images: [], isFeatured: false, category: { name: "Drones", slug: "drones" }, _count: { reviews: 12 } },
  { id: "s12", slug: "ne555-timer-ic-dip8", name: "NE555 Timer IC DIP-8 (Pack of 5)", sku: "IC-NE555", price: 69, discountPrice: 49, stockQuantity: 3000, brand: "Texas Instruments", images: [], isFeatured: false, category: { name: "ICs & Semiconductors", slug: "ics" }, _count: { reviews: 7 } },
];

// Skeleton card component
function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-muted/50 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 bg-muted/50 animate-pulse rounded w-1/3" />
        <div className="h-4 bg-muted/50 animate-pulse rounded w-full" />
        <div className="h-4 bg-muted/50 animate-pulse rounded w-2/3" />
        <div className="h-3 bg-muted/50 animate-pulse rounded w-1/4" />
        <div className="h-9 bg-muted/40 animate-pulse rounded mt-2" />
      </CardContent>
    </Card>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams?.get("cat") || "";
  const searchQuery = searchParams?.get("q") || "";

  const [products, setProducts] = useState<any[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [apiLoaded, setApiLoaded] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch from API with timeout
  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory) params.category = selectedCategory;

        const { products: data } = await productApi.getProducts(params);
        if (!cancelled && data?.length > 0) {
          setProducts(data);
          setApiLoaded(true);
        }
      } catch (error) {
        console.warn("API unavailable — showing sample products");
        // Keep SAMPLE_PRODUCTS already in state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProducts();
    return () => { cancelled = true; };
  }, [selectedCategory]);

  // Sync URL category param
  useEffect(() => {
    if (categoryParam !== selectedCategory) setSelectedCategory(categoryParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  useEffect(() => {
    if (selectedCategory !== categoryParam) {
      router.push(selectedCategory ? `/products?cat=${selectedCategory}` : `/products`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      );
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand || ""));
    }
    const effectivePrice = (p: any) => p.discountPrice ?? p.price;
    result = result.filter(p => effectivePrice(p) >= priceRange[0] && effectivePrice(p) <= priceRange[1]);
    if (selectedRating > 0) {
      result = result.filter(p => (p.rating ?? 5) >= selectedRating);
    }
    if (selectedSkillLevel) {
      result = result.filter(p => p.skillLevel === selectedSkillLevel);
    }
    if (inStockOnly) {
      result = result.filter(p => (p.stockQuantity ?? p.stock ?? 0) > 0);
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
      case "price-desc": result.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
      case "rating": result.sort((a, b) => (b._count?.reviews || 0) - (a._count?.reviews || 0)); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); break;
      case "featured":
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); break;
    }
    return result;
  }, [products, selectedBrands, priceRange, selectedRating, selectedSkillLevel, inStockOnly, sortBy, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2">
          Browse {loading ? "..." : filteredProducts.length} electronic components, kits, and modules
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin inline-block" />}
          {!loading && apiLoaded && <span className="text-xs text-green-600 font-medium">● Live</span>}
          {!loading && !apiLoaded && <span className="text-xs text-amber-500 font-medium">● Sample data</span>}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters — Desktop */}
        <aside className="hidden lg:block w-72 shrink-0">
          <ProductFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedSkillLevel={selectedSkillLevel}
            setSelectedSkillLevel={setSelectedSkillLevel}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
          />
        </aside>

        {/* Mobile Filter Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-80 bg-background overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-lg">Filters</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-0">
                <ProductFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  selectedSkillLevel={selectedSkillLevel}
                  setSelectedSkillLevel={setSelectedSkillLevel}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <Button variant="outline" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </Button>
            <div className="flex items-center gap-3 ml-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="h-9 px-3 text-sm rounded-md border border-input bg-background text-foreground"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Most Reviewed</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="hidden sm:flex border border-input rounded-md overflow-hidden">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("list")}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Skeleton loading state (show sample products clearly) */}
          {loading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {SAMPLE_PRODUCTS.slice(0, 6).map(product => (
                <div key={product.id} className="relative transition-opacity duration-500">
                  <div className="pointer-events-none">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-semibold text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSelectedCategory("");
                setSelectedBrands([]);
                setPriceRange([0, 10000]);
              }}>Clear Filters</Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={
      <div className="container py-8">
        <div className="h-8 w-48 bg-muted/50 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ProductsContent />
    </React.Suspense>
  );
}
