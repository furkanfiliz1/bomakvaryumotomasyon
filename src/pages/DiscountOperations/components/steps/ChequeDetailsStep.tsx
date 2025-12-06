import { Form, Slot, Table, useNotice } from '@components';
import { Add, ChevronLeft, ChevronRight, Clear } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Checkbox, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HeadCell } from 'src/components/common/Table/types';
import { useLazyGetBillsCompanyQuery } from '../../discount-operations.api';
import type { ChequeDetailsStepProps, ChequeItem, SelectedCheque } from '../../discount-operations.types';
import { useChequeFilterForm } from '../../hooks';
import AddChequeDialog, { AddChequeDialogMethods } from './AddChequeDialog';

// Helper function to format currency
const formatCurrency = (amount: number, currency = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const ChequeDetailsStep: React.FC<ChequeDetailsStepProps> = ({ onNext, onBack, initialData, companyId }) => {
  // State management
  const [selectedCheques, setSelectedCheques] = useState<SelectedCheque[]>(initialData?.selectedCheques || []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed per page count

  console.log('selectedCheques', selectedCheques);

  // Debug effect to track selectedCheques changes
  useEffect(() => {
    console.log('selectedCheques changed:', selectedCheques.length, selectedCheques);
  }, [selectedCheques]);

  // Dialog reference
  const addChequeDialogRef = useRef<AddChequeDialogMethods>(null);

  // Form for filters
  const { form: filterForm, schema: filterSchema, clearFilters } = useChequeFilterForm();
  const drawerName = filterForm.watch('drawerName');
  const chequeNumber = filterForm.watch('chequeNumber');
  const amount = filterForm.watch('amount');
  const paymentDueDate = filterForm.watch('paymentDueDate');

  const notice = useNotice();
  const [getBillsCompany, { data: billsResponse, isLoading }] = useLazyGetBillsCompanyQuery();

  // Extract cheques data with useMemo to avoid dependency issues
  const cheques = useMemo(() => billsResponse?.Bills || [], [billsResponse?.Bills]);
  const totalCheques = cheques.length;

  // Fetch cheques on component mount and when companyId changes
  useEffect(() => {
    if (companyId) {
      getBillsCompany({
        companyId,
        status: 1,
        pageSize: 9999, // Fetch all cheques for client-side filtering/pagination
      });
    }
  }, [companyId, getBillsCompany]);

  // Clear selected cheques when companyId changes (user navigated to different company)
  useEffect(() => {
    setSelectedCheques((prev) => {
      // Filter out cheques that don't belong to the current company
      const filteredCheques = prev.filter((cheque) => cheque.companyId === companyId);
      console.log('Clearing selectedCheques for companyId change:', {
        companyId,
        previousCount: prev.length,
        filteredCount: filteredCheques.length,
      });
      return filteredCheques;
    });
  }, [companyId]);

  // Filter cheques based on current filters
  const filteredCheques = useMemo(() => {
    return cheques.filter((cheque) => {
      const drawerNameMatch =
        !drawerName || (cheque.DrawerName && cheque.DrawerName.toLowerCase().includes(drawerName.toLowerCase()));

      const chequeNumberMatch =
        !chequeNumber || (cheque.No && cheque.No.toLowerCase().includes(chequeNumber.toLowerCase()));

      const amountMatch = !amount || cheque.PayableAmount.toString().includes(amount);

      const paymentDueDateMatch =
        !paymentDueDate ||
        (cheque.PaymentDueDate &&
          new Date(cheque.PaymentDueDate).toDateString() === new Date(paymentDueDate).toDateString());

      return drawerNameMatch && chequeNumberMatch && amountMatch && paymentDueDateMatch;
    });
  }, [cheques, drawerName, chequeNumber, amount, paymentDueDate]);

  // Calculate totals
  const totalAmount = cheques.reduce((sum, cheque) => sum + cheque.PayableAmount, 0);
  const selectedTotalAmount = selectedCheques.reduce((sum, cheque) => sum + cheque.payableAmount, 0);

  // Table headers configuration following project patterns
  const headers: HeadCell[] = [
    { id: 'checkbox', label: '', width: 50, isSortDisabled: true, slot: true },
    { id: 'DrawerName', label: 'Keşideci Adı', width: 120 },
    { id: 'No', label: 'Çek Numarası', width: 150 },
    { id: 'PayableAmount', label: 'Çek Tutarı', width: 140, type: 'currency' },
    { id: 'PaymentDueDate', label: 'Ödeme Vadesi', width: 140, type: 'date' },
    { id: 'InsertDatetime', label: 'Eklenme Tarihi', width: 140, type: 'date' },
  ];

  // Handle cheque selection
  const handleChequeSelect = useCallback(
    (cheque: ChequeItem) => {
      setSelectedCheques((prev) => {
        const isSelected = prev.some((selected) => selected.billId === cheque.Id);

        console.log('handleChequeSelect:', {
          chequeId: cheque.Id,
          isSelected,
          currentSelectionCount: prev.length,
          currentSelection: prev.map((s) => s.billId),
        });

        if (isSelected) {
          // Remove from selection
          const filtered = prev.filter((selected) => selected.billId !== cheque.Id);
          console.log('Removing cheque, new count:', filtered.length);
          return filtered;
        } else {
          // Add to selection
          const newSelection: SelectedCheque = {
            billId: cheque.Id,
            companyId: companyId!,
            payableAmount: cheque.PayableAmount,
            payableAmountCurrency: cheque.PayableAmountCurrency,
            drawerName: cheque.DrawerName,
            no: cheque.No,
            paymentDueDate: cheque.PaymentDueDate,
          };
          const newArray = [...prev, newSelection];
          console.log('Adding cheque, new count:', newArray.length);
          return newArray;
        }
      });
    },
    [companyId],
  );

  // Handle select all for current page (removed as not used in UI)
  // const handleSelectAll = useCallback(() => { ... }, []);

  // Handle filter changes by watching form values
  // Form values are automatically watched and will trigger re-filtering
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [drawerName, chequeNumber, amount, paymentDueDate]);

  // Ensure current page doesn't exceed available pages
  useEffect(() => {
    const maxPage = Math.ceil(filteredCheques.length / itemsPerPage);
    if (maxPage > 0 && currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredCheques.length, currentPage, itemsPerPage]);

  // Handle add cheque dialog
  const handleAddCheque = useCallback(() => {
    addChequeDialogRef.current?.open();
  }, []);

  // Handle cheque added from dialog
  const handleChequeAdded = useCallback(() => {
    // Refresh the cheques list when a new cheque is added
    if (companyId) {
      getBillsCompany({
        companyId,
        status: 1,
        pageSize: 9999,
      });
    }
  }, [companyId, getBillsCompany]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (selectedCheques.length === 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen en az bir çek seçiniz.',
        buttonTitle: 'Tamam',
      });
      return;
    }

    onNext({ selectedCheques });
  }, [selectedCheques, onNext, notice]);

  // Current page calculations for table display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageCheques = filteredCheques.slice(startIndex, endIndex);

  return (
    <Box sx={{ py: 2 }}>
      {/* Filters and Actions */}
      {totalCheques > 0 && (
        <Card sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Form form={filterForm} schema={filterSchema} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<Clear />} onClick={clearFilters}>
                Temizle
              </Button>
              <Button variant="contained" size="small" startIcon={<Add />} onClick={handleAddCheque}>
                Çek Ekle
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      {/* Add button for empty state */}
      {totalCheques === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={handleAddCheque}>
            Çek Ekle
          </Button>
        </Box>
      )}

      {/* Table */}
      {filteredCheques.length > 0 ? (
        <>
          <Table<ChequeItem>
            key={`table-${selectedCheques.length}-${currentPage}`}
            id="cheque-details-table"
            rowId="Id"
            headers={headers}
            data={currentPageCheques}
            loading={isLoading}
            checkbox={false} // We'll handle selection manually for more control
            size="small"
            striped
            maxHeight="250px"
            hidePaging={true} // We'll use client-side pagination
            notFoundConfig={{
              title: 'Çek bulunamadı',
              subTitle: 'Lütfen arama kriterlerinizi değiştirin.',
            }}>
            {/* Custom checkbox slot */}
            <Slot<ChequeItem> id="checkbox">
              {(_, row) => {
                if (!row) return null;
                const isChecked = selectedCheques.some((selected) => selected.billId === row.Id);
                const checkboxKey = `checkbox-${row.Id}-${selectedCheques.length}-${companyId}`;

                console.log(`Checkbox for row ${row.Id}:`, { isChecked, selectedCount: selectedCheques.length });

                return (
                  <Checkbox
                    key={checkboxKey}
                    checked={isChecked}
                    onChange={() => handleChequeSelect(row)}
                    size="small"
                  />
                );
              }}
            </Slot>
          </Table>

          {/* Client-side Pagination Controls */}
        </>
      ) : totalCheques > 0 ? (
        <Card sx={{ p: 2 }}>
          <Typography variant="body1" color="warning.main" gutterBottom>
            Filtreye uygun çek bulunamadı
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lütfen arama kriterlerinizi değiştirin.
          </Typography>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Henüz bir çek eklememişsiniz.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Grid container sx={{ mt: 2 }} alignItems="center">
        <Grid item lg={4}>
          <Button variant="outlined" onClick={onBack}>
            Önceki
          </Button>{' '}
        </Grid>
        <Grid item lg={4}>
          {filteredCheques.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ height: '30px', p: 0, minWidth: '50px' }}
                disabled={currentPage <= 1}
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                }}>
                <ChevronLeft />
              </Button>

              <Typography variant="body2">
                Sayfa {currentPage} / {Math.ceil(filteredCheques.length / itemsPerPage)} ({filteredCheques.length} çek)
              </Typography>

              <Button
                variant="outlined"
                size="small"
                sx={{ height: '30px', p: 0, minWidth: '50px' }}
                disabled={currentPage >= Math.ceil(filteredCheques.length / itemsPerPage)}
                onClick={() => {
                  const maxPage = Math.ceil(filteredCheques.length / itemsPerPage);
                  const newPage = Math.min(maxPage, currentPage + 1);
                  setCurrentPage(newPage);
                }}>
                <ChevronRight />
              </Button>
            </Box>
          )}
        </Grid>
        <Grid item lg={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Selection Summary */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" color="text.secondary">
                Toplam: <strong>{totalCheques}</strong> çek • {formatCurrency(totalAmount, 'TRY')}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Seçilen Çek: <strong>{selectedCheques.length}</strong> • {formatCurrency(selectedTotalAmount, 'TRY')}
              </Typography>
            </Box>

            <Button variant="contained" onClick={handleSubmit} disabled={selectedCheques.length === 0 || isLoading}>
              Sonraki
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Add Cheque Dialog */}
      <AddChequeDialog ref={addChequeDialogRef} onChequeAdded={handleChequeAdded} companyId={companyId} />
    </Box>
  );
};

export default ChequeDetailsStep;
