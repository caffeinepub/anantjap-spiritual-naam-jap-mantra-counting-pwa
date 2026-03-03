import { Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (page: 'terms' | 'privacy' | 'copyright' | 'feedback') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => onNavigate('terms')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('terms')}
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('privacy')}
            </button>
            <button
              onClick={() => onNavigate('copyright')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('copyright')}
            </button>
            <button
              onClick={() => onNavigate('feedback')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('feedback')}
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025. {t('built_with_love')}</span>
            <Heart className="h-4 w-4 text-lotus fill-lotus" />
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

