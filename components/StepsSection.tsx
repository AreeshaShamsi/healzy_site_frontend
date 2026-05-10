"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RiSearchEyeLine,
  RiMapLine,
  RiSettings4Line,
  RiRocketLine,
  RiBarChartLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Discovery & Audit",
    desc: "We audit your current funnel — visibility, conversion rate, follow-up gaps, and retention data.",
    icon: RiSearchEyeLine,
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    number: "02",
    title: "Growth Blueprint",
    desc: "A custom roadmap across all three pillars: Relevance, Trust, and Retention — built for your practice type.",
    icon: RiMapLine,
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    number: "03",
    title: "System Build",
    desc: "We implement campaigns, automations, profile optimisations, and follow-up systems in parallel.",
    icon: RiSettings4Line,
    color: "#06B6D4",
    bg: "#ECFEFF",
  },
  {
    number: "04",
    title: "Launch & Activate",
    desc: "Everything goes live. We monitor closely and optimise in the first 30 days for peak performance.",
    icon: RiRocketLine,
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    number: "05",
    title: "Report & Scale",
    desc: "Monthly outcome reports. Ongoing refinement. As results compound, we scale what's working.",
    icon: RiBarChartLine,
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -48 : 48, scale: 0.95 }}
      animate={
        inView
          ? { opacity: 1, x: 0, scale: 1 }
          : { opacity: 0, x: index % 2 === 0 ? -48 : 48, scale: 0.95 }
      }
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start gap-6 ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Card */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
        {/* Step number + icon row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: step.color }}
          >
            Step {step.number}
          </span>
          <motion.div
            animate={inView ? { rotate: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: step.bg }}
          >
            <Icon size={17} style={{ color: step.color }} aria-hidden="true" />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 mb-1.5 leading-snug">
          {step.title}
        </h3>

        {/* Desc */}
        <p className="text-xs text-slate-500 leading-relaxed font-light">
          {step.desc}
        </p>

        {/* Bottom accent bar */}
        <motion.div
          className="h-[2px] rounded-full mt-4"
          style={{ background: step.color }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
        />
      </div>

      {/* Timeline dot (desktop center column) */}
      <div className="hidden lg:flex flex-col items-center gap-0 pt-7 shrink-0">
        <motion.div
          className="w-5 h-5 rounded-full border-4 border-white shadow-md z-10 relative"
          style={{ background: step.color }}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

export default function StepsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Animated vertical line drawn on scroll
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-slate-50 py-14 px-6 md:px-16 overflow-hidden">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-10 opacity-0">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="text-xs text-blue-500 uppercase tracking-[0.2em] font-semibold">
              How it works
            </span>
            <div className="h-px w-8 bg-blue-500" />
          </div>
          <h2
            className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            From first call to{" "}
            <em className="italic text-blue-600">full growth system</em>
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-light">
            Step by step — every stage designed to compound your results.
          </p>
        </div>

        {/* Steps layout */}
        <div className="relative">

          {/* Center vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-slate-200">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-b from-blue-400 via-purple-400 to-amber-400 origin-top"
              style={{ transform: "scaleY(0)", transformOrigin: "top center" }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`lg:grid lg:grid-cols-[1fr_40px_1fr] lg:gap-6 items-center`}
              >
                {/* Left slot */}
                {i % 2 === 0 ? (
                  <>
                    <StepCard step={step} index={i} />
                    <div className="hidden lg:flex justify-center items-center">
                      <motion.div
                        className="w-4 h-4 rounded-full border-4 border-white shadow z-10"
                        style={{ background: step.color }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="hidden lg:flex justify-center items-center">
                      <motion.div
                        className="w-4 h-4 rounded-full border-4 border-white shadow z-10"
                        style={{ background: step.color }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    </div>
                    <StepCard step={step} index={i} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
