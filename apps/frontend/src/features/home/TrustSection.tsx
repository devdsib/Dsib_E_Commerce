import React from "react";
import { ShieldCheck, Truck, FileText, Headphones, Building2, Package } from "lucide-react";

const trustItems = [
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Genuine Products", desc: "100% authentic components" },
  { icon: <Truck className="w-6 h-6" />, title: "Fast Shipping", desc: "Pan-India in 2-4 days" },
  { icon: <FileText className="w-6 h-6" />, title: "GST Billing", desc: "B2B invoices for colleges" },
  { icon: <Headphones className="w-6 h-6" />, title: "Tech Support", desc: "Expert project assistance" },
  { icon: <Building2 className="w-6 h-6" />, title: "Bulk Orders", desc: "Special pricing for labs" },
  { icon: <Package className="w-6 h-6" />, title: "Secure Packaging", desc: "Anti-static safe delivery" },
];

export function TrustSection() {
  return (
    <section className="py-14 border-y border-border/40" style={{ backgroundColor: "hsl(var(--primary))" }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 group">
              <div className="mb-3 transition-transform group-hover:scale-110" style={{ color: "hsl(var(--accent))" }}>
                {item.icon}
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
              <p className="text-xs text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
