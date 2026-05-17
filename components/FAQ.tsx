"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "What does a digital marketing agency for doctors do?",
    answer:
      "It helps generate patient inquiries, but real growth comes from converting and retaining those patients.",
  },
  {
    question: "How do healthcare marketing services help my clinic?",
    answer:
      "They improve visibility, generate inquiries, and help build systems that convert and retain patients.",
  },
  {
    question: "Why is retention important in healthcare?",
    answer:
      "Because repeat visits and long-term patient relationships are key to sustainable growth.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 0.97]);

  // GSAP: stagger accordion items on scroll
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);

    items.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
          delay: i * 0.13,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // GSAP: floating decorative pill
  const pillRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!pillRef.current) return;
    gsap.to(pillRef.current, {
      y: -14,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white rounded-2xl px-8 py-12 md:px-12 md:py-16 overflow-hidden"
    >
      {/* Decorative animated background blob */}
     
      
      {/* Floating decorative pill */}
      

      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16">

        {/* Left: heading with Framer Motion fade-up */}
        <div className="md:w-72 flex-shrink-0">
          <motion.h2
            ref={headingRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="heading"
          >
            Frequently Asked Questions
          </motion.h2>

         

          {/* Animated underline accent */}
          
        </div>

        {/* Right: accordion — GSAP handles entry, Framer handles open/close */}
        <div className="flex-1 flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`bg-white rounded-xl border transition-colors duration-200 ${
                  isOpen ? "border-neutral-300 shadow-sm" : "border-neutral-200"
                }`}
                style={{ opacity: 0 }} // GSAP controls initial opacity
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-[18px] text-left group"
                >
                  <span className="text-[14.5px] font-medium text-neutral-900 transition-colors duration-200 group-hover:text-neutral-700">
                    {faq.question}
                  </span>

                  {/* Icon circle with Framer rotate */}
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center ${
                      isOpen
                        ? "bg-neutral-900 border-neutral-900"
                        : "bg-neutral-50 border-neutral-300"
                    }`}
                    style={{ transition: "background 0.25s, border-color 0.25s" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 1v10M1 6h10"
                        stroke={isOpen ? "#fff" : "#111827"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.span>
                </button>

                {/* AnimatePresence for smooth mount/unmount */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.28, ease: "easeOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={{ y: -6 }}
                        animate={{ y: 0 }}
                        exit={{ y: -6 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="px-5 pb-5 pt-0 text-sm text-neutral-900 leading-relaxed border-t border-neutral-100"
                      >
                        <span className="block pt-3">{faq.answer}</span>
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
