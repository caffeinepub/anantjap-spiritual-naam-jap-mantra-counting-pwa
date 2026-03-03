import { Home, Music, BarChart3, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LeftSidebarProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'japcount' | 'bhajanmarg' | 'dashboard' | 'settings') => void;
  godImageSrc?: string | null;
  godName?: string | null;
}

export default function LeftSidebar({ currentPage, onNavigate, godImageSrc, godName }: LeftSidebarProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: Home, label: t('home'), type: 'icon' as const },
    {
      id: 'japcount',
      icon: null,
      label: t('japcount'),
      type: 'image' as const,
      imageSrc: '/assets/generated/mala-beads.dim_300x300.png',
    },
    { id: 'bhajanmarg', icon: Music, label: t('bhajanmarg'), type: 'icon' as const },
    { id: 'dashboard', icon: BarChart3, label: t('dashboard'), type: 'icon' as const },
    { id: 'settings', icon: Settings, label: t('settings'), type: 'icon' as const },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <nav className="fixed left-0 top-0 bottom-0 z-50 w-[72px] flex flex-col items-center border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        {/* Top spacer to align below header */}
        <div className="h-16 w-full flex items-center justify-center border-b border-border/50">
          <div className="w-8 h-8 rounded-full spiritual-gradient opacity-70" />
        </div>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col items-center gap-1 py-4 w-full">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate(item.id as 'home' | 'japcount' | 'bhajanmarg' | 'dashboard' | 'settings')}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'spiritual-gradient text-white shadow-md scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                    aria-label={item.label}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-sacred-orange" />
                    )}

                    {item.type === 'icon' && item.icon && (
                      <item.icon className="h-5 w-5" />
                    )}
                    {item.type === 'image' && item.imageSrc && (
                      <img
                        src={item.imageSrc}
                        alt={item.label}
                        className={`h-6 w-6 object-contain transition-all ${
                          isActive
                            ? 'brightness-200 saturate-0'
                            : 'opacity-70 group-hover:opacity-100'
                        }`}
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* God Image Slot */}
        {godImageSrc && (
          <div className="w-full px-2 pb-4 flex flex-col items-center gap-1">
            <div className="w-full h-px bg-border/50 mb-2" />
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/30 shadow-md cursor-pointer hover:border-primary/60 transition-all duration-200 bg-accent/30"
                  onClick={() => onNavigate('japcount')}
                >
                  <img
                    src={godImageSrc}
                    alt={godName || 'Selected deity'}
                    className="w-full h-full object-contain"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {godName || 'Selected deity'}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-4" />
      </nav>
    </TooltipProvider>
  );
}
