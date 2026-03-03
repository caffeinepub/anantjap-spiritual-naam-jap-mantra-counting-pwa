import { Languages } from 'lucide-react';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'sanskrit', label: 'संस्कृतम्' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिन्दी' },
    { value: 'gujarati', label: 'ગુજરાતી' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold spiritual-gradient bg-clip-text text-transparent">
            ॐ AnantJap
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}

