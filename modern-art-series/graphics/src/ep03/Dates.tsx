import { DateCard } from "../shared/DateCard";
import { palette } from "../shared/palette";

export const RealismDates = () => (
  <DateCard
    title="REALISM — KEY DATES"
    events={[
      { date: "1848", label: "Revolutions sweep Europe — French monarchy falls again", color: palette.maroon },
      { date: "1850", label: "A Burial at Ornans shown at the Salon — scandal", color: palette.amber },
      { date: "1855", label: "Pavilion of Realism — the first independent artist exhibition", color: palette.amber },
      { date: "1871", label: "Paris Commune — Vendôme Column falls — Courbet arrested", color: palette.maroon },
    ]}
  />
);
