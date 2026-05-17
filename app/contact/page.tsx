import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactSection from "../../components/ContactSec";
import CalendlySection from "../../components/Calendly";

export default function ContactPage() {
  return (
    <main>
      <Navbar />
     <ContactSection/>
     <CalendlySection/>
      <Footer />
    </main>
  );
}
