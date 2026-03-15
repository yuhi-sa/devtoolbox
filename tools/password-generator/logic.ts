export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

export function generatePassword(options: PasswordOptions): string {
  let chars = "";
  if (options.uppercase) chars += UPPERCASE;
  if (options.lowercase) chars += LOWERCASE;
  if (options.numbers) chars += NUMBERS;
  if (options.symbols) chars += SYMBOLS;

  if (chars.length === 0) {
    chars = LOWERCASE + NUMBERS;
  }

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((n) => chars[n % chars.length])
    .join("");
}

export function calculateStrength(password: string): {
  score: number;
  label: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  return {
    score: Math.min(score, 5),
    label: labels[Math.min(score, 5)],
  };
}
