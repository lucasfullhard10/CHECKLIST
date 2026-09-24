import React from 'react';
import { InspectionData } from '../types';
import { X, FileText, Download, Trash2, Calendar, Clock, CheckCircle2, AlertTriangle, ShieldX } from 'lucide-react';
import { generateInspectionPDF } from '../utils/pdfGenerator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedInspections: InspectionData[];
  onLoadInspection: (item: InspectionData) => void;
  onDeleteInspection: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedInspections,
  onLoadInspection,
  onDeleteInspection,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Histórico Local de Blitz</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Inspeções salvas neste navegador ({savedInspections.length})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedInspections.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold text-neutral-400">
                Nenhum checklist salvo ainda
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Ao gerar um PDF ou salvar o checklist, ele ficará disponível aqui para consulta rápida.
              </p>
            </div>
          ) : (
            savedInspections.map((item) => {
              const dateStr = item.identification.date || item.createdAt.slice(0, 10);
              const isSaida = item.type === 'SAIDA';

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isSaida
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                      }`}
                    >
                      {isSaida ? '🟢 SAÍDA DE ROTA' : '⚫ RETORNO DE ROTA'}
                    </span>
                    <span className="text-xs font-mono font-bold text-white tracking-wider">
                      {item.identification.plate || 'SEM PLACA'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-neutral-200 truncate mb-1">
                    {item.identification.driverName || 'Motorista não informado'}
                  </h4>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {item.identification.time || '--:--'}
                    </span>
                    <span
                      className={`font-bold ${
                        item.classification === 'LIBERADO'
                          ? 'text-emerald-400'
                          : item.classification === 'ATENCAO'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {item.classification}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadInspection(item);
                        onClose();
                      }}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      Abrir no Formulário
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => generateInspectionPDF(item)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition"
                        title="Baixar PDF novamente"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteInspection(item.id)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/50 text-neutral-400 hover:text-rose-300 transition"
                        title="Excluir do histórico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
