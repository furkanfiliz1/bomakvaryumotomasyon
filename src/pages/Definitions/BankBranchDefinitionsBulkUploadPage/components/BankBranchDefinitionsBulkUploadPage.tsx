/**
 * Bank Branch Bulk Upload Page
 * Main page component for bulk uploading bank branches via Excel or manual entry
 */

import { FigoLoading, LoadingButton, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import {
  useCreateBankBranchesBulkMutation,
  useGetBankBranchesBulkUploadQuery,
  useGetBanksBulkUploadQuery,
} from '../bank-branch-bulk-upload.api';
import type { BankItem, BranchToAdd } from '../bank-branch-bulk-upload.types';
import { BRANCH_CODE_LENGTH, isValidBranchCode, isValidBranchName } from '../helpers';
import { ExcelUploadModal } from './ExcelUploadModal';
import { ExistingBranchesTable } from './ExistingBranchesTable';

export const BankBranchDefinitionsBulkUploadPage: React.FC = () => {
  const notice = useNotice();

  // State
  const [selectedBank, setSelectedBank] = useState<BankItem | null>(null);
  const [branchesToAdd, setBranchesToAdd] = useState<BranchToAdd[]>([]);
  const [overWrite, setOverWrite] = useState<boolean>(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState<boolean>(false);
  const [branchCode, setBranchCode] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');

  // API Queries
  const { data: banksData, isLoading: isBanksLoading, error: banksError } = useGetBanksBulkUploadQuery();

  const {
    data: branchesData,
    isLoading: isBranchesLoading,
    refetch: refetchBranches,
  } = useGetBankBranchesBulkUploadQuery({ BankId: selectedBank?.Id || 0 }, { skip: !selectedBank });

  const [createBranchesBulk, { isLoading: isCreating, error: createError }] = useCreateBankBranchesBulkMutation();

  // Error handling
  useErrorListener([banksError, createError]);

  // Memoized data
  const banks = useMemo(() => banksData || [], [banksData]);
  const existingBranches = useMemo(() => branchesData?.Items || [], [branchesData]);

  // Handlers
  const handleBankChange = useCallback((_: React.SyntheticEvent, value: BankItem | null) => {
    setSelectedBank(value);
    setBranchesToAdd([]);
  }, []);

  const handleAddBranch = useCallback(() => {
    // Validate
    if (!isValidBranchCode(branchCode)) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: `Şube kodu ${BRANCH_CODE_LENGTH} haneli olmalıdır`,
      });
      return;
    }

    if (!isValidBranchName(branchName)) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Şube adı boş olamaz',
      });
      return;
    }

    // Check for duplicates in pending list
    const isDuplicate = branchesToAdd.some((b) => b.code === branchCode);
    if (isDuplicate) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Bu şube kodu zaten eklenmiş',
      });
      return;
    }

    // Add to list
    setBranchesToAdd((prev) => [...prev, { code: branchCode, name: branchName }]);
    setBranchCode('');
    setBranchName('');
    notice({
      variant: 'success',
      message: 'Şube listeye eklendi',
    });
  }, [branchCode, branchName, branchesToAdd, notice]);

  const handleRemoveBranch = useCallback((index: number) => {
    setBranchesToAdd((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearAll = useCallback(() => {
    setBranchesToAdd([]);
  }, []);

  const handleExcelSubmit = useCallback(
    (branches: BranchToAdd[], excelOverWrite: boolean) => {
      setBranchesToAdd((prev) => [...prev, ...branches]);
      setOverWrite(excelOverWrite);
      setIsExcelModalOpen(false);
      notice({
        variant: 'success',
        message: `${branches.length} şube listeye eklendi`,
      });
    },
    [notice],
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedBank) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Lütfen bir banka seçin',
      });
      return;
    }

    if (branchesToAdd.length === 0) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Eklenecek şube bulunamadı',
      });
      return;
    }

    try {
      await createBranchesBulk({
        bankId: selectedBank.Id,
        branches: branchesToAdd,
        overWrite,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Şubeler başarıyla eklendi',
      });
      setBranchesToAdd([]);
      setOverWrite(false);
      refetchBranches();
    } catch {
      // Error handled by useErrorListener
    }
  }, [selectedBank, branchesToAdd, overWrite, createBranchesBulk, notice, refetchBranches]);

  if (isBanksLoading) {
    return <FigoLoading />;
  }

  return (
    <>
      <PageHeader
        title="Banka Şubesi Excel ile Toplu Ekle"
        subtitle="Seçilen bankaya manuel ve excel ile dosya şube ekleyebilirsiniz."
      />

      <Box mx={2}>
        <Card>
          <CardContent>
            {/* Bank Selection */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={banks}
                  getOptionLabel={(option) => `${option.Code} - ${option.Name}`}
                  value={selectedBank}
                  onChange={handleBankChange}
                  renderInput={(params) => (
                    <>
                      <CustomInputLabel label="Banka Seçin" />
                      <TextField {...params} placeholder="Banka ara..." fullWidth />
                    </>
                  )}
                  isOptionEqualToValue={(option, value) => option.Id === value.Id}
                />
              </Grid>
            </Grid>

            {/* Manual Entry Form */}
            {selectedBank && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Manuel Şube Ekle
                </Typography>

                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={3}>
                    <CustomInputLabel label="Şube Kodu" />
                    <TextField
                      value={branchCode}
                      onChange={(e) => setBranchCode(e.target.value)}
                      fullWidth
                      required
                      inputProps={{ maxLength: 5 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <CustomInputLabel label="Şube Adı" />
                    <TextField value={branchName} onChange={(e) => setBranchName(e.target.value)} fullWidth required />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ mt: 3.5 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddBranch} sx={{ mr: 2 }}>
                      Ekle
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => setIsExcelModalOpen(true)}>
                      Excel Yükle
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Branches To Add Table */}
            {selectedBank && branchesToAdd.length > 0 && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Eklenecek Şubeler ({branchesToAdd.length})
                  </Typography>
                  <Button variant="text" color="error" onClick={handleClearAll}>
                    Tümünü Temizle
                  </Button>
                </Box>

                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Şube Kodu</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Şube Adı</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 60 }}>Sil</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {branchesToAdd.map((branch, index) => (
                        <TableRow key={`${branch.code}-${branch.name}`} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{branch.code}</TableCell>
                          <TableCell>{branch.name}</TableCell>
                          <TableCell>
                            <IconButton size="small" color="error" onClick={() => handleRemoveBranch(index)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox checked={overWrite} onChange={(e) => setOverWrite(e.target.checked)} />}
                    label="Mevcut şubelerin üzerine yaz"
                  />

                  <LoadingButton id="save-branches-btn" variant="contained" loading={isCreating} onClick={handleSubmit}>
                    Şubeleri Kaydet
                  </LoadingButton>
                </Box>
              </Paper>
            )}

            {/* Existing Branches Table */}
            {selectedBank && (
              <ExistingBranchesTable
                bankName={selectedBank.Name}
                branches={existingBranches}
                isLoading={isBranchesLoading}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Excel Upload Modal */}
      {selectedBank && (
        <ExcelUploadModal
          open={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
          onSubmit={handleExcelSubmit}
          isSubmitting={false}
          bankName={selectedBank.Name}
        />
      )}
    </>
  );
};

export default BankBranchDefinitionsBulkUploadPage;
