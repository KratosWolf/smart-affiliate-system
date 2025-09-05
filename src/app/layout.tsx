import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIBE Smart Affiliate System",
  description: "Sistema completo para afiliados - Discovery, Validation, Presells e Campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
