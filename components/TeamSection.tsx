"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RiLinkedinLine,
  RiTwitterLine,
  RiMailLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Co-Founder & Growth Strategist",
    bio: "With 12+ years in healthcare marketing, Sarah has helped over 200 practices scale their patient acquisition systems. She specialises in retention strategy and reputation architecture.",
    tags: ["Growth Strategy", "Patient Retention", "Brand Authority"],
    initials: "SM",
    color: "#3B82F6",
    bg: "#EFF6FF",
    linkedin: "#",
    twitter: "#",
    email: "sarah@example.com",
  },
  {
    name: "James Okafor",
    role: "Co-Founder & Systems Architect",
    bio: "James brings a decade of marketing automation and funnel engineering to every engagement. He leads the technical build across campaigns, CRM integrations, and automation workflows.",
    tags: ["Automation", "Funnel Design", "CRM Systems"],
    initials: "JO",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    linkedin: "#",
    twitter: "#",
    email: "james@example.com",
  },
];

function MemberCard({ member, index }: { member: (typeof TEAM)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Top color band + avatar */}
      <div
        className="h-28 relative flex items-end px-7 pb-0"
        style={{ background: `linear-gradient(135deg, ${member.bg} 0%, white 100%)` }}
      >
        {/* Top left accent line */}
        <motion.div
          className="absolute top-0 left-0 h-[3px] rounded-tr-full"
          style={{ background: member.color }}
          initial={{ width: 0 }}
          animate={inView ? { width: "40%" } : { width: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.3, ease: "easeOut" }}
        />

        {/* Avatar circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: index * 0.15 + 0.2 }}
          className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-2xl font-black translate-y-10"
          style={{ background: member.bg, color: member.color }}
        >
          {member.initials}
        </motion.div>
      </div>

      {/* Body */}
      <div className="px-7 pt-14 pb-7 flex flex-col flex-1">
        {/* Name + role */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 leading-snug">{member.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mt-1" style={{ color: member.color }}>
            {member.role}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-4" />

        {/* Bio */}
        <p className="text-sm text-slate-500 leading-relaxed font-light flex-1">{member.bio}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-5">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
              style={{ background: member.bg, color: member.color }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Social links */}
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
          {[
            { icon: RiLinkedinLine, href: member.linkedin, label: "LinkedIn" },
            { icon: RiTwitterLine, href: member.twitter, label: "Twitter" },
            { icon: RiMailLine, href: `mailto:${member.email}`, label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:text-white transition-colors duration-200"
              style={{ ["--hover-bg" as string]: member.color }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = member.color;
                (e.currentTarget as HTMLElement).style.borderColor = member.color;
                (e.currentTarget as HTMLElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "";
                (e.currentTarget as HTMLElement).style.borderColor = "";
                (e.currentTarget as HTMLElement).style.color = "";
              }}
            >
              <Icon size={15} aria-hidden="true" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-slate-50 py-20 px-6 md:px-16 overflow-hidden">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12 opacity-0">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="text-xs text-blue-500 uppercase tracking-[0.2em] font-semibold">
              The team
            </span>
            <div className="h-px w-8 bg-blue-500" />
          </div>
          <h2
            className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The people behind{" "}
            <em className="italic text-blue-600">your growth</em>
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-light">
            Two specialists. One focused mission — building the growth system your practice deserves.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}