import Navbar from "../components/Navbar";
import HeroScroll from "../components/HeroScroll";
import WhyUse from "../components/WhyUse";
import Carousel from "../components/Carousel";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroScroll />
      <WhyUse />
      <Carousel />
      <FAQ />
      <Footer />
    </main>
  );
}
