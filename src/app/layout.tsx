import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product Catalog | CLT Challenge",
  description:
    "Catálogo de productos con Next.js, TypeScript y Redux. Consume DummyJSON API.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Catálogo
            </Link>
            <Link
              href="/favorites"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Favoritos
            </Link>
          </nav>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
