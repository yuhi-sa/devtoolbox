export interface Specificity {
  a: number; // ID selectors
  b: number; // class selectors, attribute selectors, pseudo-classes
  c: number; // type selectors, pseudo-elements
}

export interface SelectorResult {
  selector: string;
  specificity: Specificity;
  score: number;
}

export function calculateSpecificity(selector: string): Specificity {
  let a = 0;
  let b = 0;
  let c = 0;

  // Remove :not() wrapper but keep its content
  let cleaned = selector.replace(/:not\(([^)]*)\)/g, " $1 ");

  // Remove :is() and :where() - :where() has 0 specificity, :is() takes highest argument
  cleaned = cleaned.replace(/:where\([^)]*\)/g, "");
  cleaned = cleaned.replace(/:is\(([^)]*)\)/g, " $1 ");

  // Remove strings and anything inside brackets for attribute selectors count
  const attrMatches = cleaned.match(/\[[^\]]*\]/g);
  if (attrMatches) {
    b += attrMatches.length;
    cleaned = cleaned.replace(/\[[^\]]*\]/g, "");
  }

  // Count ID selectors (#id)
  const idMatches = cleaned.match(/#[a-zA-Z_-][\w-]*/g);
  if (idMatches) {
    a += idMatches.length;
    cleaned = cleaned.replace(/#[a-zA-Z_-][\w-]*/g, "");
  }

  // Count pseudo-elements (::before, ::after, etc.)
  const pseudoElementMatches = cleaned.match(/::[a-zA-Z-]+/g);
  if (pseudoElementMatches) {
    c += pseudoElementMatches.length;
    cleaned = cleaned.replace(/::[a-zA-Z-]+/g, "");
  }

  // Count pseudo-classes (:hover, :focus, etc.)
  const pseudoClassMatches = cleaned.match(/:[a-zA-Z-]+/g);
  if (pseudoClassMatches) {
    b += pseudoClassMatches.length;
    cleaned = cleaned.replace(/:[a-zA-Z-]+/g, "");
  }

  // Count class selectors (.class)
  const classMatches = cleaned.match(/\.[a-zA-Z_-][\w-]*/g);
  if (classMatches) {
    b += classMatches.length;
    cleaned = cleaned.replace(/\.[a-zA-Z_-][\w-]*/g, "");
  }

  // Count type selectors (element names), excluding * and combinators
  const typeMatches = cleaned.match(/(?:^|[\s+>~])([a-zA-Z][\w-]*)/g);
  if (typeMatches) {
    c += typeMatches.length;
  }

  return { a, b, c };
}

export function specificityScore(s: Specificity): number {
  return s.a * 10000 + s.b * 100 + s.c;
}

export function formatSpecificity(s: Specificity): string {
  return `(${s.a}, ${s.b}, ${s.c})`;
}

export function compareSelectors(selectors: string[]): SelectorResult[] {
  return selectors
    .filter((s) => s.trim())
    .map((selector) => {
      const specificity = calculateSpecificity(selector.trim());
      return {
        selector: selector.trim(),
        specificity,
        score: specificityScore(specificity),
      };
    })
    .sort((x, y) => y.score - x.score);
}
