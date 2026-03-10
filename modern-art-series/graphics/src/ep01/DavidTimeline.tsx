import { Timeline } from "../shared/Timeline";
import { palette } from "../shared/palette";

export const DavidTimeline = () => (
  <Timeline
    title="THE LIFE OF JACQUES-LOUIS DAVID"
    subtitle="1748 – 1825"
    startYear={1745}
    endYear={1830}
    eras={[
      { label: "ANCIEN RÉGIME", start: 1745, end: 1789, color: palette.amber },
      { label: "REVOLUTION", start: 1789, end: 1799, color: palette.peach },
      { label: "NAPOLEON", start: 1799, end: 1815, color: palette.amber },
      { label: "EXILE", start: 1815, end: 1830, color: palette.peach },
    ]}
    events={[
      { year: 1748, label: "Born in Paris", type: "art", row: 1 },
      { year: 1774, label: "Wins Prix de Rome", sublabel: "(4th attempt)", type: "art", row: 2 },
      { year: 1784, label: "Oath of the Horatii", type: "art", major: true, row: 3 },
      { year: 1789, label: "Bastille stormed", type: "politics", major: true, row: 2 },
      { year: 1793, label: "Death of Marat", type: "art", major: true, row: 4 },
      { year: 1797, label: "Imprisoned", type: "politics", row: 1 },
      { year: 1801, label: "Napoleon Crossing the Alps", type: "art", major: true, row: 2 },
      { year: 1807, label: "The Coronation", type: "art", row: 3 },
      { year: 1816, label: "Exiled", type: "politics", major: true, row: 1 },
      { year: 1825, label: "Dies in Brussels", sublabel: "age 77", type: "politics", major: true, row: 2 },
    ]}
  />
);
