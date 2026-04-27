import { Timeline } from "../shared/Timeline";
import { palette } from "../shared/palette";

export const SymbolismTimeline = () => (
  <Timeline
    title="SYMBOLISM + ART NOUVEAU"
    subtitle="1885 – 1910"
    startYear={1882}
    endYear={1914}
    eras={[
      { label: "THIRD REPUBLIC / BELLE ÉPOQUE", start: 1882, end: 1914, color: palette.amber },
    ]}
    events={[
      { year: 1884, label: "Huysmans — À Rebours — the Symbolist bible", type: "politics", row: 1 },
      { year: 1886, label: "Symbolist Manifesto (Moréas)", type: "politics", row: 2 },
      { year: 1891, label: "Redon's color explosion begins", type: "art", row: 4 },
      { year: 1892, label: "Moreau becomes professor — teaches Matisse", type: "art", row: 3 },
      { year: 1893, label: "Hôtel Tassel (Horta) — first Art Nouveau building", type: "art", major: true, row: 2 },
      { year: 1894, label: "Gismonda poster — Mucha becomes famous", type: "art", row: 3 },
      { year: 1897, label: "Vienna Secession founded", type: "politics", major: true, row: 1 },
      { year: 1900, label: "Paris World's Fair — Art Nouveau peak", type: "politics", major: true, row: 2 },
      { year: 1900, label: "Freud — The Interpretation of Dreams", type: "politics", row: 1 },
      { year: 1902, label: "Beethoven Frieze (Klimt)", type: "art", major: true, row: 3 },
      { year: 1904, label: "Casa Batlló (Gaudí)", type: "art", row: 4 },
      { year: 1907, label: "Portrait of Adele Bloch-Bauer I", type: "art", major: true, row: 3 },
      { year: 1908, label: "The Kiss (Klimt)", type: "art", major: true, row: 2 },
      { year: 1908, label: "\"Ornament and Crime\" — Loos", type: "politics", row: 1 },
    ]}
  />
);
