// SupplierQuery module types - Legacy Parity Implementation

// Form values - matches legacy exactly
export interface SupplierQueryFormValues {
  buyerCode: string; // "Alıcı Kodu" field - matches legacy exactly
}

// API Request - matches legacy _getReceiverAssociatedSupplier parameter
export interface SupplierQueryRequest {
  buyerCode: string;
}

// Individual supplier item - matches legacy response structure exactly
export interface AssociatedSupplier {
  CompanyIdentifier: string; // "Şirket Tanımlayıcısı"
  StatusCodeDescription: string; // "Durum Açıklaması"
  SubscCode?: string; // "Abonelik Kodu" - can be null/undefined
}

// API Response - matches legacy response structure exactly
export interface SupplierQueryResponse {
  suppliers: AssociatedSupplier[]; // Transformed from response.data.Items
}
