import { describe, it, expect } from "vitest";
import { calculateDateDifference, addDaysToDate } from "./logic";

describe("date-calculator", () => {
  it("calculates difference between same date", () => {
    const result = calculateDateDifference("2024-01-01", "2024-01-01");
    expect(result.totalDays).toBe(0);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it("calculates difference in days", () => {
    const result = calculateDateDifference("2024-01-01", "2024-01-11");
    expect(result.totalDays).toBe(10);
  });

  it("calculates difference in weeks", () => {
    const result = calculateDateDifference("2024-01-01", "2024-01-15");
    expect(result.totalWeeks).toBe(2);
  });

  it("calculates year/month/day breakdown", () => {
    const result = calculateDateDifference("2023-01-15", "2024-03-20");
    expect(result.years).toBe(1);
    expect(result.months).toBe(2);
    expect(result.days).toBe(5);
  });

  it("handles date order (earlier date second)", () => {
    const result = calculateDateDifference("2024-01-11", "2024-01-01");
    expect(result.totalDays).toBe(10);
  });

  it("throws on invalid date", () => {
    expect(() => calculateDateDifference("invalid", "2024-01-01")).toThrow(
      "Invalid date format"
    );
  });

  it("adds days to a date", () => {
    expect(addDaysToDate("2024-01-01", 10)).toBe("2024-01-11");
  });

  it("subtracts days from a date", () => {
    expect(addDaysToDate("2024-01-11", -10)).toBe("2024-01-01");
  });

  it("adds days across month boundary", () => {
    expect(addDaysToDate("2024-01-30", 5)).toBe("2024-02-04");
  });

  it("throws on invalid date for addDays", () => {
    expect(() => addDaysToDate("invalid", 1)).toThrow("Invalid date format");
  });
});
