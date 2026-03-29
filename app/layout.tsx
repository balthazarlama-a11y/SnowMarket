import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "./components/Navbar";
import { WhatsAppFAB } from "./components/WhatsAppFAB";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AndesMarket",
    template: "%s | AndesMarket",
  },
  description:
    "Marketplace de equipos de esquí y arriendo de departamentos en la nieve — Chile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(inter.variable, dmSans.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        {children}
        <WhatsAppFAB />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
