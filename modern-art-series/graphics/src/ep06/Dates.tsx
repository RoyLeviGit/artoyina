import { DateCard } from "../shared/DateCard";
import { palette } from "../shared/palette";

export const SymbolismDates = () => (
  <DateCard
    title="SYMBOLISM + ART NOUVEAU — KEY DATES"
    events={[
      { date: "1876", label: "Moreau — The Apparition at the Salon", color: palette.peach },
      { date: "1894", label: "Mucha designs Gismonda for Sarah Bernhardt — overnight celebrity", color: palette.amber },
      { date: "1897", label: "Vienna Secession founded — Klimt as president", color: palette.amber },
      { date: "1902", label: "Beethoven Frieze unveiled at the Secession, Vienna", color: palette.amber },
      { date: "1907–08", label: "The Kiss and Portrait of Adele Bloch-Bauer — the Golden Phase", color: palette.amber },
      { date: "1908", label: "Loos writes \"Ornament and Crime\" — the backlash begins", color: palette.maroon },
    ]}
  />
);
