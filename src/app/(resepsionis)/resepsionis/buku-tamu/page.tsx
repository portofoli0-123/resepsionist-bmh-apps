"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuestTable } from "@/components/shared/GuestTable"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import { AddGuestSheet } from "@/components/shared/AddGuestSheet"

export default function BukuTamuPage() {
  const [isLoading, setIsLoading] = React.useState(true)

  // Simulasi loading state
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Buku Tamu</h1>
          <p className="text-muted-foreground">Catat dan kelola data pengunjung gerai.</p>
        </div>
        <AddGuestSheet />
      </div>

      <Tabs defaultValue="Semua" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="Semua">Semua Tamu</TabsTrigger>
          <TabsTrigger value="Donatur">Donatur</TabsTrigger>
          <TabsTrigger value="Mustahiq">Mustahiq</TabsTrigger>
          <TabsTrigger value="Kerjasama">Kerjasama</TabsTrigger>
          <TabsTrigger value="Lainnya">Lainnya</TabsTrigger>
        </TabsList>
        
        <TabsContent value="Semua" className="mt-0">
          {isLoading ? <TableSkeleton /> : <GuestTable filterCategory="Semua" />}
        </TabsContent>
        <TabsContent value="Donatur" className="mt-0">
          {isLoading ? <TableSkeleton /> : <GuestTable filterCategory="Donatur" />}
        </TabsContent>
        <TabsContent value="Mustahiq" className="mt-0">
          {isLoading ? <TableSkeleton /> : <GuestTable filterCategory="Mustahiq" />}
        </TabsContent>
        <TabsContent value="Kerjasama" className="mt-0">
          {isLoading ? <TableSkeleton /> : <GuestTable filterCategory="Kerjasama" />}
        </TabsContent>
        <TabsContent value="Lainnya" className="mt-0">
          {isLoading ? <TableSkeleton /> : <GuestTable filterCategory="Lainnya" />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
