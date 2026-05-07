"use client"

import { Menu, UserCircle } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { GlobalSearch } from "./GlobalSearch"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  roleName: string
}

export function Navbar({ roleName }: NavbarProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 backdrop-blur-sm">
      {/* Mobile Hamburger Menu */}
      <Button variant="ghost" size="icon" className="md:hidden shrink-0">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Global Search — kiri */}
      <div className="flex-1">
        <GlobalSearch />
      </div>

      {/* Theme Toggle & Profil — kanan */}
      <div className="flex items-center gap-3 ml-auto">
        <ThemeToggle />

        <div className="flex items-center gap-2.5 border-l pl-3 border-border">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold leading-none text-foreground">Agung</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">{roleName}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10">
            <UserCircle className="h-6 w-6 text-primary" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
