import type {
  CommercialOperationalInfo,
  CompanyHistory,
  CompanyInformation,
  CurrentManagement,
  FigoScoreProFormData,
  FinancialDocument,
  RegistrationInformation,
  StepStatus,
  StructuralInformation,
} from '../customer-request-branch-detail.types';

/**
 * Step Status Evaluation Helpers
 * Contains validation logic for each step to determine completion status
 * Ported from legacy validators with exact same logic
 */

/**
 * Evaluates Company Information step status
 */
export const evaluateCompanyInformationStatus = (stepData?: CompanyInformation): StepStatus => {
  if (!stepData) return 'Başlanmadı';

  // Required fields for completion
  const requiredFields: (keyof CompanyInformation)[] = ['CompanyTitle', 'TaxNumber', 'TaxOffice', 'TaxOfficeCity'];

  // All possible fields to check if any data exists
  const allFields: (keyof CompanyInformation)[] = [
    'CompanyTitle',
    'TaxNumber',
    'TaxOffice',
    'TaxOfficeCity',
    'PhoneNumber',
    'Email',
    'Address',
    'WebsiteAddress',
  ];

  // Check if any field has data
  const hasAnyData = allFields.some((field) => {
    const value = stepData[field];
    return value && value.toString().trim() !== '';
  });

  // If no data at all, status is "not started"
  if (!hasAnyData) {
    return 'Başlanmadı';
  }

  // Check if all required fields are filled
  const allRequiredFilled = requiredFields.every((field) => {
    const value = stepData[field];
    return value && value.toString().trim() !== '';
  });

  // If all required fields are filled, status is "completed"
  if (allRequiredFilled) {
    return 'Tamamlandı';
  }

  // If some data exists but not all required fields are filled, status is "started"
  return 'Başlandı';
};

/**
 * Evaluates Commercial and Operational Information step status
 * Matches legacy commercialOperationalValidator.js exactly
 */
export const evaluateCommercialOperationalStatus = (stepData?: CommercialOperationalInfo): StepStatus => {
  if (!stepData) return 'Başlanmadı';

  // Required fields for completion (matching legacy)
  const requiredFields: (keyof CommercialOperationalInfo)[] = ['ActivityArea', 'EmployeeCount', 'CustomerCount'];

  // Required array fields that must have at least one item (matching legacy)
  const requiredArrayFields: (keyof CommercialOperationalInfo)[] = ['NaceCodes', 'Banks'];

  // All possible fields to check if any data exists (matching legacy)
  const allFields: (keyof CommercialOperationalInfo)[] = [
    'ActivityArea',
    'NaceCodes',
    'GtipCodes',
    'Banks',
    'EmployeeCount',
    'CustomerCount',
    'DomesticCustomerCount',
    'InternationalCustomerCount',
    'TopExportCountries',
    'TopImportCountries',
    'ExportRatio',
    'ImportRatio',
    'DomesticSalesPaymentMethods',
    'DomesticPurchasePaymentMethods',
    'DomesticSalesDueDayCount',
    'DomesticPurchaseDueDayCount',
    'CompanyBrands',
    'BranchCount',
    'CompanyFacilities',
  ];

  // Check if any field has data (matching legacy logic)
  const hasAnyData = allFields.some((field) => {
    const value = stepData[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'number') {
      return !Number.isNaN(value) && value !== null;
    }
    return value && typeof value === 'string' && value.trim() !== '';
  });

  // If no data at all, status is "not started"
  if (!hasAnyData) {
    return 'Başlanmadı';
  }

  // Check if all required fields are filled (matching legacy logic)
  const allRequiredFieldsFilled = requiredFields.every((field) => {
    const value = stepData[field];
    if (typeof value === 'number') {
      return !Number.isNaN(value) && value !== null;
    }
    return value && typeof value === 'string' && value.trim() !== '';
  });

  // Check if all required array fields have at least one item (matching legacy logic)
  const allRequiredArrayFieldsFilled = requiredArrayFields.every((field) => {
    const value = stepData[field];
    return Array.isArray(value) && value.length > 0;
  });

  // If all required fields (both simple and array) are filled, status is "completed"
  if (allRequiredFieldsFilled && allRequiredArrayFieldsFilled) {
    return 'Tamamlandı';
  }

  // If some data exists but not all required fields are filled, status is "started"
  return 'Başlandı';
};

