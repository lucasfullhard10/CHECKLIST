import React from 'react';
import { BlitzType } from '../types';
import { ShieldCheck, RotateCcw, Truck, History } from 'lucide-react';

interface HeaderProps {
  currentType: BlitzType | null;
  onNewChecklist: () => void;
  onOpenHistory: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentType,
  onNewChecklist,
  onOpenHistory,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Company */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-500/30">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base sm:text-lg text-white">
                AMPLA SERVICE
              </span>
              <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Grupo Ltda.
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              BLITZ OPERACIONAL DE FROTA
            </p>
          </div>
        </div>

        {/* Current status pill & Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentType && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentType === 'SAIDA' ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
                }`}
              />
              <span className="text-neutral-200">
                {currentType === 'SAIDA' ? 'Blitz de Saída de Rota' : 'Blitz de Retorno de Rota'}
              </span>
            </div>
          )}

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700 transition"
            title="Ver histórico de inspeções locais"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Histórico</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-600/80 text-white rounded text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Checklist Button */}
          <button
            type="button"
            onClick={onNewChecklist}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>NOVO CHECKLIST</span>
          </button>
        </div>
      </div>
    </header>
  );
};
