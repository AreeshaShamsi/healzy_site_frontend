import Navbar from './components/Navbar'
import Carousel from './pages/Carousel'
import HeroSection from './pages/HeroSection'


export default function Home() {
  return (
    <main>

      <Navbar /> 
      <HeroSection />
      <Carousel />
    </main>
  )
}