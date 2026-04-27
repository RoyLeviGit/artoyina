import { Timeline } from "../shared/Timeline";
import { palette } from "../shared/palette";

export const RealismTimeline = () => (
  <Timeline
    title="GUSTAVE COURBET — REALISM"
    subtitle="1848 – 1877"
    startYear={1844}
    endYear={1882}
    eras={[
      { label: "SECOND REPUBLIC", start: 1848, end: 1852, color: palette.peach },
      { label: "SECOND EMPIRE", start: 1852, end: 1870, color: palette.amber },
      { label: "THIRD REPUBLIC", start: 1870, end: 1882, color: palette.peach },
    ]}
    events={[
      { year: 1848, label: "Revolutions across Europe", type: "politics", major: true, row: 1 },
      { year: 1849, label: "The Stone Breakers", type: "art", row: 3 },
      { year: 1850, label: "Burial at Ornans — Salon scandal", type: "art", major: true, row: 2 },
      { year: 1852, label: "Napoleon III seizes power", type: "politics", row: 1 },
      { year: 1854, label: "Bonjour, Monsieur Courbet", type: "art", row: 4 },
      { year: 1855, label: "Pavilion of Realism", type: "art", major: true, row: 3 },
      { year: 1855, label: "The Painter's Studio", type: "art", row: 2 },
      { year: 1857, label: "The Gleaners (Millet)", type: "art", row: 4 },
      { year: 1866, label: "The Origin of the World", type: "art", row: 3 },
      { year: 1870, label: "Franco-Prussian War", type: "politics", major: true, row: 1 },
      { year: 1871, label: "Paris Commune — Vendôme Column", type: "politics", major: true, row: 2 },
      { year: 1873, label: "Courbet flees to Switzerland", type: "politics", row: 1 },
      { year: 1877, label: "Courbet dies in exile", sublabel: "age 58", type: "politics", major: true, row: 2 },
    ]}
  />
);
