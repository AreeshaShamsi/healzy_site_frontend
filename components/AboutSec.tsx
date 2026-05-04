"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── entrance timeline (scroll-triggered) ──────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Left column images
      tl.fromTo(
        img1Ref.current,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
        0
      )
        .fromTo(
          img2Ref.current,
          { y: 80, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
          0.15
        )
        .fromTo(
          blobRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)" },
          0.1
        )

        // Right column
        .fromTo(
          profileRef.current,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          0.2
        )
        .fromTo(
          quoteRef.current,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          0.3
        )
        .fromTo(
          taglineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          0.35
        )
        .fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          0.45
        )
        .fromTo(
          bodyRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          0.55
        );

      // ── parallax on the two images while scrolling ─────────────────────
      gsap.to(img1Ref.current, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(img2Ref.current, {
        y: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // ── floating blob ──────────────────────────────────────────────────
      gsap.to(blobRef.current, {
        y: -12,
        x: 6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#EFF6FF] overflow-hidden py-16 px-4 sm:px-8 lg:px-20"
    >
      {/* ── subtle background grid ───────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1e40af 1px,transparent 1px),linear-gradient(90deg,#1e40af 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* ════════════════════════════════════════════════
            LEFT — image collage
        ════════════════════════════════════════════════ */}
        <div
          ref={leftColRef}
          className="relative flex-shrink-0 w-full lg:w-[46%] h-[400px] sm:h-[480px]"
        >
          {/* Main tall image */}
          <div
            ref={img1Ref}
            className="absolute left-0 top-0 w-[55%] h-full rounded-2xl overflow-hidden shadow-xl"
            style={{ opacity: 0 }}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Team collaboration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Teal decorative blob */}
          <div
            ref={blobRef}
            className="absolute left-[44%] top-[12%] w-24 h-24 rounded-3xl bg-[#3B82F6] rotate-12 shadow-lg z-10"
            style={{ opacity: 0 }}
          />

          {/* Bottom-right image */}
          <div
            ref={img2Ref}
            className="absolute right-0 bottom-0 w-[50%] h-[62%] rounded-2xl overflow-hidden shadow-xl"
            style={{ opacity: 0 }}
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
              alt="Office team working"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT — text content
        ════════════════════════════════════════════════ */}
        <div ref={rightColRef} className="flex-1 flex flex-col gap-6">
          {/* Profile card */}
          <div
            ref={profileRef}
            className="flex items-center gap-4"
            style={{ opacity: 0 }}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-500 ring-offset-2 shadow-md flex-shrink-0">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Lucas Bennett"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">
                Lucas Bennett
              </p>
              <p className="text-xs text-gray-500">Founder & CEO</p>
            </div>
          </div>

          {/* Quote icon */}
          <div
            ref={quoteRef}
            className="text-blue-500 text-5xl font-serif leading-none select-none"
            style={{ opacity: 0 }}
          >
            &#8220;
          </div>

          {/* Divider */}
          <div className="w-16 h-0.5 bg-blue-500 rounded-full" />

          {/* About Us pill */}
          <span
            ref={taglineRef}
            className="inline-flex items-center gap-2 self-start bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md tracking-wide"
            style={{ opacity: 0 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
            About Us
          </span>

          {/* Heading */}
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight"
            style={{ opacity: 0 }}
          >
            About Us &ndash; Building Better
            <br />
            Digital Experiences
          </h2>

          {/* Body */}
          <p
            ref={bodyRef}
            className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-md"
            style={{ opacity: 0 }}
          >
            Flytech is a modern IT solution provider focused on helping
            businesses grow in the digital era. With smart technology,
            innovative ideas, and reliable services, we simplify challenges and
            create future-ready solutions that drive success.
          </p>
        </div>
      </div>
    </section>
  );
}