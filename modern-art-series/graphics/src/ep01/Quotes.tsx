import { QuoteCard } from "../shared/QuoteCard";
import { palette } from "../shared/palette";

export const QuoteWinckelmann = () => (
  <QuoteCard
    quote="Noble simplicity and quiet grandeur"
    attribution="Johann Joachim Winckelmann, 1755"
  />
);

export const QuoteHemlock = () => (
  <QuoteCard
    quote="If you drink hemlock, I will drink it with you."
    attribution="David to Robespierre"
    color={palette.maroon}
  />
);

export const QuotePatriotism = () => (
  <QuoteCard
    quote="I was deceived by the mask of patriotism."
    attribution="David, 1795"
    color={palette.peach}
  />
);
