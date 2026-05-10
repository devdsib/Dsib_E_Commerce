"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { productApi, apiClient } from "@/lib/api-client";
import {
  TrendingUp, ShoppingCart, Package, Users, AlertTriangle,
  DollarSign, BarChart3, ArrowUpRight, ArrowDownRight,
  Plus, Settings, Eye, Loader2,
} from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSlowLoad, setIsSlowLoad] = useState(false);

  // Detect slow DB wake-up
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setIsSlowLoad(true), 3000);
    } else {
      setIsSlowLoad(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes] = await Promise.all([
          productApi.getProducts(),
        ]);
        setProducts(prodRes.products || []);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const lowStockProducts = products.filter((p) => (p.stockQuantity ?? 0) <= 50).slice(0, 5);
  const topProducts = [...products].sort((a, b) => (b._count?.reviews || 0) - (a._count?.reviews || 0)).slice(0, 5);
  const totalProducts = products.length;
  const outOfStock = products.filter(p => (p.stockQuantity ?? 0) === 0).length;

  const stats = [
    { label: "Total Products", value: loading ? "..." : totalProducts.toString(), change: `${outOfStock} out of stock`, up: outOfStock === 0, icon: Package },
    { label: "Orders This Month", value: "—", change: "Connect orders API", up: true, icon: ShoppingCart },
    { label: "Total Customers", value: "—", change: "Connect users API", up: true, icon: Users },
    { label: "Low Stock Items", value: loading ? "..." : lowStockProducts.length.toString(), change: "Need restock", up: lowStockProducts.length === 0, icon: AlertTriangle },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Admin. Here&apos;s your store overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products"><Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" /> Manage Products</Button></Link>
          <Link href="/admin/products"><Button size="sm" className="text-white" style={{ backgroundColor: "hsl(var(--cta))" }}><Plus className="w-4 h-4 mr-2" /> Add Product</Button></Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}>
                  <stat.icon className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? "text-green-600" : "text-red-500"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-muted/50 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold">{stat.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Products from DB */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} /> Top Products by Reviews
              </h3>
              <Link href="/admin/products"><Button variant="ghost" size="sm" className="text-xs">View All</Button></Link>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                <div className="space-y-1 text-center">
                  <span className="font-medium">Loading products...</span>
                  {isSlowLoad && (
                    <p className="text-xs text-orange-500 animate-pulse bg-orange-500/10 px-3 py-1 rounded-full mt-2">
                      Waking up database... this may take up to 30 seconds.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Product</th>
                      <th className="pb-2 font-medium">SKU</th>
                      <th className="pb-2 font-medium">Price</th>
                      <th className="pb-2 font-medium">Stock</th>
                      <th className="pb-2 font-medium">Reviews</th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 font-medium max-w-[180px]"><p className="line-clamp-1">{p.name}</p></td>
                        <td className="py-3 font-mono text-xs">{p.sku}</td>
                        <td className="py-3 font-semibold" style={{ color: "hsl(var(--accent))" }}>₹{(p.discountPrice ?? p.price).toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${(p.stockQuantity ?? 0) === 0 ? "bg-red-100 text-red-700" : (p.stockQuantity ?? 0) <= 20 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                            {p.stockQuantity ?? 0}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground">{p._count?.reviews ?? 0}</td>
                        <td className="py-3">
                          <Link href={`/products/${p.slug}`}><Button variant="ghost" size="sm"><Eye className="w-3.5 h-3.5" /></Button></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Low Stock Alerts
            </h3>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                {isSlowLoad && (
                  <p className="text-[10px] text-orange-500 text-center px-2">Waking DB...</p>
                )}
              </div>
            ) : lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">All products well stocked ✅</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sku}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      (p.stockQuantity ?? 0) <= 10 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                    }`}>{p.stockQuantity ?? 0} left</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Product Management", href: "/admin/products", icon: Package, desc: "Add, edit, delete products" },
          { label: "View Store", href: "/", icon: Eye, desc: "See how your store looks" },
          { label: "Product Catalog", href: "/products", icon: ShoppingCart, desc: "Browse all products" },
          { label: "Settings", href: "/account/settings", icon: Settings, desc: "Account settings" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:border-accent/40 hover:shadow-md transition-all cursor-pointer group h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}>
                  <item.icon className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} />
                </div>
                <p className="font-semibold text-sm group-hover:text-accent transition-colors">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
