"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Buku Tamu",
      href: "/buku-tamu",
      icon: BookOpen,
    },
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0"
    >
      <div className="p-6">
        <h1 className="text-xl font-bold text-emerald-600 flex items-center gap-2 font-serif">
          <span className="bg-emerald-600 text-white p-1 rounded font-sans">R</span>
          Resepsionis
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
              pathname.startsWith(item.href)
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="bg-emerald-50 p-4 rounded-xl">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">MVP Version</p>
          <p className="text-xs text-emerald-600 mt-1">Dashboard Resepsionis</p>
        </div>
      </div>
    </motion.aside>
  );
}
