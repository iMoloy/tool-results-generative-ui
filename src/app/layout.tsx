import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'FlyRank Generative UI Studio — FE-07 Tool Results & Structured Output',
  description:
    'Autonomous server-side tool execution, typed Zod schemas, 4-state lifecycle machine, and generative UI components for Core Web Vitals and technical SEO.',
  keywords: ['AI SDK', 'Generative UI', 'Zod', 'Core Web Vitals', 'Frontend AI Engineering'],
  authors: [{ name: 'FlyRank Engineering Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#080b11] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
