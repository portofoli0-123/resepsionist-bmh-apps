"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileDown, Table as TableIcon } from "lucide-react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Surat, SuratInput } from "@/lib/schema-pesan";
import SuratTable from "@/components/pesan/SuratTable";
import SuratForm from "@/components/pesan/SuratForm";
import SuratDetailModal from "@/components/pesan/SuratDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, isSameDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function SuratPage() {
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingData, setEditingData] = useState<Surat | null>(null);
  const [viewingData, setViewingData] = useState<Surat | null>(null);

  useEffect(() => {
    const q = query(collection(db, "surat"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Surat[];
      setSuratList(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = suratList.filter((s) => {
    const matchesSearch =
      (s.jenisDokumen || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.kodeDokumen || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.namaPengirim || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.ditujukanKepada || "").toLowerCase().includes(search.toLowerCase());

    let matchesDate = true;
    if (date && s.createdAt) {
      const sDate = s.createdAt.toDate();
      matchesDate = isSameDay(sDate, date);
    }

    let matchesMonth = true;
    if (month !== "all" && s.createdAt) {
      matchesMonth = s.createdAt.toDate().getMonth() === parseInt(month);
    }

    return matchesSearch && matchesDate && matchesMonth;
  });

  const handleAdd = async (data: SuratInput) => {
    try {
      if (editingData) {
        await updateDoc(doc(db, "surat", editingData.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "surat"), {
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
      await deleteDoc(doc(db, "surat", idStr));
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map((s, index) => ({
      "NO": index + 1,
      "TANGGAL": s.tanggal ? format(new Date(s.tanggal), "dd MMM yyyy", { locale: idLocale }) : "-",
      "JAM": s.jam || "-",
      "JENIS DOKUMEN": s.jenisDokumen,
      "KODE DOKUMEN": s.kodeDokumen || "-",
      "NAMA PENGIRIM": s.namaPengirim,
      "INSTANSI": s.instansi || "-",
      "DI TUJUKAN KEPADA": s.ditujukanKepada,
      "TANGGAL MASUK DOKUMEN": s.tanggalMasuk ? format(new Date(s.tanggalMasuk), "dd MMM yyyy", { locale: idLocale }) : "-",
      "DISERAHKAN KEPADA": s.diserahkanKepada,
      "TANGGAL DISERAHKAN": s.tanggalDiserahkan ? format(new Date(s.tanggalDiserahkan), "dd MMM yyyy", { locale: idLocale }) : "-",
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Surat");
    XLSX.writeFile(wb, `Log_Surat_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Laporan Log Surat Masuk", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['NO', 'TANGGAL', 'JAM', 'JENIS DOKUMEN', 'KODE DOKUMEN', 'PENGIRIM', 'INSTANSI', 'DITUJUKAN', 'TGL. MASUK', 'DISERAHKAN KE', 'TGL. DISERAHKAN']],
      body: filteredData.map((s, index) => [
        index + 1,
        s.tanggal ? format(new Date(s.tanggal), "dd MMM yyyy", { locale: idLocale }) : "-",
        s.jam || "-",
        s.jenisDokumen || "-",
        s.kodeDokumen || "-",
        s.namaPengirim || "-",
        s.instansi || "-",
        s.ditujukanKepada || "-",
        s.tanggalMasuk ? format(new Date(s.tanggalMasuk), "dd MMM yyyy", { locale: idLocale }) : "-",
        s.diserahkanKepada || "-",
        s.tanggalDiserahkan ? format(new Date(s.tanggalDiserahkan), "dd MMM yyyy", { locale: idLocale }) : "-",
      ]),
      styles: { fontSize: 8 },
    });
    doc.save(`Log_Surat_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-500 font-serif">Surat Masuk</h1>
        <p className="text-muted-foreground font-sans">Catat dan kelola data surat masuk.</p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengirim, penerima, atau no..."
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

        <SuratTable
          suratList={filteredData}
          loading={loading}
          onView={(s) => { setViewingData(s); setIsDetailOpen(true); }}
          onEdit={(s) => { setEditingData(s); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      {isDialogOpen && (
        <SuratForm
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleAdd}
          initialData={editingData}
        />
      )}

      <SuratDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        data={viewingData}
      />
    </div>
  );
}
