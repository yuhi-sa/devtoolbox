export type TransformFn = (input: string) => string;

export interface PipelineStepDef {
  id: string;
  name: string;
  transform: TransformFn;
}

export const availableTransforms: PipelineStepDef[] = [
  {
    id: "base64-encode",
    name: "Base64 Encode",
    transform: (input: string) =>
      btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      ),
  },
  {
    id: "base64-decode",
    name: "Base64 Decode",
    transform: (input: string) =>
      decodeURIComponent(
        atob(input)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      ),
  },
  {
    id: "url-encode",
    name: "URL Encode",
    transform: (input: string) => encodeURIComponent(input),
  },
  {
    id: "url-decode",
    name: "URL Decode",
    transform: (input: string) => decodeURIComponent(input),
  },
  {
    id: "json-format",
    name: "JSON Format",
    transform: (input: string) => JSON.stringify(JSON.parse(input), null, 2),
  },
  {
    id: "json-minify",
    name: "JSON Minify",
    transform: (input: string) => JSON.stringify(JSON.parse(input)),
  },
  {
    id: "uppercase",
    name: "Uppercase",
    transform: (input: string) => input.toUpperCase(),
  },
  {
    id: "lowercase",
    name: "Lowercase",
    transform: (input: string) => input.toLowerCase(),
  },
  {
    id: "trim",
    name: "Trim Whitespace",
    transform: (input: string) => input.trim(),
  },
  {
    id: "reverse",
    name: "Reverse",
    transform: (input: string) => input.split("").reverse().join(""),
  },
  {
    id: "line-sort",
    name: "Sort Lines",
    transform: (input: string) => input.split("\n").sort().join("\n"),
  },
  {
    id: "line-dedupe",
    name: "Remove Duplicate Lines",
    transform: (input: string) =>
      [...new Set(input.split("\n"))].join("\n"),
  },
];

export function runPipeline(
  input: string,
  steps: string[]
): { output: string; intermediates: string[]; error?: string } {
  const intermediates: string[] = [];
  let current = input;

  for (const stepId of steps) {
    const step = availableTransforms.find((t) => t.id === stepId);
    if (!step) {
      return {
        output: current,
        intermediates,
        error: `Unknown transform: ${stepId}`,
      };
    }
    try {
      current = step.transform(current);
      intermediates.push(current);
    } catch (e) {
      return {
        output: current,
        intermediates,
        error: `Error in "${step.name}": ${(e as Error).message}`,
      };
    }
  }

  return { output: current, intermediates };
}
