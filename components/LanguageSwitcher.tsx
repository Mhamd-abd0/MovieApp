'use client';

import { useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore, Language, languageLabels } from '@/store/languageStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const { language, setLanguage, loadLanguage } = useLanguageStore();

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-400" />
      <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
        <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {Object.entries(languageLabels).map(([code, label]) => (
            <SelectItem key={code} value={code} className="text-white hover:bg-gray-700">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}