import { HeroCarousel } from "@/components/home/HeroCarousel";
import { LatestCollection } from "@/components/home/LatestCollection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { CollectionTiles } from "@/components/home/CollectionTiles";
import { Testimonials } from "@/components/home/Testimonials";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { BenefitBanners } from "@/components/home/BenefitBanners";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <LatestCollection />
      <NewArrivals />
      <CollectionTiles />
      <Testimonials />
      <PromoBanner />
      <BlogTeaser />
      <BenefitBanners />
    </>
  );
}
