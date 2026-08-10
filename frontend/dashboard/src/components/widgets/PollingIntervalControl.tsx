"use client";

import { useEffect, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import {
  POLLING_OPTIONS_MS,
  useSensorData,
} from "@/contexts/sensor-data";

function formatShort(ms: number): string {
  if (ms % 60000 === 0) return `${ms / 60000}m`;
  return `${ms / 1000}s`;
}

function formatLabel(ms: number): string {
  if (ms % 60000 === 0) {
    const minutes = ms / 60000;
    return minutes === 1 ? "1 minuto" : `${minutes} minutos`;
  }
  return `${ms / 1000} segundos`;
}

export function PollingIntervalControl() {
  const { intervalMs, setIntervalMs } = useSensorData();
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(intervalMs);

  const openModal = () => {
    setSelection(intervalMs);
    setOpen(true);
  };

  const closeDiscard = () => {
    setSelection(intervalMs);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prevOverflow;
    };
  }, [open]);

  const apply = () => {
    setIntervalMs(selection);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold tracking-wide text-zinc-200">
          Cada {formatShort(intervalMs)}
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Cambiar frecuencia de actualización"
          onClick={openModal}
        >
          <Pencil />
        </Button>
      </div>

      <Dialog.Root open={open} onOpenChange={(next) => (next ? openModal() : closeDiscard())}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[enter]:animate-in data-[enter]:fade-in" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900 p-5 text-left text-white shadow-2xl outline-none data-[enter]:animate-in data-[enter]:fade-in data-[enter]:zoom-in-95">
            <Dialog.Title className="font-display text-lg font-bold tracking-tight">
              Frecuencia de actualización
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-zinc-400">
              ¿Cada cuánto tiempo buscar del ESP32?
            </Dialog.Description>

            <div
              role="radiogroup"
              aria-label="Frecuencia de actualización"
              className="mt-4 space-y-1.5"
            >
              {POLLING_OPTIONS_MS.map((ms) => {
                const isSelected = selection === ms;
                return (
                  <button
                    key={ms}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelection(ms)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border border-sky-400/30 bg-sky-500/15 text-sky-100"
                        : "border border-transparent text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <span>{formatLabel(ms)}</span>
                    {isSelected && <Check className="h-4 w-4 text-sky-300" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" className="text-zinc-300" onClick={closeDiscard}>
                Cancelar
              </Button>
              <Button className="bg-sky-600 text-white hover:bg-sky-500" onClick={apply}>
                Aceptar
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}