/**
 * Evaluates Registration Information step status
 * Matches legacy registrationInformationValidator.js exactly
 */
export const evaluateRegistrationInformationStatus = (stepData?: RegistrationInformation): StepStatus => {
  if (!stepData) return 'Başlanmadı';

  // Required fields for completion (all fields are mandatory in legacy)
  const requiredFields: (keyof RegistrationInformation)[] = [
    'RegistrationAddress',
    'TradeRegisterNumber',
    'ChamberOfCommerceNumber',
    'RegistrationOffice',
    'RegistrationCity',
    'RegistrationDate',
    'MersisNumber',
  ];

  // All possible fields to check if any data exists (same as required fields in legacy)
  const allFields: (keyof RegistrationInformation)[] = [
    'RegistrationAddress',
    'TradeRegisterNumber',
    'ChamberOfCommerceNumber',
    'RegistrationOffice',
    'RegistrationCity',
    'RegistrationDate',
    'MersisNumber',
  ];

  // Check if any field has data (matching legacy logic)
  const hasAnyData = allFields.some((field) => {
    const value = stepData[field];
    // Handle date fields specifically
    if (field === 'RegistrationDate') {
      return value && value !== null && value.toString().trim() !== '';
    }
    return value && value.toString().trim() !== '';
  });

  // If no data at all, status is "not started"
  if (!hasAnyData) {
    return 'Başlanmadı';
  }

  // Check if all required fields are filled (matching legacy logic)
  const allRequiredFilled = requiredFields.every((field) => {
    const value = stepData[field];
    // Handle date fields specifically
    if (field === 'RegistrationDate') {
      return value && value !== null && value.toString().trim() !== '';
    }
    return value && value.toString().trim() !== '';
  });

  // If all required fields are filled, status is "completed"
  if (allRequiredFilled) {
    return 'Tamamlandı';
  }

  // If some data exists but not all required fields are filled, status is "started"
  return 'Başlandı';
};

/**
 * Evaluates Company History step status
 * Matches legacy companyHistoryValidator.js exactly
 */
export const evaluateCompanyHistoryStatus = (stepData?: CompanyHistory): StepStatus => {
  if (!stepData) return 'Başlanmadı';

  // Required fields for completion (matching legacy)
  const requiredFields: (keyof CompanyHistory)[] = ['FoundingDate', 'FoundingTitle', 'CorporationType'];

  // Required array fields that must have at least one item (matching legacy)
  const requiredArrayFields: (keyof CompanyHistory)[] = ['CompanyFounders'];

  // All possible fields to check if any data exists (matching legacy)
  const allFields: (keyof CompanyHistory)[] = [
    'FoundingDate',
    'FoundingTitle',
    'FoundationCapital',
    'CorporationType',
    'CompanyFounders',
    'TitleChanges',
    'AddressChanges',
    'MergersAndAcquisitions',
  ];

  // Check if any field has data (matching legacy logic)
  const hasAnyData = allFields.some((field) => {
    const value = stepData[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'number') {
      return !Number.isNaN(value) && value !== null;
    }
    // Handle date fields specifically
    if (field === 'FoundingDate') {
      return value && value !== null && value !== undefined && typeof value === 'string' && value.trim() !== '';
    }
    return value && typeof value === 'string' && value.trim() !== '';
  });

  // If no data at all, status is "not started"
  if (!hasAnyData) {
    return 'Başlanmadı';
  }

  // Check if all required fields are filled (matching legacy logic)
  const allRequiredFieldsFilled = requiredFields.every((field) => {
    const value = stepData[field];
    if (typeof value === 'number') {
      return !Number.isNaN(value) && value !== null;
    }
    // Handle date fields specifically
    if (field === 'FoundingDate') {
      return value && value !== null && value !== undefined && typeof value === 'string' && value.trim() !== '';
    }
    return value && typeof value === 'string' && value.trim() !== '';
  });

  // Check if all required array fields have at least one item (matching legacy logic)
  const allRequiredArrayFieldsFilled = requiredArrayFields.every((field) => {
    const value = stepData[field];
    return Array.isArray(value) && value.length > 0;
  });

  // If all required fields (both simple and array) are filled, status is "completed"
  if (allRequiredFieldsFilled && allRequiredArrayFieldsFilled) {
    return 'Tamamlandı';
  }

  // If some data exists but not all required fields are filled, status is "started"
  return 'Başlandı';
};

