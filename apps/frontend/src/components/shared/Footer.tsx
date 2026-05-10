import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <span className="text-2xl font-bold tracking-tighter">
              DSIB <span className="text-accent">TECH</span>
            </span>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              Your premium destination for electronics components, robotics kits, IoT modules, and STEM learning tools. Empowering makers and engineers globally.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="text-primary-foreground/70 hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-primary-foreground/70 hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-primary-foreground/70 hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-primary-foreground/70 hover:text-accent transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/bulk-orders" className="hover:text-accent transition-colors">Bulk Orders & Colleges</Link></li>
              <li><Link href="/tutorials" className="hover:text-accent transition-colors">STEM Tutorials</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Policies</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-accent transition-colors">Return & Refund Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-accent transition-colors">Warranty Information</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>123 Innovation Drive, Tech Park, Silicon Valley, CA 94043</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>support@dsibtech.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} DSIB Tech. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure Payments by Razorpay</span>
            <span>GST Billing Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
