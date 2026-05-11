import type { Metadata } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"]
});

const lora = Lora({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Dashboard Resepsionis",
  description: "Aplikasi Buku Tamu Resepsionis",
  icons: {
    icon: "/bmh.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${montserrat.variable} ${lora.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
