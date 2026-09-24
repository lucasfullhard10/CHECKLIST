import React from 'react';
import { ChecklistItemData, OperationalClassification } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface InspectionSummaryProps {
  checklist: Record<string, ChecklistItemData>;
  totalExpectedItems: number;
  classification: OperationalClassification;
  onChangeClassification: (c: OperationalClassification) => void;
}

export const InspectionSummary: React.FC<InspectionSummaryProps> = ({
  checklist,
  totalExpectedItems,
  classification,
  onChangeClassification,
}) => {
  const items = Object.values(checklist);
  const okCount = items.filter((i) => i.status === 'OK').length;
  const ncItems = items.filter((i) => i.status === 'NAO_CONFORME');
  const ncCount = ncItems.length;
  const naCount = items.filter((i) => i.status === 'NA').length;
  const answeredCount = okCount + ncCount + naCount;
  const unansweredCount = Math.max(0, totalExpectedItems - answeredCount);

  // Breakdown of non-conformities by severity
  const criticas = ncItems.filter((i) => i.severity === 'CRITICA').length;
  const altas = ncItems.filter((i) => i.severity === 'ALTA').length;
  const medias = ncItems.filter((i) => i.severity === 'MEDIA').length;
  const baixas = ncItems.filter((i) => i.severity === 'BAIXA').length;

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="pb-5 mb-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
            RESULTADO & CLASSIFICAÇÃO OPERACIONAL AUTOMÁTICA
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Balanço quantitativo de conformidade e determinação do parecer técnico de liberação do veículo.
        </p>
      </div>

      {/* 4 Quantitative Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-7">
        {/* ITENS OK */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-800/40">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ITENS OK</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {okCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Conformes com padrão
          </div>
        </div>

        {/* NÃO CONFORMIDADES */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-rose-800/50">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">NÃO CONF.</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {ncCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {ncCount === 0
              ? 'Nenhuma avaria apontada'
              : `${criticas} Crítica(s), ${altas} Alta(s)`}
          </div>
        </div>

        {/* N/A */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">N/A</span>
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-300">
            {naCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Não aplicáveis à carga/veículo
          </div>
        </div>

        {/* SEM RESPOSTA */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-amber-800/40">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">SEM RESPOSTA</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {unansweredCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {unansweredCount === 0 ? 'Checklist 100% preenchido' : 'Itens pendentes de checagem'}
          </div>
        </div>
      </div>

      {/* Operational Classification Section */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
        <div className="mb-4">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
            CLASSIFICAÇÃO OPERACIONAL DO VEÍCULO:
          </span>
          <p className="text-xs text-neutral-400 mt-0.5">
            Defina o parecer conclusivo da blitz operacional com base nas condições avaliadas.
          </p>
        </div>

        {/* 3 Large Classification Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 🟢 VEÍCULO LIBERADO */}
          <button
            type="button"
            onClick={() => onChangeClassification('LIBERADO')}
            className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between ${
              classification === 'LIBERADO'
                ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-950/50'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                <ShieldCheck
                  className={`w-5 h-5 ${
                    classification === 'LIBERADO' ? 'text-emerald-400' : 'text-neutral-500'
                  }`}
                />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">
                VEÍCULO LIBERADO
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Quando não houver não conformidades críticas. Operação 100% apta a prosseguir.
              </p>
            </div>
            {classification === 'LIBERADO' && (
              <span className="mt-3 text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selecionado
              </span>
            )}
          </button>

          {/* 🟡 ATENÇÃO */}
          <button
            type="button"
            onClick={() => onChangeClassification('ATENCAO')}
            className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between ${
              classification === 'ATENCAO'
                ? 'bg-amber-950/60 border-amber-500 shadow-lg shadow-amber-950/50'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                <ShieldAlert
                  className={`w-5 h-5 ${
                    classification === 'ATENCAO' ? 'text-amber-400' : 'text-neutral-500'
                  }`}
                />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">
                ATENÇÃO
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Quando existirem itens não conformes de gravidade baixa/média que precisam de acompanhamento.
              </p>
            </div>
            {classification === 'ATENCAO' && (
              <span className="mt-3 text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selecionado
              </span>
            )}
          </button>

          {/* 🔴 NÃO LIBERADO */}
          <button
            type="button"
            onClick={() => onChangeClassification('NAO_LIBERADO')}
            className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between ${
              classification === 'NAO_LIBERADO'
                ? 'bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-950/50'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                <ShieldX
                  className={`w-5 h-5 ${
                    classification === 'NAO_LIBERADO' ? 'text-rose-400' : 'text-neutral-500'
                  }`}
                />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">
                NÃO LIBERADO
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Quando houver uma condição de risco alto ou crítico que impeça a liberação do veículo.
              </p>
            </div>
            {classification === 'NAO_LIBERADO' && (
              <span className="mt-3 text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selecionado
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
