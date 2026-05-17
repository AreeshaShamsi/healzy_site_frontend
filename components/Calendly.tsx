"use client";

import { motion } from "framer-motion";
import { InlineWidget } from "react-calendly";

const stats = [
  { value: "340+", label: "Healthcare Teams" },
  { value: "98%", label: "Client Retention" },
  { value: "4.9/5", label: "Average Rating" },
];

const features = [
  "30-minute focused strategy consult",
  "Actionable acquisition and retention insights",
  "Built for clinics, hospitals, and specialist practices",
];

export default function CalendlySection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eff6ff_52%,#ffffff_100%)] py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-28 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22),transparent_65%)] blur-3xl" />
        <div className="absolute -bottom-24 -left-28 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.16),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-stretch gap-5 px-5 lg:grid-cols-[1.02fr_1fr] lg:px-7">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-full flex-col p-1 lg:pr-6"
        >
          

          <h2 className="heading mt-4 max-w-xl text-[clamp(2.1rem,4.2vw,3.1rem)]">
            Book a <em>Free Strategy Call</em>
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            Reserve a focused session with our healthcare growth team to identify your highest-impact opportunities across
            patient acquisition, conversion, and retention.
          </p>

          <div className="mt-5 hidden grid-cols-3 gap-2 lg:grid">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 text-center">
                <p className="font-['Syne',sans-serif] text-xl font-extrabold leading-none text-slate-900">{item.value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <ul className="mt-5 hidden space-y-2 lg:block">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg className="h-3 w-3" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
          className="relative flex h-full"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22),transparent_66%)] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.16),transparent_66%)] blur-2xl" />

          <div className="flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white/85 shadow-[0_16px_48px_rgba(15,23,42,0.14)] backdrop-blur-xl">
            <div className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(245,249,255,0.88)_100%)] px-5 py-3.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">Booking</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Choose Your Preferred Time</p>
                </div>
                
              </div>
              <div className="mt-3 h-px w-full bg-[linear-gradient(90deg,transparent_0%,rgba(37,99,235,0.28)_50%,transparent_100%)]" />
            </div>

            <div className="h-full bg-white/95">
              <InlineWidget
                url="https://calendly.com/business-healzy/30min"
                styles={{ height: "620px" }}
                pageSettings={{
                  hideEventTypeDetails: true,
                  hideLandingPageDetails: true,
                  primaryColor: "2563eb",
                  textColor: "0f172a",
                  backgroundColor: "ffffff",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
