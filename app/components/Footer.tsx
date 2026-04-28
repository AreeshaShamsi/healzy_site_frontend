"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function FooterSection() {
  const watermarkRef = useRef<HTMLDivElement>(null);
  const measureRef   = useRef<HTMLSpanElement>(null);
  const footerRef    = useRef<HTMLElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const fit = () => {
      const wm      = watermarkRef.current;
      const measure = measureRef.current;
      const footer  = footerRef.current;
      if (!wm || !measure || !footer) return;

      const footerWidth = footer.clientWidth;

      if (footerWidth < 640) {
        wm.style.display = "none";
        return;
      }

      wm.style.display = "block";

      // Binary-search the right font size using the off-screen measurer
      let lo = 10, hi = 600;
      while (lo < hi - 1) {
        const mid = Math.floor((lo + hi) / 2);
        measure.style.fontSize = mid + "px";
        if (measure.offsetWidth <= footerWidth) {
          lo = mid;
        } else {
          hi = mid;
        }
      }

      wm.style.fontSize = lo + "px";

      // Record content height so we can position watermark just below it
      const content = footer.querySelector<HTMLDivElement>(".footer-content");
      if (content) setContentHeight(content.offsetHeight);
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const columns = [
    {
      label: "Explore",
      links: ["Home", "Services", "About us", "Testimonials", "FAQ"],
    },
    {
      label: "Company",
      links: ["What's New", "About", "Blog", "Careers"],
    },
    {
      label: "Support",
      links: ["Getting Started", "Trust & Legal", "Terms & Conditions", "Privacy Notice"],
    },
  ];

  const socials = [
    <svg key="fb" width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        stroke="#1a7fe8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    <svg key="tw" width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
        stroke="#1a7fe8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    <svg key="ig" width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#1a7fe8" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="4" stroke="#1a7fe8" strokeWidth="1.6"/>
      <circle cx="17.5" cy="6.5" r="1" fill="#1a7fe8"/>
    </svg>,
    <svg key="yt" width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
        stroke="#1a7fe8" strokeWidth="1.6"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
        stroke="#1a7fe8" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>,
  ];

  return (
    <footer
      ref={footerRef}
      className="relative w-full"
      style={{ background: "#f0f5f8", overflow: "hidden" }}
    >
      {/* Off-screen span used purely for measuring text width at any font size */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontWeight: 900,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        healzy
      </span>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div
        className="footer-content relative"
        style={{ zIndex: 1, padding: "3rem 4rem 0" }}
      >
        <div
          className="grid pb-12"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2rem 2.5rem",
          }}
        >
          {/* Brand column */}
          <div
            style={{ gridColumn: "span 2", minWidth: 0 }}
            className="sm:col-span-2 col-span-1"
          >
            <div className="mb-3">
              <Image
                src="/logo.png"
                alt="Healzy"
                width={120}
                height={44}
                style={{ objectFit: "contain", height: "44px", width: "auto" }}
                priority
              />
            </div>

            <p
              className="leading-relaxed mb-5"
              style={{
                fontSize: "12.5px",
                color: "#4a6070",
                maxWidth: "210px",
                lineHeight: 1.7,
              }}
            >
              We help healthcare businesses generate patient inquiries, convert
              them into appointments, and retain patients for long-term growth.
            </p>

            <div className="flex gap-2 flex-wrap">
              {socials.map((icon, i) => (
                <button
                  key={i}
                  className="flex items-center justify-center transition-all duration-150 hover:scale-110"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "0.5px solid rgba(26,127,232,0.25)",
                    background: "rgba(255,255,255,0.55)",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {columns.map(({ label, links }) => (
            <div key={label}>
              <p
                className="font-bold uppercase mb-4"
                style={{
                  fontSize: "11px",
                  color: "#1a7fe8",
                  letterSpacing: "0.1em",
                }}
              >
                {label}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="transition-colors duration-150 hover:text-[#1a7fe8]"
                      style={{
                        fontSize: "13.5px",
                        color: item === "Home" ? "#0d1b2e" : "#2e4a5e",
                        fontWeight: item === "Home" ? 600 : 400,
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Watermark — sits below content, stretches full width ── */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        style={{
          display: "none",             /* JS sets to block on sm+ */
          fontWeight: 900,
          color: "rgba(26,127,232,0.09)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "normal",
          fontSize: "120px",           
        }}
      >
        healzy
      </div>
    </footer>
  );
}