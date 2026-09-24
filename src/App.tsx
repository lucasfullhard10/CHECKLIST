import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BlitzType,
  InspectionData,
  OperationIdentificationData,
  VehiclePhotosData,
  ChecklistItemData,
  ReturnOccurrencesData,
  OperationalClassification,
  ItemStatus,
} from './types';
import { CHECKLIST_SAIDA, CHECKLIST_RETORNO } from './constants/checklistData';
import { Header } from './components/Header';
import { HomeSelector } from './components/HomeSelector';
import { OperationIdentification } from './components/OperationIdentification';
import { VehiclePhotos } from './components/VehiclePhotos';
import { ReturnOccurrences } from './components/ReturnOccurrences';
import { ChecklistSection } from './components/ChecklistSection';
import { InspectionSummary } from './components/InspectionSummary';
import { GeneralObservations } from './components/GeneralObservations';
import { DigitalSignaturesSection } from './components/DigitalSignature';
import { HistoryDrawer } from './components/HistoryDrawer';
import { generateInspectionPDF } from './utils/pdfGenerator';
import {
  FileDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  X,
  ExternalLink,
} from 'lucide-react';

const INITIAL_IDENTIFICATION: OperationIdentificationData = {
  driverName: '',
  driverCpf: '',
  plate: '',
  kmInitial: '',
  kmFinal: '',
  date: new Date().toISOString().slice(0, 10),
  time: new Date().toTimeString().slice(0, 5),
  vehicleType: '',
  unit: '',
  route: '',
  cityRegion: '',
  inspectorName: '',
  inspectorCpf: '',
};

const INITIAL_PHOTOS: VehiclePhotosData = {
  front: null,
  rear: null,
  left: null,
  right: null,
};

const INITIAL_RETURN_OCCURRENCES: ReturnOccurrencesData = {
  returnKm: '',
  returnTime: new Date().toTimeString().slice(0, 5),
  hadOccurrence: 'NAO',
  hadDamage: 'NAO',
  hadAccident: 'NAO',
  hadNearMiss: 'NAO',
  hadCargoIssue: 'NAO',
  hadReturn: 'NAO',
  occurrenceType: 'Nenhuma ocorrência',
  occurrenceDescription: '',
};

const STORAGE_KEY = 'ampla_blitz_inspections_history';

