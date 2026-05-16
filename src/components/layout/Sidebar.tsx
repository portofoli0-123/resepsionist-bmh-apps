"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, X, Users, Settings, ChevronDown, ChevronRight, LayoutDashboard, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Buku Tamu",
      href: "/buku-tamu",
      icon: BookOpen,
    },
    {
      name: "Amil Keluar",
      href: "/amil-keluar",
      icon: Users,
    },
    {
      name: "Pesan Masuk",
      icon: Mail,
      children: [
        { name: "Telepon", href: "/pesan-masuk/telepon" },
        { name: "Surat", href: "/pesan-masuk/surat" },
        { name: "Paket", href: "/pesan-masuk/paket" },
      ]
    },
    {
      name: "Kelola Mustahiq",
      href: "/kelola-mustahiq",
      icon: Users,
    },
    {
      name: "Setting",
      href: "#",
      icon: Settings,
      disabled: true
    }
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <aside 
      className="w-full bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto"
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-50">
        <h1 className="text-xl font-bold text-emerald-600 flex items-center gap-2 font-serif">
          <span className="bg-emerald-600 text-white p-1.5 rounded-lg font-sans text-lg">BMH</span>
          Resepsionis
        </h1>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openDropdown === item.name;
            const isChildActive = item.children.some(child => pathname.startsWith(child.href));
            const isDisabled = (item as any).disabled;
            
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={isDisabled ? undefined : () => toggleDropdown(item.name)}
                  disabled={isDisabled}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isDisabled ? "opacity-50 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    isChildActive && !isDisabled ? "bg-emerald-50 text-emerald-700" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isChildActive && !isDisabled ? "text-emerald-600" : "text-gray-400")} />
                    {item.name}
                  </div>
                  {!isDisabled && (isOpen ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />)}
                </button>
                
                {isOpen && !isDisabled && (
                  <div className="pl-11 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={cn(
                          "block px-4 py-2 text-sm rounded-md transition-colors",
                          pathname === child.href
                            ? "text-emerald-600 font-semibold bg-emerald-50/50"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href || "#"}
              onClick={item.disabled ? (e) => e.preventDefault() : onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                item.disabled ? "opacity-50 cursor-not-allowed" : "",
                pathname === item.href
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-emerald-600" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100">
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Version 1.0.0</p>
          <p className="text-xs text-emerald-600/80 mt-1">BMH Apps Guest Management</p>
        </div>
      </div>
    </aside>
  );
}
