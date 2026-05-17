"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { ReactNode } from "react";

const TOTAL_FRAMES = 301;
const SECTION_HEIGHT_CLASS = "h-[400vh]";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getFrameSrc(index: number) {
  return `/frames/output_${String(index).padStart(4, "0")}.png`;
}

type HeroScrollProps = {
  children?: ReactNode;
};

export default function CinematicScroll({ children }: HeroScrollProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const highestLoadedRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(-1);
  const readyRef = useRef<boolean>(false);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const progressMv = useMotionValue(0);

  const leftPanelOpacity = useTransform(progressMv, [0, 0.0, 0.26, 0.34], [1, 1, 1, 0]);
  const leftPanelY = useTransform(progressMv, [0, 0.0, 0.26, 0.34], [0, 0, 0, -28]);

  const rightPanelOpacity = useTransform(progressMv, [0.38, 0.46, 0.64, 0.72], [0, 1, 1, 0]);
  const rightPanelY = useTransform(progressMv, [0.38, 0.46, 0.64, 0.72], [28, 0, 0, -28]);

  const bullet1Opacity = useTransform(progressMv, [0.28, 0.33], [0, 1]);
  const bullet2Opacity = useTransform(progressMv, [0.33, 0.38], [0, 1]);
  const bullet3Opacity = useTransform(progressMv, [0.38, 0.43], [0, 1]);
  const bullet4Opacity = useTransform(progressMv, [0.43, 0.48], [0, 1]);

  // Third card — appears after second card fades out, with a small delay offset
  const thirdPanelOpacity = useTransform(progressMv, [0.76, 0.84, 0.96, 1.0], [0, 1, 1, 1]);
  const thirdPanelY = useTransform(progressMv, [0.76, 0.84], [28, 0]);

  const pillar1Opacity = useTransform(progressMv, [0.84, 0.88], [0, 1]);
  const pillar2Opacity = useTransform(progressMv, [0.88, 0.92], [0, 1]);
  const pillar3Opacity = useTransform(progressMv, [0.92, 0.96], [0, 1]);

  const drawFrameToCanvas = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const targetW = Math.max(1, Math.floor(viewportW));
    const targetH = Math.max(1, Math.floor(viewportH));

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    if (canvas.style.width !== `${viewportW}px`) canvas.style.width = `${viewportW}px`;
    if (canvas.style.height !== `${viewportH}px`) canvas.style.height = `${viewportH}px`;

    ctx.clearRect(0, 0, targetW, targetH);

    const safe = loadedRef.current[frameIndex]
      ? frameIndex
      : Math.max(0, Math.min(frameIndex, highestLoadedRef.current));
    const image = framesRef.current[safe];
    if (!image || !loadedRef.current[safe]) return;

    const cr = targetW / targetH;
    const ir = image.naturalWidth / image.naturalHeight;
    let drawW = targetW;
    let drawH = targetH;
    let dx = 0;
    let dy = 0;
    if (ir > cr) {
      drawH = targetH;
      drawW = drawH * ir;
      dx = (targetW - drawW) / 2;
    } else {
      drawW = targetW;
      drawH = drawW / ir;
      dy = (targetH - drawH) / 2;
    }
    ctx.drawImage(image, dx, dy, drawW, drawH);
  };

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let completeCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i += 1) {
      const image = new window.Image();
      image.decoding = "async";
      image.src = getFrameSrc(i + 1);

      const markDone = (success: boolean) => {
        completeCount += 1;
        if (!cancelled) setLoadedCount(completeCount);
        if (success) {
          loadedRef.current[i] = true;
          highestLoadedRef.current = Math.max(highestLoadedRef.current, i);
        }
        if (i === 0 && success && !cancelled) {
          readyRef.current = true;
          setIsReady(true);
          currentFrameRef.current = 0;
          drawFrameToCanvas(0);
        }
        if (completeCount === TOTAL_FRAMES && !cancelled) {
          framesRef.current = images;
        }
      };

      image.onload = () => markDone(true);
      image.onerror = () => markDone(false);
      images[i] = image;
      framesRef.current[i] = image;
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const renderByScroll = () => {
      rafRef.current = 0;
      if (!readyRef.current) return;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = Math.max(sectionHeight - viewportHeight, 1);
      const progress = clamp(-rect.top / scrollable, 0, 1);

      progressMv.set(progress);

      let frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
      frameIndex = clamp(frameIndex, 0, TOTAL_FRAMES - 1);
      if (progress >= 0.999) frameIndex = TOTAL_FRAMES - 1;

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrameToCanvas(frameIndex);
      }
    };

    const requestRender = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(renderByScroll);
    };

    const handleResize = () => {
      drawFrameToCanvas(currentFrameRef.current < 0 ? 0 : currentFrameRef.current);
      requestRender();
    };

    if (isReady) {
      if (currentFrameRef.current < 0) currentFrameRef.current = 0;
      drawFrameToCanvas(currentFrameRef.current);
      requestRender();
    }

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, progressMv]);

  const pillars = [
    {
      op: pillar1Opacity,
      number: "01",
      title: "Relevance",
      desc: "We ensure your practice appears in front of patients who are actively searching for your services.",
      bullets: [
        "Search visibility for targeted conditions",
        "Local SEO for clinics & hospitals",
        "Targeted digital campaigns",
      ],
    },
    {
      op: pillar2Opacity,
      number: "02",
      title: "Trust",
      desc: "Patients evaluate your credibility before booking. We help you build that trust systematically.",
      bullets: [
        "Online reputation management",
        "Doctor profile optimisation",
        "Review generation systems",
      ],
    },
    {
      op: pillar3Opacity,
      number: "03",
      title: "Retention",
      desc: "Where most healthcare marketing agencies fall short. We build systems that keep patients coming back.",
      bullets: [
        "Automated follow-up systems",
        "Appointment conversion optimisation",
        "Long-term patient relationships",
      ],
    },
  ];

  return (
    <section id="hero-cinematic" ref={sectionRef} className={`relative w-full ${SECTION_HEIGHT_CLASS}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-y-0 right-0 z-0 h-full w-full md:w-[58%]" />

        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
            Loading... {loadedCount}/{TOTAL_FRAMES}
          </div>
        )}

        {/* Card 1 — Left */}
        <motion.div
          style={{ opacity: leftPanelOpacity }}
          className="absolute left-12 top-[53%] z-30 w-full max-w-[520px] -translate-y-1/2 md:w-[38%] md:max-w-[520px] lg:max-w-[520px]"
        >
          <motion.div
            style={{ y: leftPanelY }}
            className="relative flex min-h-[420px] w-full max-w-[520px] flex-col space-y-5 overflow-hidden rounded-[26px] border-[1.5px] border-[rgba(255,255,255,0.90)] bg-[linear-gradient(160deg,rgba(255,255,255,0.82)_0%,rgba(200,225,255,0.56)_28%,rgba(175,210,255,0.40)_62%,rgba(240,248,255,0.74)_100%)] px-6 py-10 [backdrop-filter:blur(64px)_saturate(260%)_brightness(1.18)_hue-rotate(3deg)] [box-shadow:0_1px_0_rgba(255,255,255,1)_inset,1px_0_0_rgba(255,255,255,0.84)_inset,-1px_-1px_0_rgba(145,195,255,0.34)_inset,0_0_52px_rgba(135,195,255,0.24)_inset,0_40px_100px_rgba(38,88,220,0.30),0_16px_40px_rgba(38,88,220,0.22),0_5px_14px_rgba(0,0,0,0.10),0_0_0_1px_rgba(85,150,255,0.26)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[3] before:h-[2px] before:rounded-t-[26px] before:content-[''] before:bg-[linear-gradient(90deg,rgba(140,195,255,0)_0%,rgba(255,255,255,1)_32%,rgba(195,228,255,0.88)_62%,rgba(140,195,255,0.22)_100%)] after:pointer-events-none after:absolute after:-right-[72px] after:-top-[72px] after:z-[1] after:h-[240px] after:w-[240px] after:rounded-full after:bg-[radial-gradient(circle,rgba(95,158,255,0.20)_0%,rgba(115,175,255,0.07)_44%,transparent_68%)] after:content-['']"
          >
            <div className="pointer-events-none absolute -bottom-[55px] -left-[55px] z-[1] h-[195px] w-[195px] rounded-full bg-[radial-gradient(circle,rgba(165,208,255,0.20)_0%,transparent_64%)]" />

            <h1 className="heading relative z-[2] my-4">
              Acquire
              <em className="ml-2">Patients.</em>
              <br />
              Build Trust.
              <br />
              Retain Them.
            </h1>

            <div className="relative z-[2] my-[14px] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(80,135,255,0.30)_18%,rgba(255,255,255,0.68)_50%,rgba(80,135,255,0.24)_82%,transparent_100%)]" />

            <p className="relative z-[2] mb-6 font-body text-[14px] leading-[1.70] text-[rgba(0,0,0,0.52)]">
              We help healthcare businesses acquire new patients, convert inquiries into appointments, and retain them for long-term growth.
            </p>

            <a
              href="#services"
              className="relative z-[2] inline-flex self-start rounded-[100px] bg-[#0c1a2e] px-[26px] py-3 button-text text-white no-underline transition-[background,transform] duration-200 hover:bg-[#1b3860]"
            >
              Book an Appointment
            </a>
          </motion.div>
        </motion.div>

        {/* Card 2 — Right */}
        <motion.div
          style={{ opacity: rightPanelOpacity, y: rightPanelY }}
          className="absolute left-6 top-24 z-30 w-[380px] md:left-12 md:w-[520px]"
        >
          <div className="relative overflow-hidden rounded-[26px] border-[1.5px] border-[rgba(255,255,255,0.88)] bg-[linear-gradient(160deg,rgba(255,255,255,0.80)_0%,rgba(210,228,255,0.58)_38%,rgba(190,215,255,0.42)_68%,rgba(255,255,255,0.72)_100%)] px-7 pb-[30px] pt-7 [backdrop-filter:blur(52px)_saturate(230%)_brightness(1.12)_hue-rotate(2deg)] [box-shadow:0_1px_0_rgba(255,255,255,1)_inset,1px_0_0_rgba(255,255,255,0.76)_inset,-1px_-1px_0_rgba(175,210,255,0.22)_inset,0_0_42px_rgba(138,190,255,0.18)_inset,0_34px_84px_rgba(55,105,220,0.22),0_12px_34px_rgba(55,105,220,0.16),0_4px_10px_rgba(0,0,0,0.07),0_0_0_1px_rgba(115,168,255,0.18)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[3] before:h-[2px] before:rounded-t-[26px] before:content-[''] before:bg-[linear-gradient(90deg,rgba(140,195,255,0)_0%,rgba(255,255,255,1)_32%,rgba(195,228,255,0.88)_62%,rgba(140,195,255,0.22)_100%)] after:pointer-events-none after:absolute after:-right-[72px] after:-top-[72px] after:z-[1] after:h-[240px] after:w-[240px] after:rounded-full after:bg-[radial-gradient(circle,rgba(95,158,255,0.20)_0%,rgba(115,175,255,0.07)_44%,transparent_68%)] after:content-['']">
            <div className="pointer-events-none absolute -bottom-[45px] -left-[45px] z-[1] h-[165px] w-[165px] rounded-full bg-[radial-gradient(circle,rgba(165,208,255,0.16)_0%,transparent_64%)]" />

            <h2 className="heading relative z-[2] mb-[10px]">
              Why Many Healthcare
              <br />
              Businesses Struggle
            </h2>

            <p className="relative z-[2] mb-[14px] font-body text-[14px] leading-[1.70] text-[rgba(0,0,0,0.52)]">
              What worked earlier does not work today. Today&apos;s patients are more informed, selective, and expect more.
            </p>

            <div className="relative z-[2] flex flex-col gap-[5px]">
              {[
                {
                  op: bullet1Opacity,
                  icon: "\u{1F50D}",
                  title: "Search First",
                  desc: "Patients research online before choosing any healthcare provider.",
                },
                {
                  op: bullet2Opacity,
                  icon: "\u{2696}\u{FE0F}",
                  title: "Compare Options",
                  desc: "They compare multiple clinics before making their final decision.",
                },
                {
                  op: bullet3Opacity,
                  icon: "\u{26A1}",
                  title: "Expect Quick Response",
                  desc: "Slow follow-ups lose patients to faster-responding competitors.",
                },
                {
                  op: bullet4Opacity,
                  icon: "\u{1F91D}",
                  title: "Decide on Trust",
                  desc: "Final decisions hinge on credibility and trustworthiness.",
                },
              ].map(({ op, icon, title, desc }) => (
                <motion.div
                  key={title}
                  style={{ opacity: op }}
                  className="flex items-start gap-[11px] rounded-[13px] border border-[rgba(255,255,255,0.74)] bg-[rgba(255,255,255,0.50)] px-[11px] py-2.5 [backdrop-filter:blur(12px)] [box-shadow:0_1px_0_rgba(255,255,255,0.92)_inset,0_2px_8px_rgba(75,115,200,0.07)]"
                >
                  <span className="mt-[3px] shrink-0 text-[17px] leading-none">{icon}</span>
                  <div>
                    <p className="mb-[2px] font-body text-[14px] font-semibold text-[#0a0a0a]">{title}</p>
                    <p className="m-0 font-body text-[12.5px] leading-[1.52] text-[rgba(0,0,0,0.50)]">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Card 3 — Our Approach */}
        <motion.div
          style={{ opacity: thirdPanelOpacity, y: thirdPanelY }}
          className="absolute left-6 top-[50%] z-30 w-[380px] -translate-y-1/2 md:left-12 md:w-[560px]"
        >
          <div className="relative overflow-hidden rounded-[26px] border-[1.5px] border-[rgba(255,255,255,0.88)] bg-[linear-gradient(160deg,rgba(255,255,255,0.80)_0%,rgba(210,228,255,0.58)_38%,rgba(190,215,255,0.42)_68%,rgba(255,255,255,0.72)_100%)] px-7 pb-[30px] pt-7 [backdrop-filter:blur(52px)_saturate(230%)_brightness(1.12)_hue-rotate(2deg)] [box-shadow:0_1px_0_rgba(255,255,255,1)_inset,1px_0_0_rgba(255,255,255,0.76)_inset,-1px_-1px_0_rgba(175,210,255,0.22)_inset,0_0_42px_rgba(138,190,255,0.18)_inset,0_34px_84px_rgba(55,105,220,0.22),0_12px_34px_rgba(55,105,220,0.16),0_4px_10px_rgba(0,0,0,0.07),0_0_0_1px_rgba(115,168,255,0.18)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[3] before:h-[2px] before:rounded-t-[26px] before:content-[''] before:bg-[linear-gradient(90deg,rgba(140,195,255,0)_0%,rgba(255,255,255,1)_32%,rgba(195,228,255,0.88)_62%,rgba(140,195,255,0.22)_100%)] after:pointer-events-none after:absolute after:-right-[72px] after:-top-[72px] after:z-[1] after:h-[240px] after:w-[240px] after:rounded-full after:bg-[radial-gradient(circle,rgba(95,158,255,0.20)_0%,rgba(115,175,255,0.07)_44%,transparent_68%)] after:content-['']">
            <div className="pointer-events-none absolute -bottom-[45px] -left-[45px] z-[1] h-[165px] w-[165px] rounded-full bg-[radial-gradient(circle,rgba(165,208,255,0.16)_0%,transparent_64%)]" />

            <h2 className="heading relative z-[2] mb-[6px]">
              Our Approach: Relevance,
              <br />
              Trust, Retention
            </h2>

            <p className="relative z-[2] mb-[14px] font-body text-[13px] leading-[1.65] text-[rgba(0,0,0,0.50)]">
              A three-pillar system built specifically for healthcare businesses that want more than just web traffic.
            </p>

            <div className="relative z-[2] flex flex-col gap-[8px]">
              {pillars.map(({ op, number, title, desc, bullets }) => (
                <motion.div
                  key={title}
                  style={{ opacity: op }}
                  className="overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.74)] bg-[rgba(255,255,255,0.50)] px-[13px] py-[11px] [backdrop-filter:blur(12px)] [box-shadow:0_1px_0_rgba(255,255,255,0.92)_inset,0_2px_8px_rgba(75,115,200,0.07)]"
                >
                  <div className="mb-[5px] flex items-center gap-[9px]">
                    <span className="font-display text-[13px] font-semibold tracking-[0.06em] text-[#2563eb]">
                      {number}
                    </span>
                    <p className="m-0 font-body text-[14px] font-semibold text-[#0a0a0a]">{title}</p>
                  </div>
                  <p className="mb-[7px] font-body text-[12px] leading-[1.55] text-[rgba(0,0,0,0.50)]">
                    {desc}
                  </p>
                  <ul className="m-0 flex flex-col gap-[3px] p-0">
                    {bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-[7px] font-body text-[11.5px] leading-[1.45] text-[rgba(0,0,0,0.48)]"
                      >
                        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#2563eb] opacity-60" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative z-30 h-full w-full">{children}</div>
      </div>
    </section>
  );
}



