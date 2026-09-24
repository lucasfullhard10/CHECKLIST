import React, { useState } from 'react';
import { ChecklistItemData, ItemStatus, SeverityLevel } from '../types';
import { CategoryDefinition } from '../constants/checklistData';
import { Check, X, Minus, MessageSquare, ChevronDown, ChevronUp, CheckCheck, AlertCircle } from 'lucide-react';

interface ChecklistSectionProps {
  categories: CategoryDefinition[];
  checklist: Record<string, ChecklistItemData>;
  onChangeItem: (itemId: string, updated: Partial<ChecklistItemData>) => void;
  onBatchSetCategory: (items: string[], status: ItemStatus) => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  categories,
  checklist,
  onChangeItem,
  onBatchSetCategory,
}) => {
  // Keep all categories expanded by default for quick scrolling, but allow collapse
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const getCategoryStats = (categoryTitle: string, itemLabels: string[]) => {
    let ok = 0;
    let nc = 0;
    let na = 0;
    let total = itemLabels.length;

    itemLabels.forEach((label) => {
      const id = `${categoryTitle}__${label}`;
      const item = checklist[id];
      if (item?.status === 'OK') ok++;
      else if (item?.status === 'NAO_CONFORME') nc++;
      else if (item?.status === 'NA') na++;
    });

    const unanswered = total - (ok + nc + na);
    return { ok, nc, na, unanswered, total };
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const isCollapsed = !!collapsed[category.id];
        const stats = getCategoryStats(category.title, category.items);
        const isComplete = stats.unanswered === 0;

        return (
          <section
            key={category.id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Category Header */}
            <div
              onClick={() => toggleCategory(category.id)}
              className="p-4 sm:p-5 bg-neutral-850 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-neutral-800 transition select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
                  {category.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-emerald-400 font-bold">{stats.ok} OK</span>
                  {stats.nc > 0 && (
                    <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-800 px-1.5 py-0.5 rounded">
                      {stats.nc} NC
                    </span>
                  )}
                  {stats.na > 0 && (
                    <span className="text-neutral-400">{stats.na} N/A</span>
                  )}
                  {stats.unanswered > 0 && (
                    <span className="text-amber-400 text-[11px]">
                      ({stats.unanswered} pendente{stats.unanswered > 1 ? 's' : ''})
                    </span>
                  )}
                </div>

                {/* Batch Button: All OK */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const itemIds = category.items.map((lbl) => `${category.title}__${lbl}`);
                    onBatchSetCategory(itemIds, 'OK');
                  }}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 transition"
                  title="Marcar todos os itens desta categoria como OK"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Todos OK</span>
                </button>

                <div className="text-neutral-400">
                  {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Items List */}
            {!isCollapsed && (
              <div className="divide-y divide-neutral-800/60">
                {category.items.map((label) => {
                  const itemId = `${category.title}__${label}`;
                  const itemData = checklist[itemId] || {
                    id: itemId,
                    label,
                    category: category.title,
                    status: undefined,
                  };

                  return (
                    <div
                      key={itemId}
                      className={`p-4 sm:p-5 transition ${
                        itemData.status === 'NAO_CONFORME'
                          ? 'bg-rose-950/20'
                          : itemData.status === 'OK'
                          ? 'bg-neutral-900/80'
                          : 'bg-neutral-950/40'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Item Label */}
                        <div className="flex-1 pr-2">
                          <span className="text-sm sm:text-base font-semibold text-neutral-100 block">
                            {label}
                          </span>
                        </div>

                        {/* Status Buttons: OK / NÃO CONFORME / N/A */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          {/* OK Button */}
                          <button
                            type="button"
                            onClick={() =>
                              onChangeItem(itemId, {
                                id: itemId,
                                label,
                                category: category.title,
                                status: 'OK',
                              })
                            }
                            className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition flex items-center gap-1.5 ${
                              itemData.status === 'OK'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            <span>OK</span>
                          </button>

                          {/* NÃO CONFORME Button */}
                          <button
                            type="button"
                            onClick={() =>
                              onChangeItem(itemId, {
                                id: itemId,
                                label,
                                category: category.title,
                                status: 'NAO_CONFORME',
                                severity: itemData.severity || 'MEDIA',
                              })
                            }
                            className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition flex items-center gap-1.5 ${
                              itemData.status === 'NAO_CONFORME'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50 ring-2 ring-rose-500'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                            }`}
                          >
                            <X className="w-4 h-4" />
                            <span>NÃO CONFORME</span>
                          </button>

                          {/* N/A Button */}
                          <button
                            type="button"
                            onClick={() =>
                              onChangeItem(itemId, {
                                id: itemId,
                                label,
                                category: category.title,
                                status: 'NA',
                              })
                            }
                            className={`min-h-[44px] px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition flex items-center gap-1.5 ${
                              itemData.status === 'NA'
                                ? 'bg-neutral-600 text-white ring-2 ring-neutral-400'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                            <span>N/A</span>
                          </button>
                        </div>
                      </div>

                      {/* If NÃO CONFORME: Severity Selector (Baixa, Média, Alta, Crítica) */}
                      {itemData.status === 'NAO_CONFORME' && (
                        <div className="mt-3.5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 animate-in fade-in duration-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold uppercase tracking-wider">
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                              <span>Classificar Gravidade da Não Conformidade:</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as SeverityLevel[]).map(
                                (sev) => {
                                  const isSelected = (itemData.severity || 'MEDIA') === sev;
                                  return (
                                    <button
                                      key={sev}
                                      type="button"
                                      onClick={() => onChangeItem(itemId, { severity: sev })}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                                        isSelected
                                          ? sev === 'CRITICA'
                                            ? 'bg-rose-600 text-white ring-1 ring-rose-400'
                                            : sev === 'ALTA'
                                            ? 'bg-orange-600 text-white ring-1 ring-orange-400'
                                            : sev === 'MEDIA'
                                            ? 'bg-amber-600 text-white ring-1 ring-amber-400'
                                            : 'bg-neutral-700 text-white ring-1 ring-neutral-400'
                                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                      }`}
                                    >
                                      {sev}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Specific observation for NC */}
                          <div className="mt-2">
                            <input
                              type="text"
                              value={itemData.observation || ''}
                              onChange={(e) =>
                                onChangeItem(itemId, { observation: e.target.value })
                              }
                              placeholder="Observação da não conformidade (motivo, detalhe do defeito ou ação corretiva requerida)..."
                              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-neutral-900 border border-rose-800/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-white placeholder-neutral-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* If OK or N/A, optional observation input */}
                      {itemData.status !== 'NAO_CONFORME' && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            value={itemData.observation || ''}
                            onChange={(e) => onChangeItem(itemId, { observation: e.target.value })}
                            placeholder="Observação opcional para este item..."
                            className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-950/70 border border-neutral-800 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 text-neutral-300 placeholder-neutral-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
