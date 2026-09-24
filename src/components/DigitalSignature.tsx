import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eraser, PenTool, CheckCircle2, UserCheck, User } from 'lucide-react';
import { formatCPF } from '../utils/masks';

interface SignaturePadProps {
  title: string;
  roleLabel: string;
  name: string;
  cpf: string;
  signatureDataUrl: string | null;
  onNameChange: (val: string) => void;
  onCpfChange: (val: string) => void;
  onSignatureChange: (dataUrl: string | null) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  title,
  roleLabel,
  name,
  cpf,
  signatureDataUrl,
  onNameChange,
  onCpfChange,
  onSignatureChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!signatureDataUrl);

  // Initialize canvas with clean background
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI resolution
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If existing signatureDataUrl, draw it
    if (signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = signatureDataUrl;
    }
  }, [signatureDataUrl]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling while signing
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureChange(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <span className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
          {roleLabel}
        </span>
      </div>

      {/* Name and CPF Inputs */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nome do assinante"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
            CPF
          </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => onCpfChange(formatCPF(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Digital Signature Canvas */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            Assinatura na Tela (Dedo ou Mouse)
          </label>
          {hasDrawn && (
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Assinado
            </span>
          )}
        </div>

        <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-neutral-700 bg-white">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="signature-canvas w-full h-32 sm:h-36 cursor-crosshair block"
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-neutral-400 text-xs font-medium">
              Assine aqui com o dedo ou mouse
            </div>
          )}
        </div>

        {/* Clear Signature Button */}
        <div className="mt-2.5 flex items-center justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-bold uppercase tracking-wider transition"
          >
            <Eraser className="w-3.5 h-3.5 text-rose-400" />
            <span>LIMPAR ASSINATURA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface DigitalSignaturesSectionProps {
  inspectorName: string;
  inspectorCpf: string;
  inspectorSignature: string | null;
  driverName: string;
  driverCpf: string;
  driverSignature: string | null;
  onInspectorNameChange: (val: string) => void;
  onInspectorCpfChange: (val: string) => void;
  onInspectorSignatureChange: (dataUrl: string | null) => void;
  onDriverNameChange: (val: string) => void;
  onDriverCpfChange: (val: string) => void;
  onDriverSignatureChange: (dataUrl: string | null) => void;
}

export const DigitalSignaturesSection: React.FC<DigitalSignaturesSectionProps> = ({
  inspectorName,
  inspectorCpf,
  inspectorSignature,
  driverName,
  driverCpf,
  driverSignature,
  onInspectorNameChange,
  onInspectorCpfChange,
  onInspectorSignatureChange,
  onDriverNameChange,
  onDriverCpfChange,
  onDriverSignatureChange,
}) => {
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="pb-4 mb-5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
            ASSINATURA DIGITAL DAS PARTES
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Coleta eletrônica de conformidade do responsável pela blitz e do motorista responsável pela condução.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Assinatura do Responsável */}
        <SignaturePad
          title="ASSINATURA DO RESPONSÁVEL"
          roleLabel="Responsável pela Blitz"
          name={inspectorName}
          cpf={inspectorCpf}
          signatureDataUrl={inspectorSignature}
          onNameChange={onInspectorNameChange}
          onCpfChange={onInspectorCpfChange}
          onSignatureChange={onInspectorSignatureChange}
        />

        {/* Assinatura do Motorista */}
        <SignaturePad
          title="ASSINATURA DO MOTORISTA"
          roleLabel="Condutor do Veículo"
          name={driverName}
          cpf={driverCpf}
          signatureDataUrl={driverSignature}
          onNameChange={onDriverNameChange}
          onCpfChange={onDriverCpfChange}
          onSignatureChange={onDriverSignatureChange}
        />
      </div>
    </section>
  );
};
