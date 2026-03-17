export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignItems = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface FlexboxOptions {
  direction: FlexDirection;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  flexWrap: FlexWrap;
  gap: number;
}

export const defaultFlexboxOptions: FlexboxOptions = {
  direction: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flexWrap: "nowrap",
  gap: 8,
};

export const FLEX_DIRECTIONS: FlexDirection[] = ["row", "row-reverse", "column", "column-reverse"];
export const JUSTIFY_CONTENTS: JustifyContent[] = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
];
export const ALIGN_ITEMS_OPTIONS: AlignItems[] = [
  "flex-start",
  "flex-end",
  "center",
  "stretch",
  "baseline",
];
export const FLEX_WRAPS: FlexWrap[] = ["nowrap", "wrap", "wrap-reverse"];

export function generateFlexboxCSS(options: FlexboxOptions): string {
  const lines: string[] = ["display: flex;"];

  if (options.direction !== "row") {
    lines.push(`flex-direction: ${options.direction};`);
  }

  if (options.justifyContent !== "flex-start") {
    lines.push(`justify-content: ${options.justifyContent};`);
  }

  if (options.alignItems !== "stretch") {
    lines.push(`align-items: ${options.alignItems};`);
  }

  if (options.flexWrap !== "nowrap") {
    lines.push(`flex-wrap: ${options.flexWrap};`);
  }

  if (options.gap > 0) {
    lines.push(`gap: ${options.gap}px;`);
  }

  return lines.join("\n");
}

export function generateFullFlexboxCSS(options: FlexboxOptions): string {
  const lines: string[] = [
    "display: flex;",
    `flex-direction: ${options.direction};`,
    `justify-content: ${options.justifyContent};`,
    `align-items: ${options.alignItems};`,
    `flex-wrap: ${options.flexWrap};`,
    `gap: ${options.gap}px;`,
  ];
  return lines.join("\n");
}
