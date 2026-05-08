"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileDown, Table as TableIcon, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Guest, guestSchema, CATEGORIES } from "@/lib/schema";
import GuestTable from "@/components/guest/GuestTable";
import GuestForm from "@/components/guest/GuestForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function BukuTamuPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua Tamu");
  const [date, setDate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  useEffect(() => {
    const q = query(collection(db, "guests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guestData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Guest[];
      setGuests(guestData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredGuests = guests.filter((g) => {
    const matchesSearch = 
      g.nama.toLowerCase().includes(search.toLowerCase()) || 
      (g as any).whatsapp?.toLowerCase().includes(search.toLowerCase()) ||
      g.keperluan?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Semua Tamu" || g.kategori === category;
    
    let matchesDate = true;
    if (date && g.createdAt) {
      const guestDate = format(g.createdAt.toDate(), "yyyy-MM-dd");
      matchesDate = guestDate === date;
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleAddGuest = async (data: any) => {
    try {
      if (editingGuest) {
        await updateDoc(doc(db, "guests", editingGuest.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "guests"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      setIsDialogOpen(false);
      setEditingGuest(null);
    } catch (error) {
      console.error("Error saving guest:", error);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await deleteDoc(doc(db, "guests", id));
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredGuests.map(g => ({
      Nama: g.nama,
      "No. WhatsApp": (g as any).whatsapp || "-",
      Kategori: g.kategori,
      Keperluan: g.keperluan || "-",
      Waktu: g.createdAt ? format(g.createdAt.toDate(), "HH.mm / dd MMMM yyyy", { locale: id }) : "-"
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Buku Tamu");
    XLSX.writeFile(wb, `Buku_Tamu_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Buku Tamu", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Nama', 'No. WhatsApp', 'Kategori', 'Keperluan', 'Waktu']],
      body: filteredGuests.map(g => [
        g.nama, 
        (g as any).whatsapp || "-",
        g.kategori, 
        g.keperluan || "-", 
        g.createdAt ? format(g.createdAt.toDate(), "HH.mm / dd MMMM yyyy", { locale: id }) : "-"
      ]),
    });
    doc.save(`Buku_Tamu_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Buku Tamu</h1>
        <p className="text-gray-500 font-sans">Catat dan kelola data pengunjung gerai secara real-time.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
            <Tabs defaultValue="Semua Tamu" onValueChange={setCategory} className="w-full md:w-auto">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="Semua Tamu">Semua Tamu</TabsTrigger>
                {CATEGORIES.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="relative w-full md:w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="date"
                className="pl-10"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nama atau keperluan..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto"
              onClick={() => { setEditingGuest(null); setIsDialogOpen(true); }}
            >
              <Plus className="w-4 h-4" />
              Tambah Tamu
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2 flex-1 sm:flex-none">
            <FileDown className="w-4 h-4" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2 flex-1 sm:flex-none">
            <TableIcon className="w-4 h-4" />
            PDF
          </Button>
        </div>

        <GuestTable 
          guests={filteredGuests} 
          loading={loading} 
          onEdit={(g) => { setEditingGuest(g); setIsDialogOpen(true); }}
          onDelete={handleDeleteGuest}
        />
      </div>

      <AnimatePresence>
        {isDialogOpen && (
          <GuestForm 
            isOpen={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)} 
            onSubmit={handleAddGuest}
            initialData={editingGuest}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
