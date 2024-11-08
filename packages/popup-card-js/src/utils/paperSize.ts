interface PaperSize {
  width: number;
  height: number;
}

const fixedSizes: Record<string, PaperSize> = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
  a2: { width: 420, height: 594 },
  a1: { width: 594, height: 841 },
  a0: { width: 841, height: 1189 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
  tabloid: { width: 279, height: 432 },
  ledger: { width: 432, height: 279 },
  executive: { width: 190.5, height: 254 },
};

export function parsePaperSize(paperSize: string): PaperSize {
  if (fixedSizes[paperSize.toLowerCase()] != null) {
    return fixedSizes[paperSize.toLowerCase()];
  }
  throw new Error("Unsupported paper size " + paperSize);
}
