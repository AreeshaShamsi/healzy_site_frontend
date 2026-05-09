// components/HeroSection.tsx
// Next.js + Tailwind CSS

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      {/* Gradient overlay — light blue left, fades to image right */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/90 via-blue-200/75 to-slate-900/50" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-24 w-full">
        <div className="max-w-xl">

          {/* Main Headline */}
          <h1
            className="font-black leading-tight tracking-tight text-slate-900 mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="block text-5xl md:text-6xl lg:text-7xl">
              Acquire{" "}
              <em className="text-blue-600 italic">Patients.</em>
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl">
              Build Trust.
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl">
              Retain Them.
            </span>
          </h1>

          {/* Blue accent line */}
          <div className="w-12 h-0.5 bg-blue-600 mb-6 rounded-full" />

          {/* Subtext */}
          <p className="text-slate-700 text-base md:text-lg leading-relaxed font-light mb-10 max-w-md">
            We help healthcare businesses acquire new patients, convert inquiries
            into appointments, and retain them for long-term growth.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-sm tracking-wide hover:bg-slate-700 transition-all duration-300 hover:scale-105 shadow-lg">
              Book an Appointment
            </button>
            <button className="px-8 py-4 rounded-full border border-slate-900/30 text-slate-900 text-sm font-medium hover:border-slate-900/60 transition-all duration-300">
              Learn More →
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-slate-900/10">
            {["HIPAA Compliant", "340+ Health Systems", "2.4M+ Patients Reached"].map((b) => (
              <div key={b} className="flex items-center gap-2">
                <span className="text-blue-600 text-lg">✦</span>
                <span className="text-slate-700 text-xs font-medium tracking-wider uppercase">{b}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}