import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { useDevotee } from '../contexts/DevoteeContext';

interface God {
  id: string;
  name: string;
  mantra: string;
  image: string;
  isCustom?: boolean;
}

interface GodCardProps {
  god: God;
  onSelect: () => void;
  onRemove?: () => void;
}

export default function GodCard({ god, onSelect, onRemove }: GodCardProps) {
  const { t } = useLanguage();
  const { currentDevotee } = useDevotee();
  const [japCount, setJapCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);

  useEffect(() => {
    if (currentDevotee) {
      const key = `anantjap_${currentDevotee.id}_${god.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        setJapCount(data.japCount || 0);
        setMalaCount(Math.floor((data.japCount || 0) / 108));
      } else {
        setJapCount(0);
        setMalaCount(0);
      }
    }
  }, [currentDevotee, god.id]);

  return (
    <div className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      {/* Image area — flush to top, fully covered */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '12rem' }}
        onClick={onSelect}
      >
        <img
          src={god.image}
          alt={god.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 spiritual-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
      </div>

      {/* Card header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold leading-tight">{god.name}</h3>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive -mt-1 -mr-1"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="px-4 pb-4 space-y-3" onClick={onSelect}>
        <p className="text-sm text-muted-foreground italic">{god.mantra}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <span className="text-xs">{t('japs')}:</span>
            <span className="font-bold">{japCount}</span>
          </Badge>
          <Badge variant="outline" className="gap-1 border-lotus text-lotus">
            <span className="text-xs">{t('malas')}:</span>
            <span className="font-bold">{malaCount}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
}
