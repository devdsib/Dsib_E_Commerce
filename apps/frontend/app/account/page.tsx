"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

const menuItems = [
  { label: "My Orders", icon: ShoppingBag, href: "/account/orders", desc: "Track, return, or buy again" },
  { label: "My Addresses", icon: MapPin, href: "/account/addresses", desc: "Manage delivery addresses" },
  { label: "My Wishlist", icon: Heart, href: "/wishlist", desc: "Your saved products" },
  { label: "Account Settings", icon: Settings, href: "/account/settings", desc: "Edit profile, password, email" },
];

const statusColors: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const { user, logout, token, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isSlowLoad, setIsSlowLoad] = useState(false);

  // Detect slow DB wake-up
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (ordersLoading) {
      timer = setTimeout(() => setIsSlowLoad(true), 3000);
    } else {
      setIsSlowLoad(false);
    }
    return () => clearTimeout(timer);
  }, [ordersLoading]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    async function loadOrders() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await apiClient.get("/orders/me", { headers });
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }
    loadOrders();
  }, [isLoggedIn, token, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white uppercase" style={{ backgroundColor: "hsl(var(--primary))" }}>
            {user?.name ? user.name.substring(0, 2) : "U"}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl font-bold">{user?.name || "User"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Member</p>
          </div>
          <div className="flex gap-2">
            <Link href="/account/settings"><Button variant="outline" size="sm">Edit Profile</Button></Link>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" /> Logout</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="hover:border-accent/40 hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}>
                  <item.icon className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} /> Recent Orders
      </h2>

      {ordersLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <div className="space-y-1 text-center">
            <p className="font-medium text-foreground">Loading your orders...</p>
            {isSlowLoad && (
              <p className="text-xs text-orange-500 animate-pulse bg-orange-500/10 px-3 py-1 rounded-full">
                Waking up database... this may take up to 30 seconds.
              </p>
            )}
          </div>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No orders yet</p>
            <p className="text-sm mt-1">Your completed orders will appear here.</p>
            <Link href="/products">
              <Button className="mt-4 text-white" style={{ backgroundColor: "hsl(var(--cta))" }}>Shop Now</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <Card key={order.id} className="hover:border-accent/30 transition-colors">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-semibold text-sm">DSIB-{order.id.slice(0, 6).toUpperCase()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {order.items?.length || 0} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold" style={{ color: "hsl(var(--accent))" }}>₹{Math.round(order.totalAmount).toLocaleString()}</span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
