import { QuoteCard } from "../shared/QuoteCard";
import { palette } from "../shared/palette";

// Cold open letter — the longest quote, given extra duration in Root.tsx
export const QuoteVanGoghNonentity = () => (
  <QuoteCard
    quote="What am I in the eyes of most people — a nonentity, an eccentric, or an unpleasant person — somebody who has no position in society and will never have one... All right, then — even if that were absolutely true, then I should one day like to show by my work what such an eccentric, such a nobody, has in his heart."
    attribution="Vincent van Gogh, Letter 249, to Theo"
    color={palette.amber}
  />
);

export const QuoteVanGoghColor = () => (
  <QuoteCard
    quote="Instead of trying to reproduce exactly what I see before me, I make more arbitrary use of color to express myself more forcefully."
    attribution="Vincent van Gogh, Letter 663, from Arles"
    color={palette.amber}
  />
);

export const QuoteVanGoghRisking = () => (
  <QuoteCard
    quote="Well, my own work, I am risking my life for it and my reason has half foundered because of it — that's all right."
    attribution="Vincent van Gogh — found in his pocket after his death, unsent"
    color={palette.maroon}
  />
);

export const QuoteCezanneCylinder = () => (
  <QuoteCard
    quote="Treat nature by the cylinder, the sphere, the cone, everything in proper perspective so that each side of an object or a plane is directed towards a central point."
    attribution="Paul Cézanne, letter to Émile Bernard, 1904"
    color={palette.peach}
  />
);

export const QuotePicassoCezanne = () => (
  <QuoteCard
    quote="Cézanne was the father of us all."
    attribution="Pablo Picasso"
    color={palette.peach}
  />
);
