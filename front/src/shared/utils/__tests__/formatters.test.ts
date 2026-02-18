import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatPhone, formatDuration } from "../formatters";

describe("formatCurrency", () => {
  it("should format number to BRL currency", () => {
    expect(formatCurrency(100)).toBe("R$ 100,00");
    expect(formatCurrency(1234.56)).toBe("R$ 1.234,56");
  });

  it("should handle null and undefined", () => {
    expect(formatCurrency(null)).toBe("R$ 0,00");
    expect(formatCurrency(undefined)).toBe("R$ 0,00");
  });
});

describe("formatDate", () => {
  it("should format ISO date to BR format", () => {
    const date = "2026-02-18T10:00:00Z";
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("should return dash for null/undefined", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
  });
});

describe("formatPhone", () => {
  it("should format 11-digit phone number", () => {
    expect(formatPhone("11987654321")).toBe("(11) 98765-4321");
  });

  it("should format 10-digit phone number", () => {
    expect(formatPhone("1134567890")).toBe("(11) 3456-7890");
  });

  it("should handle null and empty string", () => {
    expect(formatPhone(null)).toBe("");
    expect(formatPhone("")).toBe("");
  });
});

describe("formatDuration", () => {
  it("should format minutes to hours and minutes", () => {
    expect(formatDuration(90)).toBe("1h 30min");
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(30)).toBe("30min");
  });

  it("should handle zero and null", () => {
    expect(formatDuration(0)).toBe("0 min");
    expect(formatDuration(null)).toBe("0 min");
  });
});
