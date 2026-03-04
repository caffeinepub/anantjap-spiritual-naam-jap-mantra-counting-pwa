import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronUp, Hand, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDevotee } from "../contexts/DevoteeContext";
import { useLanguage } from "../contexts/LanguageContext";

interface JapCountPageProps {
  selectedGodId: string | null;
  onBack: () => void;
}

interface GodData {
  id: string;
  name: string;
  mantra: string;
  image: string;
}

/**
 * Returns a YYYY-MM-DD date string in the user's LOCAL timezone,
 * avoiding the UTC offset bug from toISOString().
 */
function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function JapCountPage({
  selectedGodId,
  onBack,
}: JapCountPageProps) {
  const { t } = useLanguage();
  const { currentDevotee } = useDevotee();
  const [japCount, setJapCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [japMethod, setJapMethod] = useState<"tap" | "swipe">("swipe");
  const [godData, setGodData] = useState<GodData | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [ripple, setRipple] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const savedMethod = localStorage.getItem("anantjap_jap_method");
    if (savedMethod) {
      setJapMethod(savedMethod as "tap" | "swipe");
    }
  }, []);

  useEffect(() => {
    if (selectedGodId) {
      const defaultGods: Record<string, GodData> = {
        ganesh: {
          id: "ganesh",
          name: t("ganesh"),
          mantra: t("ganesh_mantra"),
          image: "/assets/generated/ganesh-deity.dim_400x400.png",
        },
        vishnu: {
          id: "vishnu",
          name: t("vishnu"),
          mantra: t("vishnu_mantra"),
          image: "/assets/generated/vishnu-deity.dim_400x400.png",
        },
        shiv: {
          id: "shiv",
          name: t("shiv"),
          mantra: t("shiv_mantra"),
          image: "/assets/generated/shiv-deity.dim_400x400.png",
        },
        durga: {
          id: "durga",
          name: t("durga"),
          mantra: t("durga_mantra"),
          image: "/assets/generated/durga-deity.dim_400x400.png",
        },
        surya: {
          id: "surya",
          name: t("surya"),
          mantra: t("surya_mantra"),
          image: "/assets/generated/surya-deity.dim_400x400.png",
        },
      };

      if (defaultGods[selectedGodId]) {
        setGodData(defaultGods[selectedGodId]);
      } else {
        const customGods = localStorage.getItem("anantjap_custom_gods");
        if (customGods) {
          const gods = JSON.parse(customGods);
          const customGod = gods.find((g: any) => g.id === selectedGodId);
          if (customGod) setGodData(customGod);
        }
      }
    }
  }, [selectedGodId, t]);

  useEffect(() => {
    if (currentDevotee && selectedGodId) {
      const key = `anantjap_${currentDevotee.id}_${selectedGodId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        setJapCount(data.japCount || 0);
        setMalaCount(Math.floor((data.japCount || 0) / 108));
      }
    }
  }, [currentDevotee, selectedGodId]);

  const incrementJap = () => {
    if (!currentDevotee || !selectedGodId) return;

    const newCount = japCount + 1;
    const newMalaCount = Math.floor(newCount / 108);

    setJapCount(newCount);
    setMalaCount(newMalaCount);

    // Visual feedback
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    // Save to localStorage
    const key = `anantjap_${currentDevotee.id}_${selectedGodId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        japCount: newCount,
        lastUpdated: new Date().toISOString(),
      }),
    );

    // Save daily history using LOCAL date key
    const today = getLocalDateKey();
    const historyKey = `anantjap_history_${currentDevotee.id}_${selectedGodId}_${today}`;
    const historyData = localStorage.getItem(historyKey);
    const currentDailyCount = historyData ? JSON.parse(historyData).count : 0;
    localStorage.setItem(
      historyKey,
      JSON.stringify({ count: currentDailyCount + 1, date: today }),
    );

    if (newCount % 108 === 0 && newCount > 0) {
      toast.success(t("mala_completed"), {
        description: `${newMalaCount} ${t("malas")} completed!`,
        duration: 3000,
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (japMethod === "swipe") {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (japMethod === "swipe" && touchStart !== null) {
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart - touchEnd;
      if (diff > 30) incrementJap();
      setTouchStart(null);
    }
  };

  const handleZoneTap = () => {
    if (japMethod === "tap") incrementJap();
  };

  const handleZoneSwipeTap = () => {
    // Allow tap on desktop when method is swipe for testing
    if (japMethod === "swipe") incrementJap();
  };

  if (!godData) {
    return (
      <div className="container px-4 py-8 text-center">
        <p className="text-muted-foreground">
          Please select a god from the home page
        </p>
        <Button onClick={onBack} className="mt-4">
          {t("back")}
        </Button>
      </div>
    );
  }

  const progressPercent = ((japCount % 108) / 108) * 100;
  const japsToNextMala =
    108 - (japCount % 108 === 0 && japCount > 0 ? 0 : japCount % 108);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-background">
      {/* ── TOP SECTION: Info (≈50% height) ── */}
      <div className="flex flex-col flex-[5] min-h-0 px-4 pt-2 pb-2">
        {/* Back button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 -ml-2 h-9"
            data-ocid="japcount.back.button"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        </div>

        {/* God Info: image + name + mantra + counter */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
          {/* God image */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-primary shadow-lg">
              <img
                src={godData.image}
                alt={godData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* God name */}
          <h1 className="text-xl sm:text-2xl font-bold text-terracotta leading-tight text-center">
            {godData.name}
          </h1>

          {/* Mantra */}
          <p className="text-base sm:text-lg font-semibold text-center max-w-xs leading-snug">
            {godData.mantra}
          </p>

          {/* Counter number */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={japCount}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="text-5xl sm:text-6xl font-bold text-terracotta leading-none"
              data-ocid="japcount.counter.panel"
            >
              {japCount}
            </motion.div>
          </AnimatePresence>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {t("japs")}
          </p>

          {/* Mala count + progress */}
          <div className="w-full max-w-xs space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <img
                  src="/assets/generated/mala-beads.dim_300x300.png"
                  alt="Mala"
                  className="w-5 h-5 opacity-80"
                />
                <span className="font-semibold text-lotus">
                  {malaCount} {t("malas")}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {japsToNextMala === 108 && japCount === 0
                  ? "108"
                  : japsToNextMala}{" "}
                left
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-terracotta rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Large swipe/tap zone (≈50% height) ── */}
      <button
        type="button"
        ref={containerRef}
        className={[
          "flex-[5] min-h-0 mx-3 mb-3 rounded-2xl flex flex-col items-center justify-center gap-4",
          "relative overflow-hidden cursor-pointer select-none",
          "border-2 transition-colors duration-200",
          ripple
            ? "border-primary bg-primary/10"
            : "border-border/60 bg-card hover:bg-accent/30",
        ].join(" ")}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={japMethod === "tap" ? handleZoneTap : handleZoneSwipeTap}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") incrementJap();
        }}
        data-ocid="japcount.canvas_target"
        style={{ touchAction: "none" }}
      >
        {/* Ripple burst on interaction */}
        <AnimatePresence>
          {ripple && (
            <motion.div
              key="ripple"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 3.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute w-28 h-28 rounded-full bg-primary pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Animated arrow(s) */}
        {japMethod === "swipe" ? (
          <div className="flex flex-col items-center gap-1 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.22,
                  ease: "easeInOut",
                }}
              >
                <ChevronUp
                  className="text-primary"
                  style={{
                    width: 36 + i * 4,
                    height: 36 + i * 4,
                    opacity: 0.6 + i * 0.2,
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 1.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="pointer-events-none"
          >
            <Hand className="w-14 h-14 text-primary opacity-80" />
          </motion.div>
        )}

        {/* Label */}
        <div className="text-center pointer-events-none">
          <p className="text-lg sm:text-xl font-bold text-foreground tracking-wide">
            {japMethod === "swipe" ? t("swipe_up_to_count") : t("tap_to_count")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {japMethod === "swipe"
              ? "Swipe upward to add Jap"
              : "Tap anywhere to add Jap"}
          </p>
        </div>

        {/* Subtle corner ornament */}
        <div className="absolute bottom-3 right-4 opacity-20 pointer-events-none">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div className="absolute bottom-3 left-4 opacity-20 pointer-events-none">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </button>
    </div>
  );
}
