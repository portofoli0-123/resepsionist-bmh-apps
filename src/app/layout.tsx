import type { Metadata } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="id" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${lora.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
