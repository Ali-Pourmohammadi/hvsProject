import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سامانه تحلیل آزمایش‌های خونی برای ارزیابی اولیه هپاتیت C",
  description:
    "سامانه آموزشی مبتنی بر یادگیری ماشین برای ارزیابی اولیه وضعیت فرد از نظر احتمال ابتلا به هپاتیت C با استفاده از شاخص‌های آزمایش خون.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} ${vazirmatn.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
