"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SURAHS } from "@/lib/quranData";

interface SearchMatch {
  number: number;
  numberInSurah: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
  };
  edition: {
    identifier: string;
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setSearched(true);

    fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en.sahih`)
      .then(r => r.json())
      .then(data => {
        setResults(data?.data?.matches || []);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const highlightText = (text: string, q: string) => {
    if (!q) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-green-500/30 text-green-300 rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Search</h1>
        <p className="text-gray-500 text-sm">Search through translations of the Holy Quran</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="relative mb-8">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search ayahs by translation..."
          autoFocus
          className="w-full bg-[#13151f] border border-[#2a2d3a] focus:border-green-500 rounded-xl py-4 pl-12 pr-16 text-white text-base placeholder-gray-600 focus:outline-none transition-colors"
        />
        <svg className="absolute left-4 top-4.5 w-5 h-5 text-gray-500 pointer-events-none" style={{top: "1.125rem"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black text-sm font-semibold rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-[#13151f] border border-[#1e2130] p-5 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-[#1e2130] rounded w-32"/>
                <div className="h-4 bg-[#1e2130] rounded w-16"/>
              </div>
              <div className="h-4 bg-[#1e2130] rounded w-full mb-2"/>
              <div className="h-4 bg-[#1e2130] rounded w-3/4"/>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <>
          {results.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">
                  Found <span className="text-green-400 font-semibold">{results.length}</span> results for
                </span>
                <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  "{query}"
                </span>
              </div>
              <div className="space-y-3">
                {results.map((match, idx) => {
                  const surahInfo = SURAHS.find(s => s.id === match.surah.number);
                  return (
                    <Link
                      key={idx}
                      href={`/surah/${match.surah.number}#ayah-${match.numberInSurah}`}
                      className="block rounded-xl bg-[#13151f] border border-[#1e2130] hover:border-[#2a2d3a] p-5 transition-all hover:bg-[#151720] group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 flex items-center justify-center rounded bg-[#1e2130] text-xs font-bold text-green-400 group-hover:bg-green-500/20 transition-colors">
                            {match.surah.number}
                          </span>
                          <span className="text-sm font-medium text-white">{match.surah.englishName}</span>
                          <span className="text-xs text-gray-600">({surahInfo?.arabic})</span>
                        </div>
                        <span className="text-xs text-gray-600 font-mono">
                          {match.surah.number}:{match.numberInSurah}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        <span className="text-green-500/60 font-medium mr-1">{match.numberInSurah}.</span>
                        {highlightText(match.text, query)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#1e2130] flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-gray-500">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <p className="text-gray-400 mb-1">No results found for "{query}"</p>
              <p className="text-gray-600 text-sm">Try different keywords or check your spelling.</p>
            </div>
          )}
        </>
      )}

      {/* Default state */}
      {!searched && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4" style={{ fontFamily: "'Amiri', serif" }}>﴿ ﴾</div>
          <p className="text-gray-500">Search through the entire Quran in English translation.</p>
          <p className="text-gray-600 text-sm mt-1">Type a word or phrase above to get started.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-gray-500">Loading...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
