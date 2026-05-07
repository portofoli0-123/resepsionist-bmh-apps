"use client"
 
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TriangleAlertIcon, Loader2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteGuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guestName: string
  isLoading?: boolean
  onConfirm: () => void
}

export function DeleteGuestDialog({
  open,
  onOpenChange,
  guestName,
  isLoading = false,
  onConfirm,
}: DeleteGuestDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            {isLoading ? (
              <Loader2Icon className="h-6 w-6 text-destructive animate-spin" />
            ) : (
              <TriangleAlertIcon className="h-6 w-6 text-destructive" />
            )}
          </div>
          <AlertDialogTitle className="text-center">
            Hapus Data Tamu?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Apakah Anda yakin ingin menghapus data tamu{" "}
            <strong className="text-foreground">{guestName}</strong>? Tindakan
            ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-w-[100px]"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
