import Banner from "@/components/homepage/Banner";
import FeaturedBooks from "@/components/homepage/FeaturedBooks";
import FeaturedLibrarians from "@/components/homepage/FeaturedLibrarians";
import HowItWorks from "@/components/homepage/HowItWorks";
import PopularCategories from "@/components/homepage/PopularCategories";
import StatsSection from "@/components/homepage/StasSection";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Banner />
    {/* <FeaturedBooks /> */}
    <HowItWorks />
    <StatsSection />
    {/* <PopularCategories /> */}
    <FeaturedLibrarians />
    </>
  );
}
