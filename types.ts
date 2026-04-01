export interface ExtractedData {
  page: number;
  data: Record<string, string | number | null>;
  status: 'success' | 'error' | 'pending';
  errorMessage?: string;
}

export interface ProcessingStats {
  total: number;
  processed: number;
  success: number;
  failed: number;
}

export enum PageSelection {
  ALL = 'ALL',
  ODD = 'ODD',
  EVEN = 'EVEN',
}

export interface ExtractionConfig {
  fields: string;
  pageSelection: PageSelection;
  startPage: number;
  endPage?: number;
}