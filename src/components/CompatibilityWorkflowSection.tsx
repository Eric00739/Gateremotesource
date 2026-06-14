'use client';

import { Camera, Radio, Cpu, Users, FlaskConical, Factory } from 'lucide-react';
import { verificationFields, workflowSteps } from '@/data/homepage';
import LeadModalTrigger from './LeadModalTrigger';
import { useDict } from '@/i18n';

const iconMap = [Camera, Radio, Cpu, Users, FlaskConical, Factory];

export default function CompatibilityWorkflowSection() {
  const dict = useDict();
  const steps = dict.workflowSteps || workflowSteps;
  const fields = dict.verificationFields || verificationFields;

  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.workflow.sectionLabel}
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4 max-w-2xl" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
          {dict.workflow.title}
        </h2>
        <p className="text-[#64748B] mb-14 max-w-xl">
          {dict.workflow.subtitle}
        </p>

        {/* Horizontal timeline */}
        <div className="relative">
          {/* Connecting dotted line (desktop) */}
          <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-[2px] border-t-2 border-dashed border-[#E2E8F0]" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((step: { step?: number; title: string; description: string }, i: number) => {
              const Icon = iconMap[i];
              const stepNumber = step.step || i + 1;
              return (
                <div key={stepNumber} className="text-center relative">
                  {/* Numbered circle with icon */}
                  <div className="relative z-10 mb-4">
                    <div className="w-14 h-14 mx-auto bg-[#F8FAFC] rounded-full flex items-center justify-center border-2 border-[#E2E8F0] group-hover:border-[#FF8A1F] transition-colors">
                      <Icon className="w-6 h-6 text-[#FF8A1F]" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FF8A1F] rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <span className="text-white text-[10px] font-bold" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                        {stepNumber}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-[13px] font-bold text-[#0F172A] mb-1.5 leading-snug" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{step.title}</h3>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 rounded-lg border border-[#D8E4F0] bg-[#F8FAFC] p-5 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                {dict.workflow.sendTitle}
              </h3>
              <p className="text-sm text-[#64748B] max-w-2xl">
                {dict.workflow.sendSubtitle}
              </p>
            </div>
            <LeadModalTrigger
              prefillType="compatibility"
              className="inline-flex items-center justify-center rounded-lg bg-[#FF8A1F] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#F97316]"
            >
              {dict.workflow.requestCta}
            </LeadModalTrigger>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {fields.map((item: { field: string; description: string }) => (
              <div key={item.field} className="rounded-lg border border-[#E2E8F0] bg-white p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FF8A1F] mb-2" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                  {item.field}
                </div>
                <p className="text-[12px] leading-relaxed text-[#64748B]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
