import { DateCard } from "../shared/DateCard";
import { palette } from "../shared/palette";

export const RevolutionDates = () => (
  <DateCard
    title="THE REVOLUTION"
    events={[
      { date: "July 14, 1789", label: "Storming of the Bastille", color: palette.amber },
      { date: "January 21, 1793", label: "Execution of Louis XVI", color: palette.amber },
      { date: "July 13, 1793", label: "Assassination of Marat", color: palette.maroon },
      { date: "July 27, 1794", label: "Fall of Robespierre", color: palette.maroon },
    ]}
  />
);
