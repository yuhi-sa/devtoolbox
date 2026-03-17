export function hexEncode(input: string): string {
  return Array.from(input)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

export function hexDecode(input: string): string {
  const hex = input.replace(/\s+/g, "");
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string: odd number of characters");
  }
  if (!/^[0-9a-fA-F]*$/.test(hex)) {
    throw new Error("Invalid hex string: contains non-hex characters");
  }
  const bytes: string[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(String.fromCharCode(parseInt(hex.substring(i, i + 2), 16)));
  }
  return bytes.join("");
}
