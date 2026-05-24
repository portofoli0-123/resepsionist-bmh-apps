"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-md relative overflow-hidden space-y-6"
      >
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-x-8 translate-y-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-center">
          <div className="relative">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0 animate-pulse">
              <Clock className="w-12 h-12" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 p-1 bg-emerald-500 text-white rounded-full">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Akan Datang
          </div>
          <h1 className="text-2xl font-bold font-serif text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Halaman ini sedang dalam proses pengembangan oleh tim kami. Fitur hebat ini akan segera hadir untuk menyempurnakan operasional Anda!
          </p>
        </div>

        <div className="pt-2">
          <Link href="/" passHref>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium w-full rounded-xl h-11 transition-all duration-300">
              <LayoutDashboard className="w-4 h-4" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
