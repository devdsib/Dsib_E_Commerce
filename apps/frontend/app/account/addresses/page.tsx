"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft, MapPin, Plus, Home, Briefcase, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddressesPage() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  // Mock addresses since backend address management isn't built yet
  const addresses = [
    {
      id: "addr_1",
      type: "Home",
      name: "John Doe",
      phone: "+91 98765 43210",
      street: "123 Tech Park, Block C",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      isDefault: true,
    },
    {
      id: "addr_2",
      type: "Work",
      name: "John Doe",
      phone: "+91 98765 43210",
      street: "DSIB Tech Solutions, 4th Floor, Innovation Hub",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560100",
      isDefault: false,
    }
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping and billing addresses.</p>
        </div>
        <Button style={{ backgroundColor: "hsl(var(--accent))" }} className="text-white">
          <Plus className="w-4 h-4 mr-2" /> Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className={`border rounded-xl p-6 relative ${address.isDefault ? 'border-accent/50 bg-accent/5 shadow-sm' : 'bg-background hover:border-border/80'}`}>
            {address.isDefault && (
              <span className="absolute top-4 right-10 text-xs font-semibold px-2 py-1 rounded-md bg-accent/10 text-accent">Default</span>
            )}
            
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              {address.type === "Home" ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
              <span className="text-sm font-medium">{address.type}</span>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-lg">{address.name}</p>
              <p className="text-foreground/80">{address.street}</p>
              <p className="text-foreground/80">{address.city}, {address.state} - {address.pincode}</p>
              <p className="text-muted-foreground pt-2 text-sm">{address.phone}</p>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">Edit</Button>
              {!address.isDefault && (
                <Button variant="outline" size="sm" className="flex-1">Set Default</Button>
              )}
            </div>
          </div>
        ))}

        {/* Empty state card for adding new */}
        <button className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-accent hover:border-accent hover:bg-accent/5 transition-all min-h-[250px]">
          <MapPin className="w-8 h-8 mb-3 opacity-50" />
          <span className="font-medium">Add New Address</span>
        </button>
      </div>
    </div>
  );
}
