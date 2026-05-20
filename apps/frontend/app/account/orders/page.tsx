"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { orderApi } from "@/lib/api-client";
import { Package, Clock, Truck, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { isLoggedIn, user, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    async function fetchOrders() {
      try {
        const data = await orderApi.getMyOrders(token);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isLoggedIn, router, token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-4 h-4 text-amber-500" />;
      case "PROCESSING": return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "SHIPPED": return <Truck className="w-4 h-4 text-purple-500" />;
      case "DELIVERED": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "CANCELLED": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-600";
      case "PROCESSING": return "bg-blue-500/10 text-blue-600";
      case "SHIPPED": return "bg-purple-500/10 text-purple-600";
      case "DELIVERED": return "bg-green-500/10 text-green-600";
      case "CANCELLED": return "bg-red-500/10 text-red-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Order History</h1>
        <p className="text-muted-foreground">View and track your recent purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-muted/20">
          <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button style={{ backgroundColor: "hsl(var(--cta))" }} className="text-white">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl overflow-hidden bg-background shadow-sm hover:border-accent/30 transition-colors">
              <div className="p-4 sm:p-6 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Order Date</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Total Amount</p>
                    <p className="font-semibold" style={{ color: "hsl(var(--accent))" }}>₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Order ID</p>
                    <p className="font-mono text-xs mt-0.5">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${getStatusBadgeClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-md bg-muted/30 border flex items-center justify-center overflow-hidden shrink-0">
                        {item.product?.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product?.slug || ""}`} className="font-medium hover:text-accent hover:underline line-clamp-1">
                          {item.product?.name || "Unknown Product"}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="font-semibold text-right shrink-0">
                        ₹{(item.quantity * item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t bg-muted/10 flex justify-end gap-3">
                {order.status === "DELIVERED" && (
                  <Button variant="outline" size="sm">Write Review</Button>
                )}
                <Button variant="outline" size="sm">View Invoice</Button>
                <Button size="sm" style={{ backgroundColor: "hsl(var(--accent))" }} className="text-white">Track Package</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
