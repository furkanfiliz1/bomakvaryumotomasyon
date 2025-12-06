import { CheckCircle, Clear, Description as DescriptionIcon, Info as InfoIcon, Warning } from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FigoScoreProFormData, FinancialDocument } from '../../customer-request-branch-detail.types';

export interface FinancialInformationProps {
  figoScoreData?: FigoScoreProFormData;
  companyDocuments: FinancialDocument[];
  isLoading: boolean;
}

// Current period calculation based on business rules (matching legacy exactly)
const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

const getCurrentPeriod = () => {
  const currentMonth = getCurrentMonth();
  if ((currentMonth >= 1 && currentMonth <= 4) || currentMonth === 12) {
    return 1; // Aralık - Ocak - Şubat - Mart - Nisan
  }
  if (currentMonth >= 5 && currentMonth <= 8) {
    return 2; // Mayıs - Haziran - Temmuz - Ağustos
  }
  if (currentMonth >= 9 && currentMonth <= 11) {
    return 3; // Eylül - Ekim - Kasım
  }
  return 0;
};

const currentYear = getCurrentYear();
const currentMonth = getCurrentMonth();
const currentPeriod = getCurrentPeriod();
const isFirstQuarter = currentPeriod === 1;
const lastYear = currentYear - 1;
const lastTwoYear = currentYear - 2;

const prevQuarter = {
  year: isFirstQuarter && currentMonth !== 12 ? lastYear : currentYear,
  quarter: isFirstQuarter ? 3 : currentPeriod - 1,
};

// Document Status enum (matching legacy exactly)
const DocumentStatus = {
  WaitingControl: 0,
  Approved: 1,
  Declined: 3,
  WaitingApprove: 4,
  WaitingProcess: 5,
  ConfirmedAndProcessed: 6,
  NotConfirmed: 7,
  NotProcess: 8,
  NotProcessedByPapirus: 9,
};

// Document Label IDs enum (matching legacy exactly)
const DocumentLabelID = {
  VERGI_LEVHASI_LABEL_ID: 4,
  ABF_LABEL_ID: 20,
  TALIMAT_FORMU_LABEL_ID: 27,
  E_DEFTER_KEBIR: 30,
  E_DEFTER_BERAT: 31,
  YILLIK_BEYANNAME_LABEL_ID: 32,
  GECICI_BEYANNAME_LABEL_ID: 33,
  MIZAN_LABEL_ID: 34,
  FINDEKS_LABEL_ID: 35,
  FAALIYET_RAPORU_LABEL_ID: 37,
};

interface DocumentData {
  LabelId: number;
  LabelName?: string;
  LabelDescription?: string;
  PeriodYear?: number;
  PeriodQuarter?: number;
  Status: number;
}

interface ProcessedDocument {
  labelId: number;
  labelName: string;
  periodYear: number | null;
  periodQuarter: number | null;
  isRequired: boolean;
  isUploaded: boolean;
  status: number | null;
}

/**
 * Financial Information Step Component
 * Displays comprehensive document management with exact legacy business logic
 */
