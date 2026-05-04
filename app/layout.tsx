import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Quran Mazid - The Holy Quran",
  description: "Read the Holy Quran with Arabic text, English translation, and audio recitation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Amiri+Quran&family=Scheherazade+New:wght@400;700&family=Lateef:wght@300;400;500&family=Noto+Naskh+Arabic:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0f1117] text-white antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
