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

  const relevanceOpacity = useTransform(progressMv, [0, 0.25], [1, 0]);
  const trustOpacity = useTransform(progressMv, [0.2, 0.25, 0.5, 0.55], [0, 1, 1, 0]);
  const retentionOpacity = useTransform(progressMv, [0.45, 0.5, 0.75, 0.8], [0, 1, 1, 0]);
  const growthOpacity = useTransform(progressMv, [0.7, 0.75, 1], [0, 1, 1]);

  const relevanceY = useTransform(progressMv, [0, 0.25], [0, -40]);
  const trustY = useTransform(progressMv, [0.2, 0.25, 0.5, 0.55], [40, 0, 0, -40]);
  const retentionY = useTransform(progressMv, [0.45, 0.5, 0.75, 0.8], [40, 0, 0, -40]);
  const growthY = useTransform(progressMv, [0.7, 0.75, 1], [40, 0, 0]);

  const drawFrameToCanvas = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const targetW = Math.max(1, Math.floor(viewportW));
    const targetH = Math.max(1, Math.floor(viewportH));

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    if (canvas.style.width !== `${viewportW}px`) {
      canvas.style.width = `${viewportW}px`;
    }
    if (canvas.style.height !== `${viewportH}px`) {
      canvas.style.height = `${viewportH}px`;
    }

    ctx.clearRect(0, 0, targetW, targetH);

    const safeFrameIndex = loadedRef.current[frameIndex]
      ? frameIndex
      : Math.max(0, Math.min(frameIndex, highestLoadedRef.current));
    const image = framesRef.current[safeFrameIndex];
    if (!image || !loadedRef.current[safeFrameIndex]) return;

    const canvasRatio = targetW / targetH;
    const imageRatio = image.naturalWidth / image.naturalHeight;

    let drawW = targetW;
    let drawH = targetH;
    let dx = 0;
    let dy = 0;

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
        if (!cancelled) {
          setLoadedCount(completeCount);
        }
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
          console.log("Total loaded:", images.length);
        }
      };

      image.onload = () => markDone(true);
      image.onerror = () => {
        markDone(false);
      };
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
      const scrollableDistance = Math.max(sectionHeight - viewportHeight, 1);

      const progress = clamp(-rect.top / scrollableDistance, 0, 1);
      progressRef.current = progress;
      progressMv.set(progress);

      let frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
      frameIndex = clamp(frameIndex, 0, TOTAL_FRAMES - 1);

      if (progress >= 0.999) {
        frameIndex = TOTAL_FRAMES - 1;
      }

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
      if (currentFrameRef.current < 0) {
        drawFrameToCanvas(0);
      } else {
        drawFrameToCanvas(currentFrameRef.current);
      }
      requestRender();
    };

    if (isReady) {
      if (currentFrameRef.current < 0) {
        currentFrameRef.current = 0;
      }
      drawFrameToCanvas(currentFrameRef.current);
      requestRender();
    }

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isReady]);

  return (
    <section ref={sectionRef} className={`relative w-full ${SECTION_HEIGHT_CLASS}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />

        {!isReady ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900 text-sm font-medium text-white/90">
            Loading frames {loadedCount}/{TOTAL_FRAMES}
          </div>
        ) : null}

        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <motion.div
            style={{ opacity: relevanceOpacity, y: relevanceY }}
            className="absolute mx-auto max-w-2xl space-y-4 px-6 text-white"
          >
            <h2 className="text-4xl font-semibold">Relevance</h2>
            <p className="text-lg leading-relaxed text-white/90">
              Patients are actively searching for your services We bring your practice in front
              of the right audience through targeted visibility and patient lead generation
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: trustOpacity, y: trustY }}
            className="absolute mx-auto max-w-2xl space-y-4 px-6 text-white"
          >
            <h2 className="text-4xl font-semibold">Trust</h2>
            <p className="text-lg leading-relaxed text-white/90">
              Patients discover your clinic They evaluate your credibility, presence, and
              communication We help you build trust and guide them towards booking an appointment
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: retentionOpacity, y: retentionY }}
            className="absolute mx-auto max-w-2xl space-y-4 px-6 text-white"
          >
            <h2 className="text-4xl font-semibold">Retention</h2>
            <p className="text-lg leading-relaxed text-white/90">
              Patient makes an enquiry Most businesses lose them due to poor follow-up We ensure
              timely follow-ups, better communication, and higher conversion into appointments
              Patients return and stay connected
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: growthOpacity, y: growthY }}
            className="absolute mx-auto max-w-2xl space-y-4 px-6 text-white"
          >
            <h2 className="text-4xl font-semibold">Growth</h2>
            <p className="text-lg leading-relaxed text-white/90">
              Consistent inquiries + Better conversion + Repeat patients Creates a predictable and
              sustainable patient flow for your business
            </p>
          </motion.div>
        </div>

        <div className="relative z-30 h-full w-full">{children}</div>
      </div>
    </section>
  );
}
