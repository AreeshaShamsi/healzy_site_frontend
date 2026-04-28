"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What does a digital marketing agency for doctors do?",
    answer:
      "It helps generate patient inquiries, but real growth comes from converting and retaining those patients.",
  },
  {
    question: "How do healthcare marketing services help my clinic?",
    answer:
      "They improve visibility, generate inquiries, and help build systems that convert and retain patients.",
  },
  {
    question: "Why is retention important in healthcare?",
    answer:
      "Because repeat visits and long-term patient relationships are key to sustainable growth",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-white rounded-2xl px-8 py-12 md:px-12 md:py-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16">

        {/* Left: heading */}
        <div className="md:w-72 flex-shrink-0">
          <h2 className="font-bold text-3xl md:text-4xl text-blue-950 leading-tight tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm text-blue-500 leading-relaxed">
            Find clear answers to common queries and learn more about our
            services easily.
          </p>
        </div>

        {/* Right: accordion */}
        <div className="flex-1 flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-xl border transition-all duration-200 ${
                  isOpen
                    ? ""
                    : "border-blue-100"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-[18px] text-left"
                >
                  <span className="text-[14.5px] font-medium text-blue-950">
                    {faq.question}
                  </span>

                  {/* Icon circle */}
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-blue-600 border-blue-600 rotate-45"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 1v10M1 6h10"
                        stroke={isOpen ? "#fff" : "#3B82F6"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 pt-0 text-sm text-blue-500 leading-relaxed border-t border-blue-50">
                    <span className="block pt-3">{faq.answer}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}