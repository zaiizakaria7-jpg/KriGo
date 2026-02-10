import { HeroSection } from "@/components/landing/hero-section";
import { CategorySection } from "@/components/landing/category-section";
import { FeaturedSection } from "@/components/landing/featured-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AgencyMap } from "@/components/landing/agency-map";

export default function Home() {
    return (
        <>
            <HeroSection />
            <CategorySection />
            <FeaturedSection />
            <HowItWorks />
            <AgencyMap />
        </>
    );
}
