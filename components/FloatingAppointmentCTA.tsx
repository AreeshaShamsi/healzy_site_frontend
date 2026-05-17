"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";

type FloatingAppointmentCTAProps = {
  href?: string;
};

export default function FloatingAppointmentCTA({
  href = "/contact",
}: FloatingAppointmentCTAProps) {
  return (
    <Link
      href={href}
      aria-label="Book an appointment"
      className="fixed right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.9rem,env(safe-area-inset-bottom))] z-[90] inline-flex items-center gap-2.5 rounded-full border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.48)_0%,rgba(206,228,255,0.34)_100%)] px-3.5 py-2 text-[12.5px] font-semibold text-[#0f2f63] shadow-[0_10px_28px_rgba(37,99,235,0.2),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.03] hover:border-white/70 hover:shadow-[0_14px_34px_rgba(37,99,235,0.28),0_1px_0_rgba(255,255,255,1)_inset] active:scale-[0.98] sm:right-[max(1rem,env(safe-area-inset-right))] sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-4 sm:py-2.5 sm:text-[13px]"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/65 bg-white/55 shadow-[0_2px_8px_rgba(37,99,235,0.14)] sm:h-8 sm:w-8">
        <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>
      <span className="button-text whitespace-nowrap text-[12.5px] sm:text-[13px]">
        Book an Appointment
      </span>
    </Link>
  );
}
