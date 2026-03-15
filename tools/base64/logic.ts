export function base64Encode(input: string): string {
  return btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

export function base64Decode(input: string): string {
  return decodeURIComponent(
    atob(input)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}
