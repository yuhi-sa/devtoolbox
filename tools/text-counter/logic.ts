export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  bytes: number;
  uniqueWords: number;
  readingTimeSeconds: number;
}

export function countTextStats(input: string): TextStats {
  if (input.length === 0) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      bytes: 0,
      uniqueWords: 0,
      readingTimeSeconds: 0,
    };
  }

  const characters = input.length;
  const charactersNoSpaces = input.replace(/\s/g, "").length;

  const wordList = input
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const words = wordList.length;

  const sentences = (input.match(/[.!?]+(\s|$)/g) || []).length;

  const paragraphs = input
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  const lines = input.split("\n").length;

  const bytes = new TextEncoder().encode(input).length;

  const uniqueWords = new Set(wordList.map((w) => w.toLowerCase())).size;

  // Average reading speed: 200 words per minute
  const readingTimeSeconds = Math.ceil((words / 200) * 60);

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    bytes,
    uniqueWords,
    readingTimeSeconds,
  };
}

export function formatReadingTime(seconds: number): string {
  if (seconds === 0) return "0s";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) return `${secs}s`;
  if (secs === 0) return `${minutes}min`;
  return `${minutes}min ${secs}s`;
}
