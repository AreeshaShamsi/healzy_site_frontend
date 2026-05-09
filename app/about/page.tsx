import Navbar from "../../components/Navbar";
import AboutSec from "../../components/AboutSec";
import Footer from "../../components/Footer";
import ResultSection from "../../components/ResultSection";
import GrowthSection from "../../components/GrowthSection";
import Carousel from "../../components/Carousel";
import StepsSection from "../../components/StepsSection";


export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutSec />
      <GrowthSection/>
      <Carousel/>
      <StepsSection/>
      <ResultSection/>
      {/* <TeamSection/> */}
      <Footer />
    </main>
  );
}
