"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

export default function ResepsionisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setIsScrolled(mainRef.current.scrollTop > 10);
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-[280px] lg:w-64 lg:static lg:block transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar onMenuClick={toggleSidebar} isScrolled={isScrolled} />
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
