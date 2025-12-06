import {
  Box,
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
import React, { useMemo } from 'react';
import type { EnumData, FigoScoreProFormData } from '../../customer-request-branch-detail.types';
import { getCountryName } from '../../helpers';

export interface GroupCompanyStructureProps {
  figoScoreData?: FigoScoreProFormData;
  enumData: EnumData;
  isLoading: boolean;
}

// Company Hierarchy Types from legacy (matching exact structure)
interface CompanyHierarchy {
  Type: number; // 1 = participation companies, 2 = joint companies
  CompanyTitle: string;
  ShareRate: number;
  ActivityArea: string;
  CompanyPartnerName?: string; // Only for Type 2
}

interface CompanyPartnership {
  CompanyTitle: string;
  CountryId: number;
}

// Format participation companies for UI display (type: 1) - exact legacy logic
const formatParticipationCompaniesForUI = (companyHierarchies?: CompanyHierarchy[]) => {
  if (!companyHierarchies || !Array.isArray(companyHierarchies)) {
    return [];
  }

  const participationCompanies = companyHierarchies.filter((company) => company.Type === 1);

  return (participationCompanies || []).map((company, index) => ({
    id: `participation-company-${index}`,
    CompanyTitle: company.CompanyTitle || '',
    ShareRate: company.ShareRate || 0,
    ActivityArea: company.ActivityArea || '',
    Type: company.Type,
  }));
};

// Format joint companies for UI display (type: 2) - exact legacy logic
const formatJointCompaniesForUI = (companyHierarchies?: CompanyHierarchy[]) => {
  if (!companyHierarchies || !Array.isArray(companyHierarchies)) {
    return [];
  }

  const jointCompanies = companyHierarchies.filter((company) => company.Type === 2);

  return (jointCompanies || []).map((company, index) => ({
    id: `joint-company-${index}`,
    CompanyTitle: company.CompanyTitle || '',
    CompanyPartnerName: company.CompanyPartnerName || '',
    ShareRate: company.ShareRate || 0,
    ActivityArea: company.ActivityArea || '',
    Type: company.Type,
  }));
};

// Format partnerships for UI display - exact legacy logic
const formatPartnershipsForUI = (
  partnerships?: CompanyPartnership[],
  countriesEnum: Array<{ Value: string; Description: string }> = [],
) => {
  if (!partnerships || !Array.isArray(partnerships)) {
    return [];
  }

  return (partnerships || []).map((partnership, index) => {
    // Use helper function to get country name
    const countryName = getCountryName(partnership.CountryId, countriesEnum);

    return {
      id: `partnership-${index}`,
      CompanyTitle: partnership.CompanyTitle || '',
      CountryId: partnership.CountryId || '',
      CountryName: countryName,
    };
  });
};

/**
 * Group Company Structure Step Component
 * Displays comprehensive group structure with exact legacy business logic
 */
export const GroupCompanyStructure: React.FC<GroupCompanyStructureProps> = ({ figoScoreData, enumData, isLoading }) => {
  const stepData = figoScoreData?.GroupCompanyStructure;

  // Extract countries from enumData
  const { countries } = enumData;

  // Process company hierarchies and partnerships using exact legacy logic
  const companyHierarchies = useMemo(() => stepData?.CompanyHierarchies || [], [stepData]);

  const companyPartnerships = useMemo(() => stepData?.CompanyPartnerships || [], [stepData]);

  // Format data using mapping functions (exact legacy logic)
  const participationCompanies = useMemo(
    () => formatParticipationCompaniesForUI(companyHierarchies),
    [companyHierarchies],
  );

  const jointCompanies = useMemo(() => formatJointCompaniesForUI(companyHierarchies), [companyHierarchies]);

  const partnerships = useMemo(
    () => formatPartnershipsForUI(companyPartnerships, countries),
    [companyPartnerships, countries],
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Grup şirket yapısı yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Participation Companies (Type 1) - exact legacy layout */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Firmanızın İştirakleri
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead sx={{ backgroundColor: 'grey.50' }}>
              <TableRow>
                <TableCell>Firma Ünvanı</TableCell>
                <TableCell>Hisse Oranı (%)</TableCell>
                <TableCell>Faaliyet Konusu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participationCompanies && participationCompanies.length > 0 ? (
                participationCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.CompanyTitle}</TableCell>
                    <TableCell>%{company.ShareRate}</TableCell>
                    <TableCell>{company.ActivityArea}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                    Veri bekleniyor...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Joint Companies (Type 2) - exact legacy layout */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Müşterek Yönetici ve Ortakları Bulunan Firmalar
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead sx={{ backgroundColor: 'grey.50' }}>
              <TableRow>
                <TableCell>Firma Ünvanı</TableCell>
                <TableCell>Ortak Adı/Soyadı</TableCell>
                <TableCell>Hisse Oranı (%)</TableCell>
                <TableCell>Faaliyet Konusu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jointCompanies && jointCompanies.length > 0 ? (
                jointCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.CompanyTitle}</TableCell>
                    <TableCell>{company.CompanyPartnerName}</TableCell>
                    <TableCell>%{company.ShareRate}</TableCell>
                    <TableCell>{company.ActivityArea}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                    Veri bekleniyor...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Company Partnerships - exact legacy layout */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Alınan Temsilcilikler / Bayilikler
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead sx={{ backgroundColor: 'grey.50' }}>
              <TableRow>
                <TableCell>Firma Ünvanı</TableCell>
                <TableCell>Ülke</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partnerships && partnerships.length > 0 ? (
                partnerships.map((partnership) => (
                  <TableRow key={partnership.id}>
                    <TableCell>{partnership.CompanyTitle}</TableCell>
                    <TableCell>{partnership.CountryName}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                    Veri bekleniyor...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
