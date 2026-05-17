"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FiSearch, FiZap } from "react-icons/fi";
import { HiOutlineScale } from "react-icons/hi";
import { RiShakeHandsLine } from "react-icons/ri";
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

  const BULLETS = [
    {
      op: bullet1Opacity,
      icon: <FiSearch className="mt-[2px] h-[16px] w-[16px] shrink-0 text-[#2563eb] md:mt-[3px] md:h-[18px] md:w-[18px]" />,
      title: "Search First",
      desc: "Patients research online before choosing any healthcare provider.",
    },
    {
      op: bullet2Opacity,
      icon: <HiOutlineScale className="mt-[2px] h-[16px] w-[16px] shrink-0 text-[#2563eb] md:mt-[3px] md:h-[18px] md:w-[18px]" />,
      title: "Compare Options",
      desc: "They compare multiple clinics before making their final decision.",
    },
    {
      op: bullet3Opacity,
      icon: <FiZap className="mt-[2px] h-[16px] w-[16px] shrink-0 text-[#2563eb] md:mt-[3px] md:h-[18px] md:w-[18px]" />,
      title: "Expect Quick Response",
      desc: "Slow follow-ups lose patients to faster-responding competitors.",
    },
    {
      op: bullet4Opacity,
      icon: (
        <RiShakeHandsLine className="mt-[2px] h-[16px] w-[16px] shrink-0 text-[#2563eb] md:mt-[3px] md:h-[18px] md:w-[18px]" />
      ),
      title: "Decide on Trust",
      desc: "Final decisions hinge on credibility and trustworthiness.",
    },
  ];

  const pillars = [
    {
      op: pillar1Opacity,
      number: "01",
      title: "Relevance",
      desc: "",
      bullets: [
        "Search visibility for targeted conditions",
        "Local SEO for clinics & hospitals",
        
      ],
    },
    {
      op: pillar2Opacity,
      number: "02",
      title: "Trust",
      desc: "",
      bullets: [
        "Online reputation management",
        "Doctor profile optimisation",
       
      ],
    },
    {
      op: pillar3Opacity,
      number: "03",
      title: "Retention",
      desc: "",
      bullets: [
        "Automated follow-up systems",
        "Appointment conversion optimisation",
        
      ],
    },
  ];

  return (
    <section id="hero-cinematic" ref={sectionRef} className={`relative w-full ${SECTION_HEIGHT_CLASS}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-y-0 right-0 z-0 h-full w-full md:w-[58%]" />

        {!isReady && (
          <div className="font-body absolute inset-0 z-10 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
            Loading... {loadedCount}/{TOTAL_FRAMES}
          </div>
        )}

        {/* Card 1 — Left */}
        <motion.div
          style={{ opacity: leftPanelOpacity }}
          className="absolute left-4 right-4 top-20 z-30 w-auto max-w-[520px] sm:top-24 md:left-12 md:right-auto md:top-[53%] md:w-[38%] md:max-w-[520px] md:-translate-y-1/2 lg:max-w-[520px]"
        >
          <motion.div
            style={{ y: leftPanelY }}
            className="relative flex w-full max-w-[520px] flex-col items-start justify-start space-y-3 px-1 py-1 sm:space-y-4 md:min-h-[420px] md:space-y-5 md:overflow-hidden md:rounded-[26px] md:border-[1.5px] md:border-[rgba(255,255,255,0.90)] md:bg-[linear-gradient(160deg,rgba(255,255,255,0.82)_0%,rgba(200,225,255,0.56)_28%,rgba(175,210,255,0.40)_62%,rgba(240,248,255,0.74)_100%)] md:px-6 md:py-10 md:[backdrop-filter:blur(64px)_saturate(260%)_brightness(1.18)_hue-rotate(3deg)] md:[box-shadow:0_1px_0_rgba(255,255,255,1)_inset,1px_0_0_rgba(255,255,255,0.84)_inset,-1px_-1px_0_rgba(145,195,255,0.34)_inset,0_0_52px_rgba(135,195,255,0.24)_inset,0_40px_100px_rgba(38,88,220,0.30),0_16px_40px_rgba(38,88,220,0.22),0_5px_14px_rgba(0,0,0,0.10),0_0_0_1px_rgba(85,150,255,0.26)] md:before:pointer-events-none md:before:absolute md:before:inset-x-0 md:before:top-0 md:before:z-[3] md:before:h-[2px] md:before:rounded-t-[26px] md:before:content-[''] md:before:bg-[linear-gradient(90deg,rgba(140,195,255,0)_0%,rgba(255,255,255,1)_32%,rgba(195,228,255,0.88)_62%,rgba(140,195,255,0.22)_100%)] md:after:pointer-events-none md:after:absolute md:after:-right-[72px] md:after:-top-[72px] md:after:z-[1] md:after:h-[240px] md:after:w-[240px] md:after:rounded-full md:after:bg-[radial-gradient(circle,rgba(95,158,255,0.20)_0%,rgba(115,175,255,0.07)_44%,transparent_68%)] md:after:content-['']"
          >
            <div className="pointer-events-none absolute -bottom-[55px] -left-[55px] z-[1] hidden h-[195px] w-[195px] rounded-full bg-[radial-gradient(circle,rgba(165,208,255,0.20)_0%,transparent_64%)] md:block" />

    <h1 className="heading relative z-[2] mt-3 mb-2 max-w-[270px] leading-[1] sm:mt-4 sm:max-w-[300px] md:-mt-0 md:mb-4 md:max-w-none md:leading-[1] lg:text-[0.92em]">
      Acquire
      <em className="ml-2">Patients.</em>
      <br />
      Build Trust.
      <br />
      <span className="whitespace-nowrap">Retain Them.</span>
    </h1>

            <div className="relative z-[2] my-[10px] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(80,135,255,0.30)_18%,rgba(255,255,255,0.68)_50%,rgba(80,135,255,0.24)_82%,transparent_100%)] md:my-[14px]" />

            <div className="relative z-[2] top-4 translate-y-16 space-y-4 sm:top-6 sm:translate-y-24 md:top-0 md:translate-y-0 md:space-y-0">
      <p className="cinematic-body mb-4 max-w-[36ch] font-medium text-[rgba(0,0,0,0.64)] md:mb-6 md:font-normal md:text-[rgba(0,0,0,0.52)]">
        We help healthcare businesses acquire new patients, convert inquiries into appointments, and retain them for long-term growth.
      </p>

              <a
                href="#services"
                className="button-text mt-2 inline-flex self-start rounded-[100px] bg-[#0c1a2e] px-[26px] py-3 text-white no-underline transition-[background,transform] duration-200 hover:bg-[#1b3860] md:mt-0"
              >
                Book an Appointment
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Card 2 — Right */}
        <motion.div
          style={{ opacity: rightPanelOpacity, y: rightPanelY }}
          className="absolute left-6 top-24 z-30 w-[380px] md:left-12 md:w-[520px]"
        >
      <div className="relative px-3 pb-1 pt-2 sm:px-4 sm:pt-3 md:overflow-hidden md:rounded-[26px] md:border-[1.5px] md:border-[rgba(255,255,255,0.88)] md:bg-[linear-gradient(160deg,rgba(255,255,255,0.80)_0%,rgba(210,228,255,0.58)_38%,rgba(190,215,255,0.42)_68%,rgba(255,255,255,0.72)_100%)] md:px-7 md:pb-[30px] md:pt-7 md:[backdrop-filter:blur(52px)_saturate(230%)_brightness(1.12)_hue-rotate(2deg)] md:[box-shadow:0_1px_0_rgba(255,255,255,1)_inset,1px_0_0_rgba(255,255,255,0.76)_inset,-1px_-1px_0_rgba(175,210,255,0.22)_inset,0_0_42px_rgba(138,190,255,0.18)_inset,0_34px_84px_rgba(55,105,220,0.22),0_12px_34px_rgba(55,105,220,0.16),0_4px_10px_rgba(0,0,0,0.07),0_0_0_1px_rgba(115,168,255,0.18)] md:before:pointer-events-none md:before:absolute md:before:inset-x-0 md:before:top-0 md:before:z-[3] md:before:h-[2px] md:before:rounded-t-[26px] md:before:content-[''] md:before:bg-[linear-gradient(90deg,rgba(140,195,255,0)_0%,rgba(255,255,255,1)_32%,rgba(195,228,255,0.88)_62%,rgba(140,195,255,0.22)_100%)] md:after:pointer-events-none md:after:absolute md:after:-right-[72px] md:after:-top-[72px] md:after:z-[1] md:after:h-[240px] md:after:w-[240px] md:after:rounded-full md:after:bg-[radial-gradient(circle,rgba(95,158,255,0.20)_0%,rgba(115,175,255,0.07)_44%,transparent_68%)] md:after:content-['']">
        <div className="pointer-events-none absolute -bottom-[45px] -left-[45px] z-[1] hidden h-[165px] w-[165px] rounded-full bg-[radial-gradient(circle,rgba(165,208,255,0.16)_0%,transparent_64%)] md:block" />

            <h2 className="heading relative z-[2] mb-[10px]">
              Why Many Healthcare
              <br />
              Businesses Struggle
            </h2>

            <p className="cinematic-body relative z-[2] mb-[14px] text-[rgba(0,0,0,0.58)] sm:max-w-[34ch] md:max-w-none md:text-[rgba(0,0,0,0.52)]">
              What worked earlier does not work today. Today&apos;s patients are more informed, selective, and expect more.
            </p>

            <div className="relative z-[2] flex flex-col items-start gap-1.5 md:gap-[5px]">
              {BULLETS.map(({ op, icon, title }) => (
                <motion.div
                  key={title}
                  style={{ opacity: op }}
                  className="w-full max-w-[236px] h-[40px] min-h-[40px] flex items-center gap-1.5 rounded-[9px] border border-[rgba(255,255,255,0.58)] bg-[rgba(255,255,255,0.32)] px-3 py-2 [backdrop-filter:blur(4px)] [box-shadow:0_1px_4px_rgba(75,115,200,0.05)] md:max-w-none md:h-auto md:min-h-0 md:items-start md:gap-[11px] md:rounded-[13px] md:border-[rgba(255,255,255,0.74)] md:bg-[rgba(255,255,255,0.50)] md:px-[11px] md:py-2.5 md:[backdrop-filter:blur(12px)] md:[box-shadow:0_1px_0_rgba(255,255,255,0.92)_inset,0_2px_8px_rgba(75,115,200,0.07)]"
                >
                  {icon}
                  <div>
                    <p className="card-title mb-0 whitespace-nowrap text-[13px] leading-tight text-[#0a0a0a] md:mb-[2px] md:text-[14px]">{title}</p>
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
          <div className="relative px-7 pb-[30px] pt-7">

            <h2 className="heading relative z-[2] mb-[6px]">
              Our Approach
            </h2>

            <p className="cinematic-body relative z-[2] mb-[14px] text-[13px] leading-[1.65] text-[rgba(0,0,0,0.50)]">
              A three-pillar system built specifically for healthcare businesses that want more than just web traffic.
            </p>

            <div className="relative z-[2] flex flex-col gap-[8px]">
              {pillars.map(({ op, number, title,  bullets }) => (
                <motion.div
                  key={title}
                  style={{ opacity: op }}
                  className="overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.74)] bg-[rgba(255,255,255,0.50)] px-[13px] py-[11px] [backdrop-filter:blur(12px)] [box-shadow:0_1px_0_rgba(255,255,255,0.92)_inset,0_2px_8px_rgba(75,115,200,0.07)]"
                >
                  <div className="mb-[5px] flex items-center gap-[9px]">
                    <span className="ui-label text-[13px] text-[#2563eb]">
                      {number}
                    </span>
                    <p className="card-title m-0 text-[15px] text-[#0a0a0a] md:text-[16px]">{title}</p>
                  </div>
                  
                  <ul className="m-0 flex flex-col gap-[3px] list-none p-0">
                    {bullets.map((b) => (
                      <li
                        key={b}
                        className="font-body flex items-center gap-[7px] text-[11.5px] leading-[1.45] text-[rgba(0,0,0,0.48)]"
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
