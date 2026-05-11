"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { DIALOGUES, HERO_TEXT_FADE_END } from "@/lib/hero";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const bigLeftTextRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const powerReadoutRef = useRef<HTMLSpanElement | null>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const isCapturingRef = useRef(false);

  // State for smooth scrubbing
  const stateRef = useRef({
    progress: 0,
    smoothProgress: 0,
    rafId: 0,
  });

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded || framesRef.current.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Enable high-quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Smooth the progress with lerp - slower for more "weight"
    const target = stateRef.current.progress;
    stateRef.current.smoothProgress += (target - stateRef.current.smoothProgress) * 0.08;

    const currentSmooth = stateRef.current.smoothProgress;

    // Calculate frame index based on total captured frames
    const totalFrames = framesRef.current.length;
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.floor(currentSmooth * totalFrames)
    );

    const frame = framesRef.current[frameIndex];
    if (frame) {
      // Draw to canvas with object-cover logic
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = frame.width;
      const imgHeight = frame.height;

      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
      const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Smooth fade out at the end of the section
      const fadeOut = currentSmooth > 0.9 ? Math.max(0, 1 - (currentSmooth - 0.9) / 0.1) : 1;
      ctx.globalAlpha = fadeOut;

      ctx.drawImage(frame, x, y, imgWidth * scale, imgHeight * scale);
      ctx.globalAlpha = 1.0;
    }

    // Update HUD elements based on smooth progress
    if (heroTextRef.current) {
      const opacity = Math.max(0, 1 - currentSmooth / HERO_TEXT_FADE_END);
      heroTextRef.current.style.opacity = String(opacity);
      heroTextRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
    }

    if (bigLeftTextRef.current) {
      const op = Math.min(1, Math.max(0, (currentSmooth - 0.1) / 0.08));
      bigLeftTextRef.current.style.opacity = String(op);
      bigLeftTextRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
    }

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${currentSmooth})`;
    }

    if (powerReadoutRef.current) {
      const pwr = 92.4 + Math.sin(currentSmooth * Math.PI * 2) * 4.2;
      powerReadoutRef.current.textContent = pwr.toFixed(1) + "%";
    }

    // Dialogue visibility
    const newVisible = new Set<string>();
    for (const d of DIALOGUES) {
      if (currentSmooth >= d.show && currentSmooth <= d.hide) newVisible.add(d.id);
    }
    setVisibleCards((prev) => {
      if (prev.size === newVisible.size && [...prev].every(id => newVisible.has(id))) return prev;
      return newVisible;
    });
  }, [imagesLoaded]);

  useEffect(() => {
    let rafId: number;
    const loop = () => {
      renderFrame();
      rafId = requestAnimationFrame(loop);
      stateRef.current.rafId = rafId;
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [renderFrame]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable));
      stateRef.current.progress = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [renderFrame]);

  // High-performance frame capture engine
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "hero.mp4";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;

    const captureFrames = async () => {
      if (isCapturingRef.current) return;
      isCapturingRef.current = true;

      await video.play();

      const captureCanvas = document.createElement("canvas");
      const ctx = captureCanvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      // Optimize resolution for memory (480p is plenty for scroll animation)
      captureCanvas.width = 854;
      captureCanvas.height = 480;

      const duration = video.duration;
      const totalFrames = 120; // Reduced for memory safety
      let capturedCount = 0;

      const captureNext = async () => {
        if (capturedCount >= totalFrames) {
          setImagesLoaded(true);
          setLoadProgress(1);
          return;
        }

        // Add a small delay to prevent browser seek throttling
        setTimeout(() => {
          video.currentTime = (capturedCount / totalFrames) * duration;
        }, 20);
      };

      video.onseeked = async () => {
        ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
        try {
          const bitmap = await createImageBitmap(captureCanvas);
          framesRef.current.push(bitmap);
          capturedCount++;
          setLoadProgress(capturedCount / totalFrames);
          captureNext();
        } catch (e) {
          console.error("Frame capture failed", e);
          captureNext();
        }
      };

      captureNext();
    };

    video.onloadedmetadata = () => {
      captureFrames();
    };

    video.load();

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      video.pause();
      video.src = "";
      framesRef.current.forEach(f => f.close());
      framesRef.current = [];
    };
  }, []);

  return (
    <section ref={sectionRef} className="scroll-animation relative h-[800vh]">
      <div
        ref={containerRef}
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh" }}
      >
        {/* Canvas for smooth rendering */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />


        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)",
          }}
        />

        {/* HUD Frames */}
        <div className="pointer-events-none absolute left-6 top-24 text-accent md:left-10 md:top-28">
          <HudFrame corner="tl" size={26} />
        </div>
        <div className="pointer-events-none absolute right-6 top-24 text-accent md:right-10 md:top-28">
          <HudFrame corner="tr" size={26} />
        </div>
        <div className="pointer-events-none absolute bottom-14 left-6 text-accent md:bottom-16 md:left-10">
          <HudFrame corner="bl" size={26} />
        </div>
        <div className="pointer-events-none absolute bottom-14 right-6 text-accent md:bottom-16 md:right-10">
          <HudFrame corner="br" size={26} />
        </div>

        {/* Overlay Text */}
        <div
          ref={heroTextRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-5 px-6 pb-24 md:px-12 md:pb-28"
          style={{ transition: "opacity 80ms linear" }}
        >
          <EyebrowBadge>SYSTEMS // ABHAY DAS // ONLINE</EyebrowBadge>
          <h1 className="max-w-[14ch] font-sans text-5xl font-semibold leading-[0.95] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
            I am
            <br />
            <span className="text-accent">Abhay Das.</span>
          </h1>
          <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
            AI/ML Engineer specializing in Computer Vision and Generative AI.
            Scroll to run a full diagnostic on my latest deployments —
            Systems standing by.
          </p>
        </div>

        <div
          ref={bigLeftTextRef}
          className="pointer-events-none absolute bottom-24 left-6 z-10 hidden max-w-[58%] flex-col gap-5 md:flex md:bottom-28 md:left-12"
          style={{ opacity: 0, transition: "opacity 80ms linear" }}
        >
          <span className="inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,162,47,0.85)]" />
            Protocol &mdash; AI/ML ENGINEER
          </span>
          <h2 className="font-sans font-semibold leading-[0.88] tracking-tighter text-foreground text-[clamp(4rem,9.5vw,9rem)]">
            Architecting
            <br />
            with <span className="text-accent">Intelligence</span>
          </h2>
          <p className="max-w-[36ch] font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
            Intelligent systems &amp; neural architectures, engineered for impact.
          </p>
        </div>

        {/* Telemetry */}
        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
          <div className="h-px w-8 bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            Telemetry Link &mdash; Live
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            Core Intelligence
          </span>
          <span
            ref={powerReadoutRef}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent"
          >
            87.3%
          </span>
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,162,47,0.85)]" />
        </div>

        {/* Progress Bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent"
              style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            <span>SEQ 001 / 001</span>
            <span>SYSTEMS // DIAGNOSTIC</span>
            <span>Scroll &darr;</span>
          </div>
        </div>

        {/* Dialogue Cards */}
        {DIALOGUES.map((d) => {
          const visible = visibleCards.has(d.id);
          const position =
            d.id === "d1"
              ? "top-[22%] right-6 md:right-12"
              : d.id === "d2"
                ? "top-1/2 -translate-y-1/2 right-6 md:right-12"
                : "bottom-24 right-6 md:bottom-28 md:right-12";
          return (
            <div
              key={d.id}
              className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block`}
            >
              <figure
                className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
              >
                <blockquote className="font-sans text-xl font-medium leading-snug tracking-tight text-foreground">
                  &ldquo;{d.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="font-sans text-sm text-zinc-300">{d.speaker}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                    {d.film}
                  </span>
                </figcaption>
              </figure>
            </div>
          );
        })}

        {/* Loading Overlay */}
        {!imagesLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-background px-6">
            <EyebrowBadge>NEURAL LINK // BOOTING</EyebrowBadge>
            <div className="h-px w-60 bg-white/10 md:w-80">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Initializing Core... {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
