"use client";

/**
 * ResultsSection.tsx — Elevated stats with full GSAP bidirectional scroll animations
 * ─────────────────────────────────────────────────────────────────────────────────
 * Design language: matches StackedScrollCards (Playfair Display, #042C53, #185FA5)
 * Animations:
 *  - Heading + eyebrow: slide up on enter, slide down on leave (bidirectional)
 *  - Stat cards: staggered rise from below on enter, sink back on leave
 *  - Numbers: GSAP CountUp triggers on enter, resets on leave for re-trigger
 *  - Horizontal rule: width wipe left→right on enter, right→left on leave
 *  - Background parallax orbs drift on scroll
 *  - Each card has a subtle scrub-based Y parallax as you scroll through
 */

import { useEffect, useRef } from "react";
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
    isDecimal: false,
    icon: RiHospitalLine,
    description: "More new patient inquiries within 90 days of launch",
  },
  {
    label: "Retention Improvement",
    value: "85%",
    rawValue: 85,
    suffix: "%",
    isDecimal: false,
    icon: RiUserHeartLine,
    description: "Of patients return for follow-up care under our system",
  },
  {
    label: "Faster Inquiry Response",
    value: "62%",
    rawValue: 62,
    suffix: "%",
    isDecimal: false,
    icon: RiGroupLine,
    description: "Reduction in response time with automated follow-up flows",
  },
  {
    label: "Average Review Rating",
    value: "4.8★",
    rawValue: 4.8,
    suffix: "★",
    isDecimal: true,
    icon: RiShieldCheckLine,
    description: "Across Google and Healthgrades after reputation campaigns",
  },
];

