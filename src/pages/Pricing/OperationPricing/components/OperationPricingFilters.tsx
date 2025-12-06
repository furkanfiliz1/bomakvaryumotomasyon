import { Button, Card, CardContent, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';
import { OperationPricingStatus } from '../operation-pricing.types';

interface OperationPricingFiltersProps {
  filters: Record<string, unknown>;
  onFilterChange: (field: string, value: unknown) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
  customerManagerList: Array<{ Id: number; FullName: string }>;
  productTypeList: Array<{ value: number; label: string }>;
}

export const OperationPricingFilters: React.FC<OperationPricingFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  isLoading,
  customerManagerList,
  productTypeList,
}) => {
  // Status options matching legacy exactly
  const statusOptions = [
    { Value: OperationPricingStatus.All, Description: 'Tümü' },
    { Value: OperationPricingStatus.Paid, Description: 'Ödendi' },
    { Value: OperationPricingStatus.Canceled, Description: 'İptal Edildi' },
    { Value: OperationPricingStatus.Failed, Description: 'Başarısız' },
    { Value: OperationPricingStatus.Error, Description: 'Hata' },
    { Value: OperationPricingStatus.Refund, Description: 'İade' },
    { Value: OperationPricingStatus.PartialReturn, Description: 'Kısmi İade' },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Firma Kimlik No"
              value={filters.CompanyIdentifier || ''}
              onChange={(e) => onFilterChange('CompanyIdentifier', e.target.value)}
              placeholder="Firma kimlik numarası"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Firma Adı"
              value={filters.CompanyName || ''}
              onChange={(e) => onFilterChange('CompanyName', e.target.value)}
              placeholder="Firma adı"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Durum"
              value={filters.status ?? OperationPricingStatus.All}
              onChange={(e) => onFilterChange('status', Number(e.target.value))}
              size="small">
              {statusOptions.map((option) => (
                <MenuItem key={option.Value} value={option.Value}>
                  {option.Description}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Referans No"
              value={filters.referenceId || ''}
              onChange={(e) => onFilterChange('referenceId', e.target.value)}
              placeholder="Referans numarası"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Ürün Tipi"
              value={filters.productType ?? ''}
              onChange={(e) => onFilterChange('productType', Number(e.target.value) || undefined)}
              size="small">
              <MenuItem value="">Tümü</MenuItem>
              {productTypeList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Başlangıç Tarihi"
              value={filters.startPaymentDate || new Date()}
              onChange={(newValue) => onFilterChange('startPaymentDate', newValue)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Bitiş Tarihi"
              value={filters.endPaymentDate || new Date()}
              onChange={(newValue) => onFilterChange('endPaymentDate', newValue)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Müşteri Temsilcisi"
              value={filters.customerManagerId || ''}
              onChange={(e) => onFilterChange('customerManagerId', Number(e.target.value) || undefined)}
              size="small">
              <MenuItem value="">Tümü</MenuItem>
              {customerManagerList.map((option) => (
                <MenuItem key={option.Id} value={option.Id}>
                  {option.FullName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={onReset} disabled={isLoading}>
                Temizle
              </Button>
              <Button variant="contained" onClick={onSearch} disabled={isLoading}>
                Uygula
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OperationPricingFilters;