/**
 * Evaluates Current Management step status
 * Matches legacy currentManagementValidator.js exactly
 */
export const evaluateCurrentManagementStatus = (stepData?: CurrentManagement): StepStatus => {
  if (!stepData) return 'Başlanmadı';

  // Check if ManagementStaff array exists and has data (matching legacy)
  const managementStaff = stepData.ManagementStaff || [];

  // If no management staff data, status is "not started" (matching legacy)
  if (!Array.isArray(managementStaff) || managementStaff.length === 0) {
    return 'Başlanmadı';
  }

  // Required fields for each management staff member (matching legacy)
  const requiredFieldsPerStaff = ['FirstName', 'LastName', 'Role'];

  // All fields to check for any data existence (matching legacy)
  const allFieldsPerStaff = ['FirstName', 'LastName', 'Role', 'AuthorizedSignatory'];

  // Check if all management staff have required fields filled (matching legacy logic)
  let allRequiredFilled = true;
  let hasAnyData = false;

  for (const staff of managementStaff) {
    // Check if this staff member has any data
    const hasStaffData = allFieldsPerStaff.some((field) => {
      const value = (staff as Record<string, unknown>)[field];
      if (typeof value === 'boolean') {
        return value !== null && value !== undefined;
      }
      return value && typeof value === 'string' && value.trim() !== '';
    });

    if (hasStaffData) {
      hasAnyData = true;
    }

    // Check if all required fields are filled for this staff member
    const staffRequiredFilled = requiredFieldsPerStaff.every((field) => {
      const value = (staff as Record<string, unknown>)[field];
      return value && typeof value === 'string' && value.trim() !== '';
    });

    if (!staffRequiredFilled) {
      allRequiredFilled = false;
    }
  }

  // If no data at all, status is "not started"
  if (!hasAnyData) {
    return 'Başlanmadı';
  }

  // If at least one staff exists and all staff have required fields filled, status is "completed"
  if (hasAnyData && allRequiredFilled && managementStaff.length > 0) {
    return 'Tamamlandı';
  }

  // If some data exists but not all required fields are filled, status is "started"
  return 'Başlandı';
};

/**
 * Evaluates Structural Information step status
 * Matches legacy structuralInformationValidator.js exactly
 */
