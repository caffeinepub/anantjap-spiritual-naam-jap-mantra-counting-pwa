import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useStorageLimit } from "../hooks/useStorageLimit";

export default function StorageLimitBanner() {
  const { usedPercent, isNearLimit } = useStorageLimit();
  const [dismissed, setDismissed] = useState(false);

  if (!isNearLimit || dismissed) return null;

  const barColor =
    usedPercent > 95
      ? "bg-red-500"
      : usedPercent > 80
        ? "bg-amber-500"
        : "bg-yellow-400";

  return (
    <div
      data-ocid="storage.panel"
      role="alert"
      className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-700 px-4 py-3 flex flex-col gap-2 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 text-yellow-800 dark:text-yellow-300">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium leading-snug">
            Storage is <span className="font-bold">{usedPercent}% full</span>.
            Export your data in Settings to free up space.
          </p>
        </div>
        <button
          type="button"
          data-ocid="storage.close_button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss storage warning"
          className="shrink-0 rounded-md p-0.5 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-yellow-200 dark:bg-yellow-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${usedPercent}%` }}
        />
      </div>
    </div>
  );
}
