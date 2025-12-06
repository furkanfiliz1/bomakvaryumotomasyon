// Receivable Add Types
export interface CreateReceivableFormData {
  ReceiverIdentifier?: string;
  ReceiverName?: string;
  SenderIdentifier?: string;
  SenderName?: string;
  ReceivableAmount?: number;
  ReceivableNumber?: string;
  ReceivableDueDate?: string;
  ReceivableIssueDate?: string;
}

export interface CreateReceivableRequest {
  OrderNo: string;
  PayableAmount: number;
  ReceiverIdentifier?: string;
  SenderIdentifier?: string;
  PaymentDueDate: string;
  CurrencyCode: string;
  ProductType: number;
  IssueDate: string;
}

export interface CreateReceivableResponse {
  success: boolean;
  message?: string;
  orderId?: string;
}
