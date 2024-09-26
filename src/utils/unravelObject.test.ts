import { describe, expect, it } from "vitest";
import {unravelObject} from "./unravelObject.ts";


describe("unravelObject", () => {
  it("splits an object into an array of values and a key-index mapping", () => {
    expect(unravelObject({ a: "1", b: "2" })).toEqual([
      ["1", "2"],
      { a: 0, b: 1 },
    ]);
  });
});
