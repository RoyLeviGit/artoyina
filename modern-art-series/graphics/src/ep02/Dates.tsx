import { DateCard } from "../shared/DateCard";
import { palette } from "../shared/palette";

export const RomanticismDates = () => (
  <DateCard
    title="THE ROMANTIC ERA — KEY DATES"
    events={[
      { date: "July 2, 1816", label: "The Méduse runs aground — 147 stranded on a raft", color: palette.maroon },
      { date: "July 27–29, 1830", label: "The July Revolution — three days of street fighting in Paris", color: palette.amber },
      { date: "January 1832", label: "Delacroix departs for North Africa", color: palette.peach },
    ]}
  />
);
