import '../src/styles.css';
import { site } from '../lib/site-data';

export const viewport = {
  themeColor: '#0A0B0E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(site.origin),
  title: `${site.name} | Steel, Gabion Mesh & Construction Materials in Kigali, Rwanda`,
  description:
    'FORTIMESH AND STEELS RWANDA LTD supplies gabion mesh, steel wire, reinforcement rebar, structural steel, plumbing, electrical and construction materials from Kimironko, Kigali across Rwanda.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/brand/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="js" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
