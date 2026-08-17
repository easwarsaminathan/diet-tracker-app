import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anti-Inflammatory Diet Tracker',
  description: 'Beautiful 7-day anti-inflammatory vegetarian diet tracker with automatic meal progression and preparation tracking',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
