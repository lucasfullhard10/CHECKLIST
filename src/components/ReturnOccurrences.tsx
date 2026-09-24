import React from 'react';
import { ReturnOccurrencesData } from '../types';
import { RETURN_OCCURRENCE_OPTIONS } from '../constants/checklistData';
import { formatKM } from '../utils/masks';
import { AlertTriangle, Clock, Navigation, CheckCircle2, XCircle } from 'lucide-react';

interface ReturnOccurrencesProps {
  data: ReturnOccurrencesData;
  onChange: (updated: Partial<ReturnOccurrencesData>) => void;
}

export const ReturnOccurrences: React.FC<ReturnOccurrencesProps> = ({ data, onChange }) => {
  const handleToggle = (
    field:
      | 'hadOccurrence'
      | 'hadDamage'
      | 'hadAccident'
      | 'hadNearMiss'
      | 'hadCargoIssue'
      | 'hadReturn',
    val: 'SIM' | 'NAO'
  ) => {
    const updated = { [field]: val };
    onChange(updated);
  };

  // Check if any incident is flagged as 'SIM'
  const hasAnyIncident =
    data.hadOccurrence === 'SIM' ||
    data.hadDamage === 'SIM' ||
    data.hadAccident === 'SIM' ||
    data.hadNearMiss === 'SIM' ||
    data.hadCargoIssue === 'SIM' ||
    data.hadReturn === 'SIM';

  const questions: {
    field:
      | 'hadOccurrence'
      | 'hadDamage'
      | 'hadAccident'
      | 'hadNearMiss'
      | 'hadCargoIssue'
      | 'hadReturn';
    label: string;
    desc: string;
  }[] = [
    {
      field: 'hadOccurrence',
      label: 'Houve ocorrência durante a rota?',
      desc: 'Qualquer intercorrência na via, desvio de rota, atraso ou parada não programada.',
    },
    {
      field: 'hadDamage',
      label: 'Houve avaria no veículo?',
      desc: 'Amassados, arranhões, quebra de retrovisor, lanterna, vidros ou para-choque.',
    },
    {
      field: 'hadAccident',
      label: 'Houve acidente?',
      desc: 'Colisão com outros veículos, obstáculos, atropelamento ou danos a terceiros.',
    },
    {
      field: 'hadNearMiss',
      label: 'Houve quase acidente?',
      desc: 'Situação de risco iminente ou frenagem brusca de emergência.',
    },
    {
      field: 'hadCargoIssue',
      label: 'Houve problema com carga?',
      desc: 'Tombamento interno, avaria de caixas, violação de lacre ou desprendimento.',
    },
    {
      field: 'hadReturn',
      label: 'Houve devolução de mercadoria?',
      desc: 'Recusa no cliente, mercadoria avariada ou falta de recebimento.',
    },
  ];

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="pb-5 mb-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
            AUDITORIA DE RETORNO DA ROTA & OCORRÊNCIAS
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Informe os dados de fechamento do trajeto e registre eventuais sinistros ou não conformidades durante a viagem.
        </p>
      </div>

      {/* KM de Retorno e Horário de Retorno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> KM de Retorno (Hodômetro Final)
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.returnKm}
              onChange={(e) => onChange({ returnKm: formatKM(e.target.value) })}
              placeholder="Ex: 145.450"
              className="w-full pl-9.5 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white font-mono placeholder-neutral-600 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
              km
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Horário de Retorno (Chegada na Base)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="time"
              value={data.returnTime}
              onChange={(e) => onChange({ returnTime: e.target.value })}
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white transition"
            />
          </div>
        </div>
      </div>

      {/* 6 SIM/NÃO Questions */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
          Questionário de Incidentes na Rota
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {questions.map(({ field, label, desc }) => {
            const currentVal = data[field];

            return (
              <div
                key={field}
                className={`p-3.5 rounded-xl border transition ${
                  currentVal === 'SIM'
                    ? 'border-amber-600/70 bg-amber-950/20'
                    : currentVal === 'NAO'
                    ? 'border-neutral-800 bg-neutral-950'
                    : 'border-neutral-800/80 bg-neutral-950/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      {label}
                    </span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      {desc}
                    </span>
                  </div>

                  {/* Buttons SIM / NAO */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(field, 'SIM')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        currentVal === 'SIM'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      SIM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(field, 'NAO')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        currentVal === 'NAO'
                          ? 'bg-emerald-700 text-white shadow-md'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      NÃO
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditional: Automatically opens if ANY question is 'SIM' */}
      {hasAnyIncident && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border-2 border-amber-600/60 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-extrabold uppercase tracking-wide">
              DESCREVA A OCORRÊNCIA (OBRIGATÓRIO DEVIDO À RESPOSTA "SIM")
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Ocorrências da Rota Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-200 uppercase tracking-wider mb-1.5">
                Tipo Principal de Ocorrência
              </label>
              <select
                value={data.occurrenceType}
                onChange={(e) => onChange({ occurrenceType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-amber-500/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white transition cursor-pointer"
              >
                <option value="">Selecione a classificação da ocorrência...</option>
                {RETURN_OCCURRENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição Detalhada da Ocorrência */}
            <div>
              <label className="block text-xs font-bold text-neutral-200 uppercase tracking-wider mb-1.5">
                Descrição Detalhada da Ocorrência
              </label>
              <textarea
                rows={4}
                value={data.occurrenceDescription}
                onChange={(e) => onChange({ occurrenceDescription: e.target.value })}
                placeholder="Descreva detalhadamente o ocorrido (local, quilômetro, horário, danos causados, providências adotadas, envolvimento de terceiros, boletim de ocorrência, etc.)."
                className="w-full p-3 rounded-xl bg-neutral-900 border border-amber-500/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-neutral-500 transition leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
