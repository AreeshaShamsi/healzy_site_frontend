"use client";

/**
 * StackedScrollCards.tsx  — Full-screen light-blue edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Cards cover 100vw × 100vh and stack over each other on scroll.
 * Background: soft light-blue (#EAF3FB → #D6ECFA gradient).
 *
 * Install:  npm install gsap
 *
 * In layout.tsx add Playfair Display + DM Sans via next/font/google and
 * expose as CSS variables --font-playfair and --font-dm on <body>.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LERP_EASE  = 0.075;
const LERP_SNAP  = 0.0005;
const VELOCITY_K = 0.80;

const CARDS = [
  {
    step: "01",
    title: "Discovery & Audit",
    accent: "Audit",
    body: "We audit your current funnel — visibility, conversion rate, follow-up gaps, and retention data.",
    bg: "linear-gradient(160deg, #ffffff 0%, #F0F7FE 100%)",
  },
  {
    step: "02",
    title: "Growth Blueprint",
    accent: "Blueprint",
    body: "A custom roadmap across all three pillars: Relevance, Trust, and Retention — built for your practice type.",
    bg: "linear-gradient(160deg, #F5F9FF 0%, #EBF3FD 100%)",
  },
  {
    step: "03",
    title: "System Build",
    accent: "Build",
    body: "We implement campaigns, automations, profile optimisations, and follow-up systems in parallel.",
    bg: "linear-gradient(160deg, #EDF4FF 0%, #E3EEF9 100%)",
  },
  {
    step: "04",
    title: "Launch & Activate",
    accent: "Activate",
    body: "Everything goes live. We monitor closely and optimise in the first 30 days for peak performance.",
    bg: "linear-gradient(160deg, #E8F1FB 0%, #DCE9F6 100%)",
  },
  {
    step: "05",
    title: "Report & Scale",
    accent: "Scale",
    body: "Monthly outcome reports. Ongoing refinement. As results compound, we scale what's working.",
    bg: "linear-gradient(160deg, #E3EDF9 0%, #D6E5F4 100%)",
  },
] as const;

const N = CARDS.length;

function lerpFn(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function SplitTitle({ title, accent }: { title: string; accent: string }) {
  const idx = title.indexOf(accent);
  if (idx === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, idx)}
      <em className="not-italic" style={{ color: "#185FA5" }}>
        {accent}
      </em>
      {title.slice(idx + accent.length)}
    </>
  );
}

export default function StackedScrollCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnerRef  = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef    = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const outroRef   = useRef<HTMLDivElement>(null);
  const mouseRef   = useRef({ x: 0, y: 0 });

  const lerpRef = useRef({
    current:  0,
    target:   0,
    velocity: 0,
    raf:      0,
    st:       null as ScrollTrigger | null,
  });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vH = window.innerHeight;

    // ── FIX 1: Card 0 is fully bright on mount, no gray flash ─────────────────
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      if (i === 0) {
        card.style.transform = "translateY(0px) scale(1)";
        card.style.opacity   = "1";
        card.style.filter    = "blur(0px) brightness(1)";
        card.style.zIndex    = String(N + 1);
      } else {
        card.style.transform = `translateY(${vH}px) scale(0.92)`;
        card.style.opacity   = "0";
        card.style.filter    = "blur(2px) brightness(0.72)";
        card.style.zIndex    = String(N - i);
      }
    });

    if (reduced) return;

    const ctx = gsap.context(() => {

      // Header big heading fade-in
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 86%" },
        }
      );

      // FIX 4: Outro breathes in gently after last card settles
      if (outroRef.current) {
        gsap.fromTo(
          outroRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1, y: 0, duration: 1.1, ease: "power2.out",
            scrollTrigger: { trigger: outroRef.current, start: "top 90%" },
          }
        );
      }

      const st = ScrollTrigger.create({
        trigger:       pinnerRef.current,
        start:         "top top",
        end:           `+=${(N - 1) * vH}`,
        pin:           true,
        pinSpacing:    true,
        anticipatePin: 1,
      });

      lerpRef.current.st = st;
    }, sectionRef);

    // ── RAF lerp loop — drives all card motion every frame ────────────────────
    function computeReal(): number {
      const st = lerpRef.current.st;
      if (!st) return 0;
      return Math.max(0, Math.min(1, st.progress));
    }

    function tick() {
      const s = lerpRef.current;
      s.target = computeReal();

      const delta = s.target - s.current;
      if (Math.abs(delta) < LERP_SNAP && Math.abs(s.velocity) < LERP_SNAP) {
        s.current  = s.target;
        s.velocity = 0;
      } else {
        // velocity-augmented lerp — same quality both directions
        s.velocity = lerpFn(s.velocity, delta * LERP_EASE * 60, 1 - VELOCITY_K);
        s.current  = lerpFn(s.current, s.target, LERP_EASE);
      }

      applyProgress(s.current);
      s.raf = requestAnimationFrame(tick);
    }

    lerpRef.current.raf = requestAnimationFrame(tick);

    // Mouse parallax on the topmost card
    function onMove(e: MouseEvent) {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - r.left) / r.width  - 0.5) * 2,
        y: ((e.clientY - r.top)  / r.height - 0.5) * 2,
      };
      let topCard: HTMLDivElement | null = null;
      let maxZ = -Infinity;
      cardRefs.current.forEach(c => {
        if (!c) return;
        const z = +c.style.zIndex;
        if (z > maxZ) { maxZ = z; topCard = c; }
      });
      if (topCard) {
        const { x, y } = mouseRef.current;
        gsap.to(topCard, {
          x: x * 10, rotationY: x * 3.5, rotationX: -y * 2,
          duration: 1.4, ease: "power3.out", overwrite: "auto",
        });
      }
    }

    sectionRef.current?.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(lerpRef.current.raf);
      ctx.revert();
      sectionRef.current?.removeEventListener("mousemove", onMove);
    };
  }, []);

  function applyProgress(progress: number) {
    const raw    = progress * (N - 1);
    const segIdx = Math.min(Math.floor(raw), N - 2);
    const segPct = raw - segIdx;
    positionCards(segIdx, segPct);
    if (fillRef.current) fillRef.current.style.height = `${progress * 100}%`;
  }

  // ── FIX 2: Correct bi-directional card math ───────────────────────────────
  // relPos = 0   → card is the active one (fully visible)
  // relPos < 0   → card is buried (scrolled past) — on UP scroll it re-emerges
  // relPos 0→1   → card is currently entering from below
  // relPos > 1   → card is queued below the viewport
  //
  // The burial curve (relPos ≤ 0) now uses a smooth cosine ease so re-emergence
  // on scroll-up looks exactly as good as the descent on scroll-down.
  function positionCards(segIdx: number, segPct: number) {
    const vH = typeof window !== "undefined" ? window.innerHeight : 900;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      const relPos = i - segIdx - segPct;

      let translateY = 0;
      let scale      = 1;
      let opacity    = 1;
      let blur       = 0;
      let brightness = 1;
      let z          = N;

      if (relPos <= 0) {
        // Buried / active. d=0 → perfect active state.
        // d grows as more cards stack on top.
        const d = Math.abs(relPos);

        // Smooth cosine ease so the burial/re-emergence curve is symmetric
        // and doesn't visually "snap" when scrolling up.
        const ease = d <= 0 ? 0 : Math.min(d, 3) / 3; // 0–1 over first 3 cards
        const t    = 0.5 - 0.5 * Math.cos(ease * Math.PI); // cosine ease-in-out

        scale      = lerpFn(1,    0.78, t);
        opacity    = lerpFn(1,    0,    Math.min(d * 0.6, 1));
        blur       = lerpFn(0,    6,    t);
        brightness = lerpFn(1,    0.28, t);
        translateY = d * 18;
        z          = N - Math.ceil(d);

      } else if (relPos <= 1) {
        // Entering from below — expo-out so it decelerates as it lands
        const t      = 1 - relPos;
        const eased  = t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
        translateY   = vH * 0.98 * (1 - eased);
        scale        = 0.92 + 0.08 * eased;
        opacity      = 0.08 + 0.92 * eased;
        blur         = 3 * (1 - eased);
        brightness   = 0.72 + 0.28 * eased;
        z            = N + 1;

      } else {
        // Queued below viewport
        const d    = relPos - 1;
        translateY = vH + d * 60;
        scale      = 0.92;
        opacity    = d < 0.3 ? 0.08 : 0;
        blur       = 2;
        brightness = 0.72;
        z          = Math.max(0, N - Math.floor(relPos));
      }

      card.style.zIndex    = String(Math.max(0, Math.round(z)));
      card.style.opacity   = String(+opacity.toFixed(3));
      card.style.filter    = `blur(${+blur.toFixed(2)}px) brightness(${+brightness.toFixed(3)})`;
      card.style.transform = `translateY(${+translateY.toFixed(2)}px) scale(${+scale.toFixed(4)})`;
    });
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Our process"
      style={{
        position: "relative",
        background: "linear-gradient(160deg, #D6ECFA 0%, #EAF3FB 50%, #DDE9F8 100%)",
      }}
    >
      {/* Background orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-20 -top-32 h-[520px] w-[520px] rounded-full"
          style={{ background: "rgba(55,138,221,0.13)", filter: "blur(110px)" }} />
        <div className="absolute -bottom-20 -left-16 h-[400px] w-[400px] rounded-full"
          style={{ background: "rgba(24,95,165,0.08)", filter: "blur(100px)" }} />
      </div>

      {/* ── FIX 3: Big "How We Work" heading above the pin zone ─────────────── */}
      <div
        ref={headerRef}
        className="relative z-10 flex flex-col items-center px-6 pt-24 pb-12"
        style={{ opacity: 0 }}
      >
        {/* Eyebrow */}
        <p
          className="mb-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.26em]"
          style={{ color: "rgba(24,95,165,0.5)" }}
        >
          <span className="block h-px w-8" style={{ background: "rgba(24,95,165,0.25)" }} />
          Our Process
          <span className="block h-px w-8" style={{ background: "rgba(24,95,165,0.25)" }} />
        </p>

        {/* Big heading — same Playfair as cards so it feels like one family */}
        <h2
          className="text-center leading-[1.04]"
          style={{
            fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)",
            fontSize: "clamp(48px, 8vw, 104px)",
            fontWeight: 400,
            letterSpacing: "-0.035em",
            color: "#042C53",
            maxWidth: "760px",
          }}
        >
          How We{" "}
          <em className="not-italic" style={{ color: "#185FA5" }}>Work</em>
        </h2>

        {/* Subtitle */}
        <p
          className="mt-6 max-w-md text-center text-lg font-light leading-relaxed"
          style={{ color: "rgba(4,44,83,0.42)" }}
        >
          Five phases. One compounding system. Built to grow your practice.
        </p>
      </div>

      {/* Pinned viewport */}
      <div ref={pinnerRef} className="relative z-10 h-screen w-full overflow-hidden">

        {/* Vertical progress bar */}
        <div
          aria-hidden="true"
          className="absolute left-6 top-1/2 z-50 h-44 w-0.5 -translate-y-1/2 overflow-hidden rounded-full md:left-10"
          style={{ background: "rgba(24,95,165,0.12)" }}
        >
          <div
            ref={fillRef}
            className="absolute inset-x-0 top-0 rounded-full"
            style={{
              height: "0%",
              background: "linear-gradient(180deg,#185FA5,#378ADD)",
              boxShadow: "0 0 8px rgba(24,95,165,0.35)",
            }}
          />
        </div>

        {/* Card stack */}
        <div className="absolute inset-0" role="list" aria-label="Process steps">
          {CARDS.map((card, i) => (
            <div
              key={card.step}
              ref={(el) => { cardRefs.current[i] = el; }}
              role="listitem"
              aria-label={`Step ${card.step}: ${card.title}`}
              className="absolute inset-x-0 bottom-0"
              style={{
                top: 0,
                borderRadius: "32px 32px 0 0",
                background: card.bg,
                willChange: "transform, opacity, filter",
                transformOrigin: "bottom center",
                boxShadow: "0 -4px 60px rgba(24,95,165,0.08), 0 -1px 0 rgba(24,95,165,0.14)",
              }}
            >
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(55,138,221,0.4) 50%,transparent)" }} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                style={{ borderRadius: "inherit",
                         background: "linear-gradient(135deg,rgba(55,138,221,0.07) 0%,transparent 45%)" }} />

              <div className="flex h-full flex-col justify-center px-10 pb-24 pt-16 md:px-20 lg:px-32 xl:px-48">
                <p className="mb-8 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "rgba(24,95,165,0.55)" }}>
                  <span className="block h-px w-7" style={{ background: "rgba(24,95,165,0.35)" }} aria-hidden="true" />
                  Step {card.step}
                </p>

                <h3
                  className="mb-6 leading-[1.07] tracking-tight text-[#042C53]"
                  style={{
                    fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)",
                    fontSize: "clamp(44px,7.5vw,88px)",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    maxWidth: "820px",
                  }}
                >
                  <SplitTitle title={card.title} accent={card.accent} />
                </h3>

                <p className="max-w-xl text-lg font-light leading-relaxed md:text-xl"
                  style={{ color: "rgba(4,44,83,0.5)" }}>
                  {card.body}
                </p>

                <div className="mt-10">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em]"
                    style={{ background: "rgba(24,95,165,0.08)", border: "1px solid rgba(24,95,165,0.15)",
                             color: "rgba(24,95,165,0.65)" }}
                  >
                    <span className="block h-1.5 w-1.5 rounded-full"
                      style={{ background: "#378ADD", boxShadow: "0 0 6px rgba(55,138,221,0.6)" }} aria-hidden="true" />
                    Phase {card.step} of {N}
                  </span>
                </div>
              </div>

              <div aria-hidden="true"
                className="pointer-events-none absolute bottom-10 right-10 select-none leading-none md:bottom-16 md:right-16"
                style={{
                  fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)",
                  fontSize: "clamp(90px,18vw,200px)",
                  fontWeight: 400,
                  color: "rgba(55,138,221,0.07)",
                  letterSpacing: "-0.04em",
                }}
              >
                {card.step}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll nudge */}
       
      </div>

      
      

      <style>{`
        @keyframes nudgePulse {
          0%,100%{ opacity:.3; transform:scaleY(1); }
          50%    { opacity:1;  transform:scaleY(0.65); }
        }
        @keyframes outroPulse {
          0%,100%{ opacity:.25; transform:translateY(0); }
          50%    { opacity:.7;  transform:translateY(7px); }
        }
        @media(prefers-reduced-motion:reduce){
          *{ animation:none!important; transition:none!important; }
        }
      `}</style>
    </section>
  );
}