"use client";

import { useEffect, useRef } from "react";
import {
  FaHeartbeat,
  FaUserMd,
  FaHospitalAlt,
  FaChartLine,
  FaBullhorn,
  FaShieldAlt,
} from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    icon: FaHeartbeat,
    title: "Patient Acquisition",
    desc: "Precision campaigns that convert high-intent patients into booked appointments — filling your schedule with the right cases.",
  },
  {
    icon: FaUserMd,
    title: "Physician Branding",
    desc: "Elevate doctors as trusted authorities with personal branding built on clinical credibility and a strong digital presence.",
  },
  {
    icon: FaHospitalAlt,
    title: "Hospital Growth Engine",
    desc: "Full-funnel marketing ecosystems built exclusively for multi-specialty hospitals and health systems aiming to scale fast.",
  },
  {
    icon: FaChartLine,
    title: "Data-Driven ROI",
    desc: "Every rupee tracked. Real-time dashboards measure CPL, OPD footfall and admission rates — always know what's working.",
  },
  {
    icon: FaBullhorn,
    title: "Instant Brand Awareness",
    desc: "Hyper-local campaigns place your hospital front-and-center when patients search — dominating Google, Meta & more.",
  },
  {
    icon: FaShieldAlt,
    title: "Reputation Management",
    desc: "We protect and proactively build 5-star reputations across Google, Practo, and Justdial — platforms patients trust most.",
  },
];

export default function WhyUsSection() {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pinWrap = pinWrapRef.current;
    const track = trackRef.current;
    if (!pinWrap || !track) return;

    let initialized = false;
    let tween: gsap.core.Tween | null = null;
    let st: ScrollTrigger | null = null;
    const cardTweens: gsap.core.Tween[] = [];

    const getMove = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const init = () => {
      if (initialized) return;
      initialized = true;

      tween = gsap.to(track, {
        x: () => -getMove(),
        ease: "none",
      });

      st = ScrollTrigger.create({
        trigger: pinWrap,
        start: "top top",
        end: () => `+=${getMove()}`,
        pin: true,
        scrub: 1.5,
        animation: tween,
        invalidateOnRefresh: true,
      });

      track.querySelectorAll(".why-card").forEach((card) => {
        const cardTween = gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 1,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween!,
              start: "left 90%",
              end: "left 50%",
              scrub: true,
            },
          }
        );
        cardTweens.push(cardTween);
      });

      ScrollTrigger.refresh();
    };

    const onResize = () => ScrollTrigger.refresh();

    if ("fonts" in document) {
      document.fonts.ready.then(init);
    } else {
      window.addEventListener("load", init);
    }

    window.addEventListener("load", init);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("load", init);
      window.removeEventListener("resize", onResize);

      cardTweens.forEach((t) => t.kill());
      st?.kill();
      tween?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="bg-white">
      <div ref={pinWrapRef} className="h-screen overflow-hidden">
        <div className="h-full flex flex-col justify-center">

          {/* ─── Heading — matches screenshot exactly ──────────────────── */}
          <div className="text-center mb-12 px-6 shrink-0">
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-5"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Why us?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              HELLO LENDING has just revolutionized and innovated the small
              business funding industry with our Digital Approval Engine, Online
              Checkout, and Same-day Funding! You are dealing directly with the
              funding source; we do not shop your information. Approval rates are
              among the highest in the industry, and funding can take place the
              same day without shuffling any paper.
            </p>
          </div>

          {/* ─── Card track ────────────────────────────────────────────── */}
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 pl-[8vw] pr-[8vw] w-max min-w-max will-change-transform"
          >
            {CARDS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="
                  why-card
                  flex-none
                  w-[82vw] sm:w-[54vw] md:w-[36vw] lg:w-[26vw] xl:w-[20vw]
                  bg-white
                  rounded-lg
                  border border-slate-200
                  p-8
                  flex flex-col items-center text-center
                  gap-4
                "
              >
                {/* Icon circle — light blue outline style like screenshot */}
                <div className="w-16 h-16 rounded-full border-2 border-blue-200 flex items-center justify-center shrink-0">
                  <Icon className="text-blue-400 text-2xl" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-slate-800">
                  {title}
                </h3>

                {/* Desc */}
                <p className="text-slate-500 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
