export function cutChain<T extends string>(
  nodes: T[],
  cuts: [from: T, to: T][],
): T[][] {
  const sortedCuts = normalizeCuts(cuts, nodes);

  const result: T[][] = [];
  let remainder: T[] = nodes;
  for (const cut of sortedCuts) {
    const { left, right } = singleCut(remainder, cut[0], cut[1]);
    result.push(left);
    remainder = right;
  }
  result.push(remainder);
  return result;
}

function singleCut<T extends string>(
  nodes: T[],
  from: T,
  to: T,
): { left: T[]; right: T[] } {
  const fromIndex = nodes.indexOf(from);
  const toIndex = nodes.indexOf(to);
  return {
    left: [...nodes.slice(0, fromIndex + 1), ...nodes.slice(toIndex)],
    right: nodes.slice(fromIndex, toIndex + 1),
  };
}

function normalizeCuts<T>(cuts: Array<[T, T]>, nodes: Array<T>) {
  return cuts
    .map((cut) => cut.toSorted((a, b) => nodes.indexOf(a) - nodes.indexOf(b)))
    .toSorted((a, b) => {
      return (
        nodes.indexOf(a[0]) - nodes.indexOf(b[0]) ||
        nodes.indexOf(b[1]) - nodes.indexOf(a[1])
      );
    });
}
