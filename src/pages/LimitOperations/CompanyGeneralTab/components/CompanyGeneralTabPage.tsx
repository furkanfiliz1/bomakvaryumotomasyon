import { Alert, Box, CircularProgress } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import React, { useState } from 'react';

import { useCompanyGeneralTabData } from '../hooks';
import { GeneralInformationForm } from './GeneralInformationForm';
import { IntegratorHistoryDialog } from './IntegratorHistoryDialog';
import { LimitAllocationsList } from './LimitAllocationsList';
import { ScoreInformationForm } from './ScoreInformationForm';

// Set Turkish locale for dayjs
dayjs.locale('tr');

interface CompanyGeneralTabPageProps {
  companyId: string;
}

/**
 * Company General Tab Main Page Component
 * Following OperationPricing pattern for main feature page
 */
export const CompanyGeneralTabPage: React.FC<CompanyGeneralTabPageProps> = ({ companyId }) => {
  const [showIntegratorHistory, setShowIntegratorHistory] = useState(false);

  const {
    companyDetail,
    companyAllocations,
    transferList,
    scoreCompany,
    integratorHistory,
    groupCompanies,
    isTransferPossible,
    isLoading,
    hasError,
    refetchAll,
  } = useCompanyGeneralTabData(companyId);

  // Show loading for essential data (company detail and transfer list)
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
        <Box ml={2}>
          <Alert severity="info">Şirket bilgileri yükleniyor...</Alert>
        </Box>
      </Box>
    );
  }

  // Show error for critical failures
  if (hasError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Veri yüklenirken hata oluştu. Lütfen sayfayı yenileyin veya sistem yöneticisi ile iletişime geçin.
      </Alert>
    );
  }

  // Show warning if no company detail found
  if (!companyDetail) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Şirket bilgileri bulunamadı. Şirket ID&apos;sini kontrol edin.
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
      <Box>
        {/* General Information Section - Always render when company data exists */}
        <GeneralInformationForm
          companyDetail={companyDetail}
          transferList={transferList}
          groupCompanies={groupCompanies}
          isTransferPossible={isTransferPossible}
          onShowIntegratorHistory={() => setShowIntegratorHistory(true)}
          onRefresh={refetchAll}
        />

        {/* Score General Information Section - Always show to match legacy behavior */}
        <ScoreInformationForm
          scoreCompany={scoreCompany}
          companyIdentifier={companyDetail.Identifier || ''}
          onRefresh={refetchAll}
        />

        {/* Limit Allocation Information Section - Use enhanced allocation data */}
        {companyAllocations?.LimitAllocations && companyAllocations.LimitAllocations.length > 0 && (
          <LimitAllocationsList limitAllocations={companyAllocations.LimitAllocations} />
        )}

        {/* Integrator History Dialog */}
        <IntegratorHistoryDialog
          open={showIntegratorHistory}
          onClose={() => setShowIntegratorHistory(false)}
          integratorHistory={integratorHistory}
        />
      </Box>
    </LocalizationProvider>
  );
};
