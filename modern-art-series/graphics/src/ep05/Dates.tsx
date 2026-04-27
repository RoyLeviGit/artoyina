import { DateCard } from "../shared/DateCard";
import { palette } from "../shared/palette";

export const PostImpressionismDates = () => (
  <DateCard
    title="POST-IMPRESSIONISM — KEY DATES"
    events={[
      { date: "1886", label: "Final Impressionist show — Seurat exhibits La Grande Jatte", color: palette.peach },
      { date: "1888", label: "Van Gogh moves to Arles — Yellow House, Sunflowers, The Bedroom", color: palette.amber },
      { date: "Dec 1888", label: "Gauguin leaves Arles — the ear incident — they never meet again", color: palette.maroon },
      { date: "July 29, 1890", label: "Van Gogh dies at 37 — Theo dies six months later", color: palette.maroon },
      { date: "1903", label: "Gauguin dies in the Marquesas Islands, age 54", color: palette.maroon },
      { date: "1906", label: "Cézanne dies after painting outdoors in a storm, age 67", color: palette.maroon },
    ]}
  />
);
