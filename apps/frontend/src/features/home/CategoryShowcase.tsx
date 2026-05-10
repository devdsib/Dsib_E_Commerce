"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Zap, Wifi, Layers, MonitorPlay, Bot, Settings, Battery } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Arduino", icon: <Cpu className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=arduino" },
  { name: "ESP32 & IoT", icon: <Wifi className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=esp32" },
  { name: "Robotics Kits", icon: <Bot className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=robotics" },
  { name: "Sensors", icon: <Zap className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=sensors" },
  { name: "Displays", icon: <MonitorPlay className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=displays" },
  { name: "Motors", icon: <Settings className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=motors" },
  { name: "Power Modules", icon: <Battery className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=power" },
  { name: "STEM Kits", icon: <Layers className="h-8 w-8 mb-2 text-accent" />, href: "/products?cat=stem-kits" },
];

export function CategoryShowcase() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <Card className="hover:border-accent hover:shadow-md transition-all cursor-pointer bg-card h-32 flex flex-col items-center justify-center border-border/50 group">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 mt-1">{cat.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
