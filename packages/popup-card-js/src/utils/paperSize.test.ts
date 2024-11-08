import { describe, expect, it } from "vitest";
import { parsePaperSize } from "./paperSize.ts";

describe("paperSize", () => {
  it("computes A4 size", () => {
    expect(parsePaperSize("A4")).toEqual({ width: 210, height: 297 });
  });

  it("treats name case insensitivee", () => {
    expect(parsePaperSize("a4")).toEqual({ width: 210, height: 297 });
  });
});