export const FinancialInformation: React.FC<FinancialInformationProps> = ({
  companyDocuments,
  figoScoreData,
  isLoading,
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentData[]>([]);

  // Convert FinancialDocument[] to DocumentData[] - exact legacy mapping
  useEffect(() => {
    const convertedDocs: DocumentData[] = companyDocuments.map((doc) => ({
      LabelId: doc.LabelId, // Use actual LabelId from document
      LabelName: doc.LabelName,
      LabelDescription: doc.LabelDescription,
      PeriodYear: doc.PeriodYear,
      PeriodQuarter: doc.PeriodQuarter,
      Status: doc.Status,
    }));

    setUploadedDocuments(convertedDocs);
  }, [companyDocuments]);

  // Helper function to determine required tax returns based on company establishment date (legacy logic)
  const getRequiredTaxReturnYears = useMemo(() => {
    const establishmentDate = figoScoreData?.CompanyHistory?.FoundingDate;

    if (!establishmentDate) {
      return [lastYear, lastTwoYear];
    }

    const establishmentYear = new Date(establishmentDate).getFullYear();
    const requiredYears = [];

    if (establishmentYear <= lastTwoYear) {
      requiredYears.push(lastTwoYear, lastYear);
    } else if (establishmentYear <= lastYear) {
      requiredYears.push(lastYear);
    }

    return requiredYears;
  }, [figoScoreData?.CompanyHistory?.FoundingDate]);

  // Helper function to check if a document is uploaded and get its status (legacy logic)
  const checkDocumentStatus = useCallback(
    (labelId: number, periodYear: number | null = null, periodQuarter: number | null = null) => {
      const document = uploadedDocuments.find((doc) => {
        if (doc.LabelId !== labelId) return false;

        if (periodYear && periodQuarter) {
          return doc.PeriodYear === periodYear && doc.PeriodQuarter === periodQuarter;
        } else if (periodYear) {
          return doc.PeriodYear === periodYear;
        }

        return true;
      });

      return {
        isUploaded: !!document,
        status: document?.Status || null,
      };
    },
    [uploadedDocuments],
  );

  // Helper function to get document name based on label ID (legacy logic)
  const getDocumentLabelName = useCallback((labelId: number, uploadedDoc: DocumentData | null = null): string => {
    switch (labelId) {
      case DocumentLabelID.VERGI_LEVHASI_LABEL_ID:
        return 'Vergi Levhası';
      case DocumentLabelID.ABF_LABEL_ID:
        return 'ABF';
      case DocumentLabelID.TALIMAT_FORMU_LABEL_ID:
        return 'Talimat Formu';
      case DocumentLabelID.E_DEFTER_KEBIR:
        return 'E-Defter Kebir';
      case DocumentLabelID.E_DEFTER_BERAT:
        return 'E-Defter Berat';
      case DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID:
        return 'Kurumlar Beyannamesi';
      case DocumentLabelID.GECICI_BEYANNAME_LABEL_ID:
        return 'Geçici Beyanname';
      case DocumentLabelID.MIZAN_LABEL_ID:
        return 'Mizan';
      case DocumentLabelID.FINDEKS_LABEL_ID:
        return 'Findeks Raporu';
      case DocumentLabelID.FAALIYET_RAPORU_LABEL_ID:
        return 'Faaliyet Raporu';
      default:
        return uploadedDoc?.LabelName || uploadedDoc?.LabelDescription || 'Diğer Belge';
    }
  }, []);

  // Helper function to check if a document is required (legacy logic)
  const isDocumentRequired = useCallback(
    (labelId: number, periodYear: number | null, periodQuarter: number | null): boolean => {
      if (labelId === DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID && periodYear) {
        return getRequiredTaxReturnYears.includes(periodYear);
      }

      if (labelId === DocumentLabelID.GECICI_BEYANNAME_LABEL_ID || labelId === DocumentLabelID.MIZAN_LABEL_ID) {
        if (periodYear === prevQuarter.year && periodQuarter === prevQuarter.quarter) {
          return true;
        }
      }

      return false;
    },
    [getRequiredTaxReturnYears],
  );

  // Get all documents (both required and uploaded) - exact legacy logic
  const getAllDocuments = useMemo((): ProcessedDocument[] => {
    const documentMap = new Map<string, ProcessedDocument>();

    // First, add required documents and always visible documents
    const requiredDocs: ProcessedDocument[] = [
      // Dynamic tax returns based on company establishment date
      ...getRequiredTaxReturnYears.map((year) => ({
        labelId: DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID,
        labelName: getDocumentLabelName(DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID),
        periodYear: year,
        periodQuarter: null,
        isRequired: true,
        ...checkDocumentStatus(DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID, year),
      })),
      // Quarterly required documents - previous quarter is mandatory
      {
        labelId: DocumentLabelID.GECICI_BEYANNAME_LABEL_ID,
        labelName: getDocumentLabelName(DocumentLabelID.GECICI_BEYANNAME_LABEL_ID),
        periodYear: prevQuarter.year,
        periodQuarter: prevQuarter.quarter,
        isRequired: true,
        ...checkDocumentStatus(DocumentLabelID.GECICI_BEYANNAME_LABEL_ID, prevQuarter.year, prevQuarter.quarter),
      },
      {
        labelId: DocumentLabelID.MIZAN_LABEL_ID,
        labelName: getDocumentLabelName(DocumentLabelID.MIZAN_LABEL_ID),
        periodYear: prevQuarter.year,
        periodQuarter: prevQuarter.quarter,
        isRequired: true,
        ...checkDocumentStatus(DocumentLabelID.MIZAN_LABEL_ID, prevQuarter.year, prevQuarter.quarter),
      },
      // Always visible but not required documents
      {
        labelId: DocumentLabelID.FINDEKS_LABEL_ID,
        labelName: getDocumentLabelName(DocumentLabelID.FINDEKS_LABEL_ID),
        periodYear: null,
        periodQuarter: null,
        isRequired: false,
        ...checkDocumentStatus(DocumentLabelID.FINDEKS_LABEL_ID),
      },
    ];

    // Add required documents to map
    for (const doc of requiredDocs) {
      const key = `${doc.labelId}-${doc.periodYear || 'null'}-${doc.periodQuarter || 'null'}`;
      documentMap.set(key, doc);
    }

    // Then, add all uploaded documents (including optional ones)
    for (const uploadedDoc of uploadedDocuments) {
      const key = `${uploadedDoc.LabelId}-${uploadedDoc.PeriodYear || 'null'}-${uploadedDoc.PeriodQuarter || 'null'}`;

      if (documentMap.has(key)) {
        // Document is already in the map (required), just update the status
        const existingDoc = documentMap.get(key)!;
        existingDoc.isUploaded = true;
        existingDoc.status = uploadedDoc.Status;
      } else {
        // This is an optional document that was uploaded
        const isRequired = isDocumentRequired(
          uploadedDoc.LabelId,
          uploadedDoc.PeriodYear || null,
          uploadedDoc.PeriodQuarter || null,
        );
        documentMap.set(key, {
          labelId: uploadedDoc.LabelId,
          labelName: getDocumentLabelName(uploadedDoc.LabelId, uploadedDoc),
          periodYear: uploadedDoc.PeriodYear || null,
          periodQuarter: uploadedDoc.PeriodQuarter || null,
          isRequired: isRequired,
          isUploaded: true,
          status: uploadedDoc.Status,
        });
      }
    }

    return Array.from(documentMap.values()).sort((a, b) => {
      // Sort by required status first (required documents first)
      if (a.isRequired !== b.isRequired) {
        return b.isRequired ? 1 : -1;
      }
      // Then sort by label name
      return a.labelName.localeCompare(b.labelName, 'tr');
    });
  }, [uploadedDocuments, getRequiredTaxReturnYears, checkDocumentStatus, getDocumentLabelName, isDocumentRequired]);

  // Dynamic badge style helper function (legacy logic)
  const getDynamicBadgeStyle = (status: number) => {
    if (status === DocumentStatus.WaitingControl) {
      return { text: 'Kontrol Bekliyor', color: 'warning' as const };
    } else if (status === DocumentStatus.Approved || status === DocumentStatus.ConfirmedAndProcessed) {
      return { text: 'Güncel', color: 'success' as const };
    } else if (
      status === DocumentStatus.Declined ||
      status === DocumentStatus.NotConfirmed ||
      status === DocumentStatus.NotProcess ||
      status === DocumentStatus.NotProcessedByPapirus
    ) {
      return { text: 'Onaylanmadı', color: 'error' as const };
    } else if (status === DocumentStatus.WaitingApprove || status === DocumentStatus.WaitingProcess) {
      return { text: 'İşleniyor', color: 'warning' as const };
    } else {
      return { text: 'Kontrol Bekliyor', color: 'default' as const };
    }
  };

  // Get document period display (legacy logic)
  const getDocumentPeriod = (doc: ProcessedDocument): string => {
    if (doc.periodYear && doc.periodQuarter) {
      return `${doc.periodYear} / Q${doc.periodQuarter}`;
    }
    if (doc.periodYear) {
      return `${doc.periodYear}`;
    }
    return 'Dönemsiz';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Mali bilgiler yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          bgcolor: 'grey.50',
          '& .MuiTableHead-root': {
            bgcolor: 'primary.50',
          },
        }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell>Belge Adı</TableCell>
              <TableCell>Dönem</TableCell>
              <TableCell>Yükleme Durumu</TableCell>
              <TableCell>Belge Durumu</TableCell>
              <TableCell>Zorunluluk</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                    <InfoIcon color="info" />
                    <Typography color="text.secondary">Belge durumları kontrol ediliyor...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              getAllDocuments.map((doc) => {
                const uniqueKey = `${doc.labelId}-${doc.periodYear || 'null'}-${doc.periodQuarter || 'null'}`;
                const statusInfo =
                  doc.status === null
                    ? { text: 'Kontrol Bekliyor', color: 'default' as const }
                    : getDynamicBadgeStyle(doc.status);

                return (
                  <TableRow key={uniqueKey}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DescriptionIcon color="disabled" fontSize="small" />
                        {doc.labelName}
                      </Box>
                    </TableCell>
                    <TableCell>{getDocumentPeriod(doc)}</TableCell>
                    <TableCell>
                      {doc.isUploaded ? (
                        <Chip icon={<CheckCircle fontSize="small" />} label="Yüklendi" color="success" size="small" />
                      ) : (
                        <Chip icon={<Clear fontSize="small" />} label="Yüklenmedi" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.isUploaded ? (
                        <Chip label={statusInfo.text} color={statusInfo.color} size="small" />
                      ) : (
                        <Chip icon={<Clear fontSize="small" />} label="Yüklenmedi" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.isRequired ? (
                        <Chip icon={<Warning fontSize="small" />} label="Zorunlu" color="warning" size="small" />
                      ) : (
                        <Chip label="Opsiyonel" color="info" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
