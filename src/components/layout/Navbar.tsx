"use client";

import { User, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  onMenuClick: () => void;
  isScrolled?: boolean;
}

export default function Navbar({ onMenuClick, isScrolled }: NavbarProps) {
  return (
    <header 
      className={cn(
        "h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" 
          : "bg-background border-b border-transparent"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-foreground/80" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Selamat Datang,</span>
          <span className="text-sm font-semibold text-foreground">Admin Resepsionis</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