export const evaluateStructuralInformationStatus = (stepData?: StructuralInformation): StepStatus => {
  if (!stepData) return 'Başlanmadı';

  // Required fields for completion (matching legacy)
  const requiredFields: (keyof StructuralInformation)[] = ['Capital', 'PaidCapital'];

  // All possible fields to check if any data exists (matching legacy)
  const allFields: (keyof StructuralInformation)[] = [
    'Capital',
    'PaidCapital',
    'LatestCapitalIncreaseDate',
    'ShareholdingStructure',
  ];

  // Check if any field has data (matching legacy logic)
  const hasAnyData = allFields.some((field) => {
    const value = stepData[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'number') {
      return !Number.isNaN(value) && value !== null;
    }
    // Handle date fields specifically
    if (field === 'LatestCapitalIncreaseDate') {
      return value && value !== null && typeof value === 'string' && value.trim() !== '';
    }
    return value && typeof value === 'string' && value.trim() !== '';
  });

  // If no data at all, status is "not started"
  if (!hasAnyData) {
    return 'Başlanmadı';
  }

  // Check if all required fields are filled (matching legacy logic)
  const allRequiredFilled = requiredFields.every((field) => {
    const value = stepData[field];
    if (typeof value === 'number') {
      return !Number.isNaN(value) && value !== null;
    }
    return value && typeof value === 'string' && value.trim() !== '';
  });

  // If all required fields are filled, status is "completed"
  if (allRequiredFilled) {
    return 'Tamamlandı';
  }

  // If some data exists but not all required fields are filled, status is "started"
  return 'Başlandı';
};

/**
 * Evaluates Group Company Structure step status
 * This step is always optional according to business rules
 */
export const evaluateGroupCompanyStructureStatus = (): StepStatus => {
  // Group Company Structure step is always optional
  // Users can fill this information if they want, but it's not required for completion
  return 'Opsiyonel';
};

/**
 * Evaluates Financial Information step status based on uploaded documents
 * This is the most complex validation matching exactly the legacy logic
 */
export const evaluateFinancialInformationStatus = (uploadedDocuments: FinancialDocument[] = []): StepStatus => {
  if (!uploadedDocuments || uploadedDocuments.length === 0) {
    return 'Başlanmadı';
  }

  // Document Status enum (matching legacy)
  const DocumentStatus = {
    WaitingControl: 0,
    Approved: 1,
    Declined: 3,
    WaitingApprove: 4,
    WaitingProcess: 5,
    ConfirmedAndProcessed: 6,
    NotConfirmed: 7,
    NotProcess: 8,
  };

  // Document Label IDs enum (matching legacy)
  const DocumentLabelID = {
    YILLIK_BEYANNAME_LABEL_ID: 32,
    GECICI_BEYANNAME_LABEL_ID: 33,
    MIZAN_LABEL_ID: 34,
  };

  // Period calculation (matching legacy)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const currentPeriod = (() => {
    const month = new Date().getMonth() + 1;
    if ((month >= 1 && month <= 4) || month === 12) {
      return 1; // Aralık -  Ocak - Şubat - Mart - Nisan
    }
    if (month >= 5 && month <= 8) {
      return 2; // Mayıs - Haziran - Temmuz - Ağustos
    }
    if (month >= 9 && month <= 11) {
      return 3; // Eylül - Ekim - Kasım
    }
    return 0;
  })();

  const isFirstQuarter = currentPeriod === 1;
  const lastYear = currentYear - 1;
  const lastTwoYear = currentYear - 2;

  const prevQuarter = {
    year: isFirstQuarter && currentMonth !== 12 ? lastYear : currentYear,
    quarter: isFirstQuarter ? 3 : currentPeriod - 1,
  };

  // Helper function to check if a document is uploaded and get its status
  const checkDocumentStatus = (labelId: number, periodYear?: number, periodQuarter?: number) => {
    const document = uploadedDocuments.find((doc) => {
      // Cast to extended type for legacy document structure compatibility
      const docExtended = doc as FinancialDocument & {
        LabelId?: number;
        PeriodYear?: number;
        PeriodQuarter?: number;
        Status?: number;
      };

      // Check if document has matching label ID
      if (docExtended.LabelId !== labelId) return false;

      // For documents with specific periods, check period matching
      if (periodYear && periodQuarter) {
        return docExtended.PeriodYear === periodYear && docExtended.PeriodQuarter === periodQuarter;
      } else if (periodYear) {
        return docExtended.PeriodYear === periodYear;
      }

      return true;
    });

    return {
      isUploaded: !!document,
      status: (document as FinancialDocument & { Status?: number })?.Status || null,
    };
  };

  // Required documents (simplified - assuming both years are required)
  const requiredDocuments = [
    // Annual tax returns for last two years
    {
      labelId: DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID,
      periodYear: lastYear,
      periodQuarter: null,
      isRequired: true,
      ...checkDocumentStatus(DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID, lastYear),
    },
    {
      labelId: DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID,
      periodYear: lastTwoYear,
      periodQuarter: null,
      isRequired: true,
      ...checkDocumentStatus(DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID, lastTwoYear),
    },
    // Quarterly required documents - previous quarter is mandatory
    {
      labelId: DocumentLabelID.GECICI_BEYANNAME_LABEL_ID,
      periodYear: prevQuarter.year,
      periodQuarter: prevQuarter.quarter,
      isRequired: true,
      ...checkDocumentStatus(DocumentLabelID.GECICI_BEYANNAME_LABEL_ID, prevQuarter.year, prevQuarter.quarter),
    },
    {
      labelId: DocumentLabelID.MIZAN_LABEL_ID,
      periodYear: prevQuarter.year,
      periodQuarter: prevQuarter.quarter,
      isRequired: true,
      ...checkDocumentStatus(DocumentLabelID.MIZAN_LABEL_ID, prevQuarter.year, prevQuarter.quarter),
    },
  ];

  // Check if all required documents are uploaded
  const requiredDocs = requiredDocuments.filter((doc) => doc.isRequired);
  const allRequiredDocumentsUploaded = requiredDocs.every((doc) => doc.isUploaded);

  // If not all required documents are uploaded, return basic status
  if (!allRequiredDocumentsUploaded) {
    return 'Başlandı';
  }

  // All required documents are uploaded, now check their statuses
  const uploadedRequiredDocs = requiredDocs.filter((doc) => doc.isUploaded);

  // Check if all documents are approved/processed
  const allApproved = uploadedRequiredDocs.every(
    (doc) => doc.status === DocumentStatus.Approved || doc.status === DocumentStatus.ConfirmedAndProcessed,
  );

  if (allApproved) {
    return 'Tamamlandı';
  }

  // For simplicity, return "started" for any other status
  // The legacy logic has more complex status checking that would require
  // additional status types not present in our simplified enum
  return 'Başlandı';
};

