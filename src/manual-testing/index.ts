import { CleanupFunction, ManualTest } from "./types.ts";

const tests: Record<string, () => Promise<ManualTest>> =
  import.meta.glob<ManualTest>("../**/*.manual-test.ts", {
    import: "manualTest",
  });

let cleanupFn: CleanupFunction | null = null;

export function listOfTests() {
  return `<ul class="py-4">
      ${Object.keys(tests)
        .map((moduleName) => {
          return `<li class="mb-2"><a data-test-link="true" href="?test=${encodeURIComponent(moduleName)}">${moduleName}</a></li>`;
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

  const testLink = document.querySelectorAll("[data-test-link]");
  for (const link of testLink) {
    link.addEventListener("click", (event) => {
      window.history.pushState("", "", link.getAttribute("href"));
      event.preventDefault();

      runCurrentTest();
    });
  }

  runCurrentTest();
}

export async function runCurrentTest() {
  const currentTest = new URLSearchParams(document.location.search).get("test");
  await runTest(currentTest);
}

export async function runTest(moduleName: string | null) {
  const errorContainer =
    document.querySelector<HTMLDivElement>("#error-container")!;
  const testContainer =
    document.querySelector<HTMLDivElement>("#test-container")!;

  if (cleanupFn) await cleanupFn();
  testContainer.innerHTML = "";
  if (moduleName == null) {
    return;
  }

  try {
    const moduleFn = tests[moduleName];
    if (moduleFn == null) {
      errorContainer.textContent = `Test not found "${moduleName}"`;
      return;
    }
    const testModule = await tests[moduleName]();
    cleanupFn = await testModule(testContainer);
    errorContainer.innerHTML = "";
  } catch (error) {
    document.querySelector("#error-container")!.textContent = (error as Error)
      .stack!.replaceAll(document.location.origin, "")
      .replace(/\?t=\d+/g, "");
  }
}
