export const FRAME_COUNT = 169;

export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,
    hide: 0.3,
    quote: "AI and Data Science Engineer specializing in Computer Vision, Generative AI, and Real-Time Intelligent Systems.",
    speaker: "Abhay Das",
    film: "PROFESSIONAL SUMMARY",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "Developed an AI-powered empathy training system for healthcare professionals using GenAI and LLMs.",
    speaker: "Abhay Das",
    film: "AI EMPATHY COACH FOR DOCTORS",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "Engineered a real-time smart glass system integrating YOLO-based object detection and facial recognition.",
    speaker: "Abhay Das",
    film: "AI ASSISTANT FOR VISUALLY IMPAIRED",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
