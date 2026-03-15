import { describe, it, expect } from "vitest";
import { decodeJwt, checkExpiration } from "./logic";

// A real JWT token (HS256, payload: {"sub":"1234567890","name":"John Doe","iat":1516239022})
const TEST_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("jwt-decoder", () => {
  it("decodes header correctly", () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.header).toEqual({ alg: "HS256", typ: "JWT" });
  });

  it("decodes payload correctly", () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.payload).toEqual({
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022,
    });
  });

  it("returns signature", () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  });

  it("throws on invalid JWT format", () => {
    expect(() => decodeJwt("not.a.valid.jwt.token")).toThrow();
    expect(() => decodeJwt("onlyonepart")).toThrow();
  });

  it("detects expired token", () => {
    const result = checkExpiration({ exp: 1000000000 });
    expect(result.hasExp).toBe(true);
    expect(result.expired).toBe(true);
  });

  it("detects missing exp claim", () => {
    const result = checkExpiration({ sub: "123" });
    expect(result.hasExp).toBe(false);
  });
});