export default function App() {
  const [currentType, setCurrentType] = useState<BlitzType | null>(null);
  const [inspectionId, setInspectionId] = useState<string>(() =>
    crypto.randomUUID ? crypto.randomUUID() : `blitz_${Date.now()}`
  );
  const [identification, setIdentification] =
    useState<OperationIdentificationData>(INITIAL_IDENTIFICATION);
  const [photos, setPhotos] = useState<VehiclePhotosData>(INITIAL_PHOTOS);
  const [checklist, setChecklist] = useState<Record<string, ChecklistItemData>>({});
  const [returnOccurrences, setReturnOccurrences] =
    useState<ReturnOccurrencesData>(INITIAL_RETURN_OCCURRENCES);
  const [classification, setClassification] =
    useState<OperationalClassification>('LIBERADO');
  const [classificationManuallySet, setClassificationManuallySet] =
    useState<boolean>(false);
  const [generalObservations, setGeneralObservations] = useState<string>('');
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);
  const [driverSignature, setDriverSignature] = useState<string | null>(null);

  // History state
  const [savedInspections, setSavedInspections] = useState<InspectionData[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // PDF Generation Feedback
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfResult, setPdfResult] = useState<{ filename: string; blobUrl: string } | null>(null);
  const [validationAlert, setValidationAlert] = useState<string[] | null>(null);

  // Load saved inspections from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedInspections(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Falha ao ler histórico local', e);
    }
  }, []);

  const saveToHistory = useCallback((data: InspectionData) => {
    try {
      setSavedInspections((prev) => {
        const filtered = prev.filter((item) => item.id !== data.id);
        const updated = [data, ...filtered].slice(0, 50); // keep last 50
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Falha ao salvar no histórico', e);
    }
  }, []);

  const deleteFromHistory = (id: string) => {
    setSavedInspections((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Active categories
  const categories = useMemo(() => {
    return currentType === 'SAIDA' ? CHECKLIST_SAIDA : CHECKLIST_RETORNO;
  }, [currentType]);

  // Total expected items
  const totalExpectedItems = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [categories]);

  // Automatic classification deduction when checklist changes
  useEffect(() => {
    if (classificationManuallySet) return;

    const items = Object.values(checklist);
    const ncItems = items.filter((i) => i.status === 'NAO_CONFORME');

    if (ncItems.length === 0) {
      setClassification('LIBERADO');
      return;
    }

    const hasCriticalOrHigh = ncItems.some(
      (i) => i.severity === 'CRITICA' || i.severity === 'ALTA'
    );

    if (hasCriticalOrHigh) {
      setClassification('NAO_LIBERADO');
    } else {
      setClassification('ATENCAO');
    }
  }, [checklist, classificationManuallySet]);

  // Handler for item change
  const handleChecklistItemChange = (itemId: string, updated: Partial<ChecklistItemData>) => {
    setChecklist((prev) => {
      const existing = prev[itemId] || { id: itemId, label: '', category: '' };
      return {
        ...prev,
        [itemId]: {
          ...existing,
          ...updated,
        },
      };
    });
  };

  // Handler for batch setting a category
  const handleBatchSetCategory = (itemIds: string[], status: ItemStatus) => {
    setChecklist((prev) => {
      const copy = { ...prev };
      itemIds.forEach((id) => {
        const [cat, lbl] = id.split('__');
        copy[id] = {
          id,
          label: lbl || '',
          category: cat || '',
          status,
          severity: status === 'NAO_CONFORME' ? 'MEDIA' : undefined,
        };
      });
      return copy;
    });
  };

  // Start new checklist
  const handleNewChecklist = () => {
    const hasData =
      identification.driverName ||
      identification.plate ||
      Object.keys(checklist).length > 0;

    if (hasData) {
      const confirmReset = window.confirm(
        'Deseja iniciar um novo checklist? Todos os dados não salvos serão redefinidos.'
      );
      if (!confirmReset) return;
    }

    setCurrentType(null);
    setInspectionId(crypto.randomUUID ? crypto.randomUUID() : `blitz_${Date.now()}`);
    setIdentification(INITIAL_IDENTIFICATION);
    setPhotos(INITIAL_PHOTOS);
    setChecklist({});
    setReturnOccurrences(INITIAL_RETURN_OCCURRENCES);
    setClassification('LIBERADO');
    setClassificationManuallySet(false);
    setGeneralObservations('');
    setInspectorSignature(null);
    setDriverSignature(null);
    setPdfResult(null);
    setValidationAlert(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load from history
  const handleLoadInspection = (item: InspectionData) => {
    setCurrentType(item.type);
    setInspectionId(item.id);
    setIdentification(item.identification);
    setPhotos(item.photos);
    setChecklist(item.checklist);
    if (item.returnOccurrences) {
      setReturnOccurrences(item.returnOccurrences);
    }
    setClassification(item.classification);
    setClassificationManuallySet(true);
    setGeneralObservations(item.generalObservations || '');
    setInspectorSignature(item.inspectorSignature || null);
    setDriverSignature(item.driverSignature || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate PDF
  const handleGeneratePdf = () => {
    if (!currentType) return;

    // Check validation warnings (non-blocking, but helpful)
    const warnings: string[] = [];
    if (!identification.plate) warnings.push('Placa do veículo não informada');
    if (!identification.driverName) warnings.push('Nome do motorista não informado');
    if (!identification.inspectorName) warnings.push('Nome do responsável pela blitz não informado');

    const photoCount = Object.values(photos).filter(Boolean).length;
    if (photoCount < 4) {
      warnings.push(`Apenas ${photoCount} de 4 fotos do veículo foram anexadas`);
    }

    if (!inspectorSignature) warnings.push('Assinatura do responsável não preenchida');
    if (!driverSignature) warnings.push('Assinatura do motorista não preenchida');

    const answered = Object.values(checklist).filter((i) => !!i.status).length;
    if (answered < totalExpectedItems) {
      warnings.push(`${totalExpectedItems - answered} itens do checklist ainda estão sem resposta`);
    }

    if (warnings.length > 0) {
      setValidationAlert(warnings);
    } else {
      setValidationAlert(null);
    }

    try {
      setIsGenerating(true);
      const inspectionData: InspectionData = {
        id: inspectionId,
        type: currentType,
        identification,
        photos,
        checklist,
        returnOccurrences: currentType === 'RETORNO' ? returnOccurrences : undefined,
        classification,
        generalObservations,
        inspectorSignature,
        driverSignature,
        createdAt: new Date().toISOString(),
      };

      // Save locally
      saveToHistory(inspectionData);

      // Generate vector PDF
      const result = generateInspectionPDF(inspectionData);
      setPdfResult(result);
    } catch (err) {
      console.error('Erro na geração do PDF:', err);
      alert('Houve um erro ao processar o arquivo PDF. Verifique os dados e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Count checklist completion
  const answeredCount = Object.values(checklist).filter((i) => !!i.status).length;
  const photosCount = Object.values(photos).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-28">
      {/* Header */}
      <Header
        currentType={currentType}
        onNewChecklist={handleNewChecklist}
        onOpenHistory={() => setHistoryOpen(true)}
        savedCount={savedInspections.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* If no type selected, show Screen 1: HomeSelector */}
        {!currentType ? (
          <HomeSelector
            onSelectType={(type) => {
              setCurrentType(type);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNewChecklist={handleNewChecklist}
          />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Navigation Bar / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <button
                type="button"
                onClick={() => setCurrentType(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-emerald-400 uppercase tracking-wider transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar à Seleção Inicial</span>
              </button>

              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    currentType === 'SAIDA' ? 'bg-emerald-500' : 'bg-neutral-300'
                  }`}
                />
                <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  {currentType === 'SAIDA'
                    ? '🟢 BLITZ DE SAÍDA DE ROTA'
                    : '⚫ BLITZ DE RETORNO DE ROTA'}
                </h1>
              </div>

              <div className="text-xs font-semibold text-neutral-400">
                Progresso: <strong className="text-white">{answeredCount}</strong>/{totalExpectedItems} itens
              </div>
            </div>

            {/* Validation Notice Banner (if any warnings) */}
            {validationAlert && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/70 text-amber-200 text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-amber-300 uppercase tracking-wider mb-1">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Atenção aos Itens Pendentes no Documento
                  </span>
                  <button
                    type="button"
                    onClick={() => setValidationAlert(null)}
                    className="text-amber-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-300">
                  {validationAlert.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 2. IDENTIFICAÇÃO DA OPERAÇÃO */}
            <OperationIdentification
              type={currentType}
              data={identification}
              onChange={(updated) =>
                setIdentification((prev) => ({ ...prev, ...updated }))
              }
            />

            {/* 3. CAMPO DE 4 IMAGENS */}
            <VehiclePhotos
              photos={photos}
              onChange={(updated) => setPhotos((prev) => ({ ...prev, ...updated }))}
            />

            {/* 5. AUDITORIA DE RETORNO (If BLITZ DE RETORNO) */}
            {currentType === 'RETORNO' && (
              <ReturnOccurrences
                data={returnOccurrences}
                onChange={(updated) =>
                  setReturnOccurrences((prev) => ({ ...prev, ...updated }))
                }
              />
            )}

            {/* 4 / 5. CHECKLIST DA BLITZ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-tight">
                    {currentType === 'SAIDA'
                      ? 'CHECKLIST OPERACIONAL DE SAÍDA'
                      : 'CHECKLIST OPERACIONAL DE RETORNO'}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Selecione OK, NÃO CONFORME ou N/A para cada item. Em caso de não conformidade, indique a gravidade.
                  </p>
                </div>
              </div>

              <ChecklistSection
                categories={categories}
                checklist={checklist}
                onChangeItem={handleChecklistItemChange}
                onBatchSetCategory={handleBatchSetCategory}
              />
            </div>

            {/* 6. RESULTADO AUTOMÁTICO & CLASSIFICAÇÃO */}
            <InspectionSummary
              checklist={checklist}
              totalExpectedItems={totalExpectedItems}
              classification={classification}
              onChangeClassification={(c) => {
                setClassification(c);
                setClassificationManuallySet(true);
              }}
            />

            {/* 7. OBSERVAÇÕES FINAIS */}
            <GeneralObservations
              value={generalObservations}
              onChange={setGeneralObservations}
            />

            {/* 8. ASSINATURAS DIGITAIS */}
            <DigitalSignaturesSection
              inspectorName={identification.inspectorName}
              inspectorCpf={identification.inspectorCpf}
              inspectorSignature={inspectorSignature}
              driverName={identification.driverName}
              driverCpf={identification.driverCpf}
              driverSignature={driverSignature}
              onInspectorNameChange={(val) =>
                setIdentification((prev) => ({ ...prev, inspectorName: val }))
              }
              onInspectorCpfChange={(val) =>
                setIdentification((prev) => ({ ...prev, inspectorCpf: val }))
              }
              onInspectorSignatureChange={setInspectorSignature}
              onDriverNameChange={(val) =>
                setIdentification((prev) => ({ ...prev, driverName: val }))
              }
              onDriverCpfChange={(val) =>
                setIdentification((prev) => ({ ...prev, driverCpf: val }))
              }
              onDriverSignatureChange={setDriverSignature}
            />

            {/* 9. BOTÃO GRANDE GERAR PDF NO CORPO */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-emerald-600/50 shadow-2xl text-center">
              <div className="max-w-md mx-auto mb-4">
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">
                  EMISSÃO DO RELATÓRIO OPERACIONAL
                </h3>
                <p className="text-xs text-neutral-400">
                  O documento em PDF será formatado com cabeçalho oficial da Ampla Service, fotos em grade 2x2, assinaturas digitais e nome padronizado.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-base tracking-wider uppercase shadow-xl shadow-emerald-950/60 transition flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <FileDown className="w-6 h-6" />
                <span>{isGenerating ? 'GERANDO PDF...' : 'GERAR PDF'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Action Bar (visible when inside a checklist) */}
      {currentType && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 p-3 sm:p-4 shadow-2xl">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            {/* Quick Progress Indicator */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  Itens:{' '}
                  <strong className="text-white font-mono">
                    {answeredCount}/{totalExpectedItems}
                  </strong>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-neutral-300">
                <span
                  className={`w-2 h-2 rounded-full ${
                    photosCount === 4 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>
                  Fotos: <strong className="text-white font-mono">{photosCount}/4</strong>
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNewChecklist}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-bold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>REINICIAR</span>
              </button>

              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span>{isGenerating ? 'GERANDO...' : 'GERAR PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Generation Success / Preview Modal */}
      {pdfResult && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
              PDF GERADO COM SUCESSO!
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              O arquivo foi estruturado e o download iniciado automaticamente no seu navegador.
            </p>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-left mb-5">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Nome do Arquivo:
              </span>
              <p className="text-xs font-mono font-bold text-emerald-400 break-all">
                {pdfResult.filename}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href={pdfResult.blobUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Abrir / Visualizar PDF em Nova Guia</span>
              </a>

              <button
                type="button"
                onClick={() => setPdfResult(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        savedInspections={savedInspections}
        onLoadInspection={handleLoadInspection}
        onDeleteInspection={deleteFromHistory}
      />
    </div>
  );
}