export default function ResultsSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const eyebrowRef    = useRef<HTMLParagraphElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const ruleRef       = useRef<HTMLDivElement>(null);
  const cardsWrapRef  = useRef<HTMLDivElement>(null);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const orb1Ref       = useRef<HTMLDivElement>(null);
  const orb2Ref       = useRef<HTMLDivElement>(null);
  // Track whether countup has already fired so we can reset it
  const countUpTweens = useRef<(gsap.core.Tween | null)[]>([null, null, null, null]);
  const numRefs       = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Helper: reset a number display to "0suffix" ─────────────────────────
      function resetNum(i: number) {
        if (numRefs.current[i]) {
          numRefs.current[i]!.textContent = `0${STATS[i].suffix}`;
        }
        countUpTweens.current[i]?.kill();
        countUpTweens.current[i] = null;
      }

      // ── Helper: fire countUp for stat i ─────────────────────────────────────
      function fireCountUp(i: number) {
        const stat = STATS[i];
        const el   = numRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        countUpTweens.current[i] = gsap.to(obj, {
          val: stat.rawValue,
          duration: 1.8,
          ease: "power3.out",
          delay: i * 0.12,
          onUpdate() {
            const display = stat.isDecimal
              ? obj.val.toFixed(1)
              : Math.round(obj.val).toString();
            el.textContent = `${display}${stat.suffix}`;
          },
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // 1. EYEBROW — bidirectional slide
      // ─────────────────────────────────────────────────────────────────────────
      gsap.set(eyebrowRef.current, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: eyebrowRef.current,
        start: "top 88%",
        end: "bottom 10%",
        onEnter() {
          gsap.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        },
        onLeave() {
          gsap.to(eyebrowRef.current, { opacity: 0, y: -16, duration: 0.5, ease: "power2.in" });
        },
        onEnterBack() {
          gsap.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        },
        onLeaveBack() {
          gsap.to(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.5, ease: "power2.in" });
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // 2. HEADING — bidirectional, slight delay after eyebrow
      // ─────────────────────────────────────────────────────────────────────────
      gsap.set(headingRef.current, { opacity: 0, y: 32 });
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: "top 86%",
        end: "bottom 10%",
        onEnter() {
          gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.08 });
        },
        onLeave() {
          gsap.to(headingRef.current, { opacity: 0, y: -22, duration: 0.55, ease: "power2.in" });
        },
        onEnterBack() {
          gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.08 });
        },
        onLeaveBack() {
          gsap.to(headingRef.current, { opacity: 0, y: 32, duration: 0.55, ease: "power2.in" });
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // 3. SUBTITLE
      // ─────────────────────────────────────────────────────────────────────────
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: subtitleRef.current,
        start: "top 88%",
        end: "bottom 10%",
        onEnter() {
          gsap.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.18 });
        },
        onLeave() {
          gsap.to(subtitleRef.current, { opacity: 0, y: -14, duration: 0.45, ease: "power2.in" });
        },
        onEnterBack() {
          gsap.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.18 });
        },
        onLeaveBack() {
          gsap.to(subtitleRef.current, { opacity: 0, y: 20, duration: 0.45, ease: "power2.in" });
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // 4. RULE — width wipe, reverses on leave
      // ─────────────────────────────────────────────────────────────────────────
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left center", opacity: 1 });
      ScrollTrigger.create({
        trigger: ruleRef.current,
        start: "top 90%",
        end: "bottom 5%",
        onEnter() {
          gsap.to(ruleRef.current, { scaleX: 1, duration: 1.1, ease: "power3.inOut" });
        },
        onLeave() {
          gsap.to(ruleRef.current, { scaleX: 0, transformOrigin: "right center", duration: 0.6, ease: "power2.in" });
        },
        onEnterBack() {
          gsap.to(ruleRef.current, { scaleX: 1, transformOrigin: "right center", duration: 0.9, ease: "power3.out" });
        },
        onLeaveBack() {
          gsap.to(ruleRef.current, { scaleX: 0, transformOrigin: "left center", duration: 0.6, ease: "power2.in" });
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // 5. STAT CARDS — staggered bidirectional + countUp reset on leave
      // ─────────────────────────────────────────────────────────────────────────
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, { opacity: 0, y: 50, scale: 0.96 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          end: "bottom 5%",
          onEnter() {
            gsap.to(card, {
              opacity: 1, y: 0, scale: 1,
              duration: 0.75,
              delay: i * 0.11,
              ease: "power3.out",
            });
            fireCountUp(i);
          },
          onLeave() {
            gsap.to(card, {
              opacity: 0, y: -28, scale: 0.97,
              duration: 0.45,
              ease: "power2.in",
            });
            resetNum(i);
          },
          onEnterBack() {
            gsap.to(card, {
              opacity: 1, y: 0, scale: 1,
              duration: 0.7,
              delay: (STATS.length - 1 - i) * 0.08,
              ease: "power3.out",
            });
            fireCountUp(i);
          },
          onLeaveBack() {
            gsap.to(card, {
              opacity: 0, y: 50, scale: 0.96,
              duration: 0.45,
              ease: "power2.in",
            });
            resetNum(i);
          },
        });
      });

      // ─────────────────────────────────────────────────────────────────────────
      // 6. BACKGROUND ORB PARALLAX — scrub-based slow drift
      // ─────────────────────────────────────────────────────────────────────────
      gsap.to(orb1Ref.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
        },
      });
      gsap.to(orb2Ref.current, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.2,
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // 7. CARD MICRO-PARALLAX — each card floats slightly as you scroll through
      // ─────────────────────────────────────────────────────────────────────────
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const dir = i % 2 === 0 ? -12 : 12;
        gsap.fromTo(card,
          { y: dir },
          {
            y: -dir,
            ease: "none",
            scrollTrigger: {
              trigger: cardsWrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1 + i * 0.3,
            },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Results"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(170deg, #F8FBFF 0%, #EAF3FB 50%, #F0F6FD 100%)",
        padding: "72px 24px",
      }}
    >
      {/* ── Background orbs ────────────────────────────────────────────────── */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-80px",
          right: "-60px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(55,138,221,0.10)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-80px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(24,95,165,0.07)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header block ───────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>

          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "10px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.26em",
              color: "rgba(24,95,165,0.5)",
              marginBottom: "14px",
            }}
          >
            <span style={{ display: "block", height: "1px", width: "28px", background: "rgba(24,95,165,0.25)" }} />
            Proven Outcomes
            <span style={{ display: "block", height: "1px", width: "28px", background: "rgba(24,95,165,0.25)" }} />
          </p>

          {/* Heading */}
          <h2
            ref={headingRef}
            style={{
              fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 400,
              letterSpacing: "-0.028em",
              lineHeight: 1.08,
              color: "#042C53",
              margin: "0 auto 14px",
              maxWidth: "560px",
            }}
          >
            What our system{" "}
            <em className="not-italic" style={{ color: "#185FA5" }}>delivers</em>
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: "18px",
              fontWeight: 300,
              lineHeight: 1.65,
              color: "rgba(4,44,83,0.45)",
              maxWidth: "400px",
              margin: "0 auto",
              fontSize: "15px",
            }}
          >
            Real numbers from real practices — tracked, verified, and compounding.
          </p>

          {/* Wipe rule */}
          <div
            ref={ruleRef}
            style={{
              height: "1px",
              width: "60px",
              margin: "20px auto 0",
              background: "linear-gradient(90deg, transparent, #378ADD, transparent)",
            }}
          />
        </div>

        {/* ── Stat cards grid ─────────────────────────────────────────────────── */}
        <div
          ref={cardsWrapRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
          }}
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  position: "relative",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(24,95,165,0.10)",
                  boxShadow: "0 4px 40px rgba(24,95,165,0.06), 0 1px 0 rgba(255,255,255,0.8) inset",
                  padding: "24px 22px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  overflow: "hidden",
                  willChange: "transform, opacity",
                }}
              >
                {/* Top-left glow */}
                <div aria-hidden="true" style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  background: "linear-gradient(135deg, rgba(55,138,221,0.06) 0%, transparent 50%)",
                  pointerEvents: "none",
                }} />

                {/* Icon bubble */}
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #EAF3FB 0%, #D6E8F8 100%)",
                  border: "1px solid rgba(24,95,165,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color: "#185FA5" }} aria-hidden="true" />
                </div>

                {/* Number */}
                <span
                  ref={(el) => { numRefs.current[i] = el; }}
                  style={{
                    fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)",
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 400,
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                    color: "#042C53",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  0{stat.suffix}
                </span>

                {/* Label */}
                <div>
                  <p style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "rgba(24,95,165,0.7)",
                    marginBottom: "6px",
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    fontSize: "14px",
                    fontWeight: 300,
                    lineHeight: 1.55,
                    color: "rgba(4,44,83,0.45)",
                  }}>
                    {stat.description}
                  </p>
                </div>

                {/* Bottom shimmer line */}
                <div aria-hidden="true" style={{
                  position: "absolute",
                  bottom: 0,
                  left: "20%",
                  right: "20%",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(55,138,221,0.3), transparent)",
                }} />
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}