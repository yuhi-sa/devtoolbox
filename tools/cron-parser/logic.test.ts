import { describe, it, expect } from "vitest";
import { parseCron, describeCron, getNextExecutions } from "./logic";

describe("cron-parser", () => {
  it("parses a valid 5-field cron expression", () => {
    const fields = parseCron("0 0 * * *");
    expect(fields).toEqual({
      minute: "0",
      hour: "0",
      dom: "*",
      month: "*",
      dow: "*",
    });
  });

  it("throws on invalid cron expression", () => {
    expect(() => parseCron("* *")).toThrow();
    expect(() => parseCron("* * * * * *")).toThrow();
  });

  it("describes every minute", () => {
    const desc = describeCron("* * * * *");
    expect(desc).toContain("every minute");
  });

  it("describes daily at midnight", () => {
    const desc = describeCron("0 0 * * *");
    expect(desc).toContain("minute 0");
    expect(desc).toContain("hour 0");
  });

  it("describes weekly on Sunday", () => {
    const desc = describeCron("0 0 * * 0");
    expect(desc).toContain("Sunday");
  });

  it("calculates next executions for every minute", () => {
    const from = new Date("2024-01-01T00:00:00");
    const next = getNextExecutions("* * * * *", from, 5);
    expect(next).toHaveLength(5);
    expect(next[0].getMinutes()).toBe(1);
    expect(next[1].getMinutes()).toBe(2);
  });

  it("calculates next executions for hourly", () => {
    const from = new Date("2024-01-01T00:00:00");
    const next = getNextExecutions("0 * * * *", from, 3);
    expect(next).toHaveLength(3);
    expect(next[0].getHours()).toBe(1);
    expect(next[0].getMinutes()).toBe(0);
  });
});
