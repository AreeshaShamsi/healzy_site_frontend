import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CaseStudiesPage() {
  return (
    <main>
      <Navbar />
      <section className="font-body min-h-screen bg-white px-6 pb-20 pt-36 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="cinematic-heading-secondary mb-4">Case Studies</h1>
          <p className="cinematic-body">
            Case studies content will be added here.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
