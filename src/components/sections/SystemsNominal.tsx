"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";

const telemetry = [
  { label: "Core Intelligence", value: "Python / R", note: "ML Algorithms & Data Research" },
  { label: "Neural Frameworks", value: "PyTorch / Java", note: "Architecting Complex Models" },
  { label: "Vision Processing", value: "OpenCV", note: "Real-time Gesture Recognition" },
  { label: "Hardware Link", value: "Arduino / C", note: "Autonomous Navigation Systems" },
  { label: "Data Integrity", value: "SQL", note: "Secure Database Management" },
];

export function SystemsNominal() {
  return (
    <section
      id="systems"
      className="relative border-t border-white/5 bg-background px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-32"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-16">
        <div className="flex flex-col gap-16 md:grid md:grid-cols-[5fr_4fr] md:gap-20">
          <AnimatedSection className="flex flex-col gap-8">
            <AnimatedItem>
              <EyebrowBadge>SYSTEM // NEURAL STATUS</EyebrowBadge>
            </AnimatedItem>
            <AnimatedItem>
              <h2 className="max-w-[16ch] font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl">
                &ldquo;Engineering the{" "}
                <span className="text-accent">Future.</span>&rdquo;
              </h2>
            </AnimatedItem>
            <AnimatedItem>
              <p className="max-w-[48ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
                Currently pursuing a <span className="text-foreground">BTech in AI & Data Science</span> at Vimal Jyothi Engineering College. 
                My expertise lies in developing sophisticated neural architectures and autonomous vision systems. 
                From gesture-controlled assistants to PID-stabilized navigation, I bridge the gap between 
                hardware programming and high-level artificial intelligence.
              </p>
            </AnimatedItem>
            <AnimatedItem className="flex flex-wrap gap-4">
              <a
                href="#footer"
                className="group inline-flex items-center gap-2 self-start rounded-full border border-accent/30 bg-accent/5 px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent backdrop-blur-md transition-all duration-200 hover:bg-accent/10 active:translate-y-[1px]"
              >
                Establish Link
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <a
                href="/ABHAY DAS_AI_Resume.pdf"
                target="_blank"
                className="group inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 backdrop-blur-md transition-all duration-200 hover:bg-white/[0.05] active:translate-y-[1px]"
              >
                Download Dossier
              </a>
            </AnimatedItem>
          </AnimatedSection>

          <AnimatedSection className="flex flex-col divide-y divide-white/8 border-t border-white/8 font-mono md:mt-3">
            {telemetry.map((row) => (
              <AnimatedItem key={row.label}>
                <div className="flex items-baseline justify-between gap-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                      {row.label}
                    </span>
                    <span className="font-sans text-[13px] text-zinc-400">
                      {row.note}
                    </span>
                  </div>
                  <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {row.value}
                  </span>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>

        {/* Projects Grid */}
        <AnimatedSection className="mt-12 border-t border-white/5 pt-16">
          <AnimatedItem>
            <h3 className="mb-10 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
              &gt; Recent_Operations
            </h3>
          </AnimatedItem>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Project Neural Assistant",
                desc: "Gesture-controlled AI assistant leveraging Computer Vision and NLP for home automation.",
                tag: "MEDIAPIPE / PYTHON",
              },
              {
                title: "Autonomous Navigator",
                desc: "Lane-following system using PID control and real-time sensor fusion on Arduino platform.",
                tag: "EMBEDDED C / CV",
              },
              {
                title: "Neural Engine",
                desc: "Optimized inference pipeline for edge devices, reducing latency by 40% using TensorRT.",
                tag: "TENSORRT / C++",
              },
            ].map((p) => (
              <AnimatedItem key={p.title}>
                <div className="group relative flex h-full flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:bg-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">{p.tag}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-accent/40 group-hover:bg-accent" />
                  </div>
                  <h4 className="font-sans text-lg font-medium text-foreground">{p.title}</h4>
                  <p className="font-sans text-sm leading-relaxed text-zinc-400">{p.desc}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
