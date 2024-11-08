export async function manualTest(div: HTMLDivElement) {
  div.innerHTML = "<div>Hello</div>";
  return () => {
    console.log("cleanup");
  };
}
