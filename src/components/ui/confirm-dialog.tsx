"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default" | "success";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Yakin",
  cancelText = "Batal",
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            {variant === "destructive" && (
              <div className="p-2 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            {variant === "success" && (
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
            {variant === "default" && (
              <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full shrink-0">
                <Info className="w-5 h-5" />
              </div>
            )}
            <DialogTitle className="text-lg font-bold font-serif text-foreground">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-row justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="rounded-lg h-9 px-4 text-xs font-medium bg-background border-border hover:bg-muted"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-lg h-9 px-4 text-xs font-medium text-white border-none ${
              variant === "success" 
                ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600" 
                : variant === "default"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : ""
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
