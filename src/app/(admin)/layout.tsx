import { Sidebar } from "@/components/shared/Sidebar"
import { Navbar } from "@/components/shared/Navbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar basePath="/admin" roleName="Super Admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar roleName="Super Admin" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
