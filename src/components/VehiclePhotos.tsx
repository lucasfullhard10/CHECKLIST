import React, { useRef, useState } from 'react';
import { VehiclePhotosData } from '../types';
import { Camera, Upload, Trash2, RefreshCw, Eye, CheckCircle2, Maximize2, X } from 'lucide-react';

interface VehiclePhotosProps {
  photos: VehiclePhotosData;
  onChange: (updated: Partial<VehiclePhotosData>) => void;
}

interface PhotoFieldConfig {
  key: keyof VehiclePhotosData;
  label: string;
  tag: string;
  description: string;
}

const PHOTO_FIELDS: PhotoFieldConfig[] = [
  {
    key: 'front',
    label: 'FOTO 1 — FRENTE DO VEÍCULO',
    tag: 'Frente & Placa Dianteira',
    description: 'Enquadre a grade frontal, para-choque, faróis e placa dianteira.',
  },
  {
    key: 'rear',
    label: 'FOTO 2 — TRASEIRA DO VEÍCULO',
    tag: 'Traseira & Placa Traseira',
    description: 'Enquadre portas traseiras/baú, lanternas, para-choque e placa.',
  },
  {
    key: 'left',
    label: 'FOTO 3 — LADO ESQUERDO',
    tag: 'Lateral Motorista',
    description: 'Enquadre a lateral esquerda completa, cabine, pneus e faixas refletivas.',
  },
  {
    key: 'right',
    label: 'FOTO 4 — LADO DIREITO',
    tag: 'Lateral Ajudante',
    description: 'Enquadre a lateral direita completa, tanque/estepe, pneus e baú.',
  },
];

// Helper to compress image client-side to prevent memory bloat
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Convert to high quality JPEG
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressed);
      };
      img.onerror = () => reject(new Error('Erro ao processar imagem'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

export const VehiclePhotos: React.FC<VehiclePhotosProps> = ({ photos, onChange }) => {
  const [viewingPhoto, setViewingPhoto] = useState<{ title: string; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fileInputRefs = {
    front: useRef<HTMLInputElement>(null),
    rear: useRef<HTMLInputElement>(null),
    left: useRef<HTMLInputElement>(null),
    right: useRef<HTMLInputElement>(null),
  };

  const handleFileSelected = async (key: keyof VehiclePhotosData, file?: File) => {
    if (!file) return;
    try {
      setIsProcessing(key);
      const base64 = await compressImage(file);
      onChange({ [key]: base64 });
    } catch (err) {
      console.error('Falha ao processar foto', err);
    } finally {
      setIsProcessing(null);
    }
  };

  const filledCount = Object.values(photos).filter(Boolean).length;

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
              REGISTRO FOTOGRÁFICO DO VEÍCULO (4 FOTOS)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Capture ou anexe as 4 perspectivas obrigatórias. Proporção preservada e inclusão automática no PDF 2x2.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-400">Progresso:</span>
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              filledCount === 4
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
            }`}
          >
            {filledCount} de 4 Fotos
          </span>
        </div>
      </div>

      {/* 2x2 Grid of Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PHOTO_FIELDS.map(({ key, label, tag, description }) => {
          const photoUrl = photos[key];
          const processing = isProcessing === key;

          return (
            <div
              key={key}
              className={`rounded-2xl border transition-all ${
                photoUrl
                  ? 'border-emerald-700/60 bg-neutral-950'
                  : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
              } p-4 flex flex-col justify-between`}
            >
              {/* Photo Title & Tag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                    {label}
                  </h3>
                  <span className="text-[11px] font-medium text-emerald-400 block mt-0.5">
                    {tag}
                  </span>
                </div>
                {photoUrl && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Anexada
                  </span>
                )}
              </div>

              {/* Preview or Upload Area */}
              <div className="relative w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center group">
                {photoUrl ? (
                  <>
                    <img
                      src={photoUrl}
                      alt={label}
                      className="w-full h-full object-contain bg-neutral-950"
                    />

                    {/* Overlay Actions on Hover/Touch */}
                    <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={() => setViewingPhoto({ title: label, url: photoUrl })}
                        className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition shadow-lg"
                        title="Ampliar visualização"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRefs[key].current?.click()}
                        className="p-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition shadow-lg"
                        title="Substituir foto"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ [key]: null })}
                        className="p-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white transition shadow-lg"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => fileInputRefs[key].current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-neutral-850/50 transition"
                  >
                    {processing ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-400">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-semibold">Processando foto...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 mb-2 group-hover:scale-105 group-hover:border-emerald-500 group-hover:text-emerald-400 transition">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-neutral-200 uppercase tracking-wide">
                          Fotografar ou Anexar
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-1 max-w-[220px]">
                          {description}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-neutral-900">
                <input
                  ref={fileInputRefs[key]}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFileSelected(key, e.target.files?.[0])}
                />

                {photoUrl ? (
                  <div className="w-full flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setViewingPhoto({ title: label, url: photoUrl })}
                      className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visualizar</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRefs[key].current?.click()}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Substituir</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ [key]: null })}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRefs[key].current?.click()}
                    className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Selecionar Imagem</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Modal for inspecting photo */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                {viewingPhoto.title}
              </h4>
              <button
                type="button"
                onClick={() => setViewingPhoto(null)}
                className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-neutral-950 flex items-center justify-center max-h-[75vh]">
              <img
                src={viewingPhoto.url}
                alt={viewingPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
