"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { ReactNode } from "react";

const TOTAL_FRAMES = 301;
const SECTION_HEIGHT_CLASS = "h-[300vh]";

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
  const progressRef = useRef<number>(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const progressMv = useMotionValue(0);

  const leftPanelOpacity = useTransform(progressMv, [0, 0.0, 0.22, 0.28], [1, 1, 1, 0]);
  const leftPanelY     = useTransform(progressMv, [0, 0.0, 0.22, 0.28], [0, 0, 0, -28]);

  const rightPanelOpacity = useTransform(progressMv, [0.22, 0.28, 0.48, 0.54], [0, 1, 1, 0]);
  const rightPanelY       = useTransform(progressMv, [0.22, 0.28, 0.48, 0.54], [28, 0, 0, -28]);

  const bullet1Opacity = useTransform(progressMv, [0.28, 0.33], [0, 1]);
  const bullet2Opacity = useTransform(progressMv, [0.33, 0.38], [0, 1]);
  const bullet3Opacity = useTransform(progressMv, [0.38, 0.43], [0, 1]);
  const bullet4Opacity = useTransform(progressMv, [0.43, 0.48], [0, 1]);

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
      canvas.width  = targetW;
      canvas.height = targetH;
    }
    if (canvas.style.width  !== `${viewportW}px`) canvas.style.width  = `${viewportW}px`;
    if (canvas.style.height !== `${viewportH}px`) canvas.style.height = `${viewportH}px`;

    ctx.clearRect(0, 0, targetW, targetH);

    const safe = loadedRef.current[frameIndex]
      ? frameIndex
      : Math.max(0, Math.min(frameIndex, highestLoadedRef.current));
    const image = framesRef.current[safe];
    if (!image || !loadedRef.current[safe]) return;

    const cr = targetW / targetH;
    const ir = image.naturalWidth / image.naturalHeight;
    let drawW = targetW, drawH = targetH, dx = 0, dy = 0;
    if (ir > cr) { drawH = targetH; drawW = drawH * ir; dx = (targetW - drawW) / 2; }
    else         { drawW = targetW; drawH = drawW / ir; dy = (targetH - drawH) / 2; }
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

      image.onload  = () => markDone(true);
      image.onerror = () => markDone(false);
      images[i] = image;
      framesRef.current[i] = image;
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const renderByScroll = () => {
      rafRef.current = 0;
      if (!readyRef.current) return;
      const section = sectionRef.current;
      if (!section) return;

      const rect             = section.getBoundingClientRect();
      const sectionHeight    = section.offsetHeight;
      const viewportHeight   = window.innerHeight;
      const scrollable       = Math.max(sectionHeight - viewportHeight, 1);
      const progress         = clamp(-rect.top / scrollable, 0, 1);

      progressRef.current = progress;
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
  }, [isReady]);

  const leftGlass = {
    background: [
      "linear-gradient(160deg,",
      "rgba(255,255,255,0.82) 0%,",
      "rgba(200,225,255,0.56) 28%,",
      "rgba(175,210,255,0.40) 62%,",
      "rgba(240,248,255,0.74) 100%)",
    ].join(" "),
    backdropFilter:         "blur(64px) saturate(260%) brightness(1.18) hue-rotate(3deg)",
    WebkitBackdropFilter:   "blur(64px) saturate(260%) brightness(1.18) hue-rotate(3deg)",
    borderRadius:           "26px",
    border:                 "1.5px solid rgba(255,255,255,0.90)",
    boxShadow: [
      "0 1px 0 rgba(255,255,255,1) inset",
      "1px 0 0 rgba(255,255,255,0.84) inset",
      "-1px -1px 0 rgba(145,195,255,0.34) inset",
      "0 0 52px rgba(135,195,255,0.24) inset",
      "0 40px 100px rgba(38,88,220,0.30)",
      "0 16px 40px rgba(38,88,220,0.22)",
      "0 5px 14px rgba(0,0,0,0.10)",
      "0 0 0 1px rgba(85,150,255,0.26)",
    ].join(", "),
  };

  const rightGlass = {
    background: [
      "linear-gradient(160deg,",
      "rgba(255,255,255,0.80) 0%,",
      "rgba(210,228,255,0.58) 38%,",
      "rgba(190,215,255,0.42) 68%,",
      "rgba(255,255,255,0.72) 100%)",
    ].join(" "),
    backdropFilter:         "blur(52px) saturate(230%) brightness(1.12) hue-rotate(2deg)",
    WebkitBackdropFilter:   "blur(52px) saturate(230%) brightness(1.12) hue-rotate(2deg)",
    borderRadius:           "26px",
    border:                 "1.5px solid rgba(255,255,255,0.88)",
    boxShadow: [
      "0 1px 0 rgba(255,255,255,1) inset",
      "1px 0 0 rgba(255,255,255,0.76) inset",
      "-1px -1px 0 rgba(175,210,255,0.22) inset",
      "0 0 42px rgba(138,190,255,0.18) inset",
      "0 34px 84px rgba(55,105,220,0.22)",
      "0 12px 34px rgba(55,105,220,0.16)",
      "0 4px 10px rgba(0,0,0,0.07)",
      "0 0 0 1px rgba(115,168,255,0.18)",
    ].join(", "),
  };

  // Shared paragraph style used in both cards
  const sharedParaStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "14px",
    lineHeight: 1.70,
    color: "rgba(0,0,0,0.52)",
    position: "relative",
    zIndex: 2,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        .gs::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(90deg,
            rgba(140,195,255,0) 0%,
            rgba(255,255,255,1) 32%,
            rgba(195,228,255,0.88) 62%,
            rgba(140,195,255,0.22) 100%);
          border-radius: 26px 26px 0 0;
          pointer-events: none;
          z-index: 3;
        }
        .gs::after {
          content: '';
          position: absolute;
          top: -72px; right: -72px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(95,158,255,0.20) 0%,
            rgba(115,175,255,0.07) 44%,
            transparent 68%);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <section
        id="hero-cinematic"
        ref={sectionRef}
        className={`relative w-full ${SECTION_HEIGHT_CLASS}`}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-y-0 right-0 z-0 h-full w-full md:w-[58%]" />

          {!isReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
              Loading… {loadedCount}/{TOTAL_FRAMES}
            </div>
          )}

          {/* ══════════════ LEFT CARD ══════════════ */}
          <motion.div
            style={{
              opacity: leftPanelOpacity,
              position: "absolute",
              left: "3rem",
              top: "53%",
              transform: "translateY(-50%)",
            }}
            className="z-30 w-full max-w-[520px] md:w-[38%] md:max-w-[520px] lg:max-w-[520px]"
          >
            <div
              className="gs relative flex w-full max-w-[520px] min-h-[420px] flex-col space-y-5 overflow-hidden px-6 py-10 md:max-w-[520px] lg:max-w-[520px]"
              style={leftGlass}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "-55px", left: "-55px",
                  width: "195px", height: "195px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(165,208,255,0.20) 0%, transparent 64%)",
                  zIndex: 1,
                }}
              />

              <h1
                className="cinematic-heading-main"
                style={{ margin: "16px 0 16px", position: "relative", zIndex: 2 }}
              >
                Acquire
                <span style={{ marginLeft: "8px", fontStyle: "italic", color: "#2563eb" }}>Patients.</span><br />
                Build Trust.<br />
                Retain Them.
              </h1>

              <div
                style={{
                  height: "1px",
                  margin: "14px 0 14px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(80,135,255,0.30) 18%, rgba(255,255,255,0.68) 50%, rgba(80,135,255,0.24) 82%, transparent 100%)",
                  position: "relative",
                  zIndex: 2,
                }}
              />

              <p style={{ ...sharedParaStyle, margin: "0 0 24px" }}>
                We help healthcare businesses acquire new patients, convert
                inquiries into appointments, and retain them for long‑term growth.
              </p>

              <a
                href="#services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  background: "#0c1a2e",
                  borderRadius: "100px",
                  padding: "12px 26px",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  alignSelf: "flex-start",
                  position: "relative",
                  zIndex: 2,
                  transition: "background 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#1b3860"}
                onMouseLeave={e => e.currentTarget.style.background = "#0c1a2e"}
              >
                Book an Appointment
              </a>
            </div>
          </motion.div>

          {/* ══════════════ RIGHT CARD (moved to left, wider, closer to navbar) ══════════════ */}
          <motion.div
            style={{ opacity: rightPanelOpacity, y: rightPanelY }}
            className="absolute top-24 left-6 md:left-12 z-30 w-[340px] md:w-[460px]"
          >
            <div
              className="gs relative overflow-hidden"
              style={{ ...rightGlass, padding: "28px 28px 30px" }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "-45px", left: "-45px",
                  width: "165px", height: "165px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(165,208,255,0.16) 0%, transparent 64%)",
                  zIndex: 1,
                }}
              />

              <h2
                className="cinematic-heading-secondary"
                style={{ marginBottom: "10px", position: "relative", zIndex: 2 }}
              >
                Why Many Healthcare<br />Businesses Struggle
              </h2>

              <p style={{ ...sharedParaStyle, marginBottom: "14px" }}>
                What worked earlier does not work today. Today's patients are
                more informed, selective, and expect more.
              </p>

              <div className="flex flex-col gap-[5px]" style={{ position: "relative", zIndex: 2 }}>
                {[
                  { op: bullet1Opacity, icon: "🔍", title: "Search First",          desc: "Patients research online before choosing any healthcare provider." },
                  { op: bullet2Opacity, icon: "⚖️", title: "Compare Options",       desc: "They compare multiple clinics before making their final decision." },
                  { op: bullet3Opacity, icon: "⚡", title: "Expect Quick Response", desc: "Slow follow-ups lose patients to faster-responding competitors." },
                  { op: bullet4Opacity, icon: "🤝", title: "Decide on Trust",       desc: "Final decisions hinge on credibility and trustworthiness." },
                ].map(({ op, icon, title, desc }) => (
                  <motion.div
                    key={title}
                    style={{
                      opacity: op,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "11px",
                      padding: "10px 11px",
                      borderRadius: "13px",
                      background: "rgba(255,255,255,0.50)",
                      border: "1px solid rgba(255,255,255,0.74)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.92) inset, 0 2px 8px rgba(75,115,200,0.07)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    <span style={{ fontSize: "17px", lineHeight: 1, marginTop: "3px", flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 600, color: "#0a0a0a", margin: "0 0 2px" }}>{title}</p>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12.5px", lineHeight: 1.52, color: "rgba(0,0,0,0.50)", margin: 0 }}>{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="relative z-30 h-full w-full">{children}</div>
        </div>
      </section>
    </>
  );
}
