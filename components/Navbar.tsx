"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const heroSection = document.getElementById("hero-cinematic");
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.01,
      }
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <style>{`
        .nav-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: center;
          padding: 14px 24px;
          transition: padding 0.3s ease;
        }
        .nav-root.scrolled {
          padding: 8px 24px;
        }
        .nav-pill {
          width: 100%;
          max-width: 1200px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(18px) saturate(1.6);
          -webkit-backdrop-filter: blur(18px) saturate(1.6);
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 20px;
          box-shadow:
            0 4px 24px rgba(30, 58, 138, 0.08),
            0 1px 4px rgba(30, 58, 138, 0.06),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transition: box-shadow 0.3s ease, border-radius 0.3s ease;
          overflow: hidden;
        }
        .nav-root.scrolled .nav-pill {
          box-shadow:
            0 8px 32px rgba(30, 58, 138, 0.13),
            0 2px 8px rgba(30, 58, 138, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.9);
          border-radius: 18px;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 28px;
          gap: 16px;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          text-decoration: none;
        }
        .logo img {
          height: 32px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        /* Desktop links */
        .nav-links {
          display: none;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2px;
          align-items: center;
          flex: 1;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .nav-links { display: flex; }
        }
        .nav-links a {
          display: block;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 6px 18px;
          border-radius: 10px;
          text-decoration: none;
          color: #64748b;
          transition: color 0.18s, background 0.18s;
          white-space: nowrap;
        }
        .nav-links a:hover {
          color: #1e3a8a;
          background: rgba(59, 130, 246, 0.08);
        }
        .nav-links a.active {
          color: #1d4ed8;
          background: rgba(59, 130, 246, 0.12);
          font-weight: 600;
        }

        /* CTA button — hidden on sm, visible on md+ */
        .cta-btn {
          display: none;
          font-family: inherit;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #1d4ed8;
          border: 1.5px solid rgba(59, 130, 246, 0.35);
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          box-shadow: 0 1px 4px rgba(59,130,246,0.10);
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.18s, box-shadow 0.18s, border-color 0.18s;
        }
        @media (min-width: 768px) {
          .cta-btn { display: flex; }
        }
        .cta-btn:hover {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 14px rgba(59,130,246,0.18);
          border-color: rgba(59,130,246,0.55);
        }

        /* Hamburger */
        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4.5px;
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(59,130,246,0.08);
          border-radius: 10px;
          cursor: pointer;
          padding: 8px;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        @media (min-width: 768px) {
          .hamburger { display: none; }
        }
        .hamburger:hover { background: rgba(59,130,246,0.16); }
        .hamburger span {
          display: block;
          height: 1.8px;
          border-radius: 2px;
          background: #1e3a8a;
          transition: transform 0.25s, opacity 0.2s, width 0.25s;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) {
          transform: translateY(6.3px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-6.3px) rotate(-45deg);
        }

        /* Mobile menu */
        .mobile-menu {
          display: block;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        @media (min-width: 768px) {
          .mobile-menu { display: none !important; }
        }
        .mobile-menu.open {
          max-height: 320px;
        }
        .mobile-menu-inner {
          padding: 8px 14px 14px;
          border-top: 1px solid rgba(59,130,246,0.12);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mobile-menu a {
          display: block;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          padding: 9px 12px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-menu a:hover, .mobile-menu a.active {
          background: rgba(59,130,246,0.10);
          color: #1d4ed8;
          font-weight: 600;
        }
      `}</style>

      <div
        className={`nav-root transition-all duration-300 ease-out fixed top-0 left-0 w-full z-50 ${
          isHeroVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-6 pointer-events-none"
        }`}
      >
        <div className="nav-pill navbar-text bg-white/70 backdrop-blur-md">
          <div className="nav-inner">

            {/* Logo */}
            <Link href="/" className="logo">
              <img src="/logo.png" alt="Logo" />
            </Link>

            {/* Desktop nav */}
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={pathname === item.href ? "active" : ""}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA — md+ only */}
            <button className="cta-btn">
              Get started
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7.5 4l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Hamburger — sm only */}
            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          {/* Mobile menu — no CTA inside */}
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <div className="mobile-menu-inner">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={pathname === item.href ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
