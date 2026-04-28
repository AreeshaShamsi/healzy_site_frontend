import Navbar from './components/Navbar'
import Carousel from './pages/Carousel'
import HeroSection from './pages/HeroSection'
import Footer from './components/Footer'
import WhyUsSection from './pages/WhyUse'
import FAQ from './pages/FAQ'


export default function Home() {
  return (
    <main>

      <Navbar /> 
      <HeroSection />
      <WhyUsSection />
      <Carousel />
      <FAQ/>
      <Footer/>
    </main>
  )
}