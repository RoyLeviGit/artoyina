import { QuoteCard } from "../shared/QuoteCard";
import { palette } from "../shared/palette";

export const QuoteCourbetGoal = () => (
  <QuoteCard
    quote="To create living art — this is my goal."
    attribution="Gustave Courbet, Realist Manifesto, 1855"
  />
);

export const QuoteCourbetLiberty = () => (
  <QuoteCard
    quote="He belonged to no school, to no church, to no institution, to no academy, least of all to any régime except the régime of liberty."
    attribution="Gustave Courbet"
    color={palette.peach}
  />
);
