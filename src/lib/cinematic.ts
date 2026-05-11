export const CINE_FRAME_COUNT = 169;

export const cineFramePath = (n: number) =>
  `/frames2/frame_${String(n).padStart(4, "0")}.jpg`;

export type Beat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  quote: string;
  speaker: string;
  film: string;
};

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.1,
    hide: 0.3,
    label: "01 — Inception",
    quote: "Building systems that see, think, and understand.",
    speaker: "Abhay Das",
    film: "AI/ML ARCHITECT — 2024",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.55,
    label: "02 — Vision",
    quote: "Bridging the gap between code and human empathy.",
    speaker: "Abhay Das",
    film: "COMPUTER VISION SPECIALIST — 2024",
  },
  {
    id: "b3",
    show: 0.6,
    hide: 0.8,
    label: "03 — Future",
    quote: "The next generation of intelligence is already here.",
    speaker: "Abhay Das",
    film: "GENERATIVE AI RESEARCH — 2024",
  },
];

export const CINE_INTRO_FADE_END = 0.08;
