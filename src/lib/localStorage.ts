export function loadState<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const serialized = window.localStorage.getItem(key);
    if (serialized === null) return undefined;
    return JSON.parse(serialized) as T;
  } catch {
    return undefined;
  }
}

export function saveState<T>(key: string, state: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // storage full, disabled, or unavailable (e.g. private browsing) — ignore
  }
}
