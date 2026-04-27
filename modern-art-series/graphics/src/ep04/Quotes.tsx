import { QuoteCard } from "../shared/QuoteCard";
import { palette } from "../shared/palette";

export const QuoteMonetLandscape = () => (
  <QuoteCard
    quote="For me, a landscape does not exist in its own right, since its appearance changes at every moment."
    attribution="Claude Monet"
  />
);

export const QuoteCassattIndependence = () => (
  <QuoteCard
    quote="I accepted with joy. At last I could work with absolute independence without considering the opinion of a jury. I hated conventional art."
    attribution="Mary Cassatt"
    color={palette.peach}
  />
);

export const QuoteCassattAlone = () => (
  <QuoteCard
    quote="I am independent! I can live alone and I love to work."
    attribution="Mary Cassatt"
    color={palette.peach}
  />
);

// Attributed — on-screen text doc says frame as "reportedly said"
export const QuoteRenoirTubes = () => (
  <QuoteCard
    quote="Without tubes of paint, there would have been no Impressionism."
    attribution="Renoir (attr.)"
    color={palette.amber}
  />
);
