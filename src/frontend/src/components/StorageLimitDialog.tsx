import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStorageLimit } from "../hooks/useStorageLimit";

export default function StorageLimitDialog() {
  const { isAtLimit } = useStorageLimit();
  const [open, setOpen] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isAtLimit) return null;

  const handleExportData = () => {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("anantjap_")) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anantjap_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
    setOpen(false);
  };

  const handleDeleteAll = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("anantjap_")) keys.push(key);
    }
    for (const key of keys) localStorage.removeItem(key);
    toast.success("All data deleted");
    setOpen(false);
    window.location.reload();
  };

  // Two-step delete confirmation
  if (confirmDelete) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent data-ocid="storage.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Confirm Delete All Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently erase all your jap records, custom gods, and
              bhajans from this device. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="storage.cancel_button"
              onClick={() => setConfirmDelete(false)}
            >
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="storage.delete_button"
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent data-ocid="storage.dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Storage Full
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your device storage for AnantJap is full. Please export your data or
            delete some content to continue saving new jap counts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel data-ocid="storage.cancel_button">
            Dismiss
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="storage.secondary_button"
            onClick={() => setConfirmDelete(true)}
            className="bg-destructive text-destructive-foreground gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete All Data
          </AlertDialogAction>
          <AlertDialogAction
            data-ocid="storage.primary_button"
            onClick={handleExportData}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
