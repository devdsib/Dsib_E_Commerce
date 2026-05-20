"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft, User, Lock, Mail, Bell, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
    // Update local state if user changes
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isLoggedIn, router, user]);

  if (!isLoggedIn || !user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/10 text-accent font-medium text-left">
            <User className="w-4 h-4" /> Profile Info
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium text-left transition-colors">
            <Lock className="w-4 h-4" /> Password
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium text-left transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium text-left transition-colors">
            <Shield className="w-4 h-4" /> Privacy
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Profile Section */}
          <div className="border rounded-xl p-6 sm:p-8 bg-background shadow-sm">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            
            <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground shrink-0 border-4 border-background shadow-sm">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-3 flex-1 w-full">
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      value={email}
                      readOnly
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-muted text-muted-foreground text-sm cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">To change your email address, please contact support.</p>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button style={{ backgroundColor: "hsl(var(--accent))" }} className="text-white px-8">Save Changes</Button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-200 rounded-xl p-6 sm:p-8 bg-red-50/30 dark:bg-red-950/10">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
            <p className="text-muted-foreground mb-6 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="destructive">Delete Account</Button>
          </div>

        </div>
      </div>
    </div>
  );
}
