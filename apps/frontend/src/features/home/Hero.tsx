"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full bg-primary overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-cta/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl"
        >
          Build the Future with <span className="text-accent">Premium Electronics</span> &amp; Robotics Kits
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl"
        >
          Your ultimate destination for professional engineering tools, IoT modules, and STEM learning ecosystem.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/products?cat=robotics-kits">
            <Button size="lg" className="bg-cta hover:bg-cta/90 text-white font-bold h-12 px-8 text-lg">
              Shop Robotics Kits
            </Button>
          </Link>
          <Link href="/products?cat=esp32-iot">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg text-white border-white/20 hover:bg-white/10">
              Explore IoT Modules
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
