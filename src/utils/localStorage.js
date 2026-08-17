export function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);
    if (Array.isArray(fallback))
      return Array.isArray(parsed) ? parsed : fallback;
    if (fallback && typeof fallback === "object") {
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : fallback;
    }
    if (fallback !== null && typeof parsed !== typeof fallback) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not save "${key}" to browser storage.`, error);
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Could not remove "${key}" from browser storage.`, error);
    return false;
  }
}
