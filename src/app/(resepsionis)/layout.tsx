import { Sidebar } from "@/components/shared/Sidebar"
import { Navbar } from "@/components/shared/Navbar"

export default function ResepsionisLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar basePath="/resepsionis" roleName="Resepsionis" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar roleName="Resepsionis" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
