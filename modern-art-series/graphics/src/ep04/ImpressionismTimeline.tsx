import { Timeline } from "../shared/Timeline";
import { palette } from "../shared/palette";

export const ImpressionismTimeline = () => (
  <Timeline
    title="THE IMPRESSIONIST MOVEMENT"
    subtitle="1863 – 1926"
    startYear={1858}
    endYear={1930}
    eras={[
      { label: "SECOND EMPIRE", start: 1858, end: 1870, color: palette.peach },
      { label: "THIRD REPUBLIC", start: 1870, end: 1930, color: palette.amber },
    ]}
    events={[
      { year: 1863, label: "Salon des Refusés — Manet", type: "politics", major: true, row: 1 },
      { year: 1869, label: "La Grenouillère — Monet & Renoir paint side by side", type: "art", row: 3 },
      { year: 1870, label: "Franco-Prussian War — Bazille killed", type: "politics", row: 1 },
      { year: 1872, label: "Impression, Sunrise", type: "art", major: true, row: 2 },
      { year: 1874, label: "First Impressionist exhibition", type: "politics", major: true, row: 1 },
      { year: 1876, label: "Moulin de la Galette (Renoir)", type: "art", row: 4 },
      { year: 1877, label: "Cassatt joins the group", type: "art", major: true, row: 3 },
      { year: 1879, label: "Camille Monet dies", type: "politics", row: 2 },
      { year: 1880, label: "The Dance Class (Degas)", type: "art", row: 3 },
      { year: 1882, label: "The Child's Bath (Cassatt)", type: "art", row: 4 },
      { year: 1883, label: "Monet moves to Giverny", type: "art", row: 2 },
      { year: 1886, label: "8th and final Impressionist show", type: "politics", major: true, row: 1 },
      { year: 1891, label: "Haystacks series", type: "art", major: true, row: 2 },
      { year: 1894, label: "Rouen Cathedral series", type: "art", row: 3 },
      { year: 1906, label: "Water Lilies series begins", type: "art", major: true, row: 4 },
      { year: 1926, label: "Monet dies, age 86", sublabel: "Water Lilies donated to France", type: "politics", major: true, row: 2 },
    ]}
  />
);
