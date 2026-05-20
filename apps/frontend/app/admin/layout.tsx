"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
    setChecking(false);
  }, [isLoggedIn, router]);

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm">Verifying access…</p>
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--destructive) / 0.1)" }}>
          <ShieldAlert className="w-8 h-8" style={{ color: "hsl(var(--destructive))" }} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          You don't have permission to access the admin panel. This area is restricted to authorized administrators only.
        </p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
