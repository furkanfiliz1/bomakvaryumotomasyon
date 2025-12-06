/**
 * E-Invoice Transfer History Types
 * Based on legacy EInvoiceTransferHistory.js implementation
 */

export interface EInvoiceTransferHistoryFilters {
  page: number;
  pageSize: number;
  transferId?: number | null;
  number?: string;
}

export interface EInvoiceTransferHistoryItem {
  Id: number | null;
  Number: string;
  CreatedDate: string;
  Date: string;
  Status: number;
  StatusDescription: string;
  Message: string;
}

export interface EInvoiceTransferHistoryResponse {
  Items: EInvoiceTransferHistoryItem[];
  TotalCount: number;
}

export interface TransferInvoiceFromScoreRequest {
  SenderIdentifier: string;
  InvoiceNumber: string;
}

export interface TransferInvoiceFromScoreResponse {
  IsSuccess: boolean;
}

export interface LocationState {
  identifier: string;
  id: number;
  transferId: number;
}
