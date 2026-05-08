"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
  {
    key: "fb",
    label: "Facebook",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          stroke="#1a7fe8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "tw",
    label: "Twitter / X",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
          stroke="#1a7fe8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "ig",
    label: "Instagram",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="#1a7fe8" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="#1a7fe8" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="#1a7fe8" />
      </svg>
    ),
  },
  {
    key: "yt",
    label: "YouTube",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
          stroke="#1a7fe8"
          strokeWidth="1.8"
        />
        <polygon
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          stroke="#1a7fe8"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function FooterSection() {
  const watermarkRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fit = () => {
      const wm = watermarkRef.current;
      const measure = measureRef.current;
      const footer = footerRef.current;
      if (!wm || !measure || !footer) return;

      const footerWidth = footer.clientWidth;

      if (footerWidth < 640) {
        wm.style.display = "none";
        return;
      }

      wm.style.display = "block";

      let lo = 10,
        hi = 600;
      while (lo < hi - 1) {
        const mid = Math.floor((lo + hi) / 2);
        measure.style.fontSize = mid + "px";
        if (measure.offsetWidth <= footerWidth) lo = mid;
        else hi = mid;
      }

      wm.style.fontSize = lo + "px";
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #bde3f5 0%, #cdeaf8 18%, #dff2fb 35%, #edf8fd 52%, #daeef9 68%, #c8e4f4 84%, #b5d7ee 100%)",
      }}
    >
      {/* Off-screen measurer for watermark binary search */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible whitespace-nowrap font-black leading-none"
        style={{ position: "fixed", top: "-9999px", left: "-9999px" }}
      >
        healzy
      </span>

      {/* Top divider */}
      <div className="w-full h-px bg-blue-200/60" />

      {/* Main content */}
      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-20 pt-10 pb-0">

        {/* Grid layout */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 pb-10 md:pb-12">

          {/* Brand column — spans full width on mobile, 2 cols on md+ */}
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            {/* Logo */}
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Healzy"
                width={110}
                height={40}
                style={{ objectFit: "contain", height: "40px", width: "auto" }}
                priority
              />
            </div>

            <p className="text-[#4a6070] text-[13px] leading-[1.75] mb-5 max-w-[240px] sm:max-w-[270px]">
              We help healthcare businesses generate patient inquiries, convert
              them into appointments, and retain patients for long-term growth.
            </p>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2">
              {socials.map(({ key, label, icon }) => (
                <button
                  key={key}
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-blue-200/60 bg-white/50 hover:bg-white/80 hover:scale-110 transition-all duration-150 cursor-pointer"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Nav columns — each takes 1 col */}
          {columns.map(({ label, links }) => (
            <div key={label} className="col-span-1">
              <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-widest text-[#1a7fe8] mb-3 sm:mb-4">
                {label}
              </p>
              <ul className="flex flex-col gap-[9px] sm:gap-[10px]">
                {links.map((item, i) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`text-[12.5px] sm:text-[13px] leading-snug transition-colors duration-150 hover:text-[#1a7fe8] ${
                        i === 0
                          ? "font-semibold text-[#0d1b2e]"
                          : "font-normal text-[#2e4a5e]"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-200/50 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <p className="text-[11.5px] text-[#6a8090] text-center sm:text-left">
            © {new Date().getFullYear()} Healzy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {["Privacy Notice", "Terms & Conditions"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[11.5px] text-[#6a8090] hover:text-[#1a7fe8] transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Watermark — hidden on sm, stretches full width on md+ */}
     
    </footer>
  );
}