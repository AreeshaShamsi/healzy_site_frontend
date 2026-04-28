"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLSpanElement>(null);
  const line2Ref    = useRef<HTMLSpanElement>(null);
  const line3Ref    = useRef<HTMLSpanElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const blob1Ref    = useRef<HTMLDivElement>(null);
  const blob2Ref    = useRef<HTMLDivElement>(null);
  const blob3Ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── FIX #2: Register plugin INSIDE useEffect (SSR-safe) ─────────────────
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── FIX #4: .filter(Boolean) prevents null ref crashes ────────────────
      const headings = [
        line1Ref.current,
        line2Ref.current,
        line3Ref.current,
      ].filter(Boolean);

      const supporting = [
        subRef.current,
        ctaRef.current,
        statsRef.current,
      ].filter(Boolean);

      // ── 1. Set initial hidden state BEFORE entry animation ────────────────
      gsap.set(headings, { y: 60, opacity: 0 });
      gsap.set(supporting, { y: 30, opacity: 0 });

      // ── 2. Entry animation (runs once, no ScrollTrigger) ──────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(headings, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
        })
        .to(subRef.current,   { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .to(ctaRef.current,   { y: 0, opacity: 1, duration: 0.6 }, "-=0.35")
        .to(statsRef.current, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");

      // ── 3. Blob parallax (scrub = bidirectional) ──────────────────────────
      const blobBase = {
        ease: "none" as const,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          invalidateOnRefresh: true,
        },
      };

      gsap.to(blob1Ref.current, { y: -80, scrub: 1.5, ...blobBase });
      gsap.to(blob2Ref.current, { y: -40, x: 30, scrub: 2, ...blobBase });
      gsap.to(blob3Ref.current, { y: -60, x: -20, scrub: 1.8, ...blobBase });

      // ── 4. Scroll-out animations ──────────────────────────────────────────
      const attachScrollOut = () => {
        gsap.to(headings, {
          y: -50,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "20% top",
            end: "70% top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(supporting, {
          y: -30,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "25% top",
            end: "65% top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      };

      // ── FIX #1: tl.call() instead of tl.then() (GSAP timelines aren't Promises) ──
      tl.call(attachScrollOut);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #bde3f5 0%, #cdeaf8 18%, #dff2fb 35%, #edf8fd 52%, #daeef9 68%, #c8e4f4 84%, #b5d7ee 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          ref={blob1Ref}
          className="absolute top-0 right-0 w-[60vw] h-[75vh]"
          style={{
            background:
              "radial-gradient(ellipse at 75% 15%, #ffffff 0%, #d8edf8 38%, transparent 68%)",
            opacity: 0.75,
          }}
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-0 right-0 w-[48vw] h-[55vh]"
          style={{
            background:
              "radial-gradient(ellipse at 88% 88%, #aed4ee 0%, transparent 62%)",
            opacity: 0.5,
          }}
        />
        <div
          ref={blob3Ref}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-[35vw] h-[60vh]"
          style={{
            background:
              "radial-gradient(ellipse at 10% 50%, #d8eef8 0%, transparent 65%)",
            opacity: 0.45,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-center flex-1 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div ref={badgeRef} className="inline-flex items-center gap-2 self-start mb-4 sm:mb-5" />

        <h1 className="font-black leading-[1.04] tracking-tight mb-4 sm:mb-5">
          <span
            ref={line1Ref}
            className="block text-[#0d1b2e]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
          >
            Generate Patients.
          </span>
          <span
            ref={line2Ref}
            className="block text-[#0d1b2e]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
          >
            Build Trust.
          </span>
          <span
            ref={line3Ref}
            className="block"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
              background: "linear-gradient(90deg, #1a7fe8 0%, #00b4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Retain Them.
          </span>
        </h1>

        <p
          ref={subRef}
          className="text-[#4a5a6a] leading-relaxed mb-6 sm:mb-7"
          style={{
            fontSize: "clamp(1rem, 1.4vw, 1.05rem)",
            maxWidth: "min(460px, 85vw)",
          }}
        >
          We help healthcare businesses generate patient inquiries, convert them
          into appointments, and retain patients for long-term growth.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-3 items-center mb-8 sm:mb-10">
          <button
            className="flex items-center gap-2 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-400/30"
            style={{
              background: "linear-gradient(90deg, #1a7fe8 0%, #0eb5ff 100%)",
              padding: "0.6rem 1.25rem",
              fontSize: "clamp(0.9rem, 1.1vw, 0.9rem)",
            }}
          >
            Book a Free Consultation
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div ref={statsRef} className="flex flex-nowrap gap-6 sm:gap-10 md:gap-14">
          {[
            { value: "500+", label: "Projects Delivered" },
            { value: "98%",  label: "Client Satisfaction" },
            { value: "12+",  label: "Years of Excellence" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span
                className="font-extrabold text-[#0d1b2e] tracking-tight"
                style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.35rem)" }}
              >
                {value}
              </span>
              <span
                className="text-[#6a7e90]"
                style={{ fontSize: "clamp(0.78rem, 0.85vw, 0.78rem)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}