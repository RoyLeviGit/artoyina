import { QuoteCard } from "../shared/QuoteCard";
import { palette } from "../shared/palette";

// Inscribed on the Secession Building
export const QuoteSecessionMotto = () => (
  <QuoteCard
    quote="To every age its art, to every art its freedom."
    attribution="Vienna Secession motto — inscribed on the Secession Building, 1897"
    color={palette.amber}
  />
);

export const QuoteKlimtFreedom = () => (
  <QuoteCard
    quote="Enough of censorship. I want to get free."
    attribution="Gustav Klimt — after the University of Vienna paintings scandal"
    color={palette.peach}
  />
);

export const QuoteLoosOrnament = () => (
  <QuoteCard
    quote="The evolution of culture is synonymous with the removal of ornament from objects of daily use."
    attribution="Adolf Loos, \"Ornament and Crime,\" 1908"
    color={palette.maroon}
  />
);

export const QuoteSullivanForm = () => (
  <QuoteCard
    quote="Form ever follows function."
    attribution="Louis Sullivan, \"The Tall Office Building Artistically Considered,\" 1896"
    color={palette.peach}
  />
);