/**
 * Updates all step statuses based on FigoScore API data
 * This is the main function called when data is loaded
 */
export const evaluateAllStepStatuses = (
  figoScoreData: FigoScoreProFormData | undefined,
  companyDocuments: FinancialDocument[] = [],
) => {
  if (!figoScoreData) {
    // Return all "not started" if no data, except Summary & Approval which has no status
    return [
      'Başlanmadı' as StepStatus, // Company Information
      'Başlanmadı' as StepStatus, // Commercial & Operational
      'Başlanmadı' as StepStatus, // Registration Information
      'Başlanmadı' as StepStatus, // Company History
      'Başlanmadı' as StepStatus, // Current Management
      'Başlanmadı' as StepStatus, // Structural Information
      'Başlanmadı' as StepStatus, // Financial Information
      'Opsiyonel' as StepStatus, // Group Company Structure
      null, // Summary & Approval - no status indicator needed
    ];
  }

  return [
    evaluateCompanyInformationStatus(figoScoreData.CompanyInformation),
    evaluateCommercialOperationalStatus(figoScoreData.CommercialAndOperationalInformation),
    evaluateRegistrationInformationStatus(figoScoreData.RegistryInformation),
    evaluateCompanyHistoryStatus(figoScoreData.CompanyHistory),
    evaluateCurrentManagementStatus(figoScoreData.CurrentManagementStaff),
    evaluateStructuralInformationStatus(figoScoreData.StructuralInformation),
    evaluateFinancialInformationStatus(companyDocuments),
    evaluateGroupCompanyStructureStatus(),
    null, // Summary & Approval - no status indicator needed
  ];
};
