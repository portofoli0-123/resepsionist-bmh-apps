"use client";

import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Selamat Datang,</span>
        <span className="text-sm font-semibold text-gray-900">Admin Resepsionis</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-200 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
