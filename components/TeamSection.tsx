"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    
    name: "Rachel Moore",
    role: "Chief Strategist",
    bio: "12 years bridging clinical practice and patient acquisition. Builds pipelines that outlast ad budgets.",
 
   
    src: "/images/rachel.jpg",
    color: "blue",
  },
  {
   
    name: "James Keller",
    role: "Growth Director",
    bio: "Turns behavioral data into brand stories. Runs campaigns that convert browsers into booked appointments.",
    
   
    src: "/images/james.jpg",
    color: "green",
  },
  {
   
    name: "Sara Patel",
    role: "Patient Experience",
    bio: "Designs review systems and loyalty loops that transform one-time patients into your loudest advocates.",
    
   
    src: "/images/sara.jpg",
    color: "purple",
  },
] as const;

const colorClasses = {
  blue: {
    avatar: "bg-gradient-to-br from-[#c5d0ff] to-[#e8edff] text-[#1a3ce8]",
    tag: "bg-[#e8edff] text-[#1a3ce8]",
    accent: "bg-[#1a3ce8]",
  },
  green: {
    avatar: "bg-gradient-to-br from-[#b2d9cc] to-[#e8f5f0] text-[#0d7a5f]",
    tag: "bg-[#e8f5f0] text-[#0d7a5f]",
    accent: "bg-[#0d7a5f]",
  },
  purple: {
    avatar: "bg-gradient-to-br from-[#dbb4ff] to-[#f3e8ff] text-[#7c3aed]",
    tag: "bg-[#f3e8ff] text-[#7c3aed]",
    accent: "bg-[#7c3aed]",
  },
} as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".team-left", {
        scrollTrigger: { trigger: ".team", start: "top 78%" },
        opacity: 0,
        x: -36,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".team-sub", {
        scrollTrigger: { trigger: ".team", start: "top 78%" },
        opacity: 0,
        x: 36,
        duration: 0.8,
        ease: "power3.out",
      });
      document.querySelectorAll(".card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: ".cards", start: "top 82%" },
          opacity: 0,
          y: 48,
          duration: 0.7,
          delay: i * 0.13,
          ease: "power3.out",
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-x-hidden bg-[#f5f4f1] font-['DM_Sans',sans-serif] text-[#0d0d0d]">
      <section className="team mx-auto max-w-[1200px] px-12 pb-[100px] pt-20 max-md:px-6 max-md:pb-20 max-md:pt-[60px]">
        <div className="team-top mb-14 flex items-end justify-between gap-8 max-md:flex-col max-md:items-start">
          <div className="team-left">
            <h2 className="heading max-w-[360px] leading-[1.02]">
              Behind every
              <br />
              <em>healthy practice</em>
            </h2>
          </div>
        </div>

        <div className="cards grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {team.map((member, index) => (
            <div
              key={member.name}
              className="card group relative flex cursor-default flex-col overflow-hidden rounded-3xl border border-[#e8e8e4] bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#d8d8d2] hover:shadow-[0_20px_48px_rgba(0,0,0,0.10)]"
            >
              <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-[#e0e0da]">
                <Image
                  src={member.src}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="photo-img z-[1] object-cover object-[center_top] transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,0.68,0,1.2)] group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div
                  className={`absolute inset-0 z-0 flex items-center justify-center font-['Syne',sans-serif] text-[40px] font-extrabold ${
                    colorClasses[member.color].avatar
                  }`}
                >
                  {initials(member.name)}
                </div>
                <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[rgba(13,13,13,0.6)] to-transparent to-[55%]" />
                <span className="absolute right-3.5 top-3.5 z-[3] rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.18)] px-2.5 py-1 font-['Syne',sans-serif] text-[10px] font-bold tracking-[0.08em] text-white backdrop-blur-[8px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="absolute bottom-4 left-5 z-[3]">
                  <p className="font-['Syne',sans-serif] text-[17px] font-bold leading-[1.15] text-white">{member.name}</p>
                  <p className="text-[11px] font-normal uppercase tracking-[0.08em] text-[rgba(255,255,255,0.7)]">{member.role}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-6 pb-5 pt-[22px]">
                <p className="flex-1 text-[13px] font-light leading-[1.75] text-[#666]">{member.bio}</p>
               
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
