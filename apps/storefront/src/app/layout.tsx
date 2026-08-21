import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LuxeCraft — Worldwide Luxury Ecommerce',
    template: '%s | LuxeCraft',
  },
  description: 'Bespoke luxury handcrafted rugs, crafts and custom design orders worldwide.',
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
