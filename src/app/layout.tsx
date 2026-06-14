import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { siteUrl } from "@/data/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

const syncDocumentLanguage = `
(() => {
  const match = window.location.pathname.match(/^\\/(en|it|pt|es|ru|fr)(?:\\/|$)/);
  document.documentElement.lang = match ? match[1] : 'en';
})();
`;

const cleanupLegacyServiceWorker = `
(() => {
  if (!('serviceWorker' in navigator)) return;

  const reloadOnce = () => {
    const key = 'grs-sw-cleaned-20260614';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    window.location.reload();
  };

  const clearCaches = () => {
    if (!('caches' in window)) return Promise.resolve();
    return caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name))));
  };

  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        if (!registrations.length) return clearCaches();
        return Promise.all(registrations.map((registration) => registration.unregister()))
          .then(clearCaches)
          .then(reloadOnce);
      })
      .catch(() => {});
  });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#062748]">
        <script dangerouslySetInnerHTML={{ __html: syncDocumentLanguage }} />
        <script dangerouslySetInnerHTML={{ __html: cleanupLegacyServiceWorker }} />
        {children}
      </body>
    </html>
  );
}
