import { describe, expect, it } from "vitest";
import { formatAge, formatNumber, formatPercent } from "./format";

describe("format utilities", () => {
  it("formats numbers with group separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats percent values as rounded whole percentages", () => {
    expect(formatPercent(0.234)).toBe("23%");
    expect(formatPercent(0.996)).toBe("100%");
  });

  it("formats age values with yrs suffix", () => {
    expect(formatAge(42)).toBe("42 yrs");
  });
});
