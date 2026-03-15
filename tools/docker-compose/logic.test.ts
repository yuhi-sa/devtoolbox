import { describe, it, expect } from "vitest";
import { parseDockerRun, toComposeYaml } from "./logic";

describe("docker-compose", () => {
  it("parses image name", () => {
    const result = parseDockerRun("docker run nginx:latest");
    expect(result.image).toBe("nginx:latest");
  });

  it("parses ports", () => {
    const result = parseDockerRun("docker run -p 8080:80 -p 443:443 nginx");
    expect(result.ports).toEqual(["8080:80", "443:443"]);
  });

  it("parses volumes", () => {
    const result = parseDockerRun("docker run -v /data:/app/data nginx");
    expect(result.volumes).toEqual(["/data:/app/data"]);
  });

  it("parses environment variables", () => {
    const result = parseDockerRun("docker run -e NODE_ENV=production nginx");
    expect(result.envVars).toEqual(["NODE_ENV=production"]);
  });

  it("parses name and detach flags", () => {
    const result = parseDockerRun("docker run -d --name myapp nginx");
    expect(result.name).toBe("myapp");
    expect(result.detach).toBe(true);
  });

  it("parses restart and network flags", () => {
    const result = parseDockerRun(
      "docker run --restart always --network mynet nginx"
    );
    expect(result.restart).toBe("always");
    expect(result.network).toBe("mynet");
  });

  it("generates valid compose YAML", () => {
    const parsed = parseDockerRun(
      "docker run -d --name web -p 8080:80 -e NODE_ENV=prod nginx:latest"
    );
    const yaml = toComposeYaml(parsed);
    expect(yaml).toContain("version: '3'");
    expect(yaml).toContain("web:");
    expect(yaml).toContain("image: nginx:latest");
    expect(yaml).toContain('"8080:80"');
    expect(yaml).toContain("NODE_ENV=prod");
  });
});
