import { Hero } from "@/features/home/Hero";
import { CategoryShowcase } from "@/features/home/CategoryShowcase";
import { FeaturedProducts } from "@/features/home/FeaturedProducts";
import { TrustSection } from "@/features/home/TrustSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <TrustSection />
    </div>
  );
}
