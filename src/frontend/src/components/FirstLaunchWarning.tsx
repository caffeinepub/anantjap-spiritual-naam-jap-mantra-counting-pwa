import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function FirstLaunchWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem("anantjap_seen_warning");
    if (!hasSeenWarning) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in fade-in slide-in-from-top-4">
      <Alert className="border-sacred bg-background shadow-lg">
        <AlertTriangle className="h-4 w-4 text-sacred" />
        <AlertDescription className="text-sm">
          ⚠️ All Jap data is stored locally on your device. If the app is
          deleted, data cannot be recovered.
        </AlertDescription>
      </Alert>
    </div>
  );
}
