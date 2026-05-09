"use client";

import { useLayoutEffect, useRef } from "react";
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
    title: "Built on Healthcare Marketing Services That Matter",
    desc: "Our healthcare marketing services are designed around real outcomes — patient flow, trust, and sustainable growth.",
  },
  {
    icon: FaUserMd,
    title: "Beyond a Digital Marketing Agency for Doctors",
    desc: "As a digital marketing agency for doctors, we do more than campaigns — we build systems that support long-term patient acquisition."
  },
  {
    icon: FaHospitalAlt,
    title: "Hospital Growth Engine",
    desc: "Full-funnel marketing ecosystems built exclusively for multi-specialty hospitals and health systems aiming to scale fast.",
  },
  {
    icon: FaChartLine,
    title: "Strong Emphasis on Retention",
    desc: "Our approach ensures that patient inquiries are nurtured, followed up, and converted into repeat visits and relationships.",
  },
  {
    icon: FaBullhorn,
    title: "Understanding of Patient Behaviour",
    desc: "We understand how patients search, evaluate, and choose healthcare providers, and align your system accordingly.",
  },
  {
    icon: FaShieldAlt,
    title: "Structured and Measurable Systems",
    desc: "Unlike typical healthcare marketing agencies, we create structured systems that are scalable and driven by measurable results.",
  },
];

export default function WhyUsSection() {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    console.log("WhyUse mounted");

    const pinWrap = pinWrapRef.current;
    const track = trackRef.current;
    if (!pinWrap || !track) return;

    let disposed = false;
    let ctx: gsap.Context | null = null;

    const init = () => {
      if (disposed) return;
      ctx = gsap.context(() => {
        const getMove = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -getMove(),
          ease: "none",
        });

        ScrollTrigger.create({
          trigger: pinWrap,
          start: "top top",
          end: () => `+=${getMove()}`,
          pin: true,
          scrub: 1.5,
          animation: tween,
          invalidateOnRefresh: true,
        });

        track.querySelectorAll(".why-card").forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              duration: 1,
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 90%",
                end: "left 50%",
                scrub: true,
              },
            }
          );
        });
      }, pinWrap);
      ScrollTrigger.refresh();
    };

    const onResize = () => ScrollTrigger.refresh();
    const fontReady = "fonts" in document ? document.fonts.ready : Promise.resolve();
    fontReady.then(init);
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  return (
    <section className="bg-white">
      <div ref={pinWrapRef} className="h-screen overflow-hidden">
        <div className="h-full flex flex-col justify-center">

          {/* ─── Heading — matches screenshot exactly ──────────────────── */}
          <div className="text-center mb-12 px-6 shrink-0">
            <h2
              className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5"
            >
              Why us?
            </h2>
            <p className="font-body text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
             Many healthcare marketing agencies focus only on generating leads.
We help you build a system that not only brings patient inquiries but also converts and retains them for long-term growth.
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
                <h3 className="card-title text-base text-slate-800">
                  {title}
                </h3>

                {/* Desc */}
                <p className="font-body text-slate-500 text-sm leading-relaxed">
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
