/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SURAHS } from "@/lib/quranData";
import { loadFontSettings, saveFontSettings, ARABIC_FONTS, DEFAULT_FONT_SETTINGS } from "@/lib/fontSettings";
import { FontSettings } from "@/types";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [surahSidebarOpen, setSurahSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [fontPanelOpen, setFontPanelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [fontSettings, setFontSettings] = useState<FontSettings>(DEFAULT_FONT_SETTINGS);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFontSettings(loadFontSettings());
    }, []);

    useEffect(() => {
        saveFontSettings(fontSettings);
        document.documentElement.style.setProperty("--arabic-font", fontSettings.arabicFont);
        document.documentElement.style.setProperty("--arabic-size", `${fontSettings.arabicFontSize}px`);
        document.documentElement.style.setProperty("--trans-size", `${fontSettings.translationFontSize}px`);
    }, [fontSettings]);

    const activeSurahId = pathname.match(/\/surah\/(\d+)/)?.[1];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const updateFont = (key: keyof FontSettings, value: string | number) => {
        setFontSettings((prev: unknown) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
            {/* Icon Sidebar */}
            <div className="w-14 flex-shrink-0 bg-[#1a1d27] border-r border-[#2a2d3a] flex flex-col items-center py-4 gap-2 z-50">
                <Link href="/" className="w-10 h-10 flex items-center justify-center mb-2">
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                        <circle cx="20" cy="20" r="18" fill="#16a34a" opacity="0.15" />
                        <path d="M12 20 Q20 8 28 20 Q20 32 12 20Z" fill="#16a34a" opacity="0.6" />
                        <circle cx="20" cy="20" r="3" fill="#22c55e" />
                    </svg>
                </Link>

                <IconBtn
                    onClick={() => { setSurahSidebarOpen(p => !p); setFontPanelOpen(false); }}
                    active={surahSidebarOpen}
                    title="Surah List"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                </IconBtn>

                <IconBtn
                    onClick={() => { setFontPanelOpen(p => !p); setSurahSidebarOpen(false); }}
                    active={fontPanelOpen}
                    title="Font Settings"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M4 20L10 4L16 20M6.5 14h7" />
                        <path d="M18 14c0-1.1.9-2 2-2s2 .9 2 2v4a2 2 0 01-4 0v-4z" strokeWidth="1.5" />
                    </svg>
                </IconBtn>

                <IconBtn onClick={() => searchRef.current?.focus()} title="Search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                </IconBtn>

                <div className="flex-1" />

                <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-[#2a2d3a] transition-colors" title="Home">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </Link>
            </div>

            {/* Surah Sidebar */}
            {surahSidebarOpen && (
                <div className="w-72 flex-shrink-0 bg-[#13151f] border-r border-[#2a2d3a] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[#2a2d3a]">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Surahs</h2>
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search ayahs..."
                                className="w-full bg-[#1e2130] border border-[#2a2d3a] rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                            />
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                        </form>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin">
                        {SURAHS.map((surah: { id: boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; englishName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; ayahCount: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; arabic: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                            <Link
                                key={surah.id}
                                href={`/surah/${surah.id}`}
                                className={`flex items-center px-4 py-3 hover:bg-[#1e2130] transition-colors border-b border-[#1e2130] group ${activeSurahId === String(surah.id) ? "bg-[#1e2130] border-l-2 border-l-green-500" : ""}`}
                            >
                                <div className={`w-8 h-8 flex-shrink-0 rounded flex items-center justify-center text-xs font-bold mr-3 ${activeSurahId === String(surah.id) ? "bg-green-500 text-black" : "bg-[#2a2d3a] text-gray-400 group-hover:bg-green-500/20 group-hover:text-green-400"} transition-colors`}>
                                    {surah.id}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate">{surah.name}</div>
                                    <div className="text-xs text-gray-500">{surah.englishName} • {surah.ayahCount} ayahs</div>
                                </div>
                                <div className="text-lg text-gray-400 font-arabic ml-2" style={{ fontFamily: "'Amiri', serif" }}>
                                    {surah.arabic}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Font Settings Panel */}
            {fontPanelOpen && (
                <div className="w-72 flex-shrink-0 bg-[#13151f] border-r border-[#2a2d3a] flex flex-col p-5 overflow-y-auto">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Font Settings</h2>
                        <button onClick={() => setFontPanelOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-3">Arabic Font</label>
                            <div className="space-y-2">
                                {ARABIC_FONTS.map(font => (
                                    <button
                                        key={font.value}
                                        onClick={() => updateFont("arabicFont", font.value)}
                                        className={`w-full text-right px-4 py-3 rounded-lg border transition-all ${fontSettings.arabicFont === font.value ? "border-green-500 bg-green-500/10 text-green-400" : "border-[#2a2d3a] bg-[#1e2130] text-gray-300 hover:border-[#3a3d4a]"}`}
                                        style={{ fontFamily: `'${font.value}', serif`, fontSize: "18px" }}
                                    >
                                        {font.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-3">
                                Arabic Font Size: <span className="text-green-400">{fontSettings.arabicFontSize}px</span>
                            </label>
                            <input
                                type="range" min="20" max="48" step="2"
                                value={fontSettings.arabicFontSize}
                                onChange={e => updateFont("arabicFontSize", Number(e.target.value))}
                                className="w-full accent-green-500"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>Small</span><span>Large</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-3">
                                Translation Size: <span className="text-green-400">{fontSettings.translationFontSize}px</span>
                            </label>
                            <input
                                type="range" min="12" max="24" step="1"
                                value={fontSettings.translationFontSize}
                                onChange={e => updateFont("translationFontSize", Number(e.target.value))}
                                className="w-full accent-green-500"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>Small</span><span>Large</span>
                            </div>
                        </div>

                        <div className="p-4 bg-[#1e2130] rounded-lg border border-[#2a2d3a]">
                            <p className="text-xs text-gray-500 mb-2">Preview</p>
                            <p className="text-right leading-loose text-white" style={{ fontFamily: `'${fontSettings.arabicFont}', serif`, fontSize: `${fontSettings.arabicFontSize}px` }}>
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </p>
                            <p className="text-gray-300 mt-2" style={{ fontSize: `${fontSettings.translationFontSize}px` }}>
                                In the name of Allah, the Most Gracious, the Most Merciful.
                            </p>
                        </div>

                        <button
                            onClick={() => setFontSettings(DEFAULT_FONT_SETTINGS)}
                            className="w-full py-2 text-sm text-gray-500 hover:text-white border border-[#2a2d3a] rounded-lg hover:border-[#3a3d4a] transition-colors"
                        >
                            Reset to Default
                        </button>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1a1d27] border-b border-[#2a2d3a]">
                    <button onClick={() => setMobileSidebarOpen(true)} className="text-gray-400 hover:text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <span className="text-white font-semibold">Quran Mazid</span>
                    <button onClick={() => setFontPanelOpen(p => !p)} className="text-gray-400 hover:text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                            <path d="M4 20L10 4L16 20M6.5 14h7" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
                    <div className="relative w-80 bg-[#13151f] flex flex-col">
                        <div className="p-4 border-b border-[#2a2d3a] flex items-center justify-between">
                            <h2 className="text-white font-semibold">All Surahs</h2>
                            <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 hover:text-white">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {SURAHS.map(surah => (
                                <Link
                                    key={surah.id}
                                    href={`/surah/${surah.id}`}
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 hover:bg-[#1e2130] transition-colors border-b border-[#1e2130] ${activeSurahId === String(surah.id) ? "bg-[#1e2130] border-l-2 border-l-green-500" : ""}`}
                                >
                                    <div className={`w-8 h-8 flex-shrink-0 rounded flex items-center justify-center text-xs font-bold mr-3 ${activeSurahId === String(surah.id) ? "bg-green-500 text-black" : "bg-[#2a2d3a] text-gray-400"}`}>
                                        {surah.id}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white">{surah.name}</div>
                                        <div className="text-xs text-gray-500">{surah.englishName} • {surah.ayahCount} ayahs</div>
                                    </div>
                                    <div className="text-lg text-gray-400 font-arabic ml-2" style={{ fontFamily: "'Amiri', serif" }}>
                                        {surah.arabic}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function IconBtn({ children, onClick, active, title }: { children: React.ReactNode; onClick: () => void; active?: boolean; title?: string }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${active ? "bg-green-500/20 text-green-400" : "text-gray-500 hover:text-white hover:bg-[#2a2d3a]"}`}
        >
            {children}
        </button>
    );
}
