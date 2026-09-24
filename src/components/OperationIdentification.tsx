import React from 'react';
import { BlitzType, OperationIdentificationData } from '../types';
import { VEHICLE_TYPES } from '../constants/checklistData';
import { formatCPF, formatPlate, formatKM, isValidPlate } from '../utils/masks';
import { User, CreditCard, Hash, Calendar, Clock, Truck, Building2, MapPin, Navigation, UserCheck } from 'lucide-react';

interface OperationIdentificationProps {
  type: BlitzType;
  data: OperationIdentificationData;
  onChange: (updated: Partial<OperationIdentificationData>) => void;
}

export const OperationIdentification: React.FC<OperationIdentificationProps> = ({
  type,
  data,
  onChange,
}) => {
  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlate(e.target.value);
    onChange({ plate: formatted });
  };

  const handleCpfChange = (field: 'driverCpf' | 'inspectorCpf', val: string) => {
    onChange({ [field]: formatCPF(val) });
  };

  const handleSetCurrentDateTime = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    onChange({ date: dateStr, time: timeStr });
  };

  const isPlateValid = data.plate.length > 0 ? isValidPlate(data.plate) : true;

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
              IDENTIFICAÇÃO DA OPERAÇÃO
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Preencha os dados cadastrais do condutor, veículo e parâmetros da rota.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSetCurrentDateTime}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-400 border border-neutral-700 transition"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Preencher Data/Hora Atual</span>
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Nome do Motorista */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Nome Completo do Motorista
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              required
              value={data.driverName}
              onChange={(e) => onChange({ driverName: e.target.value })}
              placeholder="Ex: Carlos Eduardo da Silva"
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-600 transition"
            />
          </div>
        </div>

        {/* CPF do Motorista */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> CPF do Motorista
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.driverCpf}
              onChange={(e) => handleCpfChange('driverCpf', e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-600 font-mono transition"
            />
          </div>
        </div>

        {/* Placa do Veículo */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              <span className="text-emerald-400">*</span> Placa do Veículo
            </label>
            <span className="text-[10px] text-neutral-500 uppercase font-mono">
              Mercosul ou Padrão
            </span>
          </div>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              required
              value={data.plate}
              onChange={handlePlateChange}
              placeholder="ABC1D23 ou ABC-1234"
              maxLength={8}
              className={`w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border ${
                !isPlateValid ? 'border-amber-500' : 'border-neutral-700'
              } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white font-mono font-bold tracking-widest placeholder-neutral-600 uppercase transition`}
            />
          </div>
          {!isPlateValid && data.plate.length > 0 && (
            <p className="text-[11px] text-amber-400 mt-1">
              Formato de placa em validação (ex: ABC1D23 ou ABC-1234)
            </p>
          )}
        </div>

        {/* KM Inicial/Final */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> {type === 'SAIDA' ? 'KM Inicial (Saída)' : 'KM de Saída (Inicial)'}
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.kmInitial}
              onChange={(e) => onChange({ kmInitial: formatKM(e.target.value) })}
              placeholder="Ex: 145.280"
              className="w-full pl-9.5 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white font-mono placeholder-neutral-600 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
              km
            </span>
          </div>
        </div>

        {/* Data */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Data da Inspeção
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white transition"
            />
          </div>
        </div>

        {/* Horário */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Horário
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="time"
              value={data.time}
              onChange={(e) => onChange({ time: e.target.value })}
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white transition"
            />
          </div>
        </div>

        {/* Tipo de Veículo */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Tipo de Veículo
          </label>
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <select
              value={data.vehicleType}
              onChange={(e) => onChange({ vehicleType: e.target.value })}
              className="w-full pl-9.5 pr-8 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white transition appearance-none cursor-pointer"
            >
              <option value="">Selecione o tipo de veículo...</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Unidade / Filial */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Unidade / Filial
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.unit}
              onChange={(e) => onChange({ unit: e.target.value })}
              placeholder="Ex: Matriz São Paulo / CD Lapa"
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-600 transition"
            />
          </div>
        </div>

        {/* Rota */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Rota / Linha
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.route}
              onChange={(e) => onChange({ route: e.target.value })}
              placeholder="Ex: Rota 14 - Interior SP / Campinas"
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-600 transition"
            />
          </div>
        </div>

        {/* Cidade / Região */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Cidade / Região
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.cityRegion}
              onChange={(e) => onChange({ cityRegion: e.target.value })}
              placeholder="Ex: Campinas e Região Metropolitana"
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-600 transition"
            />
          </div>
        </div>

        {/* Nome do Responsável pela Blitz */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">*</span> Nome do Responsável pela Blitz
          </label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.inspectorName}
              onChange={(e) => onChange({ inspectorName: e.target.value })}
              placeholder="Ex: Roberto Mendes (Inspetor de Frota)"
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-600 transition"
            />
          </div>
        </div>

        {/* CPF do Responsável */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            CPF do Responsável
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={data.inspectorCpf}
              onChange={(e) => handleCpfChange('inspectorCpf', e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white font-mono placeholder-neutral-600 transition"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
