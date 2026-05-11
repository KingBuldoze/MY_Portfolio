"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { BEATS } from "@/lib/cinematic";

export function CinematicReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const h2InevitableRef = useRef<HTMLHeadingElement | null>(null);
  const h2PersonalRef = useRef<HTMLHeadingElement | null>(null);
  const outroRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const seqReadoutRef = useRef<HTMLSpanElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visibleBeats, setVisibleBeats] = useState<Set<string>>(new Set());

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

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Enable high-quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Smooth progress - slightly faster response to match scroll engine
    const target = stateRef.current.progress;
    stateRef.current.smoothProgress += (target - stateRef.current.smoothProgress) * 0.08;
    const currentSmooth = stateRef.current.smoothProgress;

    // Frame mapping
    const totalFrames = framesRef.current.length;
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.floor(currentSmooth * totalFrames)
    );

    const frame = framesRef.current[frameIndex];

    // Prepare dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (frame) {
      const imgWidth = frame.width;
      const imgHeight = frame.height;
      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
      const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

      // Draw the image first
      ctx.save();

      // Fade in at the start of the section
      const fadeIn = currentSmooth < 0.1 ? Math.min(1, currentSmooth / 0.1) : 1;
      ctx.globalAlpha = fadeIn;

      ctx.drawImage(frame, x, y, imgWidth * scale, imgHeight * scale);

      // Now apply the radial mask using Canvas composite operations for MUCH smoother edges
      const maskSize = currentSmooth < 0.2 ? 0 :
        currentSmooth > 0.8 ? 100 :
          ((currentSmooth - 0.2) / 0.6) * 100;

      if (maskSize < 100) {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const maxDim = Math.max(canvasWidth, canvasHeight);
        const innerRadius = (maxDim * maskSize) / 100;
        const outerRadius = innerRadius + 400; // Even softer edge

        const grad = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      ctx.restore();
    }

    // Animations linked to smooth progress
    if (h2InevitableRef.current) {
      const op = Math.min(1, Math.max(0, (0.52 - currentSmooth) / 0.1));
      h2InevitableRef.current.style.opacity = String(op);
    }

    if (h2PersonalRef.current) {
      const op = Math.min(1, Math.max(0, (currentSmooth - 0.48) / 0.1));
      h2PersonalRef.current.style.opacity = String(op);
    }

    if (outroRef.current) {
      const op = Math.min(1, Math.max(0, (currentSmooth - 0.86) / 0.06));
      outroRef.current.style.opacity = String(op);
      outroRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
    }

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${currentSmooth})`;
    }

    if (seqReadoutRef.current) {
      seqReadoutRef.current.textContent = `SEQ 001 / 001`;
    }

    // Beats visibility
    const newVisible = new Set<string>();
    for (const beat of BEATS) {
      if (currentSmooth >= beat.show && currentSmooth <= beat.hide) newVisible.add(beat.id);
    }
    setVisibleBeats(prev => {
      if (prev.size === newVisible.size && [...prev].every(id => newVisible.has(id))) return prev;
      return newVisible;
    });

    stateRef.current.rafId = requestAnimationFrame(renderFrame);
  }, [imagesLoaded]);

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
    stateRef.current.rafId = requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(stateRef.current.rafId);
    };
  }, [renderFrame]);

  // Capture engine for CinematicReveal
  useEffect(() => {
    const video = document.createElement("video");
    video.src = `${window.location.origin}/MY_Portfolio/reveal.mp4`;
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

      // Optimize resolution for memory
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
    <section
      ref={sectionRef}
      id="cinematic"
      className="scroll-animation relative border-t border-white/5 bg-background h-[500vh]"
    >
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh" }}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_100%)] opacity-[0.03]"
        />

        {/* Cinematic Canvas */}
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <canvas
            ref={canvasRef}
            className="h-full w-full object-contain"
            style={{
              maskImage: "radial-gradient(circle at center, black 40%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 90%)"
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 90%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)",
          }}
        />

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

        <div className="pointer-events-none absolute right-6 top-28 z-10 flex max-w-[46ch] flex-col items-end gap-5 text-right md:right-12 md:top-32">
          <EyebrowBadge>NEURAL CORE // SYSTEM STATUS</EyebrowBadge>
          <div className="relative self-stretch">
            <h2
              ref={h2InevitableRef}
              className="font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
              style={{ transition: "opacity 240ms ease-out" }}
            >
              I am
              <br />
              <span className="text-accent">the solution.</span>
            </h2>
            <h2
              ref={h2PersonalRef}
              className="absolute inset-0 font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
              style={{ opacity: 0, transition: "opacity 240ms ease-out" }}
            >
              And I am
              <br />
              <span className="text-accent">Abhay Das.</span>
            </h2>
          </div>
          <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
            The future of intelligence is neural. Every project is a step towards a more connected and understanding world.
          </p>
        </div>

        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
          <div className="h-px w-8 bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            Neural Log &mdash; Active
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span
            ref={seqReadoutRef}
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent"
          >
            SEQ 001 / 001
          </span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,162,47,0.85)]"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent"
              style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            <span>PROJECTS // ARCHIVE</span>
            <span>SYSTEM // PLAYBACK</span>
            <span>Scroll &darr;</span>
          </div>
        </div>

        {BEATS.map((b, i) => {
          const visible = visibleBeats.has(b.id);
          const position =
            i === 0
              ? "top-[24%] left-6 md:left-12"
              : i === 1
                ? "top-1/2 -translate-y-1/2 left-6 md:left-12"
                : "bottom-24 left-6 md:bottom-28 md:left-12";
          return (
            <div
              key={b.id}
              className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block`}
            >
              <figure
                className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {b.label}
                </span>
                <blockquote className="mt-3 font-sans text-xl font-medium leading-snug tracking-tight text-foreground">
                  &ldquo;{b.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="font-sans text-sm text-zinc-300">{b.speaker}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400">
                    {b.film}
                  </span>
                </figcaption>
              </figure>
            </div>
          );
        })}

        <div
          ref={outroRef}
          className="pointer-events-none absolute bottom-24 right-6 z-10 flex flex-col items-end gap-4 md:bottom-32 md:right-12"
          style={{ opacity: 0, transition: "opacity 80ms linear" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Next &mdash; engage
          </span>
          <a
            href="#systems"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] active:translate-y-[1px]"
          >
            Access Systems
            <span aria-hidden>&darr;</span>
          </a>
        </div>

        {!imagesLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-background px-6">
            <EyebrowBadge>NEURAL DATA // RESTORING</EyebrowBadge>
            <div className="h-px w-60 bg-white/10 md:w-80">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Synthesizing Intelligence &nbsp;&middot;&nbsp; {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
