"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileDown, Table as TableIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AmilKeluar } from "@/lib/schema";
import AmilKeluarTable from "@/components/amil-keluar/AmilKeluarTable";
import AmilKeluarForm from "@/components/amil-keluar/AmilKeluarForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";

export default function AmilKeluarPage() {
  const [data, setData] = useState<AmilKeluar[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AmilKeluar | null>(null);

  useEffect(() => {
    const q = query(collection(db, "amil-keluar"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AmilKeluar[];
      setData(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) || 
      item.keperluan.toLowerCase().includes(search.toLowerCase());
    
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
        await updateDoc(doc(db, "amil-keluar", editingItem.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "amil-keluar"), {
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
      await deleteDoc(doc(db, "amil-keluar", id));
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map(item => ({
      Nama: item.nama,
      Tanggal: (item as any).tanggal ? format(new Date((item as any).tanggal), "dd MMM yyyy", { locale: id }) :
        item.createdAt ? format(item.createdAt.toDate(), "dd MMM yyyy", { locale: id }) : "-",
      Jam: (item as any).jam || "-",
      Keperluan: item.keperluan,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Amil Keluar");
    XLSX.writeFile(wb, `Amil_Keluar_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Amil Keluar", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Nama', 'Tanggal', 'Jam', 'Keperluan']],
      body: filteredData.map(item => [
        item.nama,
        (item as any).tanggal ? format(new Date((item as any).tanggal), "dd MMM yyyy", { locale: id }) :
          item.createdAt ? format(item.createdAt.toDate(), "dd MMM yyyy", { locale: id }) : "-",
        (item as any).jam || "-",
        item.keperluan,
      ]),
    });
    doc.save(`Amil_Keluar_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 font-serif">Amil Keluar</h1>
        <p className="text-gray-500 font-sans">Catat dan kelola data amil yang keluar kantor secara real-time.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nama atau keperluan..."
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
              Tambah Amil Keluar
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

        <AmilKeluarTable 
          data={filteredData} 
          loading={loading} 
          onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      <AnimatePresence>
        {isDialogOpen && (
          <AmilKeluarForm 
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
