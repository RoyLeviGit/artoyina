import { DateCard } from "../shared/DateCard";
import { palette } from "../shared/palette";

export const ImpressionismDates = () => (
  <DateCard
    title="IMPRESSIONISM — KEY DATES"
    events={[
      { date: "1863", label: "Salon des Refusés — Manet's Olympia and Luncheon cause scandal", color: palette.maroon },
      { date: "April 15, 1874", label: "First Impressionist exhibition — Boulevard des Capucines, Paris", color: palette.amber },
      { date: "1879", label: "Camille Monet dies, age 32 — Monet paints her on her deathbed", color: palette.maroon },
      { date: "1883", label: "Monet moves to Giverny — begins the garden and the Water Lilies", color: palette.amber },
      { date: "1927", label: "Monet dies at 86 — Water Lilies installed at L'Orangerie, Paris", color: palette.peach },
    ]}
  />
);
