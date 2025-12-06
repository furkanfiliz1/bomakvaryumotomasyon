import { PageHeader, Slot } from '@components';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'src/components/common/Table/Table';
import { calculatePageTotals, generateExcelFileName, legalProceedingsTableHeaders } from '../helpers';
import { useLegalProceedingsQueryParams } from '../hooks';
import { useGetLegalProceedingsReportQuery } from '../limit-operations.api';
import { LegalProceedingsItem, LegalProceedingsResponse } from '../limit-operations.types';
import {
  LegalProceedingsCollapseDetails,
  LegalProceedingsFilters,
  LegalProceedingsSummary,
  LegalProceedingsTableRowActions,
  LegalProceedingsTableSlots,
} from './';

const LimitLegalProceedingsPage = () => {
  const { queryParams, updateParams } = useLegalProceedingsQueryParams();

  // State for dialogs
  const [warningDialog, setWarningDialog] = useState<boolean>(false);

  // Modal state placeholders for future implementation
  // const [selectedModal, setSelectedModal] = useState<string | null>(null);
  // const [selectedModalElement, setSelectedModalElement] = useState<LegalProceedingsItem | null>(null);

  // API call with server-side pagination
  const { data: response, error, isLoading, refetch } = useGetLegalProceedingsReportQuery(queryParams);

  const legalProceedingsData = response?.Items || [];
  const totalCount = response?.TotalCount || 0;

  // Calculate page totals
  const pageTotals = calculatePageTotals(legalProceedingsData);

  // Handle Excel export
  useEffect(() => {
    if (response?.ExtensionData) {
      const fileName = generateExcelFileName();
      const blob = new Blob([Uint8Array.from(atob(response.ExtensionData), (c) => c.charCodeAt(0))], {
        type: 'application/vnd.ms-excel',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [response?.ExtensionData]);

  // Handle export
  const handleExport = useCallback(() => {
    updateParams({ ...queryParams, isExport: true });
  }, [queryParams, updateParams]);

  // Handle pagination
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: newPage + 1 }); // MUI uses 0-based, API uses 1-based
    },
    [updateParams],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      updateParams({ page: 1, pageSize: newPageSize });
    },
    [updateParams],
  );

  const closeWarningDialog = useCallback(() => {
    setWarningDialog(false);
  }, []);

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Kanuni takip verileri yüklenirken bir hata oluştu: {error.toString()}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <PageHeader title="Kanuni Takip İşlemleri" subtitle="Tazmin Edilen İşlemler İçin Kanuni Takip Süreci" />
      <Box mx={2}>
        {/* Filters */}
        <LegalProceedingsFilters onExport={handleExport} isLoading={isLoading} />

        {/* Table */}
        <Card sx={{ p: 2 }}>
          <Table
            id="legal-proceedings-table"
            rowId="Id"
            headers={legalProceedingsTableHeaders}
            data={legalProceedingsData}
            loading={isLoading}
            error={error}
            rowActions={[
              {
                Element: ({ toggleCollapse, isCollapseOpen }) => (
                  <LegalProceedingsTableSlots.CollapseToggleSlot
                    toggleCollapse={toggleCollapse}
                    isCollapseOpen={isCollapseOpen}
                  />
                ),
                isCollapseButton: true,
              },
              {
                Element: ({ row }) => (row ? <LegalProceedingsTableRowActions item={row} onDeleted={refetch} /> : null),
                isCollapseButton: false,
              },
            ]}
            CollapseComponent={({ row }) => <LegalProceedingsCollapseDetails row={row} />}
            pagingConfig={{
              page: (queryParams.page || 1) - 1, // Convert to 0-based for MUI
              rowsPerPage: queryParams.pageSize || 50,
              totalCount: totalCount,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            notFoundConfig={{
              title: 'Kanuni takip kaydı bulunamadı',
              subTitle: 'Arama kriterlerinize uygun kayıt bulunmuyor. Filtreleri değiştirmeyi deneyin.',
            }}
            size="small"
            striped>
            <Slot<LegalProceedingsItem> id="invoiceId">
              {(_, row) => {
                const RiskyFinancialSituations = row?.RiskyFinancialSituations || [];

                // Map situation numbers to descriptions
                const getSituationText = (situationCode: number): string => {
                  switch (situationCode) {
                    case 1:
                      return 'İflas';
                    case 4:
                      return 'Konkordato';
                    default:
                      return `-`;
                  }
                };

                if (RiskyFinancialSituations && RiskyFinancialSituations?.length === 0) return '-';

                return (
                  <>
                    {RiskyFinancialSituations?.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {RiskyFinancialSituations?.map((situation, index) => (
                          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                            {getSituationText(situation)}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </>
                );
              }}
            </Slot>
          </Table>
        </Card>
        {/* Summary Banner - Only show when there are results */}
        {legalProceedingsData.length > 0 && (
          <LegalProceedingsSummary
            perPageCompensationAmount={pageTotals.perPageCompensationAmount}
            perPageCollectionAmount={pageTotals.perPageCollectionAmount}
            perPageRemainingCompensationAmount={pageTotals.perPageRemainingCompensationAmount}
            totalCompensationAmount={(response as LegalProceedingsResponse)?.AllTotalAmount || 0}
            totalCollectionAmount={(response as LegalProceedingsResponse)?.AllTotalCollectionAmount || 0}
            totalRemainingCompensationAmount={(response as LegalProceedingsResponse)?.AllTotalClosingBalance || 0}
            currentPageItemCount={legalProceedingsData.length}
            totalItemCount={totalCount}
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 9999,
            }}>
            <CircularProgress />
          </Box>
        )}

        {/* Warning Dialog for ProductType === 0 */}
        <Dialog open={warningDialog} onClose={closeWarningDialog}>
          <DialogTitle>Uyarı</DialogTitle>
          <DialogContent>
            <Typography>Bu ürün tipi için işlem gerçekleştirilemez.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeWarningDialog}>Tamam</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default LimitLegalProceedingsPage;
