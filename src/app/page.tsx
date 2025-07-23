import FeaturesSection from "@/components/home/Features";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}