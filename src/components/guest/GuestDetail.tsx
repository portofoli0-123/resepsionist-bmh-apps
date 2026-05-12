"use client";

import { Guest } from "@/lib/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Tag, Info, Building2 } from "lucide-react";

interface GuestDetailProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
}

export default function GuestDetail({ isOpen, onClose, guest }: GuestDetailProps) {
  if (!guest) return null;

  const detailItems = [
    {
      icon: <User className="w-4 h-4 text-emerald-600" />,
      label: "Nama Lengkap",
      value: guest.nama,
    },
    {
      icon: <Calendar className="w-4 h-4 text-emerald-600" />,
      label: "Tanggal Kunjungan",
      value: (guest as any).tanggal
        ? format(new Date((guest as any).tanggal), "eeee, dd MMMM yyyy", { locale: id })
        : guest.createdAt
        ? format(guest.createdAt.toDate(), "eeee, dd MMMM yyyy", { locale: id })
        : "-",
    },
    {
      icon: <Clock className="w-4 h-4 text-emerald-600" />,
      label: "Jam Kunjungan",
      value: (guest as any).jam || "-",
    },
    {
      icon: <Tag className="w-4 h-4 text-emerald-600" />,
      label: "Kategori",
      value: guest.kategori,
    },
    {
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      label: "Institusi / Lembaga",
      value: (guest as any).institusi || "-",
    },
    {
      icon: <Phone className="w-4 h-4 text-emerald-600" />,
      label: "No. WhatsApp",
      value: (guest as any).whatsapp || "-",
    },
    {
      icon: <Info className="w-4 h-4 text-emerald-600" />,
      label: "Keperluan",
      value: guest.keperluan || "-",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] rounded-xl overflow-hidden p-0 gap-0">
        <DialogHeader className="bg-emerald-600 p-6 text-white">
          <DialogTitle className="font-serif text-2xl">Detail Pengunjung</DialogTitle>
          <p className="text-emerald-50 opacity-90 text-sm mt-1">Informasi lengkap data tamu gerai.</p>
        </DialogHeader>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailItems.map((item, index) => (
              <div key={index} className={`space-y-1.5 ${item.label === "Keperluan" || item.label === "Institusi / Lembaga" ? "md:col-span-2" : ""}`}>
                <div className="flex items-center gap-2 text-gray-500">
                  {item.icon}
                  <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                </div>
                <div className="pl-6 text-gray-900 font-medium leading-relaxed">
                  {item.label === "Kategori" ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      guest.kategori === 'Donatur' ? 'bg-blue-100 text-blue-800' :
                      guest.kategori === 'Mustahiq' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.value}
                    </span>
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
