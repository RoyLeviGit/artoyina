import { Timeline } from "../shared/Timeline";
import { palette } from "../shared/palette";

export const PostImpressionismTimeline = () => (
  <Timeline
    title="POST-IMPRESSIONISM — THREE LIVES"
    subtitle="1880 – 1906"
    startYear={1877}
    endYear={1910}
    eras={[
      { label: "THIRD REPUBLIC", start: 1877, end: 1910, color: palette.amber },
    ]}
    events={[
      { year: 1880, label: "Cézanne withdraws to Aix", type: "art", row: 4 },
      { year: 1882, label: "Gauguin begins painting Sundays", type: "art", row: 3 },
      { year: 1883, label: "Van Gogh: The Potato Eaters (Nuenen)", type: "art", row: 2 },
      { year: 1884, label: "Seurat begins La Grande Jatte", type: "art", row: 4 },
      { year: 1886, label: "Final Impressionist show", type: "politics", major: true, row: 1 },
      { year: 1886, label: "Van Gogh arrives in Paris — palette transforms", type: "art", major: true, row: 2 },
      { year: 1888, label: "Van Gogh moves to Arles", type: "art", major: true, row: 3 },
      { year: 1888, label: "Vision After the Sermon (Gauguin)", type: "art", row: 4 },
      { year: 1889, label: "The Starry Night", type: "art", major: true, row: 2 },
      { year: 1889, label: "Gauguin departs for Tahiti", type: "art", row: 4 },
      { year: 1890, label: "Van Gogh dies — Auvers", type: "politics", major: true, row: 1 },
      { year: 1895, label: "Where Do We Come From? (Gauguin)", type: "art", major: true, row: 3 },
      { year: 1895, label: "Cézanne's first solo show, age 56", type: "art", row: 4 },
      { year: 1901, label: "Cézanne: The Large Bathers", type: "art", row: 3 },
      { year: 1903, label: "Gauguin dies — Marquesas", type: "politics", major: true, row: 2 },
      { year: 1906, label: "Cézanne dies — Cézanne retrospective next year", type: "politics", major: true, row: 1 },
    ]}
  />
);
