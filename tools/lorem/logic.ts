const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum",
];

const FIRST_SENTENCE = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export type GenerateMode = "paragraphs" | "sentences" | "words";

function getRandomWord(index: number): string {
  return LOREM_WORDS[index % LOREM_WORDS.length];
}

export function generateWords(count: number, startWithLorem: boolean = true): string {
  if (count <= 0) return "";

  const words: string[] = [];
  if (startWithLorem) {
    const loremStart = ["Lorem", "ipsum", "dolor", "sit", "amet"];
    const take = Math.min(count, loremStart.length);
    words.push(...loremStart.slice(0, take));
  }

  let idx = startWithLorem ? 5 : 0;
  while (words.length < count) {
    words.push(getRandomWord(idx));
    idx++;
  }

  return words.join(" ");
}

export function generateSentences(count: number, startWithLorem: boolean = true): string {
  if (count <= 0) return "";

  const sentences: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem) {
      sentences.push(FIRST_SENTENCE);
    } else {
      const wordCount = 8 + (i % 7);
      const words: string[] = [];
      for (let w = 0; w < wordCount; w++) {
        words.push(getRandomWord(w + i * 7));
      }
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      sentences.push(words.join(" ") + ".");
    }
  }

  return sentences.join(" ");
}

export function generateParagraphs(count: number, startWithLorem: boolean = true): string {
  if (count <= 0) return "";

  const paragraphs: string[] = [];

  for (let i = 0; i < count; i++) {
    const sentenceCount = 4 + (i % 3);
    const useLoremStart = i === 0 && startWithLorem;
    paragraphs.push(generateSentences(sentenceCount, useLoremStart));
  }

  return paragraphs.join("\n\n");
}

export function generateLorem(
  mode: GenerateMode,
  count: number,
  startWithLorem: boolean = true
): string {
  switch (mode) {
    case "paragraphs":
      return generateParagraphs(count, startWithLorem);
    case "sentences":
      return generateSentences(count, startWithLorem);
    case "words":
      return generateWords(count, startWithLorem);
  }
}
