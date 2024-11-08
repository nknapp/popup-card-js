export type ManualTest = (div: HTMLDivElement) => Promise<CleanupFunction>;

export type CleanupFunction = () => void | Promise<void>;
