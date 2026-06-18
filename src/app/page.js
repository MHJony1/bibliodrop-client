import Banner from '@/components/homepage/Banner';
import FeaturedBooks from '@/components/homepage/FeaturedBooks';
import FeaturedLibrarians from '@/components/homepage/FeaturedLibrarians';
import HowItWorks from '@/components/homepage/HowItWorks';
import PeopleSay from '@/components/homepage/PeopleSay';
import PopularCategories from '@/components/homepage/PopularCategories';
import StatsSection from '@/components/homepage/StasSection';
import WhyChooseUs from '@/components/homepage/WhyChooseUs';

export default function Home() {
  return (
    <>
      <Banner />
      {/* <FeaturedBooks /> */}

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <StatsSection />

      <section id="categories">
        <PopularCategories />
      </section>

      <FeaturedLibrarians />
      <PeopleSay />
      <WhyChooseUs />
    </>
  );
}
