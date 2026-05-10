"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, MapPin, Truck, CreditCard, ShoppingBag, ChevronRight, ArrowLeft, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Shipping", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirmation", icon: CheckCircle2 },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, gstAmount, total, clearCart } = useCartStore();
  const { isLoggedIn, token } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const shippingCost = shippingMethod === "express" ? 99 : subtotal() > 499 ? 0 : 49;
  const grandTotal = total() + shippingCost;

  // Auth guard — show login prompt if not logged in
  if (!isLoggedIn && currentStep < 4) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}>
          <LogIn className="w-10 h-10" style={{ color: "hsl(var(--accent))" }} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Login Required</h1>
        <p className="text-muted-foreground mb-6">Please sign in to your account to complete your purchase. Your cart will be saved.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login">
            <Button className="text-white font-semibold" style={{ backgroundColor: "hsl(var(--cta))" }}>
              <LogIn className="w-4 h-4 mr-2" /> Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && currentStep < 4) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add products before proceeding to checkout.</p>
        <Link href="/products"><Button className="text-white" style={{ backgroundColor: "hsl(var(--cta))" }}>Browse Products</Button></Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === "cod") {
      // Simulate COD Success
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(4);
        clearCart();
      }, 1500);
      return;
    }

    // Razorpay Flow
    setIsProcessing(true);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      // 1. Create Order in Backend
      const response = await apiClient.post("/orders", {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        shippingAddressId: "mock-address-id",
        paymentMethod: "RAZORPAY"
      }, {
        headers: authHeaders,
      });

      const { razorpayOrder } = response.data;

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_replace_me",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "DSIB Tech",
        description: "Purchase of Electronics Components",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          try {
            await apiClient.post("/orders/verify", {
              razorpayOrderId: razorpayOrder.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }, { headers: authHeaders });

            toast.success("Payment verified! Order confirmed ✅");
            setCurrentStep(4);
            clearCart();
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: address.fullName,
          email: "user@example.com",
          contact: address.phone
        },
        theme: {
          color: "#00D9FF"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function (response: any) {
        toast.error("Payment Failed: " + response.error.description);
      });

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Failed to initiate payment. Are you logged in?";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10 gap-1">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              currentStep >= step.id
                ? "text-white"
                : "bg-muted text-muted-foreground"
            }`} style={currentStep >= step.id ? { backgroundColor: "hsl(var(--accent))" } : {}}>
              <step.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className={`w-4 h-4 mx-1 ${currentStep > step.id ? "text-accent" : "text-muted-foreground/30"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Full Name *</label>
                    <Input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Phone Number *</label>
                    <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+91 98765 43210" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Street Address *</label>
                    <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="123 Innovation Drive, Tech Park" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">City *</label>
                    <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Bangalore" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">State *</label>
                    <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="Karnataka" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">PIN Code *</label>
                    <Input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="560001" />
                  </div>
                </div>
                <Button className="mt-6 w-full sm:w-auto text-white font-semibold" style={{ backgroundColor: "hsl(var(--cta))" }} onClick={() => setCurrentStep(2)}>
                  Continue to Shipping <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} /> Shipping Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Delivery", desc: "3-5 business days", price: subtotal() > 499 ? "FREE" : "₹49" },
                    { id: "express", label: "Express Delivery", desc: "1-2 business days", price: "₹99" },
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      shippingMethod === method.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={shippingMethod === method.id} onChange={() => setShippingMethod(method.id)} className="accent-accent" />
                        <div>
                          <div className="font-semibold text-sm">{method.label}</div>
                          <div className="text-xs text-muted-foreground">{method.desc}</div>
                        </div>
                      </div>
                      <span className="font-bold text-sm" style={{ color: "hsl(var(--accent))" }}>{method.price}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                  <Button className="text-white font-semibold" style={{ backgroundColor: "hsl(var(--cta))" }} onClick={() => setCurrentStep(3)}>
                    Continue to Payment <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "razorpay", label: "Razorpay (UPI / Cards / Net Banking)", desc: "Secure payment via Razorpay" },
                    { id: "cod", label: "Cash on Delivery (COD)", desc: "Pay when your order arrives" },
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === method.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                    }`}>
                      <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="accent-accent mr-3" />
                      <div>
                        <div className="font-semibold text-sm">{method.label}</div>
                        <div className="text-xs text-muted-foreground">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Coupon */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <label className="text-sm font-medium mb-2 block">Have a coupon code?</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter coupon code" className="flex-1" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isProcessing}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                  <Button 
                    className="text-white font-bold text-base px-8" 
                    style={{ backgroundColor: "hsl(var(--cta))" }} 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      <>Place Order — ₹{Math.round(grandTotal).toLocaleString()}</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <Card>
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}>
                  <CheckCircle2 className="w-10 h-10" style={{ color: "hsl(var(--accent))" }} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                <p className="text-muted-foreground mb-2">Thank you for your purchase. Your order has been confirmed.</p>
                <p className="text-sm text-muted-foreground mb-6">Order ID: <span className="font-mono font-semibold text-foreground">DSIB-{Date.now().toString(36).toUpperCase()}</span></p>
                <div className="flex justify-center gap-3">
                  <Link href="/products"><Button className="text-white" style={{ backgroundColor: "hsl(var(--cta))" }}>Continue Shopping</Button></Link>
                  <Link href="/account"><Button variant="outline">View Orders</Button></Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {currentStep < 4 && (
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 bg-muted/30 rounded-md shrink-0 flex items-center justify-center text-[8px] text-muted-foreground/30 overflow-hidden">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          "IMG"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold whitespace-nowrap" style={{ color: "hsl(var(--accent))" }}>₹{((item.discountPrice ?? item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal().toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{Math.round(gstAmount()).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span></div>
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total</span>
                    <span style={{ color: "hsl(var(--accent))" }}>₹{Math.round(grandTotal).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
