import { jsPDF } from 'jspdf';
import { InspectionData, ChecklistItemData } from '../types';

export function generateInspectionPDF(data: InspectionData): { filename: string; blobUrl: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Colors
  const PRIMARY_GREEN = [16, 120, 72] as const; // Corporate Green
  const DARK_BG = [20, 24, 28] as const;
  const LIGHT_GRAY = [245, 246, 248] as const;
  const BORDER_GRAY = [218, 222, 229] as const;
  const TEXT_DARK = [30, 41, 59] as const;
  const TEXT_MUTED = [100, 116, 139] as const;

  const sanitizeStr = (str?: string) => (str || '---').trim();

  // Helper for adding page header
  const renderHeader = (pageNumber: number, totalPages: number = 1) => {
    // Top banner
    doc.setFillColor(...PRIMARY_GREEN);
    doc.rect(margin, currentY, contentWidth, 18, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('AMPLA SERVICE GRUPO LTDA.', margin + 6, currentY + 7);

    // Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const subtitle = data.type === 'SAIDA' ? 'BLITZ DE SAÍDA DE ROTA' : 'BLITZ DE RETORNO DE ROTA';
    doc.text(subtitle, margin + 6, currentY + 13.5);

    // Date/Time right aligned
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const dateStr = `Data: ${sanitizeStr(data.identification.date)}  ${sanitizeStr(data.identification.time)}`;
    const dateWidth = doc.getTextWidth(dateStr);
    doc.text(dateStr, margin + contentWidth - dateWidth - 6, currentY + 7);

    const docId = `DOC: ${data.id.slice(0, 8).toUpperCase()}`;
    const docIdWidth = doc.getTextWidth(docId);
    doc.text(docId, margin + contentWidth - docIdWidth - 6, currentY + 13.5);

    currentY += 21;
  };

  // Helper for page break
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      currentY = margin;
      renderHeader(doc.getNumberOfPages());
    }
  };

  // 1. Initial Header
  renderHeader(1);

  // 2. Identification Block
  doc.setFillColor(...LIGHT_GRAY);
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 34, 1.5, 1.5, 'FD');

  // Title section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...PRIMARY_GREEN);
  doc.text('IDENTIFICAÇÃO DA OPERAÇÃO & VEÍCULO', margin + 4, currentY + 5);

  const colWidth = contentWidth / 3;
  const rowY1 = currentY + 11;
  const rowY2 = currentY + 18;
  const rowY3 = currentY + 25;
  const rowY4 = currentY + 31;

  doc.setFontSize(7.5);

  // Column 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Motorista:', margin + 4, rowY1);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(sanitizeStr(data.identification.driverName).slice(0, 32), margin + 20, rowY1);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('CPF:', margin + 4, rowY2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(sanitizeStr(data.identification.driverCpf), margin + 20, rowY2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Placa:', margin + 4, rowY3);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(sanitizeStr(data.identification.plate), margin + 20, rowY3);

  // Column 2
  const col2X = margin + colWidth;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Tipo Veículo:', col2X, rowY1);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(sanitizeStr(data.identification.vehicleType).slice(0, 26), col2X + 22, rowY1);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text(data.type === 'SAIDA' ? 'KM Saída:' : 'KM Inicial/Ret.:', col2X, rowY2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  const kmText = data.type === 'SAIDA' 
    ? `${sanitizeStr(data.identification.kmInitial)} km` 
    : `${sanitizeStr(data.identification.kmInitial)} / ${sanitizeStr(data.returnOccurrences?.returnKm || data.identification.kmFinal)} km`;
  doc.text(kmText, col2X + 22, rowY2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Rota / Destino:', col2X, rowY3);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(sanitizeStr(data.identification.route).slice(0, 26), col2X + 22, rowY3);

  // Column 3
  const col3X = margin + colWidth * 2;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Filial / Unid.:', col3X, rowY1);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(sanitizeStr(data.identification.unit).slice(0, 24), col3X + 20, rowY1);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Região / Cidade:', col3X, rowY2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(sanitizeStr(data.identification.cityRegion).slice(0, 24), col3X + 20, rowY2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Resp. Blitz:', col3X, rowY3);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(sanitizeStr(data.identification.inspectorName).slice(0, 24), col3X + 20, rowY3);

  currentY += 37;

  // 3. Operational Classification & Counters Banner
  checkPageBreak(25);
  doc.setLineWidth(0.3);

  // Count items
  const items = Object.values(data.checklist);
  const okCount = items.filter((i) => i.status === 'OK').length;
  const ncItems = items.filter((i) => i.status === 'NAO_CONFORME');
  const ncCount = ncItems.length;
  const naCount = items.filter((i) => i.status === 'NA').length;
  const unansweredCount = items.filter((i) => !i.status).length;

  // Status color block
  let statusBg: readonly [number, number, number] = [22, 163, 74]; // Green
  let statusText = 'VEÍCULO LIBERADO';
  let statusSub = 'Operação autorizada para tráfego normal.';

  if (data.classification === 'ATENCAO') {
    statusBg = [217, 119, 6]; // Amber/Yellow
    statusText = 'ATENÇÃO — COM RESSALVAS';
    statusSub = 'Itens não conformes identificados requerem acompanhamento.';
  } else if (data.classification === 'NAO_LIBERADO') {
    statusBg = [220, 38, 38]; // Red
    statusText = 'NÃO LIBERADO — OPERAÇÃO RETIDA';
    statusSub = 'Condição impeditiva identificada. Veículo retido para correção.';
  }

  // Draw Result card
  doc.setFillColor(...statusBg);
  doc.roundedRect(margin, currentY, 70, 18, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(statusText, margin + 4, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(statusSub, margin + 4, currentY + 13);

  // Draw 4 Metric Boxes
  const metricBoxWidth = (contentWidth - 73) / 4;
  const metrics = [
    { label: 'ITENS OK', count: okCount, color: [22, 163, 74] as const },
    { label: 'NÃO CONF.', count: ncCount, color: ncCount > 0 ? [220, 38, 38] as const : [100, 116, 139] as const },
    { label: 'N/A', count: naCount, color: [100, 116, 139] as const },
    { label: 'S/ RESPOSTA', count: unansweredCount, color: unansweredCount > 0 ? [234, 88, 12] as const : [100, 116, 139] as const },
  ];

  metrics.forEach((m, idx) => {
    const boxX = margin + 73 + idx * metricBoxWidth;
    doc.setFillColor(LIGHT_GRAY[0], LIGHT_GRAY[1], LIGHT_GRAY[2]);
    doc.setDrawColor(BORDER_GRAY[0], BORDER_GRAY[1], BORDER_GRAY[2]);
    doc.roundedRect(boxX, currentY, metricBoxWidth - 2, 18, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(String(m.count), boxX + (metricBoxWidth - 2) / 2, currentY + 8, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(m.label, boxX + (metricBoxWidth - 2) / 2, currentY + 14, { align: 'center' });
  });

  currentY += 22;

  // 4. If Retorno: Show Occurrence block
  if (data.type === 'RETORNO' && data.returnOccurrences) {
    checkPageBreak(30);
    const ret = data.returnOccurrences;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin, currentY, contentWidth, 24, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('OCORRÊNCIAS REGISTRADAS NO RETORNO DA ROTA', margin + 4, currentY + 5);

    doc.setFontSize(7);
    doc.setTextColor(...TEXT_DARK);
    doc.setFont('helvetica', 'normal');
    const questionsSummary = [
      `Avaria Veículo: ${ret.hadDamage || 'NÃO'}`,
      `Acidente: ${ret.hadAccident || 'NÃO'}`,
      `Quase Acidente: ${ret.hadNearMiss || 'NÃO'}`,
      `Problema Carga: ${ret.hadCargoIssue || 'NÃO'}`,
      `Devolução: ${ret.hadReturn || 'NÃO'}`,
    ].join('   |   ');
    doc.text(questionsSummary, margin + 4, currentY + 10);

    doc.setFont('helvetica', 'bold');
    doc.text(`Tipo de Ocorrência: ${sanitizeStr(ret.occurrenceType)}`, margin + 4, currentY + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(`Descrição: ${sanitizeStr(ret.occurrenceDescription)}`.slice(0, 110), margin + 4, currentY + 20);

    currentY += 27;
  }

  // 5. REGISTRO FOTOGRÁFICO — 4 IMAGENS EM GRADE 2x2
  checkPageBreak(85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...PRIMARY_GREEN);
  doc.text('REGISTRO FOTOGRÁFICO DO VEÍCULO (GRADE 2x2)', margin, currentY);
  currentY += 3;

  const photoCardW = (contentWidth - 4) / 2;
  const photoCardH = 40;

  const photoSlots = [
    { label: 'FOTO 1 — FRENTE DO VEÍCULO', key: 'front', img: data.photos.front },
    { label: 'FOTO 2 — TRASEIRA DO VEÍCULO', key: 'rear', img: data.photos.rear },
    { label: 'FOTO 3 — LADO ESQUERDO', key: 'left', img: data.photos.left },
    { label: 'FOTO 4 — LADO DIREITO', key: 'right', img: data.photos.right },
  ];

  photoSlots.forEach((slot, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = margin + col * (photoCardW + 4);
    const y = currentY + row * (photoCardH + 3);

    // Frame
    doc.setFillColor(...LIGHT_GRAY);
    doc.setDrawColor(...BORDER_GRAY);
    doc.roundedRect(x, y, photoCardW, photoCardH, 1, 1, 'FD');

    // Label banner
    doc.setFillColor(30, 41, 59);
    doc.rect(x, y, photoCardW, 4.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(slot.label, x + photoCardW / 2, y + 3.2, { align: 'center' });

    if (slot.img) {
      try {
        // Embed image inside photo slot maintaining aspect ratio
        const imgH = photoCardH - 5.5;
        const imgW = photoCardW - 2;
        doc.addImage(slot.img, 'JPEG', x + 1, y + 5, imgW, imgH, undefined, 'FAST');
      } catch (err) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(...TEXT_MUTED);
        doc.text('Foto anexada (visualizar no sistema)', x + photoCardW / 2, y + 20, { align: 'center' });
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...TEXT_MUTED);
      doc.text('Foto não enviada', x + photoCardW / 2, y + 22, { align: 'center' });
    }
  });

  currentY += (photoCardH + 3) * 2 + 4;

  // 6. DETALHAMENTO DE NÃO CONFORMIDADES (se houver)
  if (ncItems.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(220, 38, 38);
    doc.text(`RELATÓRIO DE NÃO CONFORMIDADES IDENTIFICADAS (${ncItems.length} ITEM/ITENS)`, margin, currentY);
    currentY += 4;

    // Table header
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(...BORDER_GRAY);
    doc.rect(margin, currentY, contentWidth, 5.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...TEXT_DARK);

    doc.text('CATEGORIA / ITEM', margin + 3, currentY + 3.8);
    doc.text('GRAVIDADE', margin + 110, currentY + 3.8);
    doc.text('OBSERVAÇÃO OPERACIONAL', margin + 135, currentY + 3.8);
    currentY += 5.5;

    ncItems.forEach((nc) => {
      checkPageBreak(10);
      const rowHeight = 7.5;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...BORDER_GRAY);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...TEXT_DARK);
      doc.text(`${nc.category}: ${nc.label}`.slice(0, 68), margin + 3, currentY + 4.5);

      // Severity badge
      const sev = nc.severity || 'MEDIA';
      let sevColor: readonly [number, number, number] = [217, 119, 6];
      if (sev === 'CRITICA' || sev === 'ALTA') sevColor = [220, 38, 38];
      else if (sev === 'BAIXA') sevColor = [100, 116, 139];

      doc.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(sev, margin + 110, currentY + 4.5);

      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(sanitizeStr(nc.observation).slice(0, 36), margin + 135, currentY + 4.5);

      currentY += rowHeight;
    });

    currentY += 4;
  }

  // 7. OBSERVAÇÕES GERAIS
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...PRIMARY_GREEN);
  doc.text('OBSERVAÇÕES GERAIS DA INSPEÇÃO', margin, currentY);
  currentY += 3;

  doc.setFillColor(...LIGHT_GRAY);
  doc.setDrawColor(...BORDER_GRAY);
  doc.roundedRect(margin, currentY, contentWidth, 16, 1, 1, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_DARK);
  const obsText = data.generalObservations.trim() || 'Nenhuma observação complementar registrada.';
  const splitObs = doc.splitTextToSize(obsText, contentWidth - 8);
  doc.text(splitObs, margin + 4, currentY + 4.5);

  currentY += 20;

  // 8. ASSINATURAS DIGITAIS
  checkPageBreak(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...PRIMARY_GREEN);
  doc.text('TERMO DE RESPONSABILIDADE & ASSINATURAS DIGITAIS', margin, currentY);
  currentY += 3;

  const sigWidth = (contentWidth - 6) / 2;
  const sigHeight = 30;

  // Responsável Card
  const sig1X = margin;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_GRAY);
  doc.roundedRect(sig1X, currentY, sigWidth, sigHeight, 1.5, 1.5, 'FD');

  doc.setFillColor(...DARK_BG);
  doc.rect(sig1X, currentY, sigWidth, 4.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('RESPONSÁVEL PELA BLITZ', sig1X + sigWidth / 2, currentY + 3.2, { align: 'center' });

  if (data.inspectorSignature) {
    try {
      doc.addImage(data.inspectorSignature, 'PNG', sig1X + 4, currentY + 5.5, sigWidth - 8, 14);
    } catch {
      // ignore
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text(`Nome: ${sanitizeStr(data.identification.inspectorName)}`, sig1X + 4, currentY + 22.5);
  doc.text(`CPF: ${sanitizeStr(data.identification.inspectorCpf)}`, sig1X + 4, currentY + 26.5);

  // Motorista Card
  const sig2X = margin + sigWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_GRAY);
  doc.roundedRect(sig2X, currentY, sigWidth, sigHeight, 1.5, 1.5, 'FD');

  doc.setFillColor(...DARK_BG);
  doc.rect(sig2X, currentY, sigWidth, 4.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('CONDUTOR / MOTORISTA', sig2X + sigWidth / 2, currentY + 3.2, { align: 'center' });

  if (data.driverSignature) {
    try {
      doc.addImage(data.driverSignature, 'PNG', sig2X + 4, currentY + 5.5, sigWidth - 8, 14);
    } catch {
      // ignore
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text(`Nome: ${sanitizeStr(data.identification.driverName)}`, sig2X + 4, currentY + 22.5);
  doc.text(`CPF: ${sanitizeStr(data.identification.driverCpf)}`, sig2X + 4, currentY + 26.5);

  currentY += sigHeight + 4;

  // Add Page Numbers and Footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...TEXT_MUTED);
    const footerText = `AMPLA SERVICE GRUPO LTDA. — Sistema Blitz Operacional — Documento emitido eletronicamente em ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} — Página ${i} de ${totalPages}`;
    doc.text(footerText, pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  // Format Filename:
  // BLITZ_SAIDA_ROTA_PLACA_DATA.pdf
  // BLITZ_RETORNO_ROTA_PLACA_DATA.pdf
  const plateClean = (data.identification.plate || 'SEM_PLACA').replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const dateClean = (data.identification.date || new Date().toISOString().slice(0, 10)).replace(/[^0-9-]/g, '');
  const prefix = data.type === 'SAIDA' ? 'BLITZ_SAIDA_ROTA' : 'BLITZ_RETORNO_ROTA';
  const filename = `${prefix}_${plateClean}_${dateClean}.pdf`;

  const blobUrl = doc.output('bloburl');
  doc.save(filename);

  return { filename, blobUrl: blobUrl.toString() };
}
