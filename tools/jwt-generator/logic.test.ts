import { describe, it, expect } from "vitest";
import {
  encodeHeader,
  encodePayload,
  buildUnsignedToken,
  decodeJwtParts,
  getDefaultHeader,
  getDefaultPayload,
} from "./logic";

describe("jwt-generator", () => {
  it("encodes header to base64url", () => {
    const header = { alg: "HS256", typ: "JWT" };
    const encoded = encodeHeader(header);
    expect(encoded).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
  });

  it("encodes payload to base64url", () => {
    const payload = { sub: "1234567890", name: "John Doe", iat: 1516239022 };
    const encoded = encodePayload(payload);
    expect(encoded).toBe(
      "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"
    );
  });

  it("builds unsigned token with header and payload", () => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = { sub: "test" };
    const token = buildUnsignedToken(header, payload);
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
  });

  it("decodes JWT parts correctly", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const result = decodeJwtParts(token);
    expect(result).not.toBeNull();
    expect(result!.header).toContain("HS256");
    expect(result!.payload).toContain("John Doe");
    expect(result!.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  });

  it("returns null for invalid token format", () => {
    expect(decodeJwtParts("not-a-jwt")).toBeNull();
    expect(decodeJwtParts("only.two")).toBeNull();
  });

  it("provides default header and payload", () => {
    const header = getDefaultHeader() as Record<string, string>;
    expect(header.alg).toBe("HS256");
    expect(header.typ).toBe("JWT");

    const payload = getDefaultPayload() as Record<string, unknown>;
    expect(payload.sub).toBeDefined();
    expect(payload.iat).toBeDefined();
  });
});
