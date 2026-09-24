import React from 'react';
import { BlitzType } from '../types';
import { LogOut, LogIn, ArrowRight, ShieldCheck, ClipboardCheck, Sparkles } from 'lucide-react';

interface HomeSelectorProps {
  onSelectType: (type: BlitzType) => void;
  onNewChecklist: () => void;
}

export const HomeSelector: React.FC<HomeSelectorProps> = ({
  onSelectType,
  onNewChecklist,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-neutral-100 animate-in fade-in duration-300">
      {/* Hero Branding */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 uppercase">
          AMPLA SERVICE
        </h1>
        <div className="inline-block bg-neutral-900 border border-neutral-800 px-4 py-1.5 rounded-lg mb-3">
          <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">
            BLITZ OPERACIONAL DE VEÍCULOS
          </span>
        </div>
        <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto font-medium">
          Sistema de gestão e inspeção rigorosa da frota — Ampla Service Grupo Ltda.
        </p>
        <div className="mt-4 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          Selecione o tipo de inspeção
        </div>
      </div>

      {/* Two Big Main Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
        {/* Option 1: 🟢 BLITZ DE SAÍDA DE ROTA */}
        <button
          type="button"
          onClick={() => onSelectType('SAIDA')}
          className="group relative text-left bg-gradient-to-b from-neutral-900 to-neutral-950 hover:from-neutral-850 hover:to-neutral-900 p-6 sm:p-8 rounded-2xl border-2 border-emerald-600/40 hover:border-emerald-500 transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/40 active:scale-[0.99] flex flex-col justify-between"
        >
          <div className="absolute top-5 right-5 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />

          <div>
            <div className="w-14 h-14 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                FASE INICIAL
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-emerald-300 transition-colors">
              🟢 BLITZ DE SAÍDA DE ROTA
            </h2>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
              Inspeção prévia à partida da viagem. Verificação de documentação do condutor, integridade do veículo, pneus, iluminação, freios, cabine, carga e segurança geral.
            </p>

            <ul className="space-y-1.5 text-xs text-neutral-300 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Documentação & Treinamentos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Condições mecânicas, freios e pneus</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Acondicionamento e amarração de carga</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>4 Fotos obrigatórias & Assinaturas digitais</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-emerald-400 text-sm font-bold uppercase tracking-wide">
            <span>Iniciar Blitz de Saída</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </button>

        {/* Option 2: ⚫ BLITZ DE RETORNO DE ROTA */}
        <button
          type="button"
          onClick={() => onSelectType('RETORNO')}
          className="group relative text-left bg-gradient-to-b from-neutral-900 to-neutral-950 hover:from-neutral-850 hover:to-neutral-900 p-6 sm:p-8 rounded-2xl border-2 border-neutral-700 hover:border-neutral-500 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.99] flex flex-col justify-between"
        >
          <div className="absolute top-5 right-5 w-4 h-4 rounded-full bg-neutral-400 shadow-[0_0_10px_rgba(163,163,163,0.6)]" />

          <div>
            <div className="w-14 h-14 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-200 mb-5 group-hover:scale-110 transition-transform">
              <LogIn className="w-7 h-7" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                FASE CONCLUSIVA
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-neutral-200 transition-colors">
              ⚫ BLITZ DE RETORNO DE ROTA
            </h2>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
              Inspeção pós-viagem no desembarque. Avaliação de quilometragem percorrida, integridade de componentes, relato de ocorrências ou avarias, devoluções e entrega de carga.
            </p>

            <ul className="space-y-1.5 text-xs text-neutral-300 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>KM e Horário de Retorno</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Auditoria de avarias, acidentes ou quase acidentes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Estado de implemento e sobras de carga</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>4 Fotos obrigatórias & Assinaturas digitais</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-neutral-300 text-sm font-bold uppercase tracking-wide">
            <span>Iniciar Blitz de Retorno</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Quick Action Button: NOVO CHECKLIST */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onNewChecklist}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-sm tracking-wide uppercase border border-neutral-700 transition active:scale-95 shadow-md"
        >
          <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          <span>NOVO CHECKLIST</span>
        </button>
      </div>
    </div>
  );
};
