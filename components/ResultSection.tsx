"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RiHospitalLine,
  RiUserHeartLine,
  RiGroupLine,
  RiShieldCheckLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    label: "Patient Inquiry Rate",
    value: "3×",
    rawValue: 3,
    suffix: "×",
    icon: RiHospitalLine,
  },
  {
    label: "Retention Improvement",
    value: "85%",
    rawValue: 85,
    suffix: "%",
    icon: RiUserHeartLine,
  },
  {
    label: "Faster Inquiry Response",
    value: "62%",
    rawValue: 62,
    suffix: "%",
    icon: RiGroupLine,
  },
  {
    label: "Average Review Rating",
    value: "4.8★",
    rawValue: 4.8,
    suffix: "★",
    icon: RiShieldCheckLine,
  },
];

function CountUp({
  rawValue,
  suffix,
  inView,
}: {
  rawValue: number;
  suffix: string;
  inView: boolean;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const isDecimal = rawValue % 1 !== 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: rawValue,
      duration: 2,
      ease: "power3.out",
      onUpdate: () => {
        if (numRef.current) {
          const display = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
          numRef.current.textContent = `${display}${suffix}`;
        }
      },
    });
  }, [inView, rawValue, suffix]);

  return (
    <span
      ref={numRef}
      className="text-[2rem] font-bold text-slate-800 leading-none tabular-nums"
    >
      0{suffix}
    </span>
  );
}

function StatCard({
  stat,
  index,
  isLast,
}: {
  stat: (typeof STATS)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.13,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex flex-col items-center gap-3 flex-1 px-6 py-8 relative
        ${!isLast ? "border-r border-slate-200" : ""}
      `}
    >
      {/* Icon bubble */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 16,
          delay: index * 0.13 + 0.18,
        }}
        className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-1"
      >
        <Icon size={26} className="text-blue-500" aria-hidden="true" />
      </motion.div>

      {/* Animated number */}
      <CountUp rawValue={stat.rawValue} suffix={stat.suffix} inView={inView} />

      {/* Label */}
      <p className="text-sm text-slate-400 font-normal text-center leading-snug">
        {stat.label}
      </p>
    </motion.div>
  );
}

export default function ResultsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading slide-up
      gsap.fromTo(
        headingRef.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );

      // Trust badges stagger
      gsap.fromTo(
        ".trust-badge",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".trust-row",
            start: "top 92%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">

        {/* Section heading */}
        <div ref={headingRef} className="text-center mb-12 opacity-0">
         
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-snug">
            What our system delivers
          </h2>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-stretch bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={i}
              isLast={i === STATS.length - 1}
            />
          ))}
        </motion.div>

        {/* Trust badges */}
       

      </div>
    </section>
  );
}