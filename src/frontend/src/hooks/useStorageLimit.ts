import { useCallback, useEffect, useState } from "react";

const TOTAL_BYTES = 5 * 1024 * 1024; // 5MB estimated max

function estimateUsedBytes(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) ?? "";
      // UTF-16 encoding: each char is 2 bytes
      total += (key.length + value.length) * 2;
    }
  }
  return total;
}

export function useStorageLimit() {
  const [usedBytes, setUsedBytes] = useState(() => estimateUsedBytes());
  const [isAtLimit, setIsAtLimit] = useState(false);

  // Refresh usage after any storage change
  useEffect(() => {
    const refresh = () => setUsedBytes(estimateUsedBytes());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const totalBytes = TOTAL_BYTES;
  const usedPercent = Math.min(100, Math.round((usedBytes / totalBytes) * 100));
  const isNearLimit = usedPercent > 80;
  const isAtLimitComputed = usedPercent > 95;

  const safeSetItem = useCallback((key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      // Refresh usage after successful write
      setUsedBytes(estimateUsedBytes());
      return true;
    } catch (err) {
      if (
        err instanceof DOMException &&
        (err.name === "QuotaExceededError" ||
          err.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        setIsAtLimit(true);
        setUsedBytes(estimateUsedBytes());
        return false;
      }
      throw err;
    }
  }, []);

  return {
    usedBytes,
    totalBytes,
    usedPercent,
    isNearLimit: isNearLimit || isAtLimit,
    isAtLimit: isAtLimitComputed || isAtLimit,
    safeSetItem,
  };
}
