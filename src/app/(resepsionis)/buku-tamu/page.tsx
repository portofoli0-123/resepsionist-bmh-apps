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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";

export default function BukuTamuPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua Tamu");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState("all");
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
      const guestDate = g.createdAt.toDate();
      matchesDate = isSameDay(guestDate, date);
    }

    let matchesMonth = true;
    if (month !== "all" && g.createdAt) {
      matchesMonth = g.createdAt.toDate().getMonth() === parseInt(month);
    }
    
    return matchesSearch && matchesCategory && matchesDate && matchesMonth;
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
      Tanggal: (g as any).tanggal ? format(new Date((g as any).tanggal), "dd MMM yyyy", { locale: id }) :
        g.createdAt ? format(g.createdAt.toDate(), "dd MMM yyyy", { locale: id }) : "-",
      Jam: (g as any).jam || "-",
      Kategori: g.kategori,
      Keperluan: g.keperluan || "-",
      Institusi: (g as any).institusi || "-",
      "No. WhatsApp": (g as any).whatsapp || "-",
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
      head: [['Nama', 'Tanggal', 'Jam', 'Kategori', 'Keperluan', 'Institusi', 'No. WhatsApp']],
      body: filteredGuests.map(g => [
        g.nama,
        (g as any).tanggal ? format(new Date((g as any).tanggal), "dd MMM yyyy", { locale: id }) :
          g.createdAt ? format(g.createdAt.toDate(), "dd MMM yyyy", { locale: id }) : "-",
        (g as any).jam || "-",
        g.kategori, 
        g.keperluan || "-", 
        (g as any).institusi || "-",
        (g as any).whatsapp || "-",
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
        <h1 className="text-3xl font-bold text-emerald-800 font-serif">Buku Tamu</h1>
        <p className="text-gray-500 font-sans">Catat dan kelola data pengunjung gerai secara real-time.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
            <div className="w-full md:w-auto">
              <div className="md:hidden">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua Tamu">Semua Tamu</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Tabs value={category} onValueChange={setCategory} className="hidden md:block w-full md:w-auto">
                <TabsList className="bg-gray-100 p-1">
                  <TabsTrigger value="Semua Tamu">Semua Tamu</TabsTrigger>
                  {CATEGORIES.map((cat) => (
                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <DatePicker date={date} setDate={setDate} />
            <MonthPicker month={month} setMonth={setMonth} />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportExcel} 
              className="gap-2 flex-1 sm:flex-none transition-all duration-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 group"
            >
              <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportPDF} 
              className="gap-2 flex-1 sm:flex-none transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-red-600 group"
            >
              <TableIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              PDF
            </Button>
          </div>
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
