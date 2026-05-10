"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryApi } from "@/lib/api-client";

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedRating: number;
  setSelectedRating: (r: number) => void;
  selectedSkillLevel: string;
  setSelectedSkillLevel: (s: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
}

export function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  selectedSkillLevel,
  setSelectedSkillLevel,
  inStockOnly,
  setInStockOnly,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    categoryApi.getCategories().then((data) => {
      setCategories(data.categories || []);
    }).catch(console.error);
  }, []);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  const clearAll = () => {
    setSelectedCategory("");
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setSelectedRating(0);
    setSelectedSkillLevel("");
    setInStockOnly(false);
  };

  // Common brands in electronics
  const brands = ["Arduino", "Raspberry Pi Foundation", "Espressif", "DSIB Tech", "Generic", "TowerPro"];

  return (
    <Card className="sticky top-20 overflow-y-auto max-h-[calc(100vh-6rem)]">
      <CardContent className="p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive">
            Clear All
          </Button>
        </div>

        {/* Categories from DB */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground/80">Category</h4>
          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedCategory("")}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === "" ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                  selectedCategory === cat.slug ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground/80">Price Range (₹)</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full h-9 px-2 text-sm rounded-md border border-input bg-background"
              placeholder="Min"
              min={0}
            />
            <span className="text-muted-foreground text-sm">to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full h-9 px-2 text-sm rounded-md border border-input bg-background"
              placeholder="Max"
              min={0}
            />
          </div>
        </div>

        {/* Brand */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground/80">Brand</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-border accent-accent"
                  aria-label={`Filter by ${brand}`}
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground/80">Minimum Rating</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(selectedRating === star ? 0 : star)}
                className={`text-lg transition-colors ${star <= selectedRating ? "text-cta" : "text-muted-foreground/30"}`}
                aria-label={`${star} star minimum rating`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground/80">Skill Level</h4>
          <div className="flex flex-wrap gap-2">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedSkillLevel(selectedSkillLevel === level ? "" : level)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedSkillLevel === level
                    ? "bg-accent text-white border-accent"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-accent"
              aria-label="Show in-stock items only"
            />
            <span className="text-muted-foreground">In Stock Only</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
