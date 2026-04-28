"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LOGOS = [
  { src: "/logos/batra-heart.png", alt: "Batra Heart & Multispeciality Hospital" },
  { src: "/logos/dream-home.png", alt: "Partner Hospital 2" },
  { src: "/logos/rani-avantibai.png", alt: "Partner Hospital 3" },
  { src: "/logos/shanta-homes.png", alt: "Partner Hospital 4" },
  { src: "/logos/dream-home.png", alt: "Partner Hospital 5" },
  { src: "/logos/rani-avantibai.png", alt: "Partner Hospital 6" },
];

export default function LogoCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const tiles = [...LOGOS, ...LOGOS, ...LOGOS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        track,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        }
      );

      const singleSetWidth = track.scrollWidth / 3;

      tweenRef.current = gsap.to(track, {
        x: `-=${singleSetWidth}`,
        duration: singleSetWidth / 55,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % singleSetWidth),
        },
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const v     = self.getVelocity();
          const boost = gsap.utils.clamp(0.3, 3.5, 1 + Math.abs(v) / 1000);
          const dir   = v < 0 ? -1 : 1;
          if (!tweenRef.current) return;
          gsap.to(tweenRef.current, {
            timeScale: boost * dir,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
            onComplete() {
              gsap.to(tweenRef.current!, { timeScale: 1, duration: 1.6, ease: "power2.inOut" });
            },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ background: "#ffffff", paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        {/* ── Subtle top rule ── */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "80%",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, #e2e8f0 30%, #e2e8f0 70%, transparent 100%)",
          }}
        />

        {/* ── Label row ── */}
        <div
          ref={labelRef}
          className="relative z-10 flex items-center justify-center gap-4 mb-10 px-6"
        >
          <div
            style={{
              flex: 1,
              maxWidth: 120,
              height: "1px",
              background: "linear-gradient(90deg, transparent, #cbd5e1)",
            }}
          />
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#94a3b8",
              whiteSpace: "nowrap",
            }}
          >
            Trusted by leading partners
          </p>
          <div
            style={{
              flex: 1,
              maxWidth: 120,
              height: "1px",
              background: "linear-gradient(90deg, #cbd5e1, transparent)",
            }}
          />
        </div>

        {/* ── Left fade mask ── */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-20"
          style={{
            width: "10%",
            background: "linear-gradient(to right, #ffffff 0%, transparent 100%)",
          }}
        />
        {/* ── Right fade mask ── */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-20"
          style={{
            width: "10%",
            background: "linear-gradient(to left, #ffffff 0%, transparent 100%)",
          }}
        />

        {/* ── Track ── */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center will-change-transform"
            style={{ width: "max-content", gap: "0px" }}
          >
            {tiles.map((logo, i) => (
              <LogoItem key={i} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        </div>

        {/* ── Subtle bottom rule ── */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "80%",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, #e2e8f0 30%, #e2e8f0 70%, transparent 100%)",
          }}
        />
      </section>
    </div>
  );
}

function LogoItem({ src, alt }: { src: string; alt: string }) {
  const itemRef    = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(itemRef.current, {
      scale: 1.06,
      duration: 0.28,
      ease: "power2.out",
    });
    gsap.to(itemRef.current, {
      filter: "grayscale(0%) opacity(1)",
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(itemRef.current, {
      scale: 1,
      duration: 0.38,
      ease: "power2.inOut",
    });
    gsap.to(itemRef.current, {
      filter: "grayscale(100%) opacity(0.45)",
      duration: 0.35,
      ease: "power2.inOut",
    });
  };

  return (
    <div className="flex items-center flex-shrink-0 px-3 sm:px-4 lg:px-6">
      {/* Logo */}
      <div
        ref={itemRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-pointer flex-shrink-0"
        style={{
          width: "clamp(140px, 18vw, 300px)",
          height: "clamp(56px, 9vw, 150px)",
          filter: "grayscale(100%) opacity(0.45)",
          willChange: "transform, filter",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 140px, (max-width: 1024px) 200px, 300px"
        />
      </div>

      {/* Vertical divider after each logo */}
      <div
        ref={dividerRef}
        className="flex-shrink-0 ml-3 sm:ml-4 lg:ml-6"
        style={{
          width: "1px",
          height: 28,
          background: "linear-gradient(180deg, transparent, #e2e8f0, transparent)",
        }}
      />
    </div>
  );
}