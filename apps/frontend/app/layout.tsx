import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CartProvider } from "@/components/shared/CartProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "DSIB Tech | Premium Electronics & Robotics Components",
    template: "%s | DSIB Tech",
  },
  description: "Your premium destination for electronics components, robotics kits, IoT modules, Arduino, Raspberry Pi, ESP32, and STEM learning tools. Fast shipping across India.",
  keywords: ["electronics", "robotics", "Arduino", "Raspberry Pi", "ESP32", "IoT", "STEM", "components", "India", "DSIB Tech"],
  authors: [{ name: "DSIB Tech" }],
  creator: "DSIB Tech",
  publisher: "DSIB Tech",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dsibtech.com",
    siteName: "DSIB Tech",
    title: "DSIB Tech | Premium Electronics & Robotics Components",
    description: "Your premium destination for electronics components, robotics kits, IoT modules and STEM learning tools.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "DSIB Tech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSIB Tech | Premium Electronics & Robotics",
    description: "Premium electronics, robotics kits, IoT modules and STEM learning tools.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", inter.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartProvider />
        </div>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
