import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CompensationUpdateFormData } from '../limit-operations.types';

interface CompensationFormFieldsProps {
  form: UseFormReturn<CompensationUpdateFormData>;
  dropdownData: {
    financers: { label: string; value: number }[];
    riskyCalculations: { label: string; value: number }[];
    guarantorRates: { label: string; value: number }[];
    documentStates: { label: string; value: number }[];
    lawFirms: { label: string; value: number }[];
    protocols: { label: string; value: number }[];
    productTypes: { label: string; value: number }[];
    states: { label: string; value: number }[];
  };
}

/**
 * Form fields component for compensation update form
 * Based on UpdateCompensation.js reference form structure
 */
export const CompensationFormFields: React.FC<CompensationFormFieldsProps> = ({ form, dropdownData }) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Grid container spacing={2}>
      {/* Company Identifier */}
      <Grid item xs={12} md={6}>
        <Controller
          name="Identifier"
          control={control}
          rules={{ required: 'Firma seçiniz' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Firma"
              error={!!errors.Identifier}
              helperText={errors.Identifier?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>

      {/* Compensation Date */}
      <Grid item xs={12} md={6}>
        <Controller
          name="CompensationDate"
          control={control}
          rules={{ required: 'Tazminat tarihi zorunlu' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Tazminat Tarihi"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.CompensationDate}
              helperText={errors.CompensationDate?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>

      {/* Amount */}
      <Grid item xs={12} md={6}>
        <Controller
          name="Amount"
          control={control}
          rules={{ required: 'Tutar zorunlu' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Tutar"
              type="number"
              error={!!errors.Amount}
              helperText={errors.Amount?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>

      {/* Financer */}
      <Grid item xs={12} md={6}>
        <Controller
          name="FinancerId"
          control={control}
          rules={{ required: 'Finansör seçiniz' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.FinancerId} variant="outlined">
              <InputLabel>Finansör</InputLabel>
              <Select {...field} label="Finansör">
                {dropdownData.financers.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.FinancerId && <FormHelperText>{errors.FinancerId.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      {/* Risky Financial Situations - Multi Select */}
      <Grid item xs={12}>
        <Controller
          name="RiskyFinancialSituations"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Riskli Mali Durumlar</InputLabel>
              <Select
                {...field}
                multiple
                input={<OutlinedInput label="Riskli Mali Durumlar" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(selected) &&
                      selected.map((item) => {
                        // Handle both direct number values and objects with value property
                        const value = typeof item === 'object' && item !== null && 'value' in item ? item.value : item;
                        const option = dropdownData.riskyCalculations.find((opt) => opt.value === value);
                        return <Chip key={String(value)} label={option?.label || String(value)} size="small" />;
                      })}
                  </Box>
                )}>
                {dropdownData.riskyCalculations.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Guarantor Rate */}
      <Grid item xs={12} md={6}>
        <Controller
          name="GuarantorRate"
          control={control}
          rules={{ required: 'Kefil oranı seçiniz' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.GuarantorRate} variant="outlined">
              <InputLabel>Kefil Oranı</InputLabel>
              <Select {...field} label="Kefil Oranı">
                {dropdownData.guarantorRates.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.GuarantorRate && <FormHelperText>{errors.GuarantorRate.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      {/* Document State */}
      <Grid item xs={12} md={6}>
        <Controller
          name="DocumentState"
          control={control}
          rules={{ required: 'Evrak durumu seçiniz' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.DocumentState} variant="outlined">
              <InputLabel>Evrak Durumu</InputLabel>
              <Select {...field} label="Evrak Durumu">
                {dropdownData.documentStates.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.DocumentState && <FormHelperText>{errors.DocumentState.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      {/* Law Firm */}
      <Grid item xs={12} md={6}>
        <Controller
          name="LawFirmId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Hukuk Bürosu</InputLabel>
              <Select {...field} label="Hukuk Bürosu">
                <MenuItem value={0}>
                  <em>Seçiniz</em>
                </MenuItem>
                {dropdownData.lawFirms.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Assignment Fee */}
      <Grid item xs={12} md={6}>
        <Controller
          name="AssignmentFee"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth label="Devir Ücreti" type="number" variant="outlined" />
          )}
        />
      </Grid>

      {/* Assignment Date */}
      <Grid item xs={12} md={6}>
        <Controller
          name="AssignmentDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Devir Tarihi"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          )}
        />
      </Grid>

      {/* Protocol */}
      <Grid item xs={12} md={6}>
        <Controller
          name="Protocol"
          control={control}
          rules={{ required: 'Protokol seçiniz' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.Protocol} variant="outlined">
              <InputLabel>Protokol</InputLabel>
              <Select {...field} label="Protokol">
                {dropdownData.protocols.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.Protocol && <FormHelperText>{errors.Protocol.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      {/* Product Type */}
      <Grid item xs={12} md={6}>
        <Controller
          name="ProductType"
          control={control}
          rules={{ required: 'Ürün tipi seçiniz' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.ProductType} variant="outlined">
              <InputLabel>Ürün Tipi</InputLabel>
              <Select {...field} label="Ürün Tipi">
                {dropdownData.productTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.ProductType && <FormHelperText>{errors.ProductType.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      {/* State */}
      <Grid item xs={12} md={6}>
        <Controller
          name="State"
          control={control}
          rules={{ required: 'Durum seçiniz' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.State} variant="outlined">
              <InputLabel>Durum</InputLabel>
              <Select {...field} label="Durum">
                {dropdownData.states.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.State && <FormHelperText>{errors.State.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      {/* Interest Rate */}
      <Grid item xs={12} md={6}>
        <Controller
          name="InterestRate"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth label="Faiz Oranı (%)" type="number" variant="outlined" />
          )}
        />
      </Grid>

      {/* Interest Amount - Read Only */}
      <Grid item xs={12} md={6}>
        <Controller
          name="InterestAmount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Faiz Tutarı"
              type="number"
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          )}
        />
      </Grid>

      {/* Note */}
      <Grid item xs={12}>
        <Controller
          name="Note"
          control={control}
          render={({ field }) => <TextField {...field} fullWidth label="Not" multiline rows={3} variant="outlined" />}
        />
      </Grid>

      {/* Is Digital Switch */}
      <Grid item xs={12} md={6}>
        <Controller
          name="IsDigital"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} />} label="Dijital" />
          )}
        />
      </Grid>
    </Grid>
  );
};
