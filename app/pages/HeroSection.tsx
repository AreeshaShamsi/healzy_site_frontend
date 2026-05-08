"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const TOTAL_FRAMES = 301;
const SECTION_HEIGHT_CLASS = "h-[300vh]";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getFrameSrc(index: number) {
  return `/frames/output_${String(index).padStart(4, "0")}.png`;
}

type CinematicScrollProps = {
  children?: ReactNode;
};

export default function CinematicScroll({ children }: CinematicScrollProps) {
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

  // LEFT glassmorphism card — visible from frame 1 (progress 0), fades out at 0.28
  const leftPanelOpacity = useTransform(progressMv, [0, 0.0, 0.22, 0.28], [1, 1, 1, 0]);
  const leftPanelY = useTransform(progressMv, [0, 0.0, 0.22, 0.28], [0, 0, 0, -28]);

  // RIGHT panel: visible during Trust phase
  const rightPanelOpacity = useTransform(progressMv, [0.22, 0.28, 0.48, 0.54], [0, 1, 1, 0]);
  const rightPanelY = useTransform(progressMv, [0.22, 0.28, 0.48, 0.54], [28, 0, 0, -28]);

  // Staggered bullet points
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
      canvas.width = targetW;
      canvas.height = targetH;
    }
    if (canvas.style.width !== `${viewportW}px`) canvas.style.width = `${viewportW}px`;
    if (canvas.style.height !== `${viewportH}px`) canvas.style.height = `${viewportH}px`;

    ctx.clearRect(0, 0, targetW, targetH);

    const safeFrameIndex = loadedRef.current[frameIndex]
      ? frameIndex
      : Math.max(0, Math.min(frameIndex, highestLoadedRef.current));
    const image = framesRef.current[safeFrameIndex];
    if (!image || !loadedRef.current[safeFrameIndex]) return;

    const canvasRatio = targetW / targetH;
    const imageRatio = image.naturalWidth / image.naturalHeight;

    let drawW = targetW, drawH = targetH, dx = 0, dy = 0;
    if (imageRatio > canvasRatio) {
      drawH = targetH;
      drawW = drawH * imageRatio;
      dx = (targetW - drawW) / 2;
    } else {
      drawW = targetW;
      drawH = drawW / imageRatio;
      dy = (targetH - drawH) / 2;
    }
    ctx.drawImage(image, dx, dy, drawW, drawH);
  };

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let completeCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i += 1) {
      const frameNumber = i + 1;
      const image = new window.Image();
      image.decoding = "async";
      image.src = getFrameSrc(frameNumber);

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

    return () => { cancelled = true; };
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
      const scrollableDistance = Math.max(sectionHeight - viewportHeight, 1);

      const progress = clamp(-rect.top / scrollableDistance, 0, 1);
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }

        /* ── Glassmorphism card ── */
        .glass-card {
          background:
            linear-gradient(
              160deg,
              rgba(255,255,255,0.82) 0%,
              rgba(214,232,255,0.60) 35%,
              rgba(195,220,255,0.45) 65%,
              rgba(255,255,255,0.75) 100%
            );
          backdrop-filter: blur(48px) saturate(220%) brightness(1.12) hue-rotate(2deg);
          -webkit-backdrop-filter: blur(48px) saturate(220%) brightness(1.12) hue-rotate(2deg);
          border-radius: 28px;
          border: 1.5px solid transparent;
          background-clip: padding-box;
          outline: 1.5px solid rgba(255,255,255,0.90);
          outline-offset: -1.5px;
          box-shadow:
            /* top edge shimmer */
            0 1px 0 rgba(255,255,255,1) inset,
            /* left edge shimmer */
            1px 0 0 rgba(255,255,255,0.75) inset,
            /* bottom right inner shadow */
            -1px -1px 0 rgba(180,210,255,0.25) inset,
            /* deep ambient glow */
            0 32px 80px rgba(60,110,220,0.22),
            0 12px 32px rgba(60,110,220,0.16),
            0 4px 10px rgba(0,0,0,0.07),
            /* outer rim light */
            0 0 0 1px rgba(120,170,255,0.18);
          padding: 42px 48px 46px;
          position: relative;
          overflow: hidden;
        }

        /* Iridescent top highlight bar */
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(150,200,255,0) 0%,
            rgba(255,255,255,1) 30%,
            rgba(200,230,255,0.9) 60%,
            rgba(150,200,255,0.3) 100%
          );
          border-radius: 28px 28px 0 0;
        }

        /* Big radial orb — top-right corner */
        .glass-card::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(100,160,255,0.18) 0%,
            rgba(120,180,255,0.08) 40%,
            transparent 70%
          );
          pointer-events: none;
        }

        /* Bottom-left orb for depth */
        .glass-card .glass-orb-bl {
          position: absolute;
          bottom: -60px; left: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(180,210,255,0.15) 0%,
            transparent 65%
          );
          pointer-events: none;
        }

        /* Frosted inner divider line */
        .glass-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(100,150,255,0.25) 20%,
            rgba(255,255,255,0.60) 50%,
            rgba(100,150,255,0.20) 80%,
            transparent 100%
          );
          margin: 20px 0 22px;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Outfit', sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2a5baa;
          background: rgba(100, 150, 255, 0.12);
          border: 1px solid rgba(100,150,255,0.30);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.8) inset,
            0 2px 8px rgba(80,120,220,0.10);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 5px 16px;
          margin-bottom: 22px;
        }

        .tag-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4a6fa5;
          flex-shrink: 0;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: clamp(42px, 5vw, 64px);
          line-height: 1.09;
          letter-spacing: -0.02em;
          color: #0d1b2e;
          margin-bottom: 0;
        }

        .hero-title .italic-accent {
          font-style: italic;
          color: #2563eb;
          font-weight: 700;
        }

        .title-underline {
          width: 100%;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0) 100%);
          border-radius: 2px;
          margin-top: 12px;
          margin-bottom: 20px;
        }

        .hero-body {
          font-family: 'Outfit', sans-serif;
          font-size: 15.5px;
          line-height: 1.75;
          color: rgba(10, 20, 40, 0.58);
          font-weight: 400;
          margin-bottom: 28px;
        }

        /* ── CTA Buttons ── */
        .cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: #0d1b2e;
          border: none;
          border-radius: 100px;
          padding: 12px 24px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .btn-primary:hover { background: #1e3a5f; transform: translateY(-1px); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #0d1b2e;
          background: transparent;
          border: none;
          padding: 12px 4px;
          cursor: pointer;
          text-decoration: none;
          opacity: 0.72;
          transition: opacity 0.2s;
        }
        .btn-ghost:hover { opacity: 1; }

        .play-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(10,20,40,0.3);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── RIGHT panel (struggle) ── */
        .glass-card-right {
          background:
            linear-gradient(
              160deg,
              rgba(255,255,255,0.80) 0%,
              rgba(210,228,255,0.58) 40%,
              rgba(190,215,255,0.42) 70%,
              rgba(255,255,255,0.72) 100%
            );
          backdrop-filter: blur(48px) saturate(220%) brightness(1.10) hue-rotate(2deg);
          -webkit-backdrop-filter: blur(48px) saturate(220%) brightness(1.10) hue-rotate(2deg);
          border-radius: 28px;
          background-clip: padding-box;
          outline: 1.5px solid rgba(255,255,255,0.88);
          outline-offset: -1.5px;
          box-shadow:
            0 1px 0 rgba(255,255,255,1) inset,
            1px 0 0 rgba(255,255,255,0.75) inset,
            -1px -1px 0 rgba(180,210,255,0.20) inset,
            0 32px 80px rgba(60,110,220,0.20),
            0 12px 32px rgba(60,110,220,0.14),
            0 4px 10px rgba(0,0,0,0.06),
            0 0 0 1px rgba(120,170,255,0.15);
          padding: 34px 38px 38px;
          position: relative;
          overflow: hidden;
        }

        .glass-card-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(150,200,255,0) 0%,
            rgba(255,255,255,1) 30%,
            rgba(200,230,255,0.9) 60%,
            rgba(150,200,255,0.3) 100%
          );
          border-radius: 28px 28px 0 0;
        }

        .glass-card-right::after {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(100,160,255,0.14) 0%,
            transparent 65%
          );
          pointer-events: none;
        }

        .hero-tagline {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #2563eb;
          text-decoration: underline;
          text-decoration-color: rgba(37,99,235,0.5);
          text-underline-offset: 3px;
          margin-top: 10px;
          margin-bottom: 0;
          display: block;
        }

        .btn-book {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%);
          border: none;
          border-radius: 14px;
          padding: 15px 28px;
          cursor: pointer;
          letter-spacing: 0.01em;
          text-decoration: none;
          margin-top: 20px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.25) inset,
            0 8px 24px rgba(37,99,235,0.35),
            0 2px 8px rgba(37,99,235,0.25);
          transition: transform 0.15s, box-shadow 0.15s;
          position: relative;
          overflow: hidden;
        }
        .btn-book::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        }
        .btn-book:hover {
          transform: translateY(-2px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.25) inset,
            0 12px 32px rgba(37,99,235,0.42),
            0 4px 12px rgba(37,99,235,0.30);
        }
        .btn-book svg {
          flex-shrink: 0;
        }
          font-family: 'Outfit', sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.38);
          margin-bottom: 14px;
          display: block;
        }

        .right-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 3.2vw, 40px);
          font-weight: 700;
          line-height: 1.12;
          color: #080808;
          letter-spacing: -0.015em;
          margin-bottom: 10px;
        }

        .right-body {
          font-family: 'Outfit', sans-serif;
          font-size: 14.5px;
          line-height: 1.72;
          color: rgba(0,0,0,0.52);
          margin-bottom: 18px;
        }

        .bullet-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 13px 14px;
          margin-bottom: 6px;
          border-radius: 14px;
          background: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.70);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 2px 8px rgba(80,120,200,0.06);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .bullet-row:last-child { margin-bottom: 0; }

        .bullet-icon {
          font-size: 20px;
          line-height: 1;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .bullet-title {
          font-family: 'Outfit', sans-serif;
          font-size: 15.5px;
          font-weight: 600;
          color: #0a0a0a;
          margin-bottom: 2px;
        }

        .bullet-desc {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          line-height: 1.55;
          color: rgba(0,0,0,0.50);
        }
      `}</style>

      <section id="hero-cinematic" ref={sectionRef} className={`relative w-full ${SECTION_HEIGHT_CLASS}`}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />

          {!isReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
              Loading… {loadedCount}/{TOTAL_FRAMES}
            </div>
          )}

          {/* ── LEFT glass card — always visible from frame 1 ── */}
          <motion.div
            style={{ opacity: leftPanelOpacity, y: leftPanelY }}
            className="absolute left-6 top-1/2 z-30 w-[380px] -translate-y-1/2 md:left-12 md:w-[500px]"
          >
            <div className="glass-card">
              <div className="glass-orb-bl" />

              {/* Headline */}
              <h1 className="hero-title">
                Acquire<br />
                <span className="italic-accent">Patients.</span><br />
                Build Trust.<br />
                Retain Them.
              </h1>

              {/* Blue bold tagline underlined */}
              <p className="hero-tagline">Your Growth Partner in Healthcare Marketing</p>

              {/* Glass divider */}
              <div className="glass-divider" />

              {/* Body copy */}
              <p className="hero-body">
                We help healthcare businesses acquire new patients, convert inquiries
                into appointments, and retain them for long&#8209;term growth.
              </p>

              {/* Secondary CTA row */}
              <div className="cta-group">
                <a href="#services" className="btn-primary">
                  Explore Our Services
                </a>
                <a href="#process" className="btn-ghost">
                  <span className="play-icon">
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 1.5L7.5 5L1.5 8.5V1.5Z" fill="#0d1b2e" />
                    </svg>
                  </span>
                  Watch our process
                </a>
              </div>

              {/* Book a consultation CTA */}
              <a href="#consultation" className="btn-book">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M3 9h18" stroke="white" strokeWidth="1.8"/>
                  <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M8 13h4m-4 4h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Book a Consultation
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT glass card: Why Businesses Struggle ── */}
          <motion.div
            style={{ opacity: rightPanelOpacity, y: rightPanelY }}
            className="absolute bottom-8 right-6 z-30 w-[340px] md:right-12 md:w-[440px]"
          >
            <div className="glass-card-right">
              <span className="tag-label-right">The Reality</span>

              <h2 className="right-title">
                Why Many Healthcare<br />Businesses Struggle
              </h2>

              <p className="right-body">
                What worked earlier does not work today. Today's patients are more
                informed, more selective, and expect more.
              </p>

              <div>
                <motion.div style={{ opacity: bullet1Opacity }} className="bullet-row">
                  <span className="bullet-icon">🔍</span>
                  <div>
                    <p className="bullet-title">Search First</p>
                    <p className="bullet-desc">Patients research extensively online before choosing any healthcare provider.</p>
                  </div>
                </motion.div>

                <motion.div style={{ opacity: bullet2Opacity }} className="bullet-row">
                  <span className="bullet-icon">⚖️</span>
                  <div>
                    <p className="bullet-title">Compare Options</p>
                    <p className="bullet-desc">They compare multiple clinics and hospitals before making their final decision.</p>
                  </div>
                </motion.div>

                <motion.div style={{ opacity: bullet3Opacity }} className="bullet-row">
                  <span className="bullet-icon">⚡</span>
                  <div>
                    <p className="bullet-title">Expect Quick Response</p>
                    <p className="bullet-desc">Slow follow-ups lose patients to competitors who respond faster.</p>
                  </div>
                </motion.div>

                <motion.div style={{ opacity: bullet4Opacity }} className="bullet-row">
                  <span className="bullet-icon">🤝</span>
                  <div>
                    <p className="bullet-title">Decide on Trust</p>
                    <p className="bullet-desc">Final decisions are made on credibility and perceived trustworthiness.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="relative z-30 h-full w-full">{children}</div>
        </div>
      </section>
    </>
  );
}