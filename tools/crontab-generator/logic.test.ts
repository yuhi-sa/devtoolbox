import { describe, it, expect } from "vitest";
import {
  buildCronExpression,
  parseCronExpression,
  describeCron,
  getNextExecutions,
} from "./logic";

describe("crontab-generator", () => {
  it("builds a cron expression from parts", () => {
    const result = buildCronExpression({
      minute: "0",
      hour: "12",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    });
    expect(result).toBe("0 12 * * *");
  });

  it("parses a cron expression string", () => {
    const result = parseCronExpression("30 2 * * 1");
    expect(result).toEqual({
      minute: "30",
      hour: "2",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1",
    });
  });

  it("returns null for invalid cron expressions", () => {
    expect(parseCronExpression("invalid")).toBeNull();
    expect(parseCronExpression("1 2 3")).toBeNull();
  });

  it("generates human-readable description", () => {
    const description = describeCron({
      minute: "0",
      hour: "12",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    });
    expect(description).toContain("minute");
    expect(description).toContain("hour");
  });

  it("describes step values", () => {
    const description = describeCron({
      minute: "*/5",
      hour: "*",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    });
    expect(description).toContain("every 5 minute");
  });

  it("calculates next execution times", () => {
    const from = new Date(2025, 0, 1, 0, 0, 0); // Jan 1 2025 00:00
    const results = getNextExecutions(
      { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
      5,
      from
    );
    expect(results).toHaveLength(5);
    // All should be at minute 0
    results.forEach((d) => expect(d.getMinutes()).toBe(0));
    // First should be 1:00 (next hour on the hour)
    expect(results[0].getHours()).toBe(1);
  });

  it("handles every-minute cron", () => {
    const from = new Date(2025, 0, 1, 12, 0, 0);
    const results = getNextExecutions(
      { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
      5,
      from
    );
    expect(results).toHaveLength(5);
    expect(results[0].getMinutes()).toBe(1);
    expect(results[1].getMinutes()).toBe(2);
  });
});
