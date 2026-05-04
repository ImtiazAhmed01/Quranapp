export interface Surah {
  id: number;
  name: string;
  arabic: string;
  englishName: string;
  ayahCount: number;
  revelationType: string;
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
}

export interface FontSettings {
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
}

export interface SearchResult {
  surahId: number;
  surahName: string;
  surahArabic: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
  highlight?: string;
}
