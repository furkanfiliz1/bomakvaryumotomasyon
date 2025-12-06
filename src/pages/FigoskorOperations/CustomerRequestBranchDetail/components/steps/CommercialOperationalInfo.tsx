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
import React, { useMemo } from 'react';
import type { EnumData, FigoScoreProFormData } from '../../customer-request-branch-detail.types';
import { getFacilityPropertyStatusName, getFacilityTypeName, getPaymentMethodName } from '../../helpers';

export interface CommercialOperationalInfoProps {
  figoScoreData?: FigoScoreProFormData;
  enumData: EnumData;
  isLoading: boolean;
}

/**
 * Commercial and Operational Information Step Component
 * Displays comprehensive business operation details matching legacy layout
 */
export const CommercialOperationalInfo: React.FC<CommercialOperationalInfoProps> = ({
  figoScoreData,
  enumData,
  isLoading,
}) => {
  const stepData = figoScoreData?.CommercialAndOperationalInformation;

  // Extract enum data for easier access
  const { facilityTypes, facilityPropertyStatuses, paymentMethods } = enumData;

  // Process CompanyFacilities to extract Own and Outside facility data
  const processedFacilityData = useMemo(() => {
    if (!stepData?.CompanyFacilities || !Array.isArray(stepData.CompanyFacilities)) {
      return {
        ownFacilityTypes: [],
        ownPropertyStatuses: [],
        outsideFacilityTypes: [],
        outsidePropertyStatuses: [],
      };
    }

    const ownFacilities = stepData.CompanyFacilities.filter((facility) => facility.IsHeadquarter === true);
    const outsideFacilities = stepData.CompanyFacilities.filter((facility) => facility.IsHeadquarter === false);

    const ownFacilityTypes = [...new Set(ownFacilities.map((facility) => facility.FacilityType).filter(Boolean))];
    const ownPropertyStatuses = [
      ...new Set(ownFacilities.map((facility) => facility.FacilityPropertyStatus).filter(Boolean)),
    ];
    const outsideFacilityTypes = [
      ...new Set(outsideFacilities.map((facility) => facility.FacilityType).filter(Boolean)),
    ];
    const outsidePropertyStatuses = [
      ...new Set(outsideFacilities.map((facility) => facility.FacilityPropertyStatus).filter(Boolean)),
    ];

    return {
      ownFacilityTypes,
      ownPropertyStatuses,
      outsideFacilityTypes,
      outsidePropertyStatuses,
    };
  }, [stepData?.CompanyFacilities]);

  // Process CompanyBrands to extract Type 2 brands and filter them out
  const processedBrandsData = useMemo(() => {
    if (!stepData?.CompanyBrands || !Array.isArray(stepData.CompanyBrands)) {
      return {
        companyBrandsImportProductType: null,
        filteredCompanyBrands: [],
      };
    }

    const type2Brand = stepData.CompanyBrands.find((brand) => brand.Type === 2);
    const companyBrandsImportProductType = type2Brand ? type2Brand.Category : null;
    const filteredCompanyBrands = stepData.CompanyBrands.filter((brand) => brand.Type !== 2);

    return {
      companyBrandsImportProductType,
      filteredCompanyBrands,
    };
  }, [stepData?.CompanyBrands]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Ticari ve operasyonel bilgiler yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Basic Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Faaliyet Alanı
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.ActivityArea ? 'normal' : 'italic',
                color: stepData?.ActivityArea ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.ActivityArea ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Çalışan Sayısı
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.EmployeeCount ? 'normal' : 'italic',
                color: stepData?.EmployeeCount ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.EmployeeCount ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Firmanızın Yaklaşık Müşteri Adedi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.CustomerCount ? 'normal' : 'italic',
                color: stepData?.CustomerCount ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.CustomerCount ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Şube Sayısı
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.BranchCount ? 'normal' : 'italic',
                color: stepData?.BranchCount ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.BranchCount ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Yurtiçi Müşteri Adedi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.DomesticCustomerCount ? 'normal' : 'italic',
                color: stepData?.DomesticCustomerCount ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.DomesticCustomerCount ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Yurtdışı Müşteri Adedi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.InternationalCustomerCount ? 'normal' : 'italic',
                color: stepData?.InternationalCustomerCount ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.InternationalCustomerCount ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* NACE Codes - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        NACE Kodları
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Kod</TableCell>
              <TableCell>Açıklama</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.NaceCodes && stepData.NaceCodes.length > 0 ? (
              stepData.NaceCodes.map((nace, index) => (
                <TableRow key={index}>
                  <TableCell>{nace.Value}</TableCell>
                  <TableCell>{nace.Description}</TableCell>
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

      {/* GTIP Codes - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        GTIP Kodları
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>GTIP Kodu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.GtipCodes && stepData.GtipCodes.length > 0 ? (
              stepData.GtipCodes.map((gtip, index) => (
                <TableRow key={index}>
                  <TableCell>{gtip}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Banks - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Çalışılan Bankalar
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Banka Kodu</TableCell>
              <TableCell>Banka Adı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.Banks && stepData.Banks.length > 0 ? (
              stepData.Banks.map((bank, index) => (
                <TableRow key={index}>
                  <TableCell>{bank.Value}</TableCell>
                  <TableCell>{bank.Description}</TableCell>
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

      {/* Import/Export Information */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        İthalat/İhracat Bilgileri
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Toplam Satışlar İçinde İhracatın Oranı (%)
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.ExportRatio ? 'normal' : 'italic',
                color: stepData?.ExportRatio ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.ExportRatio ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Toplam Alımlar İçinde İthalatın Oranı (%)
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.ImportRatio ? 'normal' : 'italic',
                color: stepData?.ImportRatio ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.ImportRatio ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Export Countries - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        En Çok İhracat Yapılan Ülkeler
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ülke Kodu</TableCell>
              <TableCell>Ülke Adı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.TopExportCountries && stepData.TopExportCountries.length > 0 ? (
              stepData.TopExportCountries.map((country, index) => (
                <TableRow key={index}>
                  <TableCell>{country.Value}</TableCell>
                  <TableCell>{country.Description}</TableCell>
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

      {/* Import Countries - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        En Çok İthalat Yapılan Ülkeler
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ülke Kodu</TableCell>
              <TableCell>Ülke Adı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.TopImportCountries && stepData.TopImportCountries.length > 0 ? (
              stepData.TopImportCountries.map((country, index) => (
                <TableRow key={index}>
                  <TableCell>{country.Value}</TableCell>
                  <TableCell>{country.Description}</TableCell>
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

      {/* Payment Terms */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Ödeme Bilgileri
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Yurtiçi Satışların Ortalama Tahsilat Vadesi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.DomesticSalesDueDayCount ? 'normal' : 'italic',
                color: stepData?.DomesticSalesDueDayCount ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.DomesticSalesDueDayCount ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Yurtiçi Alımlarının Ortalama Ödeme Vadesi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.DomesticPurchaseDueDayCount ? 'normal' : 'italic',
                color: stepData?.DomesticPurchaseDueDayCount ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.DomesticPurchaseDueDayCount ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Yurtiçi Satış Ödeme Şekilleri
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle:
                  stepData?.DomesticSalesPaymentMethods && stepData.DomesticSalesPaymentMethods.length > 0
                    ? 'normal'
                    : 'italic',
                color:
                  stepData?.DomesticSalesPaymentMethods && stepData.DomesticSalesPaymentMethods.length > 0
                    ? 'inherit'
                    : 'text.secondary',
              }}>
              {stepData?.DomesticSalesPaymentMethods && stepData.DomesticSalesPaymentMethods.length > 0
                ? stepData.DomesticSalesPaymentMethods.map((method) =>
                    getPaymentMethodName(method, paymentMethods),
                  ).join(', ')
                : 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Yurtiçi Alım Ödeme Şekilleri
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle:
                  stepData?.DomesticPurchasePaymentMethods && stepData.DomesticPurchasePaymentMethods.length > 0
                    ? 'normal'
                    : 'italic',
                color:
                  stepData?.DomesticPurchasePaymentMethods && stepData.DomesticPurchasePaymentMethods.length > 0
                    ? 'inherit'
                    : 'text.secondary',
              }}>
              {stepData?.DomesticPurchasePaymentMethods && stepData.DomesticPurchasePaymentMethods.length > 0
                ? stepData.DomesticPurchasePaymentMethods.map((method) =>
                    getPaymentMethodName(method, paymentMethods),
                  ).join(', ')
                : 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Company Brands Import Product Type - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        İthal Edilen Ürün Türü
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ürün Kategorisi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: processedBrandsData?.companyBrandsImportProductType ? 'normal' : 'italic',
                color: processedBrandsData?.companyBrandsImportProductType ? 'inherit' : 'text.secondary',
              }}>
              {processedBrandsData?.companyBrandsImportProductType ?? 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Company Brands (excluding Type 2) - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Şirket Markaları
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>İmal Edilen Ürünlerin Tescilli Markaları</TableCell>
              <TableCell>İmal Edilen Ürünlerin Tescilli Kategorisi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedBrandsData?.filteredCompanyBrands && processedBrandsData.filteredCompanyBrands.length > 0 ? (
              processedBrandsData.filteredCompanyBrands.map((brand, index) => (
                <TableRow key={index}>
                  <TableCell>{brand.Brand}</TableCell>
                  <TableCell>{brand.Category}</TableCell>
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

      {/* Own Company Facility Types Summary - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Firmanızın Genel Merkezinde Bulunan Alanlar
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tesis Türü</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedFacilityData?.ownFacilityTypes && processedFacilityData.ownFacilityTypes.length > 0 ? (
              processedFacilityData.ownFacilityTypes.map((type, index) => (
                <TableRow key={index}>
                  <TableCell>{getFacilityTypeName(type, facilityTypes)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Own Company Facility Property Statuses Summary - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Firmanızın Genel Merkezi için Geçerli Olan
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mülkiyet Durumu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedFacilityData?.ownPropertyStatuses && processedFacilityData.ownPropertyStatuses.length > 0 ? (
              processedFacilityData.ownPropertyStatuses.map((status, index) => (
                <TableRow key={index}>
                  <TableCell>{getFacilityPropertyStatusName(status, facilityPropertyStatuses)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Outside Company Facility Types Summary - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Genel Merkez Dışında Firmanızın Kullandığı Diğer Alanlar
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tesis Türü</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedFacilityData?.outsideFacilityTypes && processedFacilityData.outsideFacilityTypes.length > 0 ? (
              processedFacilityData.outsideFacilityTypes.map((type, index) => (
                <TableRow key={index}>
                  <TableCell>{getFacilityTypeName(type, facilityTypes)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Outside Company Facility Property Statuses Summary - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Firmanızın Genel Merkez Dışında Olanlar için
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mülkiyet Durumu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedFacilityData?.outsidePropertyStatuses &&
            processedFacilityData.outsidePropertyStatuses.length > 0 ? (
              processedFacilityData.outsidePropertyStatuses.map((status, index) => (
                <TableRow key={index}>
                  <TableCell>{getFacilityPropertyStatusName(status, facilityPropertyStatuses)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
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
