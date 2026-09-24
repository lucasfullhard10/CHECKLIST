export type BlitzType = 'SAIDA' | 'RETORNO';

export type ItemStatus = 'OK' | 'NAO_CONFORME' | 'NA';

export type SeverityLevel = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type OperationalClassification = 'LIBERADO' | 'ATENCAO' | 'NAO_LIBERADO';

export interface ChecklistItemData {
  id: string;
  label: string;
  category: string;
  status?: ItemStatus;
  severity?: SeverityLevel;
  observation?: string;
}

export interface VehiclePhotosData {
  front: string | null;
  rear: string | null;
  left: string | null;
  right: string | null;
}

export interface OperationIdentificationData {
  driverName: string;
  driverCpf: string;
  plate: string;
  kmInitial: string;
  kmFinal: string;
  date: string;
  time: string;
  vehicleType: string;
  unit: string;
  route: string;
  cityRegion: string;
  inspectorName: string;
  inspectorCpf: string;
}

export interface ReturnOccurrencesData {
  returnKm: string;
  returnTime: string;
  hadOccurrence: 'SIM' | 'NAO' | '';
  hadDamage: 'SIM' | 'NAO' | '';
  hadAccident: 'SIM' | 'NAO' | '';
  hadNearMiss: 'SIM' | 'NAO' | '';
  hadCargoIssue: 'SIM' | 'NAO' | '';
  hadReturn: 'SIM' | 'NAO' | '';
  occurrenceType: string;
  occurrenceDescription: string;
}

export interface InspectionData {
  id: string;
  type: BlitzType;
  identification: OperationIdentificationData;
  photos: VehiclePhotosData;
  checklist: Record<string, ChecklistItemData>;
  returnOccurrences?: ReturnOccurrencesData;
  classification: OperationalClassification;
  generalObservations: string;
  inspectorSignature: string | null;
  driverSignature: string | null;
  createdAt: string;
  completedAt?: string;
}
