import { QuoteCard } from "../shared/QuoteCard";
import { palette } from "../shared/palette";

export const QuoteBaudelaire = () => (
  <QuoteCard
    quote="Romanticism is precisely situated neither in choice of subjects nor in exact truth, but in a mode of feeling."
    attribution="Charles Baudelaire, 1846"
  />
);

export const QuoteDelacroixGreeks = () => (
  <QuoteCard
    quote="The Greeks and Romans are here at my door."
    attribution="Eugène Delacroix, Tangier, 1832"
    color={palette.peach}
  />
);

export const QuoteDelacroixPaint = () => (
  <QuoteCard
    quote="Since I have not fought for the glory of my country, at least I will paint for her."
    attribution="Eugène Delacroix, 1830"
    color={palette.maroon}
  />
);
