"use client";

import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";

const telemetry = [
  { label: "Core Intelligence", value: "Python / R / SQL", note: "ML Algorithms & Data Research" },
  { label: "Neural Frameworks", value: "PyTorch / TensorFlow", note: "Architecting Deep Neural Networks" },
  { label: "Vision Processing", value: "OpenCV / YOLO", note: "Real-time Detection & Recognition" },
  { label: "Generative AI", value: "LLMs / RAG", note: "Prompt Engineering & Vector DBs" },
  { label: "Data Analytics", value: "Pandas / Sklearn", note: "Statistical Modeling & Insights" },
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
                BTech Graduate in <span className="text-foreground">AI & Data Science</span> from Vimal Jyothi Engineering College. 
                Previously pursued an MSc in Artificial Intelligence from <span className="text-foreground">Touro University, New York, USA.</span>
                {" "}My expertise lies in developing sophisticated neural architectures and autonomous vision systems. 
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
                  <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl text-right">
                    {row.value}
                  </span>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-12 border-t border-white/5 pt-16">
          <AnimatedItem>
            <h3 className="mb-10 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
              &gt; Recent_Operations
            </h3>
          </AnimatedItem>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI Empathy Coach",
                desc: "Medical communication training toolkit using GenAI to simulate patient roleplay and provide empathy feedback.",
                tag: "LLM / NEXT.JS / NLP",
                link: "https://github.com/KingBuldoze/AI_Empathy_coach",
                highlight: true,
              },
              {
                title: "AI for Visually Impaired",
                desc: "Integrated assistant featuring face recognition, object detection, and emergency alerts for the visually impaired.",
                tag: "YOLOv11 / PYTHON / CV",
                link: "https://github.com/VILAS07/Integrated-AI-Assistant-for-Visually-Impaired-People",
                highlight: true,
              },
              {
                title: "Gesture Based AI",
                desc: "Real-time sign language interpretation system using computer vision and machine learning for seamless communication.",
                tag: "KERAS / OPENCV / AI",
                link: "https://github.com/VILAS07/Sign-Language-Recogonition",
                highlight: true,
              },
              {
                title: "Fraud Detection",
                desc: "Advanced machine learning model for identifying fraudulent transactions and patterns in financial data.",
                tag: "ML / PYTHON / SKLEARN",
                link: "https://github.com/KingBuldoze/Fraud_Detection",
                highlight: false,
              },
              {
                title: "RAG Pipeline",
                desc: "Implementation of Retrieval-Augmented Generation for efficient document retrieval and context-aware responses.",
                tag: "LLM / VECTOR-DB / RAG",
                link: "https://github.com/KingBuldoze/RAG",
                highlight: false,
              },
            ].map((p) => (
              <AnimatedItem key={p.title}>
                <a 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group relative flex h-full flex-col gap-3 rounded-2xl border p-6 transition-all duration-300 ${
                    p.highlight 
                      ? "border-accent/30 bg-accent/[0.03] hover:bg-accent/[0.06] hover:border-accent/50 shadow-[0_0_20px_rgba(212,162,47,0.02)]" 
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[9px] uppercase tracking-widest ${p.highlight ? "text-accent/80" : "text-zinc-500"}`}>{p.tag}</span>
                    <GithubLogo size={16} className={`${p.highlight ? "text-accent/60" : "text-zinc-600"} group-hover:text-accent transition-colors`} />
                  </div>
                  <h4 className="font-sans text-lg font-medium text-foreground group-hover:text-accent transition-colors">{p.title}</h4>
                  <p className="font-sans text-sm leading-relaxed text-zinc-400 line-clamp-3">{p.desc}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-tighter transition-colors">
                    <span className="text-zinc-500 group-hover:text-accent/80">Execute_Link</span>
                    <ArrowUpRight size={12} weight="bold" className="text-accent/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>
                  
                  {p.highlight && (
                    <div className="absolute -right-px -top-px h-12 w-12 overflow-hidden rounded-tr-2xl">
                      <div className="absolute right-[-20px] top-[6px] w-[60px] rotate-45 bg-accent/20 py-0.5 text-center font-mono text-[6px] uppercase tracking-widest text-accent backdrop-blur-sm">
                        Prime
                      </div>
                    </div>
                  )}
                </a>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
