import { describe, it, expect } from "vitest";
import { tomlToJson, jsonToToml } from "./logic";

describe("toml-converter", () => {
  it("parses simple key-value pairs", () => {
    const toml = 'name = "test"\nvalue = 42';
    const result = JSON.parse(tomlToJson(toml));
    expect(result.name).toBe("test");
    expect(result.value).toBe(42);
  });

  it("parses booleans", () => {
    const toml = "enabled = true\ndisabled = false";
    const result = JSON.parse(tomlToJson(toml));
    expect(result.enabled).toBe(true);
    expect(result.disabled).toBe(false);
  });

  it("parses sections", () => {
    const toml = '[server]\nhost = "localhost"\nport = 8080';
    const result = JSON.parse(tomlToJson(toml));
    expect(result.server.host).toBe("localhost");
    expect(result.server.port).toBe(8080);
  });

  it("parses arrays", () => {
    const toml = "values = [1, 2, 3]";
    const result = JSON.parse(tomlToJson(toml));
    expect(result.values).toEqual([1, 2, 3]);
  });

  it("ignores comments", () => {
    const toml = '# this is a comment\nname = "test"';
    const result = JSON.parse(tomlToJson(toml));
    expect(result.name).toBe("test");
  });

  it("converts JSON to TOML", () => {
    const json = '{"name": "test", "value": 42}';
    const toml = jsonToToml(json);
    expect(toml).toContain('name = "test"');
    expect(toml).toContain("value = 42");
  });

  it("converts nested JSON to TOML with sections", () => {
    const json = '{"server": {"host": "localhost", "port": 8080}}';
    const toml = jsonToToml(json);
    expect(toml).toContain("[server]");
    expect(toml).toContain('host = "localhost"');
  });

  it("throws on invalid TOML", () => {
    expect(() => tomlToJson("invalid line without equals")).toThrow();
  });
});
