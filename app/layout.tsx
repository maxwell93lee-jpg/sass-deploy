import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/presentation/components/layout/Navbar";
import Footer from "@/presentation/components/layout/Footer";
import { createClient } from "@/infrastructure/api/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cloudnote.service"),
  title: "CloudNote - 당신의 디지털 안식처",
  description: "AI가 당신의 아이디어를 맥락에 따라 정리하는 지능형 스마트 노트 플랫폼",
  keywords: ["스마트 노트", "AI 메모", "지식 관리", "CloudNote", "지능형 요약"],
  openGraph: {
    title: "CloudNote - 아이디어를 지능적으로 정리하다",
    description: "AI 자동 태깅과 요약으로 모든 아이디어를 가치 있는 지식으로 바꾸는 스마트 노트입니다.",
    url: "https://cloudnote.service",
    siteName: "CloudNote",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CloudNote 서비스 미리보기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudNote - 지능형 스마트 노트",
    description: "AI가 맥락을 이해하고 정리해주는 당신의 디지털 안식처.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <Navbar user={user} />
        <main className="flex-grow flex flex-col pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
