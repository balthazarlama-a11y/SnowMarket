import type { Metadata } from "next";
import { Navbar } from "./components/Navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "SnowMarket",
  description: "Marketplace de equipos de esqui y arriendo de departamentos en Chile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
