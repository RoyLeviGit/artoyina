import { Timeline } from "../shared/Timeline";
import { palette } from "../shared/palette";

export const RomanticismTimeline = () => (
  <Timeline
    title="THE ROMANTIC MOVEMENT"
    subtitle="1815 – 1863"
    startYear={1812}
    endYear={1868}
    eras={[
      { label: "RESTORATION", start: 1815, end: 1830, color: palette.amber },
      { label: "JULY MONARCHY", start: 1830, end: 1848, color: palette.peach },
      { label: "SECOND REPUBLIC / SECOND EMPIRE", start: 1848, end: 1868, color: palette.amber },
    ]}
    events={[
      { year: 1816, label: "Méduse shipwreck", type: "politics", major: true, row: 1 },
      { year: 1818, label: "Géricault begins the Raft", type: "art", row: 3 },
      { year: 1819, label: "Raft of the Medusa", type: "art", major: true, row: 2 },
      { year: 1821, label: "Géricault in London", type: "art", row: 3 },
      { year: 1822, label: "Barque of Dante", sublabel: "Delacroix's Salon debut", type: "art", row: 4 },
      { year: 1824, label: "Massacre at Chios", type: "art", major: true, row: 3 },
      { year: 1824, label: "Géricault dies", sublabel: "age 32", type: "politics", row: 1 },
      { year: 1827, label: "Death of Sardanapalus", type: "art", major: true, row: 2 },
      { year: 1830, label: "July Revolution", type: "politics", major: true, row: 1 },
      { year: 1830, label: "Liberty Leading the People", type: "art", major: true, row: 4 },
      { year: 1832, label: "North Africa journey", type: "art", row: 3 },
      { year: 1834, label: "Women of Algiers", type: "art", major: true, row: 2 },
      { year: 1863, label: "Delacroix dies", sublabel: "age 65", type: "politics", major: true, row: 2 },
    ]}
  />
);
