import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { type Language, useLanguage } from "../contexts/LanguageContext";

export default function Header() {
  const { language, setLanguage } = useLanguage();

  const languageOptions: { value: Language; label: string }[] = [
    { value: "sanskrit", label: "संस्कृतम्" },
    { value: "english", label: "English" },
    { value: "hindi", label: "हिन्दी" },
    { value: "gujarati", label: "ગુજરાતી" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Brand name only — logo is shown in the LeftSidebar */}
        <span className="font-heading text-xl font-bold tracking-wide text-foreground">
          AnantJap
        </span>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
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
