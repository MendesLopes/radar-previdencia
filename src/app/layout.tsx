import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar Previdenciário - Previdência Complementar",
  description: "Painel de Consolidação e Monitoramento de Alterações Regulatórias para EFPCs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
