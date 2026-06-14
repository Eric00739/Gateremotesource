'use client';

import Image from 'next/image';
import { applications } from '@/data/homepage';
import { useDict } from '@/i18n';

export default function ApplicationScenariosSection() {
  const dict = useDict();
  const names = dict.applications.names || [];

  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.applications.sectionLabel}
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-12" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
          {dict.applications.title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {applications.map((app, index) => {
            const name = names[index] || app.name;
            return (
            <div
              key={app.name}
              className="relative rounded-lg overflow-hidden group card-hover-light"
            >
              <div className="relative h-40">
                <Image
                  src={app.image}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="w-8 h-[2px] bg-[#FF8A1F] mb-3 group-hover:w-12 transition-all duration-300" />
                <span className="text-white font-bold text-[15px]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{name}</span>
              </div>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}
