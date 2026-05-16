"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileDown, Table as TableIcon } from "lucide-react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Telepon, TeleponInput } from "@/lib/schema-pesan";
import TeleponTable from "@/components/pesan/TeleponTable";
import TeleponForm from "@/components/pesan/TeleponForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, isSameDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function TeleponPage() {
  const [teleponList, setTeleponList] = useState<Telepon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<Telepon | null>(null);

  useEffect(() => {
    const q = query(collection(db, "telepon"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Telepon[];
      setTeleponList(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = teleponList.filter((t) => {
    const matchesSearch = 
      (t.nama || "").toLowerCase().includes(search.toLowerCase()) || 
      (t.keperluan || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.nomorTelepon || "").toLowerCase().includes(search.toLowerCase());
    
    let matchesDate = true;
    if (date && t.createdAt) {
      const tDate = t.createdAt.toDate();
      matchesDate = isSameDay(tDate, date);
    }

    let matchesMonth = true;
    if (month !== "all" && t.createdAt) {
      matchesMonth = t.createdAt.toDate().getMonth() === parseInt(month);
    }
    
    return matchesSearch && matchesDate && matchesMonth;
  });

  const handleAdd = async (data: TeleponInput) => {
    try {
      if (editingData) {
        await updateDoc(doc(db, "telepon", editingData.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "telepon"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      setIsDialogOpen(false);
      setEditingData(null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (idStr: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await deleteDoc(doc(db, "telepon", idStr));
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map((t, index) => ({
      "NO": index + 1,
      "TANGGAL": t.tanggal ? format(new Date(t.tanggal), "dd MMM yyyy", { locale: idLocale }) : 
        t.createdAt ? format(t.createdAt.toDate(), "dd MMM yyyy", { locale: idLocale }) : "-",
      "JAM": t.jam || "-",
      "NAMA": t.nama,
      "INSTANSI": t.instansi || "-",
      "NO. TELEPON": t.nomorTelepon,
      "KEPERLUAN": t.keperluan,
      "KETERANGAN": t.keterangan || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Telepon");
    XLSX.writeFile(wb, `Log_Telepon_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Log Telepon", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['NO', 'TANGGAL', 'JAM', 'NAMA', 'INSTANSI', 'NO. TELEPON', 'KEPERLUAN', 'KETERANGAN']],
      body: filteredData.map((t, index) => [
        index + 1,
        t.tanggal ? format(new Date(t.tanggal), "dd MMM yyyy", { locale: idLocale }) : 
          t.createdAt ? format(t.createdAt.toDate(), "dd MMM yyyy", { locale: idLocale }) : "-",
        t.jam || "-",
        t.nama, 
        t.instansi || "-",
        t.nomorTelepon, 
        t.keperluan,
        t.keterangan || "-", 
      ]),
    });
    doc.save(`Log_Telepon_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-500 font-serif">Log Telepon</h1>
        <p className="text-muted-foreground font-sans">Catat dan kelola data telepon masuk.</p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, penerima, atau no..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto"
            onClick={() => { setEditingData(null); setIsDialogOpen(true); }}
          >
            <Plus className="w-4 h-4" />
            Tambah Data
          </Button>
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

        <TeleponTable 
          teleponList={filteredData} 
          loading={loading} 
          onEdit={(t) => { setEditingData(t); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      {isDialogOpen && (
        <TeleponForm 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          onSubmit={handleAdd}
          initialData={editingData}
        />
      )}
    </div>
  );
}
