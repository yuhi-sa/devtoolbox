export interface QrOptions {
  text: string;
  size: number;
}

export function validateQrInput(text: string): string | null {
  if (!text.trim()) {
    return "Please enter text or URL to generate QR code.";
  }
  if (text.length > 2000) {
    return "Input text is too long. Maximum 2000 characters.";
  }
  return null;
}

export function generateQrUrl(options: QrOptions): string {
  const { text, size } = options;
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
}
