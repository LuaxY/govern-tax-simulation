import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="gap-2 border-gray-200 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
          variant="outline"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="hidden text-sm sm:inline">
            {currentLanguage.name}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1" sideOffset={8}>
        <div className="space-y-0.5">
          {languages.map((language) => (
            <button
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                language.code === i18n.language
                  ? "bg-gray-50 font-medium text-teal-700"
                  : "text-gray-700"
              }`}
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              type="button"
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
