"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { productApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── Instant sample data ─────────────────────────────────────────────────────
const SAMPLE_FEATURED = [
  { id: "s1", slug: "arduino-uno-r3-development-board", name: "Arduino Uno R3 ATmega328P", sku: "ARD-UNO-R3", price: 899, discountPrice: 549, stockQuantity: 150, brand: "Arduino", images: [], isFeatured: true, _count: { reviews: 42 } },
  { id: "s3", slug: "raspberry-pi-4-model-b-4gb", name: "Raspberry Pi 4 Model B – 4GB RAM", sku: "RPI4-4GB", price: 5499, discountPrice: 4799, stockQuantity: 45, brand: "Raspberry Pi Foundation", images: [], isFeatured: true, _count: { reviews: 55 } },
  { id: "s5", slug: "universal-robotics-trainer-kit-v01", name: "Universal Robotics Trainer Kit V0.1", sku: "DSIB-URTK-V01", price: 7999, discountPrice: 4999, stockQuantity: 32, brand: "DSIB Tech", images: [], isFeatured: true, _count: { reviews: 20 } },
  { id: "s9", slug: "stem-iot-smart-home-kit", name: "STEM IoT Smart Home Learning Kit", sku: "DSIB-STEM-IOT-01", price: 3999, discountPrice: 2999, stockQuantity: 55, brand: "DSIB Tech", images: [], isFeatured: true, _count: { reviews: 9 } },
];

const SAMPLE_BEST_SELLERS = [
  { id: "s10", slug: "jumper-wire-kit-120pcs", name: "Jumper Wire Kit 120pcs (M-M / M-F / F-F)", sku: "WIRE-JMP-120", price: 199, discountPrice: 129, stockQuantity: 1200, brand: "Generic", images: [], isFeatured: false, _count: { reviews: 61 } },
  { id: "s4", slug: "ultrasonic-sensor-hc-sr04", name: "HC-SR04 Ultrasonic Distance Sensor", sku: "SEN-US-04", price: 99, discountPrice: 59, stockQuantity: 500, brand: "Generic", images: [], isFeatured: false, _count: { reviews: 27 } },
  { id: "s2", slug: "esp32-devkit-v1-wifi-bluetooth", name: "ESP32 DevKit V1 WiFi + Bluetooth", sku: "ESP32-DEVKIT-V1", price: 599, discountPrice: 399, stockQuantity: 230, brand: "Espressif", images: [], isFeatured: true, _count: { reviews: 38 } },
  { id: "s6", slug: "servo-motor-sg90-micro", name: "SG90 Micro Servo Motor 9g", sku: "MOT-SG90", price: 149, discountPrice: 89, stockQuantity: 800, brand: "TowerPro", images: [], isFeatured: false, _count: { reviews: 31 } },
];

// Skeleton card
function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-muted/50 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 bg-muted/50 animate-pulse rounded w-1/3" />
        <div className="h-4 bg-muted/50 animate-pulse rounded w-full" />
        <div className="h-4 bg-muted/50 animate-pulse rounded w-2/3" />
        <div className="h-9 bg-muted/40 animate-pulse rounded mt-2" />
      </CardContent>
    </Card>
  );
}

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<any[]>(SAMPLE_FEATURED);
  const [bestSellers, setBestSellers] = useState<any[]>(SAMPLE_BEST_SELLERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      try {
        const { products: featuredData } = await productApi.getProducts({ featured: true });
        const { products: allProducts } = await productApi.getProducts();
        if (!cancelled) {
          if (featuredData?.length > 0) setFeatured(featuredData.slice(0, 4));
          if (allProducts?.length > 0) {
            setBestSellers(
              [...allProducts].sort((a, b) => (b._count?.reviews || 0) - (a._count?.reviews || 0)).slice(0, 4)
            );
          }
        }
      } catch (error) {
        console.warn("API unavailable — showing sample products on home page");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProducts();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/* Trending / Featured */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Trending Products</h2>
              <p className="text-muted-foreground mt-1">Most popular electronics components this week</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((product) => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Best Sellers</h2>
              <p className="text-muted-foreground mt-1">Top rated by engineering students &amp; makers</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : bestSellers.map((product) => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </section>
    </>
  );
}
