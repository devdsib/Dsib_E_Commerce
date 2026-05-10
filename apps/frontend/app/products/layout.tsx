import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | DSIB Tech — Electronics, Robotics & IoT Components",
  description: "Browse our complete catalog of Arduino, Raspberry Pi, ESP32, sensors, motors, robotics kits, and STEM learning modules. Free shipping above ₹499.",
  openGraph: {
    title: "Shop Electronics & Robotics Components | DSIB Tech",
    description: "Premium electronics components, IoT modules, and STEM kits for makers and engineers.",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
