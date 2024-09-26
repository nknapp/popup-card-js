import { describe, expect, it } from "vitest";
import { cutChain } from "./cut-chain.ts";

describe("cut-chain", () => {
  it("no cuts", () => {
    expect(cutChain(["a", "b", "c", "d", "e", "f"], [])).toEqual([
      ["a", "b", "c", "d", "e", "f"],
    ]);
  });
  it("returns two (circular) chains that result by cutting at given points", () => {
    expect(cutChain(["a", "b", "c", "d", "e", "f"], [["b", "d"]])).toEqual([
      ["a", "b", "d", "e", "f"],
      ["b", "c", "d"],
    ]);
  });

  it("order of cut points does not matter", () => {
    expect(cutChain(["a", "b", "c", "d", "e", "f"], [["d", "b"]])).toEqual([
      ["a", "b", "d", "e", "f"],
      ["b", "c", "d"],
    ]);
  });

  /**
   *  a b c
   *   /|
   *  f e d
   */
  it("cuts multiple segments", () => {
    expect(
      cutChain(
        ["a", "b", "c", "d", "e", "f"],
        [
          ["b", "f"],
          ["b", "e"],
        ],
      ),
    ).toEqual([
      ["a", "b", "f"],
      ["b", "e", "f"],
      ["b", "c", "d", "e"],
    ]);
  });

  /**
   *  a b c
   *    |/
   *  f e d
   */
  it("order of cuts does not matter (same end point)", () => {
    expect(
      cutChain(
        ["a", "b", "c", "d", "e", "f"],
        [
          ["c", "e"],
          ["b", "e"],
        ],
      ),
    ).toEqual([
      ["a", "b", "e", "f"],
      ["b", "c", "e"],
      ["c", "d", "e"],
    ]);
  });

  /**
   *  a b c
   *   /|
   *  f e d
   */
  it("order of cuts does not matter (same starting point)", () => {
    expect(
      cutChain(
        ["a", "b", "c", "d", "e", "f"],
        [
          ["b", "e"],
          ["b", "f"],
        ],
      ),
    ).toEqual([
      ["a", "b", "f"],
      ["b", "e", "f"],
      ["b", "c", "d", "e"],
    ]);
  });
});
