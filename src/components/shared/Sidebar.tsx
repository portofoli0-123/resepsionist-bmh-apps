"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookUser,
  HandHeart,
  Banknote,
  Boxes,
  BookOpen,
  Settings2,
  ChevronDown,
  ClipboardList,
  MapPin,
  Search,
  Receipt,
  TrendingUp,
  ShieldCheck,
  Phone,
  Package,
  UserCog,
  Timer,
  ReceiptText,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface NavSubItem {
  title: string
  href: string
  icon: React.ElementType
}

interface NavItem {
  title: string
  icon: React.ElementType
  href?: string
  subItems?: NavSubItem[]
}

interface NavGroup {
  groupLabel: string
  items: NavItem[]
}

interface SidebarProps {
  basePath: string
  roleName: string
}

export function Sidebar({ basePath, roleName }: SidebarProps) {
  const pathname = usePathname()

  const navGroups: NavGroup[] = [
    {
      groupLabel: `Panel ${roleName}`,
      items: [
        {
          title: "Dashboard",
          href: `${basePath}`,
          icon: LayoutDashboard,
        },
        {
          title: "Buku Tamu",
          href: `${basePath}/buku-tamu`,
          icon: BookUser,
        },
        {
          title: "Layanan Mustahiq",
          icon: HandHeart,
          subItems: [
            { title: "Pendaftaran Baru", href: `${basePath}/layanan-mustahiq/pendaftaran`, icon: ClipboardList },
            { title: "Tracking Pengajuan", href: `${basePath}/layanan-mustahiq/tracking`, icon: MapPin },
            { title: "Pencarian Cepat", href: `${basePath}/layanan-mustahiq/pencarian`, icon: Search },
          ],
        },
        {
          title: "Layanan Donatur",
          icon: Banknote,
          subItems: [
            { title: "Donasi & Wakaf", href: `${basePath}/layanan-donatur/donasi`, icon: ReceiptText },
            { title: "Kwitansi Digital", href: `${basePath}/layanan-donatur/kwitansi`, icon: Receipt },
          ],
        },
        {
          title: "Modul Prodaya",
          icon: Boxes,
          subItems: [
            { title: "Cashflow Tracker", href: `${basePath}/modul-prodaya/cashflow`, icon: TrendingUp },
            { title: "Audit Trail", href: `${basePath}/modul-prodaya/audit`, icon: ShieldCheck },
          ],
        },
        {
          title: "Direktori",
          icon: BookOpen,
          subItems: [
            { title: "Phonebook", href: `${basePath}/direktori/phonebook`, icon: Phone },
            { title: "Barang Logistik", href: `${basePath}/direktori/logistik`, icon: Package },
          ],
        },
      ],
    },
    {
      groupLabel: "Panel Umum",
      items: [
        {
          title: "Pengaturan",
          icon: Settings2,
          subItems: [
            { title: "Profil Kantor", href: `${basePath}/pengaturan/profil`, icon: UserCog },
            { title: "Manajemen Sesi", href: `${basePath}/pengaturan/sesi`, icon: Timer },
          ],
        },
      ],
    },
  ]

  const allMenusWithSubs = navGroups
    .flatMap((g) => g.items)
    .filter((i) => i.subItems)
    .map((i) => i.title)

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(
    Object.fromEntries(allMenusWithSubs.map((t) => [t, false]))
  )

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const renderItem = (item: NavItem, index: number) => {
    const Icon = item.icon

    // Expandable (has sub-items)
    if (item.subItems) {
      const isOpen = openMenus[item.title]
      const hasActiveChild = item.subItems.some((sub) => pathname.startsWith(sub.href))

      return (
        <div key={index} className="flex flex-col">
          <button
            onClick={() => toggleMenu(item.title)}
            className={cn(
              "flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
              hasActiveChild && !isOpen
                ? "text-sidebar-primary-foreground bg-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", hasActiveChild && !isOpen ? "" : "opacity-70")} />
            <span>{item.title}</span>
            <ChevronDown
              className={cn(
                "ml-auto h-3.5 w-3.5 transition-transform duration-200 opacity-50",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <div className="flex flex-col pl-4 pr-2 mt-0.5 mb-1 space-y-0.5 border-l border-border/60 ml-5">
              {item.subItems.map((sub, idx) => {
                const SubIcon = sub.icon
                const isSubActive = pathname === sub.href
                return (
                  <Link
                    key={idx}
                    href={sub.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-150",
                      isSubActive
                        ? "text-sidebar-primary bg-sidebar-primary/10 font-semibold"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <SubIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    {sub.title}
                    {isSubActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    // Plain link
    const isActive = pathname === item.href
    return (
      <Link
        key={index}
        href={item.href!}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm ring-1 ring-sidebar-primary/40"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "" : "opacity-70")} />
        <span>{item.title}</span>
        {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
      </Link>
    )
  }

  return (
    <div className="hidden border-r border-border bg-sidebar md:flex md:flex-col w-64 h-full flex-shrink-0">
      {/* Logo / Brand Header */}
      <div className="flex h-14 items-center border-b border-border px-4 lg:h-[60px] lg:px-6">
        <Link href={basePath} className="flex items-center gap-3 font-semibold group">
          <div className="size-9 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:shadow-primary/30 transition-shadow">
            <span className="text-primary-foreground font-bold text-base leading-none">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sidebar-foreground font-bold text-sm leading-tight">BMH Nasional</span>
            <span className="text-muted-foreground text-[10px] font-normal leading-tight">Baitul Maal Hidayatullah</span>
          </div>
        </Link>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            <div className="px-4 mb-1.5">
              <h2 className="px-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                {group.groupLabel}
              </h2>
            </div>
            <nav className="grid items-start px-2 lg:px-3 gap-0.5">
              {group.items.map((item, index) => renderItem(item, index))}
            </nav>
            {gi < navGroups.length - 1 && <div className="mt-4 mx-4 border-t border-border/50" />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        <p className="text-[10px] text-muted-foreground text-center">© 2026 Baitul Maal Hidayatullah</p>
      </div>
    </div>
  )
}
