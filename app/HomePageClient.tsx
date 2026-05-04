"use client";
import Link from "next/link";
import { SURAHS } from "@/lib/quranData";

export default function HomePageClient() {
  const popularSurahs = [1, 2, 18, 36, 55, 67, 112, 113, 114];
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-linear-to-br from-green-900/40 via-[#1a2535] to-[#0f1117]" />
        <div className="relative text-center py-12 px-6">
          <div className="text-5xl md:text-7xl mb-4 text-green-300/80" style={{ fontFamily: "'Amiri', serif" }}>القرآن الكريم</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">The Holy Quran</h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">Read, listen, and explore the complete Quran with Arabic text, English translation, and audio recitation.</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link href="/surah/1" className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full text-sm transition-colors">Start Reading</Link>
            <Link href="/search" className="px-6 py-3 bg-[#1e2130] border border-[#2a2d3a] hover:border-green-500/50 text-gray-300 hover:text-white font-medium rounded-full text-sm transition-all">Search Ayahs</Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[{ label: "Surahs", value: "114" }, { label: "Ayahs", value: "6,236" }, { label: "Juz", value: "30" }].map(s => (
          <div key={s.label} className="rounded-xl bg-[#13151f] border border-[#1e2130] p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popular Surahs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {popularSurahs.map(id => {
            const s = SURAHS.find((x: { id: number; }) => x.id === id)!; return (
              <Link key={id} href={`/surah/${id}`} className="flex items-center gap-3 p-3 rounded-xl bg-[#13151f] border border-[#1e2130] hover:border-[#2a2d3a] hover:bg-[#151720] transition-all group">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-sm font-bold group-hover:bg-green-500/20 transition-colors">{id}</div>
                <div className="min-w-0 flex-1"><div className="text-sm font-medium text-white truncate">{s.name}</div><div className="text-xs text-gray-500">{s.ayahCount} ayahs</div></div>
                <div className="text-lg text-gray-500 shrink-0" style={{ fontFamily: "'Amiri',serif" }}>{s.arabic}</div>
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">All Surahs</h2>
        <div className="space-y-1">
          {SURAHS.map(s => (
            <Link key={s.id} href={`/surah/${s.id}`} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#13151f] transition-colors group">
              <div className="w-8 h-8 shrink-0 rounded flex items-center justify-center text-xs font-bold bg-[#1e2130] text-gray-500 group-hover:bg-green-500/10 group-hover:text-green-400 transition-colors">{s.id}</div>
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{s.name}</span>
                <span className="text-xs text-gray-600 hidden sm:block">• {s.englishName}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-600 hidden sm:block">{s.ayahCount} ayahs</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1e2130] text-gray-500 text-[10px]">{s.revelationType === "Meccan" ? "Makkah" : "Madinah"}</span>
                <span className="text-lg text-gray-500" style={{ fontFamily: "'Amiri',serif" }}>{s.arabic}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
