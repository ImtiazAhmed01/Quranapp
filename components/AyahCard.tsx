"use client";

import { useState, useRef, useEffect } from "react";
import { Ayah } from "@/types";

interface AyahCardProps {
    ayah: Ayah;
    globalNumber: number;
    arabicFont: string;
    arabicFontSize: number;
    translationFontSize: number;
    isPlaying: boolean;
    onPlay: () => void;
    onEnded: () => void;
}

export default function AyahCard({
    ayah,
    globalNumber,
    arabicFont,
    arabicFontSize,
    translationFontSize,
    isPlaying,
    onPlay,
    onEnded,
}: AyahCardProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`;

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
            setError(false);
            audioRef.current.play().catch(() => {
                setError(true);
                setLoading(false);
            });
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isPlaying]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${ayah.arabic}\n\n${ayah.translation}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group border border-[#1e2130] hover:border-[#2a2d3a] rounded-xl p-5 md:p-7 bg-[#13151f] hover:bg-[#151720] transition-all duration-200">
            <audio
                ref={audioRef}
                src={audioUrl}
                onLoadedData={() => setLoading(false)}
                onEnded={onEnded}
                onError={() => { setError(true); setLoading(false); }}
            />

            {/* Ayah number row */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full text-green-500/40">
                            <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-400">
                            {ayah.ayahNumber}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy */}
                    <button
                        onClick={handleCopy}
                        title="Copy Ayah"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e2130] hover:bg-[#2a2d3a] text-gray-400 hover:text-white transition-colors"
                    >
                        {copied ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-400">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                        )}
                    </button>

                    {/* Play button */}
                    <button
                        onClick={onPlay}
                        title={isPlaying ? "Pause" : "Play"}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isPlaying
                            ? "bg-green-500 text-black"
                            : "bg-[#1e2130] hover:bg-green-500/20 text-gray-400 hover:text-green-400"
                            }`}
                    >
                        {loading ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                            </svg>
                        ) : isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Arabic text */}
            <div
                className="text-right leading-loose mb-5 text-white"
                style={{
                    fontFamily: `'${arabicFont}', 'Amiri', serif`,
                    fontSize: `${arabicFontSize}px`,
                    lineHeight: "2",
                    direction: "rtl",
                }}
            >
                {ayah.arabic}
            </div>

            {/* Divider */}
            <div className="border-t border-[#1e2130] mb-4" />

            {/* Translation */}
            <p
                className="text-gray-400 leading-relaxed"
                style={{ fontSize: `${translationFontSize}px`, lineHeight: "1.8" }}
            >
                <span className="text-green-500/60 font-medium mr-1">
                    {ayah.ayahNumber}.
                </span>
                {ayah.translation}
            </p>

            {error && (
                <p className="text-red-400/60 text-xs mt-2">Audio unavailable for this ayah.</p>
            )}
        </div>
    );
}
