import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useDevotee } from '../contexts/DevoteeContext';
import { toast } from 'sonner';

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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function JapCountPage({ selectedGodId, onBack }: JapCountPageProps) {
  const { t, language } = useLanguage();
  const { currentDevotee } = useDevotee();
  const [japCount, setJapCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [japMethod, setJapMethod] = useState<'tap' | 'swipe'>('swipe');
  const [godData, setGodData] = useState<GodData | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMethod = localStorage.getItem('anantjap_jap_method');
    if (savedMethod) {
      setJapMethod(savedMethod as 'tap' | 'swipe');
    }
  }, []);

  useEffect(() => {
    if (selectedGodId) {
      // Load god data
      const defaultGods: Record<string, GodData> = {
        ganesh: {
          id: 'ganesh',
          name: t('ganesh'),
          mantra: t('ganesh_mantra'),
          image: '/assets/generated/ganesh-deity.dim_400x400.png',
        },
        vishnu: {
          id: 'vishnu',
          name: t('vishnu'),
          mantra: t('vishnu_mantra'),
          image: '/assets/generated/vishnu-deity.dim_400x400.png',
        },
        shiv: {
          id: 'shiv',
          name: t('shiv'),
          mantra: t('shiv_mantra'),
          image: '/assets/generated/shiv-deity.dim_400x400.png',
        },
        durga: {
          id: 'durga',
          name: t('durga'),
          mantra: t('durga_mantra'),
          image: '/assets/generated/durga-deity.dim_400x400.png',
        },
        surya: {
          id: 'surya',
          name: t('surya'),
          mantra: t('surya_mantra'),
          image: '/assets/generated/surya-deity.dim_400x400.png',
        },
      };

      if (defaultGods[selectedGodId]) {
        setGodData(defaultGods[selectedGodId]);
      } else {
        // Load custom god
        const customGods = localStorage.getItem('anantjap_custom_gods');
        if (customGods) {
          const gods = JSON.parse(customGods);
          const customGod = gods.find((g: any) => g.id === selectedGodId);
          if (customGod) {
            setGodData(customGod);
          }
        }
      }
    }
  }, [selectedGodId, t, language]);

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

    // Save to localStorage
    const key = `anantjap_${currentDevotee.id}_${selectedGodId}`;
    const data = {
      japCount: newCount,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));

    // Save daily history using LOCAL date key (not UTC) to avoid timezone offset bug
    const today = getLocalDateKey();
    const historyKey = `anantjap_history_${currentDevotee.id}_${selectedGodId}_${today}`;
    const historyData = localStorage.getItem(historyKey);
    const currentDailyCount = historyData ? JSON.parse(historyData).count : 0;
    localStorage.setItem(historyKey, JSON.stringify({ count: currentDailyCount + 1, date: today }));

    // Check for mala completion
    if (newCount % 108 === 0 && newCount > 0) {
      toast.success(t('mala_completed'), {
        description: `${newMalaCount} ${t('malas')} completed!`,
        duration: 3000,
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (japMethod === 'swipe') {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (japMethod === 'swipe' && touchStart !== null) {
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart - touchEnd;
      
      if (diff > 50) {
        incrementJap();
      }
      setTouchStart(null);
    }
  };

  const handleTap = () => {
    if (japMethod === 'tap') {
      incrementJap();
    }
  };

  if (!godData) {
    return (
      <div className="container px-4 py-8 text-center">
        <p className="text-muted-foreground">Please select a god from the home page</p>
        <Button onClick={onBack} className="mt-4">
          {t('back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="container px-4 py-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Button>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center px-4 py-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}
      >
        {/* God Image */}
        <div className="relative mb-8">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-2xl">
            <img
              src={godData.image}
              alt={godData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        {/* God Name */}
        <h1 className="text-3xl font-bold mb-6 spiritual-gradient bg-clip-text text-transparent">
          {godData.name}
        </h1>

        {/* Mantra */}
        <div className="text-center mb-8 max-w-md">
          <p className="text-2xl font-semibold mb-2">{godData.mantra}</p>
          <p className="text-sm text-muted-foreground">
            {japMethod === 'tap' ? t('tap_to_count') : t('swipe_up_to_count')}
          </p>
        </div>

        {/* Counter */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-7xl font-bold spiritual-gradient bg-clip-text text-transparent">
              {japCount}
            </div>
            <div className="text-sm text-muted-foreground mt-2">{t('japs')}</div>
          </div>

          {/* Mala Count */}
          <div className="flex items-center justify-center gap-2">
            <img
              src="/assets/generated/mala-beads.dim_300x300.png"
              alt="Mala"
              className="w-8 h-8 opacity-70"
            />
            <span className="text-2xl font-semibold text-lotus">
              {malaCount} {t('malas')}
            </span>
          </div>

          {/* Progress to next mala */}
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full spiritual-gradient transition-all duration-300"
              style={{ width: `${(japCount % 108) / 108 * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {108 - (japCount % 108)} japs to next mala
          </p>
        </div>
      </div>
    </div>
  );
}
