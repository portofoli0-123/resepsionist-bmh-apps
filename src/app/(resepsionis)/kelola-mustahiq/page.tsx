"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileDown, Table as TableIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MustahiqUang } from "@/lib/schema";
import MustahiqUangTable from "@/components/mustahiq/MustahiqUangTable";
import MustahiqUangForm from "@/components/mustahiq/MustahiqUangForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";

export default function KelolaMustahiqPage() {
  const [data, setData] = useState<MustahiqUang[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MustahiqUang | null>(null);

  useEffect(() => {
    const q = query(collection(db, "mustahiq-uang"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MustahiqUang[];
      setData(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) || 
      item.nik.toLowerCase().includes(search.toLowerCase()) ||
      item.alamat.toLowerCase().includes(search.toLowerCase());
    
    let matchesDate = true;
    if (date && item.createdAt) {
      const itemDate = item.createdAt.toDate();
      matchesDate = isSameDay(itemDate, date);
    }

    let matchesMonth = true;
    if (month !== "all" && item.createdAt) {
      matchesMonth = item.createdAt.toDate().getMonth() === parseInt(month);
    }
    
    return matchesSearch && matchesDate && matchesMonth;
  });

  const handleSubmit = async (formData: any) => {
    try {
      if (editingItem) {
        await updateDoc(doc(db, "mustahiq-uang", editingItem.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "mustahiq-uang"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await deleteDoc(doc(db, "mustahiq-uang", id));
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map(item => ({
      Nama: item.nama,
      NIK: item.nik,
      Alamat: item.alamat,
      Nominal: item.nominal,
      Tanggal: item.tanggal ? format(new Date(item.tanggal), "dd MMM yyyy", { locale: id }) :
        item.createdAt ? format(item.createdAt.toDate(), "dd MMM yyyy", { locale: id }) : "-",
      Jam: item.jam || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kelola Mustahiq");
    XLSX.writeFile(wb, `Mustahiq_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Penerimaan Uang Mustahiq", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Nama', 'NIK', 'Alamat', 'Nominal', 'Tanggal', 'Jam']],
      body: filteredData.map(item => [
        item.nama,
        item.nik,
        item.alamat,
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.nominal),
        item.tanggal ? format(new Date(item.tanggal), "dd MMM yyyy", { locale: id }) :
          item.createdAt ? format(item.createdAt.toDate(), "dd MMM yyyy", { locale: id }) : "-",
        item.jam || "-",
      ]),
    });
    doc.save(`Mustahiq_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-500 font-serif">Kelola Mustahiq</h1>
        <p className="text-muted-foreground font-sans">Catat dan kelola data penyaluran dana mustahiq secara real-time.</p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIK, alamat..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto"
              onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}
            >
              <Plus className="w-4 h-4" />
              Input Penerima Uang
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

        <MustahiqUangTable 
          data={filteredData} 
          loading={loading} 
          onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      <AnimatePresence>
        {isDialogOpen && (
          <MustahiqUangForm 
            isOpen={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)} 
            onSubmit={handleSubmit}
            initialData={editingItem}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
