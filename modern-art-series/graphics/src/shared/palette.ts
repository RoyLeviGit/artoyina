import { loadFont } from "@remotion/google-fonts/Cormorant";

const { fontFamily: cormorant } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

export const palette = {
  maroon: "#881F26",
  amber: "#F4A731",
  peach: "#FFD4CE",
  forest: "#01321F",
  bg: "#1a1714",
} as const;

export const fonts = {
  serif: cormorant,
} as const;
