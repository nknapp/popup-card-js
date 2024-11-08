import { ManualTest } from "./manual-testing/types.ts";
import { TypedRecord } from "./utils/TypedRecord.ts";

export const rawTests: Record<string, () => Promise<ManualTest>> =
  import.meta.glob<ManualTest>("./**/*.manual-test.ts", {
    import: "manualTest",
  });

export const tests = Object.fromEntries(
  TypedRecord.entries(rawTests).map(([name, module]) => {
    return [name, module];
  }),
);

export function testUrls() {
  return TypedRecord.keys(tests).map((name) => ({
    url: `?test=${encodeURIComponent(name)}`,
    name,
  }));
}
