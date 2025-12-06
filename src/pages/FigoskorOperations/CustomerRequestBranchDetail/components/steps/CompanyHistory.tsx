import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import type { EnumData, FigoScoreProFormData } from '../../customer-request-branch-detail.types';
import { getCorporationTypeName } from '../../helpers';

export interface CompanyHistoryProps {
  figoScoreData?: FigoScoreProFormData;
  enumData: EnumData;
  isLoading: boolean;
}

/**
 * Company History Step Component
 * Displays comprehensive company historical information matching legacy layout
 */
export const CompanyHistory: React.FC<CompanyHistoryProps> = ({ figoScoreData, enumData, isLoading }) => {
  const stepData = figoScoreData?.CompanyHistory;

  // Extract corporation types from enumData
  const { corporationTypes } = enumData;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Veri bekleniyor...';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Veri bekleniyor...';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Şirket geçmişi yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Foundation Information */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Kuruluş Bilgileri
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Kuruluş Tarihi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.FoundingDate ? 'normal' : 'italic',
                color: stepData?.FoundingDate ? 'inherit' : 'text.secondary',
              }}>
              {formatDate(stepData?.FoundingDate)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Kuruluş Sermayesi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.FoundationCapital ? 'normal' : 'italic',
                color: stepData?.FoundationCapital ? 'inherit' : 'text.secondary',
              }}>
              {formatCurrency(stepData?.FoundationCapital)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Kuruluştaki Hukuki Yapısı
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.CorporationType ? 'normal' : 'italic',
                color: stepData?.CorporationType ? 'inherit' : 'text.secondary',
              }}>
              {getCorporationTypeName(stepData?.CorporationType, corporationTypes)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Kuruluş Ünvanı
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontSize: '0.9em',
                fontStyle: stepData?.FoundingTitle ? 'normal' : 'italic',
                color: stepData?.FoundingTitle ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.FoundingTitle || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Company Founders - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Şirket Kurucuları
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell>Ad</TableCell>
              <TableCell>Soyad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.CompanyFounders && stepData.CompanyFounders.length > 0 ? (
              stepData.CompanyFounders.map((founder, index) => (
                <TableRow key={`founder-${founder.FirstName}-${founder.LastName}-${index}`}>
                  <TableCell>{founder.FirstName}</TableCell>
                  <TableCell>{founder.LastName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Title Changes - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Ünvan Değişiklikleri
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell>Yeni Ünvan</TableCell>
              <TableCell>Değişiklik Tarihi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.TitleChanges && stepData.TitleChanges.length > 0 ? (
              stepData.TitleChanges.map((change, index) => (
                <TableRow key={`title-${change.Title}-${change.ChangeDate}-${index}`}>
                  <TableCell>{change.Title}</TableCell>
                  <TableCell>{formatDate(change.ChangeDate)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Address Changes - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Adres Değişiklikleri
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell>Yeni Adres</TableCell>
              <TableCell>Değişiklik Tarihi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.AddressChanges && stepData.AddressChanges.length > 0 ? (
              stepData.AddressChanges.map((change, index) => (
                <TableRow key={`address-${change.ChangeDate}-${index}`}>
                  <TableCell>{change.Address}</TableCell>
                  <TableCell>{formatDate(change.ChangeDate)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mergers and Acquisitions - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Birleşme ve Devralma İşlemleri
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell>Şirket Ünvanı</TableCell>
              <TableCell>Devralma Yılı</TableCell>
              <TableCell>Şirket Türü</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.MergersAndAcquisitions && stepData.MergersAndAcquisitions.length > 0 ? (
              stepData.MergersAndAcquisitions.map((merger, index) => (
                <TableRow key={`merger-${merger.CompanyTitle}-${merger.AcquisitionYear}-${index}`}>
                  <TableCell>{merger.CompanyTitle}</TableCell>
                  <TableCell>{merger.AcquisitionYear}</TableCell>
                  <TableCell>{getCorporationTypeName(merger.CorporationType, corporationTypes)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
