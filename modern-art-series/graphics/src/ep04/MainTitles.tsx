import { Fragment } from "react";
import { AnimatedMainTitle } from "../shared/AnimatedMainTitle";

export const ep04MainTitles = [
  { id: "the-science", lines: ["THE SCIENCE"] },
  { id: "the-technology", lines: ["THE TECHNOLOGY"] },
  { id: "the-scandal", lines: ["THE SCANDAL"] },
  { id: "impressionism", lines: ["IMPRESSIONISM"] },
  { id: "the-exhibition", lines: ["THE EXHIBITION"] },
  { id: "monet-and-camille", lines: ["MONET AND CAMILLE"] },
  { id: "the-long-road-to-success", lines: ["THE LONG ROAD", "TO SUCCESS"] },
  { id: "monets-later-years", lines: ["MONET’S LATER YEARS"] },
  { id: "art-after-impressionism", lines: ["ART AFTER", "IMPRESSIONISM"] },
];

export const Ep04MainTitle: React.FC<{ lines: string[] }> = ({ lines }) => (
  <AnimatedMainTitle
    title={lines.map((line, index) => (
      <Fragment key={line}>
        {index > 0 && <br />}
        {line}
      </Fragment>
    ))}
  />
);
