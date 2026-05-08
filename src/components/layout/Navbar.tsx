"use client";

import { User, Menu } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header 
      className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:inline">Selamat Datang,</span>
          <span className="text-sm font-semibold text-gray-900">Admin Resepsionis</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-200 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
