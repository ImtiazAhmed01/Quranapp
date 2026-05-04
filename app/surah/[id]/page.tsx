"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SURAHS } from "@/lib/quranData";
import { fetchSurahAyahs } from "@/lib/quranApi";
import { loadFontSettings } from "@/lib/fontSettings";
import { Ayah, FontSettings } from "@/types";
import AyahCard from "@/components/AyahCard";

// Cumulative ayah offsets for global numbering
const SURAH_OFFSETS: number[] = [0];
for (let i = 0; i < SURAHS.length - 1; i++) {
  SURAH_OFFSETS.push(SURAH_OFFSETS[i] + SURAHS[i].ayahCount);
}

export default function SurahPage() {
  const params = useParams();
  const surahId = Number(params.id);
  const surah = SURAHS.find(s => s.id === surahId);

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    arabicFont: "Amiri",
    arabicFontSize: 28,
    translationFontSize: 16,
  });

  useEffect(() => {
    setFontSettings(loadFontSettings());
    const interval = setInterval(() => setFontSettings(loadFontSettings()), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!surahId || surahId < 1 || surahId > 114) return;
    setLoading(true);
    setError(false);
    setPlayingAyah(null);
    setIsPlayingAll(false);

    fetchSurahAyahs(surahId).then(data => {
      if (data.length === 0) setError(true);
      else setAyahs(data);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [surahId]);

  const globalOffset = SURAH_OFFSETS[surahId - 1] || 0;

  const handleAyahPlay = useCallback((ayahNumber: number) => {
    setPlayingAyah(prev => prev === ayahNumber ? null : ayahNumber);
    setIsPlayingAll(false);
  }, []);

  const handleAyahEnded = useCallback((ayahNumber: number) => {
    if (isPlayingAll && ayahNumber < ayahs.length) {
      setPlayingAyah(ayahNumber + 1);
    } else {
      setPlayingAyah(null);
      setIsPlayingAll(false);
    }
  }, [isPlayingAll, ayahs.length]);

  const handlePlayAll = () => {
    if (isPlayingAll) {
      setIsPlayingAll(false);
      setPlayingAyah(null);
    } else {
      setIsPlayingAll(true);
      setPlayingAyah(1);
    }
  };

  if (!surah) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Surah not found</p>
    </div>
  );

  const prevSurah = surahId > 1 ? SURAHS[surahId - 2] : null;
  const nextSurah = surahId < 114 ? SURAHS[surahId] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Surah Header */}
      <div className="relative mb-10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-[#1a2535] to-[#0f1117]"/>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}/>
        <div className="relative text-center py-10 px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"/>
            {surah.revelationType} • {surah.ayahCount} Ayahs
          </div>
          <h1 className="text-4xl md:text-5xl text-white mb-2" style={{ fontFamily: "'Amiri', serif" }}>
            {surah.arabic}
          </h1>
          <p className="text-green-400 text-lg font-semibold mb-1">{surah.name}</p>
          <p className="text-gray-500 text-sm">{surah.englishName}</p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePlayAll}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                isPlayingAll
                  ? "bg-green-500 text-black"
                  : "bg-[#1e2130] border border-[#2a2d3a] text-gray-300 hover:border-green-500 hover:text-green-400"
              }`}
            >
              {isPlayingAll ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                  </svg>
                  Stop Playing
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Play All
                </>
              )}
            </button>
          </div>

          {/* Bismillah (except for At-Tawbah which is surah 9) */}
          {surahId !== 9 && (
            <div className="mt-6 text-2xl md:text-3xl text-gray-300" style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-[#13151f] border border-[#1e2130] p-7 animate-pulse">
              <div className="h-4 bg-[#1e2130] rounded w-12 mb-6"/>
              <div className="h-8 bg-[#1e2130] rounded mb-3"/>
              <div className="h-6 bg-[#1e2130] rounded w-4/5 mb-5"/>
              <div className="h-px bg-[#1e2130] mb-4"/>
              <div className="h-4 bg-[#1e2130] rounded w-full mb-2"/>
              <div className="h-4 bg-[#1e2130] rounded w-3/4"/>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-red-400">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="text-gray-400 mb-2">Failed to load this surah.</p>
          <p className="text-gray-600 text-sm mb-4">The Quran API may be unavailable. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-[#1e2130] border border-[#2a2d3a] text-gray-300 hover:text-white text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Ayahs */}
      {!loading && !error && (
        <div className="space-y-4">
          {ayahs.map(ayah => (
            <AyahCard
              key={ayah.ayahNumber}
              ayah={ayah}
              globalNumber={globalOffset + ayah.ayahNumber}
              arabicFont={fontSettings.arabicFont}
              arabicFontSize={fontSettings.arabicFontSize}
              translationFontSize={fontSettings.translationFontSize}
              isPlaying={playingAyah === ayah.ayahNumber}
              onPlay={() => handleAyahPlay(ayah.ayahNumber)}
              onEnded={() => handleAyahEnded(ayah.ayahNumber)}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      {!loading && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#1e2130]">
          {prevSurah ? (
            <Link href={`/surah/${prevSurah.id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#13151f] border border-[#1e2130] hover:border-[#2a2d3a] text-gray-300 hover:text-white text-sm transition-all group">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span>{prevSurah.name}</span>
            </Link>
          ) : <div/>}

          {nextSurah ? (
            <Link href={`/surah/${nextSurah.id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#13151f] border border-[#1e2130] hover:border-[#2a2d3a] text-gray-300 hover:text-white text-sm transition-all group">
              <span>{nextSurah.name}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ) : <div/>}
        </div>
      )}
    </div>
  );
}
