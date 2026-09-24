import React from 'react';
import { MessageSquareText } from 'lucide-react';

interface GeneralObservationsProps {
  value: string;
  onChange: (val: string) => void;
}

export const GeneralObservations: React.FC<GeneralObservationsProps> = ({ value, onChange }) => {
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="pb-4 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
            OBSERVAÇÕES FINAIS
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Espaço destinado a anotações complementares, ressalvas técnicas ou orientações ao condutor.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
          OBSERVAÇÕES GERAIS
        </label>
        <div className="relative">
          <textarea
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Descreva aqui qualquer informação adicional referente à inspeção."
            className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-500 transition leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
};
