import { ManualTest } from "./types.ts";

const tests: Record<
  string,
  { (): Promise<(div: HTMLDivElement) => Promise<void>> }
> = import.meta.glob<ManualTest>("../**/*.manual-test.ts", {
  import: "manualTest",
});

export function listOfTests() {
  return `<ul class="py-4">
      ${Object.keys(tests)
        .map((moduleName) => {
          return `<li class="mb-2"><a href="?test=${encodeURIComponent(moduleName)}">${moduleName}</a></li>`;
        })
        .join("")}
    </ul>`;
}

export function page(appElement: HTMLDivElement) {
  appElement.innerHTML = `
        <div class="flex w-full p-8 gap-4 h-full">
            <div class="w-1/4">
                <h2>List of tests</h2>
                ${listOfTests()}
                <div id="error-container" class="border border-red-900 w-full min-h-20 whitespace-pre-wrap"></div>
            </div>
            <div id="test-container" class="border border-stone-500 flex-1 h-full"></div>
        <div>
    `;

  const currentTest = new URLSearchParams(document.location.search).get("test");
  if (currentTest != null) {
    runTest(currentTest)
      .then(() => (document.querySelector("#error-container")!.innerHTML = ""))
      .catch((error) => {
        document.querySelector("#error-container")!.textContent = error.stack
          .replaceAll(document.location.origin, "")
          .replace(/\?t=\d+/g, "");
      });
  }
}

export async function runTest(moduleName: string) {
  const textContainer =
    document.querySelector<HTMLDivElement>("#test-container")!;
  const moduleFn = tests[moduleName];
  if (moduleFn == null) {
    textContainer.textContent = `Test not found "${moduleName}"`;
    return;
  }
  const testModule = await tests[moduleName]();
  await testModule(textContainer);
}
