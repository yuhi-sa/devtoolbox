import { describe, it, expect } from "vitest";
import { generateNginxConfig } from "./logic";

describe("nginx-config", () => {
  it("generates basic server block", () => {
    const result = generateNginxConfig({
      serverName: "example.com",
      port: 80,
    });
    expect(result).toContain("server {");
    expect(result).toContain("listen 80;");
    expect(result).toContain("server_name example.com;");
  });

  it("includes SSL directives when enabled", () => {
    const result = generateNginxConfig({
      serverName: "example.com",
      port: 443,
      ssl: true,
    });
    expect(result).toContain("listen 443 ssl;");
    expect(result).toContain("ssl_certificate");
    expect(result).toContain("ssl_protocols");
  });

  it("includes gzip config when enabled", () => {
    const result = generateNginxConfig({
      serverName: "example.com",
      port: 80,
      gzip: true,
    });
    expect(result).toContain("gzip on;");
    expect(result).toContain("gzip_types");
  });

  it("includes reverse proxy directives", () => {
    const result = generateNginxConfig({
      serverName: "example.com",
      port: 80,
      reverseProxy: "http://localhost:3000",
    });
    expect(result).toContain("proxy_pass http://localhost:3000;");
    expect(result).toContain("proxy_set_header Host");
  });

  it("includes CORS headers when enabled", () => {
    const result = generateNginxConfig({
      serverName: "example.com",
      port: 80,
      cors: true,
    });
    expect(result).toContain("Access-Control-Allow-Origin");
    expect(result).toContain("Access-Control-Allow-Methods");
  });

  it("includes root and index when rootPath set", () => {
    const result = generateNginxConfig({
      serverName: "example.com",
      port: 80,
      rootPath: "/var/www/html",
    });
    expect(result).toContain("root /var/www/html;");
    expect(result).toContain("index index.html");
  });
});
