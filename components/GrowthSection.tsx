"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHECKS = [
  "Our patient acquisition system inspires healthcare providers to discover untapped growth and build a pipeline that never runs dry.",
  "We motivate practices to pursue measurable milestones — more appointments, better reviews, and stronger patient loyalty.",
  "Our structured system encourages healthcare teams to achieve their best outcomes, paving the way for professional and community impact.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Variants — once: false makes every element animate IN on scroll-down
// and animate OUT (back to hidden) on scroll-up
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 42 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -38 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88, y: 26 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: i * 0.13 },
  }),
};

const iconPop = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.08 + i * 0.1,
      duration: 0.42,
      type: "spring",
      stiffness: 320,
      damping: 18,
    },
  }),
};

export default function GrowthSection() {
  const sectionRef = useRef(null);
  const statRef    = useRef(null);
  const countRef   = useRef(null);

  // Parallax on the tall left image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgParallax = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  // GSAP bidirectional counter — plays forward on enter, reverses on leave
  useEffect(() => {
    if (!countRef.current || !statRef.current) return;

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      const tween = gsap.to(obj, {
        val: 340,
        duration: 1.8,
        ease: "power2.out",
        snap: { val: 1 },
        paused: true,
        onUpdate() {
          if (countRef.current)
            countRef.current.textContent = `${Math.round(obj.val)}+`;
        },
      });

      ScrollTrigger.create({
        trigger: statRef.current,
        start: "top 85%",
        end: "bottom 15%",
        onEnter:     () => tween.play(),
        onLeave:     () => tween.reverse(),
        onEnterBack: () => tween.play(),
        onLeaveBack: () => tween.reverse(),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: Text ── */}
        <div>
          {/* Headline — fades up on scroll-down, fades out on scroll-up */}
          <motion.h2
            className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.12] mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            Consistent growth,{" "}
            <em className="italic text-blue-600">boundless potential</em>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className="text-slate-500 text-sm leading-[1.8] font-light mb-9 max-w-sm"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            Our healthcare marketing platform empowers clinics and hospitals with
            vital patient-growth systems, enhancing their credibility for
            sustainable long-term success.
          </motion.p>

          {/* Checklist — each item slides in from left, reverses on scroll-up */}
          <ul className="flex flex-col gap-5">
            {CHECKS.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                variants={fadeLeft}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
              >
                {/* Icon spring-pops in / out */}
                <motion.div
                  className="mt-0.5 w-[22px] h-[22px] shrink-0 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center"
                  variants={iconPop}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                >
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path
                      d="M1 4.5L4 7.5L10 1"
                      stroke="#2563eb"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <p className="text-slate-600 text-sm leading-[1.75]">{item}</p>
              </motion.li>
            ))}
          </ul>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mt-10"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
          >
            <button className="px-7 py-3.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors duration-200">
              Book a Free Audit
            </button>
            <button className="text-sm text-blue-600 font-medium hover:underline transition">
              See case studies →
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT: Image mosaic ── */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[420px]">

          {/* Left tall image — parallax + scale-in/out */}
          <motion.div
            className="row-span-2 rounded-2xl overflow-hidden relative"
            variants={scaleIn}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {/* Parallax wrapper — continuous scroll-driven movement */}
            <motion.div
              style={{ y: imgParallax }}
              className="absolute inset-[-8%] w-[116%] h-[116%]"
            >
              <Image
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
                alt="Doctor consulting patient"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-blue-600/[0.07]" />
          </motion.div>

          {/* Top-right image */}
          <motion.div
            className="rounded-2xl overflow-hidden relative"
            variants={scaleIn}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
              alt="Healthcare professional at work"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-blue-600/[0.05]" />
          </motion.div>

          {/* Bottom-right stat card — GSAP counter inside */}
          <motion.div
            ref={statRef}
            className="rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100"
            variants={scaleIn}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="text-center px-4">
              <p
                ref={countRef}
                className="text-5xl font-black text-blue-800 leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                0+
              </p>
              <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-widest mt-2">
                Health systems
              </p>
              <p className="text-[11px] text-slate-400 font-light mt-1">
                trust our platform
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}