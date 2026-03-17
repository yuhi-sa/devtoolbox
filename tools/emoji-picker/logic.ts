export interface EmojiEntry {
  emoji: string;
  name: string;
  category: string;
  codePoint: string;
}

export const EMOJI_LIST: EmojiEntry[] = [
  // Smileys & Emotion
  { emoji: "\u{1F600}", name: "grinning face", category: "Smileys", codePoint: "U+1F600" },
  { emoji: "\u{1F601}", name: "beaming face", category: "Smileys", codePoint: "U+1F601" },
  { emoji: "\u{1F602}", name: "face with tears of joy", category: "Smileys", codePoint: "U+1F602" },
  { emoji: "\u{1F603}", name: "grinning face with big eyes", category: "Smileys", codePoint: "U+1F603" },
  { emoji: "\u{1F604}", name: "grinning squinting face", category: "Smileys", codePoint: "U+1F604" },
  { emoji: "\u{1F605}", name: "grinning face with sweat", category: "Smileys", codePoint: "U+1F605" },
  { emoji: "\u{1F606}", name: "squinting face", category: "Smileys", codePoint: "U+1F606" },
  { emoji: "\u{1F609}", name: "winking face", category: "Smileys", codePoint: "U+1F609" },
  { emoji: "\u{1F60A}", name: "smiling face with smiling eyes", category: "Smileys", codePoint: "U+1F60A" },
  { emoji: "\u{1F60D}", name: "smiling face with heart eyes", category: "Smileys", codePoint: "U+1F60D" },
  { emoji: "\u{1F618}", name: "face blowing a kiss", category: "Smileys", codePoint: "U+1F618" },
  { emoji: "\u{1F60E}", name: "smiling face with sunglasses", category: "Smileys", codePoint: "U+1F60E" },
  { emoji: "\u{1F60F}", name: "smirking face", category: "Smileys", codePoint: "U+1F60F" },
  { emoji: "\u{1F612}", name: "unamused face", category: "Smileys", codePoint: "U+1F612" },
  { emoji: "\u{1F614}", name: "pensive face", category: "Smileys", codePoint: "U+1F614" },
  { emoji: "\u{1F616}", name: "confounded face", category: "Smileys", codePoint: "U+1F616" },
  { emoji: "\u{1F61C}", name: "winking face with tongue", category: "Smileys", codePoint: "U+1F61C" },
  { emoji: "\u{1F61E}", name: "disappointed face", category: "Smileys", codePoint: "U+1F61E" },
  { emoji: "\u{1F620}", name: "angry face", category: "Smileys", codePoint: "U+1F620" },
  { emoji: "\u{1F621}", name: "pouting face", category: "Smileys", codePoint: "U+1F621" },
  { emoji: "\u{1F622}", name: "crying face", category: "Smileys", codePoint: "U+1F622" },
  { emoji: "\u{1F623}", name: "persevering face", category: "Smileys", codePoint: "U+1F623" },
  { emoji: "\u{1F624}", name: "face with steam from nose", category: "Smileys", codePoint: "U+1F624" },
  { emoji: "\u{1F625}", name: "sad but relieved face", category: "Smileys", codePoint: "U+1F625" },
  { emoji: "\u{1F628}", name: "fearful face", category: "Smileys", codePoint: "U+1F628" },
  { emoji: "\u{1F629}", name: "weary face", category: "Smileys", codePoint: "U+1F629" },
  { emoji: "\u{1F62D}", name: "loudly crying face", category: "Smileys", codePoint: "U+1F62D" },
  { emoji: "\u{1F631}", name: "face screaming in fear", category: "Smileys", codePoint: "U+1F631" },
  { emoji: "\u{1F633}", name: "flushed face", category: "Smileys", codePoint: "U+1F633" },
  { emoji: "\u{1F634}", name: "sleeping face", category: "Smileys", codePoint: "U+1F634" },
  { emoji: "\u{1F637}", name: "face with medical mask", category: "Smileys", codePoint: "U+1F637" },
  { emoji: "\u{1F914}", name: "thinking face", category: "Smileys", codePoint: "U+1F914" },
  { emoji: "\u{1F917}", name: "hugging face", category: "Smileys", codePoint: "U+1F917" },
  { emoji: "\u{1F92F}", name: "exploding head", category: "Smileys", codePoint: "U+1F92F" },
  { emoji: "\u{1F970}", name: "smiling face with hearts", category: "Smileys", codePoint: "U+1F970" },
  // Gestures & People
  { emoji: "\u{1F44D}", name: "thumbs up", category: "Gestures", codePoint: "U+1F44D" },
  { emoji: "\u{1F44E}", name: "thumbs down", category: "Gestures", codePoint: "U+1F44E" },
  { emoji: "\u{1F44F}", name: "clapping hands", category: "Gestures", codePoint: "U+1F44F" },
  { emoji: "\u{1F44B}", name: "waving hand", category: "Gestures", codePoint: "U+1F44B" },
  { emoji: "\u{1F44C}", name: "OK hand", category: "Gestures", codePoint: "U+1F44C" },
  { emoji: "\u{270C}\u{FE0F}", name: "victory hand", category: "Gestures", codePoint: "U+270C" },
  { emoji: "\u{1F91D}", name: "handshake", category: "Gestures", codePoint: "U+1F91D" },
  { emoji: "\u{1F64F}", name: "folded hands", category: "Gestures", codePoint: "U+1F64F" },
  { emoji: "\u{1F4AA}", name: "flexed biceps", category: "Gestures", codePoint: "U+1F4AA" },
  { emoji: "\u{1F918}", name: "sign of the horns", category: "Gestures", codePoint: "U+1F918" },
  { emoji: "\u{270D}\u{FE0F}", name: "writing hand", category: "Gestures", codePoint: "U+270D" },
  { emoji: "\u{1F91E}", name: "crossed fingers", category: "Gestures", codePoint: "U+1F91E" },
  { emoji: "\u{1F919}", name: "call me hand", category: "Gestures", codePoint: "U+1F919" },
  { emoji: "\u{1F448}", name: "backhand index pointing left", category: "Gestures", codePoint: "U+1F448" },
  { emoji: "\u{1F449}", name: "backhand index pointing right", category: "Gestures", codePoint: "U+1F449" },
  { emoji: "\u{1F446}", name: "backhand index pointing up", category: "Gestures", codePoint: "U+1F446" },
  { emoji: "\u{1F447}", name: "backhand index pointing down", category: "Gestures", codePoint: "U+1F447" },
  // Hearts & Symbols
  { emoji: "\u{2764}\u{FE0F}", name: "red heart", category: "Symbols", codePoint: "U+2764" },
  { emoji: "\u{1F49C}", name: "purple heart", category: "Symbols", codePoint: "U+1F49C" },
  { emoji: "\u{1F499}", name: "blue heart", category: "Symbols", codePoint: "U+1F499" },
  { emoji: "\u{1F49A}", name: "green heart", category: "Symbols", codePoint: "U+1F49A" },
  { emoji: "\u{1F49B}", name: "yellow heart", category: "Symbols", codePoint: "U+1F49B" },
  { emoji: "\u{1F494}", name: "broken heart", category: "Symbols", codePoint: "U+1F494" },
  { emoji: "\u{1F495}", name: "two hearts", category: "Symbols", codePoint: "U+1F495" },
  { emoji: "\u{1F525}", name: "fire", category: "Symbols", codePoint: "U+1F525" },
  { emoji: "\u{2B50}", name: "star", category: "Symbols", codePoint: "U+2B50" },
  { emoji: "\u{1F31F}", name: "glowing star", category: "Symbols", codePoint: "U+1F31F" },
  { emoji: "\u{26A1}", name: "high voltage", category: "Symbols", codePoint: "U+26A1" },
  { emoji: "\u{2705}", name: "check mark button", category: "Symbols", codePoint: "U+2705" },
  { emoji: "\u{274C}", name: "cross mark", category: "Symbols", codePoint: "U+274C" },
  { emoji: "\u{2757}", name: "exclamation mark", category: "Symbols", codePoint: "U+2757" },
  { emoji: "\u{2753}", name: "question mark", category: "Symbols", codePoint: "U+2753" },
  { emoji: "\u{1F4AF}", name: "hundred points", category: "Symbols", codePoint: "U+1F4AF" },
  { emoji: "\u{267B}\u{FE0F}", name: "recycling symbol", category: "Symbols", codePoint: "U+267B" },
  { emoji: "\u{1F6AB}", name: "prohibited", category: "Symbols", codePoint: "U+1F6AB" },
  // Animals & Nature
  { emoji: "\u{1F436}", name: "dog face", category: "Animals", codePoint: "U+1F436" },
  { emoji: "\u{1F431}", name: "cat face", category: "Animals", codePoint: "U+1F431" },
  { emoji: "\u{1F42D}", name: "mouse face", category: "Animals", codePoint: "U+1F42D" },
  { emoji: "\u{1F430}", name: "rabbit face", category: "Animals", codePoint: "U+1F430" },
  { emoji: "\u{1F43B}", name: "bear", category: "Animals", codePoint: "U+1F43B" },
  { emoji: "\u{1F427}", name: "penguin", category: "Animals", codePoint: "U+1F427" },
  { emoji: "\u{1F426}", name: "bird", category: "Animals", codePoint: "U+1F426" },
  { emoji: "\u{1F40D}", name: "snake", category: "Animals", codePoint: "U+1F40D" },
  { emoji: "\u{1F422}", name: "turtle", category: "Animals", codePoint: "U+1F422" },
  { emoji: "\u{1F41D}", name: "honeybee", category: "Animals", codePoint: "U+1F41D" },
  { emoji: "\u{1F98B}", name: "butterfly", category: "Animals", codePoint: "U+1F98B" },
  { emoji: "\u{1F33B}", name: "sunflower", category: "Animals", codePoint: "U+1F33B" },
  { emoji: "\u{1F339}", name: "rose", category: "Animals", codePoint: "U+1F339" },
  { emoji: "\u{1F340}", name: "four leaf clover", category: "Animals", codePoint: "U+1F340" },
  { emoji: "\u{1F332}", name: "evergreen tree", category: "Animals", codePoint: "U+1F332" },
  { emoji: "\u{1F335}", name: "cactus", category: "Animals", codePoint: "U+1F335" },
  // Food & Drink
  { emoji: "\u{1F34E}", name: "red apple", category: "Food", codePoint: "U+1F34E" },
  { emoji: "\u{1F34A}", name: "tangerine", category: "Food", codePoint: "U+1F34A" },
  { emoji: "\u{1F34B}", name: "lemon", category: "Food", codePoint: "U+1F34B" },
  { emoji: "\u{1F34C}", name: "banana", category: "Food", codePoint: "U+1F34C" },
  { emoji: "\u{1F34D}", name: "pineapple", category: "Food", codePoint: "U+1F34D" },
  { emoji: "\u{1F353}", name: "strawberry", category: "Food", codePoint: "U+1F353" },
  { emoji: "\u{1F355}", name: "pizza", category: "Food", codePoint: "U+1F355" },
  { emoji: "\u{1F354}", name: "hamburger", category: "Food", codePoint: "U+1F354" },
  { emoji: "\u{1F35F}", name: "french fries", category: "Food", codePoint: "U+1F35F" },
  { emoji: "\u{1F363}", name: "sushi", category: "Food", codePoint: "U+1F363" },
  { emoji: "\u{1F370}", name: "shortcake", category: "Food", codePoint: "U+1F370" },
  { emoji: "\u{2615}", name: "hot beverage", category: "Food", codePoint: "U+2615" },
  { emoji: "\u{1F37A}", name: "beer mug", category: "Food", codePoint: "U+1F37A" },
  { emoji: "\u{1F377}", name: "wine glass", category: "Food", codePoint: "U+1F377" },
  // Objects & Tools
  { emoji: "\u{1F4BB}", name: "laptop", category: "Objects", codePoint: "U+1F4BB" },
  { emoji: "\u{1F4F1}", name: "mobile phone", category: "Objects", codePoint: "U+1F4F1" },
  { emoji: "\u{1F4E7}", name: "email", category: "Objects", codePoint: "U+1F4E7" },
  { emoji: "\u{1F4DA}", name: "books", category: "Objects", codePoint: "U+1F4DA" },
  { emoji: "\u{1F4DD}", name: "memo", category: "Objects", codePoint: "U+1F4DD" },
  { emoji: "\u{1F4A1}", name: "light bulb", category: "Objects", codePoint: "U+1F4A1" },
  { emoji: "\u{1F527}", name: "wrench", category: "Objects", codePoint: "U+1F527" },
  { emoji: "\u{1F528}", name: "hammer", category: "Objects", codePoint: "U+1F528" },
  { emoji: "\u{1F512}", name: "locked", category: "Objects", codePoint: "U+1F512" },
  { emoji: "\u{1F513}", name: "unlocked", category: "Objects", codePoint: "U+1F513" },
  { emoji: "\u{1F4CA}", name: "bar chart", category: "Objects", codePoint: "U+1F4CA" },
  { emoji: "\u{1F4CB}", name: "clipboard", category: "Objects", codePoint: "U+1F4CB" },
  { emoji: "\u{1F4CE}", name: "paperclip", category: "Objects", codePoint: "U+1F4CE" },
  { emoji: "\u{1F4CC}", name: "pushpin", category: "Objects", codePoint: "U+1F4CC" },
  { emoji: "\u{1F50D}", name: "magnifying glass", category: "Objects", codePoint: "U+1F50D" },
  { emoji: "\u{1F3AF}", name: "bullseye", category: "Objects", codePoint: "U+1F3AF" },
  // Travel & Weather
  { emoji: "\u{2708}\u{FE0F}", name: "airplane", category: "Travel", codePoint: "U+2708" },
  { emoji: "\u{1F697}", name: "automobile", category: "Travel", codePoint: "U+1F697" },
  { emoji: "\u{1F680}", name: "rocket", category: "Travel", codePoint: "U+1F680" },
  { emoji: "\u{1F3E0}", name: "house", category: "Travel", codePoint: "U+1F3E0" },
  { emoji: "\u{1F3D4}\u{FE0F}", name: "snow-capped mountain", category: "Travel", codePoint: "U+1F3D4" },
  { emoji: "\u{1F30D}", name: "globe Europe-Africa", category: "Travel", codePoint: "U+1F30D" },
  { emoji: "\u{1F30E}", name: "globe Americas", category: "Travel", codePoint: "U+1F30E" },
  { emoji: "\u{1F30F}", name: "globe Asia-Australia", category: "Travel", codePoint: "U+1F30F" },
  { emoji: "\u{2600}\u{FE0F}", name: "sun", category: "Travel", codePoint: "U+2600" },
  { emoji: "\u{1F319}", name: "crescent moon", category: "Travel", codePoint: "U+1F319" },
  { emoji: "\u{2601}\u{FE0F}", name: "cloud", category: "Travel", codePoint: "U+2601" },
  { emoji: "\u{1F308}", name: "rainbow", category: "Travel", codePoint: "U+1F308" },
  { emoji: "\u{2744}\u{FE0F}", name: "snowflake", category: "Travel", codePoint: "U+2744" },
  // Activities
  { emoji: "\u{26BD}", name: "soccer ball", category: "Activities", codePoint: "U+26BD" },
  { emoji: "\u{1F3C0}", name: "basketball", category: "Activities", codePoint: "U+1F3C0" },
  { emoji: "\u{1F3C8}", name: "american football", category: "Activities", codePoint: "U+1F3C8" },
  { emoji: "\u{26BE}", name: "baseball", category: "Activities", codePoint: "U+26BE" },
  { emoji: "\u{1F3BE}", name: "tennis", category: "Activities", codePoint: "U+1F3BE" },
  { emoji: "\u{1F3B5}", name: "musical note", category: "Activities", codePoint: "U+1F3B5" },
  { emoji: "\u{1F3B6}", name: "musical notes", category: "Activities", codePoint: "U+1F3B6" },
  { emoji: "\u{1F3A8}", name: "artist palette", category: "Activities", codePoint: "U+1F3A8" },
  { emoji: "\u{1F3AE}", name: "video game", category: "Activities", codePoint: "U+1F3AE" },
  { emoji: "\u{1F3B2}", name: "game die", category: "Activities", codePoint: "U+1F3B2" },
  { emoji: "\u{1F3C6}", name: "trophy", category: "Activities", codePoint: "U+1F3C6" },
  { emoji: "\u{1F3C5}", name: "sports medal", category: "Activities", codePoint: "U+1F3C5" },
  { emoji: "\u{1F3AD}", name: "performing arts", category: "Activities", codePoint: "U+1F3AD" },
  // Flags & Misc
  { emoji: "\u{1F6A9}", name: "triangular flag", category: "Flags", codePoint: "U+1F6A9" },
  { emoji: "\u{1F3F3}\u{FE0F}", name: "white flag", category: "Flags", codePoint: "U+1F3F3" },
  { emoji: "\u{1F3F4}", name: "black flag", category: "Flags", codePoint: "U+1F3F4" },
  { emoji: "\u{1F3C1}", name: "chequered flag", category: "Flags", codePoint: "U+1F3C1" },
];

export function getCategories(): string[] {
  return [...new Set(EMOJI_LIST.map((e) => e.category))];
}

export function searchEmojis(query: string, category?: string): EmojiEntry[] {
  let results = EMOJI_LIST;

  if (category && category !== "All") {
    results = results.filter((e) => e.category === category);
  }

  if (query.trim()) {
    const lower = query.toLowerCase();
    results = results.filter(
      (e) =>
        e.name.toLowerCase().includes(lower) ||
        e.emoji.includes(query) ||
        e.codePoint.toLowerCase().includes(lower)
    );
  }

  return results;
}
