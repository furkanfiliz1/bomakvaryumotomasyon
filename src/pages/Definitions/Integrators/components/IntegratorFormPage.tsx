/**
 * Integrator Form Page
 * Add/Edit integrator with params management
 */

import { Form, Icon, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { downloadBase64File, getParamsTableHeaders, parseParamFormData } from '../helpers';
import { useIntegratorForm, useIntegratorsDropdownData, useParamForm } from '../hooks';
import {
  useCreateIntegratorMutation,
  useDeleteIntegratorTemplateMutation,
  useLazyGetIntegratorDetailQuery,
  useLazyGetIntegratorTemplateQuery,
  useUpdateIntegratorCommissionRateMutation,
  useUpdateIntegratorMutation,
  useUploadIntegratorTemplateMutation,
} from '../integrators.api';
import type { IntegratorFormData, IntegratorParam, ParamFormData } from '../integrators.types';

const IntegratorFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notice = useNotice();
  const isEdit = Boolean(id);

  // Local state for params
  const [params, setParams] = useState<IntegratorParam[]>([]);
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [hasTemplate, setHasTemplate] = useState<boolean>(false);

  // Get dropdown data
  const {
    integrationTypeOptions,
    parentIntegratorOptions,
    dataTypes,
    inputDataTypes,
    dataTypeOptions,
    inputDataTypeOptions,
    isLoading: isDropdownLoading,
    error: dropdownError,
  } = useIntegratorsDropdownData();

  // Fetch integrator detail if editing
  const [fetchDetail, { data: integratorDetail, isLoading: isDetailLoading, error: detailError }] =
    useLazyGetIntegratorDetailQuery();

  // Get user language from localStorage
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('opUser') || '{}');
    } catch {
      return {};
    }
  }, []);
  const languageId = user?.Language?.Id || 10;

  // Fetch template
  const [fetchTemplate, { data: templateData, error: templateError, isFetching: isTemplateFetching }] =
    useLazyGetIntegratorTemplateQuery();

  // Mutations
  const [createIntegrator, { isLoading: isCreating, error: createError }] = useCreateIntegratorMutation();
  const [updateIntegrator, { isLoading: isUpdating, error: updateError }] = useUpdateIntegratorMutation();
  const [updateCommissionRate, { isLoading: isUpdatingRate, error: rateError }] =
    useUpdateIntegratorCommissionRateMutation();
  const [uploadTemplate, { isLoading: isUploading, error: uploadError }] = useUploadIntegratorTemplateMutation();
  const [deleteTemplate, { isLoading: isDeleting, error: deleteError }] = useDeleteIntegratorTemplateMutation();

  // Form hooks
  const { form, schema, resetForm } = useIntegratorForm({
    integrationTypeOptions,
    parentIntegratorOptions,
    initialData: integratorDetail,
    isEdit,
  });

  const {
    form: paramForm,
    schema: paramSchema,
    resetForm: resetParamForm,
  } = useParamForm({
    dataTypeOptions,
    inputDataTypeOptions,
  });

  // Error handling
  useErrorListener([
    dropdownError,
    detailError,
    createError,
    updateError,
    rateError,
    uploadError,
    deleteError,
    templateError,
  ]);

  // Fetch detail on edit
  useEffect(() => {
    if (id) {
      fetchDetail(Number(id));
      fetchTemplate({ id: Number(id), languageId });
    }
  }, [id, fetchDetail, fetchTemplate, languageId]);

  // Update form when detail is loaded
  useEffect(() => {
    if (integratorDetail) {
      resetForm(integratorDetail);
      setParams(integratorDetail.Params || []);
      setCommissionRate(integratorDetail.CommissionRate?.toString() || '');
    }
  }, [integratorDetail, resetForm]);

  // Update hasTemplate when template data changes
  useEffect(() => {
    setHasTemplate(Boolean(templateData?.FileContent));
  }, [templateData]);

  // Handle form submit
  const handleSubmit = useCallback(
    async (data: IntegratorFormData) => {
      try {
        if (isEdit && integratorDetail) {
          // Update existing
          await updateIntegrator({
            Id: integratorDetail.Id,
            Identifier: data.Identifier,
            Name: data.Name,
            IsActive: data.IsActive || false,
            IsBackground: data.IsBackground || false,
            Type: Number(data.Type),
            ParentId: data.ParentId || null,
            TutorialVideoUrl: integratorDetail.TutorialVideoUrl,
            Params: params,
            SubIntegrators: integratorDetail.SubIntegrators,
          }).unwrap();

          notice({
            variant: 'success',
            title: 'Başarılı',
            message: 'Entegratör başarıyla güncellendi',
          });
        } else {
          // Create new
          await createIntegrator({
            Identifier: data.Identifier,
            Name: data.Name,
            IsActive: data.IsActive || false,
            IsBackground: data.IsBackground || false,
            Type: String(data.Type),
            ParentId: data.ParentId ? String(data.ParentId) : null,
            CommissionRate: commissionRate || null,
            Params: params,
          }).unwrap();

          notice({
            variant: 'success',
            title: 'Başarılı',
            message: 'Entegratör başarıyla oluşturuldu',
          });
        }

        navigate('/definitions/integrators');
      } catch {
        // Error handled by useErrorListener
      }
    },
    [isEdit, integratorDetail, params, commissionRate, updateIntegrator, createIntegrator, navigate, notice],
  );

  // Handle commission rate update
  const handleUpdateCommissionRate = useCallback(async () => {
    if (!id) return;

    try {
      await updateCommissionRate({
        Id: Number(id),
        CommissionRate: commissionRate,
      }).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Entegratör oranı başarıyla güncellendi',
      });
    } catch {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Entegratör oranı güncellenirken hata oluştu',
      });
    }
  }, [id, commissionRate, updateCommissionRate, notice]);

  // Handle add param
  const handleAddParam = useCallback(
    (data: ParamFormData) => {
      const newParam = parseParamFormData(data, dataTypes, inputDataTypes);
      setParams((prev) => [...prev, newParam]);
      resetParamForm();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Parametre eklendi',
      });
    },
    [dataTypes, inputDataTypes, resetParamForm, notice],
  );

  // Handle remove param
  // Pending param index to delete (for confirm dialog)
  const pendingDeleteIndexRef = React.useRef<number | null>(null);

  // Execute remove param after confirmation
  const executeRemoveParam = useCallback(() => {
    if (pendingDeleteIndexRef.current !== null) {
      const indexToDelete = pendingDeleteIndexRef.current;
      setParams((prev) => prev.filter((_, i) => i !== indexToDelete));
      pendingDeleteIndexRef.current = null;
    }
  }, []);

  // Handle remove param - show confirmation
  const handleRemoveParam = useCallback(
    (index: number) => {
      pendingDeleteIndexRef.current = index;
      notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Sil',
        message: 'Bu parametreyi silmek istediğinizden emin misiniz?',
        buttonTitle: 'Evet, Sil',
        onClick: executeRemoveParam,
        catchOnCancel: true,
      });
    },
    [notice, executeRemoveParam],
  );

  // Handle order index change
  const handleOrderIndexChange = useCallback((index: number, value: string) => {
    const newOrderIndex = Number(value) || 0;
    setParams((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], OrderIndex: newOrderIndex };
      return updated;
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !id) return;

      // Validate file type
      if (file.type !== 'application/pdf') {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'Sadece PDF dosyaları yüklenebilir',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('type', 'pdf');

      try {
        await uploadTemplate({
          id: Number(id),
          languageId,
          formData,
        }).unwrap();

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Dosya başarıyla yüklendi',
        });

        // Refetch template
        fetchTemplate({ id: Number(id), languageId });
      } catch {
        // Error handled by useErrorListener
      }
    },
    [id, languageId, uploadTemplate, fetchTemplate, notice],
  );

  // Handle file download
  const handleFileDownload = useCallback(() => {
    if (templateData?.FileContent && templateData?.Name) {
      downloadBase64File(templateData.FileContent, templateData.Name);
    }
  }, [templateData]);

  // Execute delete template
  const executeDeleteTemplate = useCallback(async () => {
    if (!templateData?.Id) return;
    try {
      await deleteTemplate(templateData.Id).unwrap();

      // Clear template from UI immediately
      setHasTemplate(false);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Dosya başarıyla silindi',
      });
    } catch {
      // Error handled by useErrorListener
    }
  }, [templateData, deleteTemplate, notice]);

  // Handle file delete
  const handleFileDelete = useCallback(() => {
    if (!templateData?.Id) return;

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Sil',
      message: 'Bu dosyayı silmek istediğinizden emin misiniz?',
      buttonTitle: 'Evet, Sil',
      onClick: () => {
        executeDeleteTemplate();
      },
      catchOnCancel: true,
    });
  }, [templateData, notice, executeDeleteTemplate]);

  // Params table headers
  const paramsHeaders = getParamsTableHeaders();

  // Action element for params table
  const ParamActionElement = useCallback(
    (props: { index?: number }) => {
      const { index } = props;
      if (index === undefined) return null;
      return (
        <Tooltip title="Sil">
          <IconButton size="small" onClick={() => handleRemoveParam(index)} color="error">
            <Icon icon="trash-03" size={16} />
          </IconButton>
        </Tooltip>
      );
    },
    [handleRemoveParam],
  );

  // Loading state
  if (isDropdownLoading || (isEdit && isDetailLoading)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <>
      <PageHeader title={isEdit ? 'Entegratör Düzenle' : 'Entegratör Ekle'} subtitle="Entegratör bilgilerini girin" />

      <Grid container spacing={3}>
        {/* Left Column - Integrator Form */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Entegratör Bilgileri
              </Typography>

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form} schema={schema as any} />

              {/* Template Upload Card - Only for edit */}
              {isEdit && (
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Entegratör Kullanım Kılavuzu
                    </Typography>

                    {hasTemplate && templateData?.FileContent ? (
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {templateData.Name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="İndir">
                            <IconButton size="small" onClick={handleFileDownload} color="primary">
                              <Icon icon="download-01" size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <IconButton size="small" onClick={handleFileDelete} color="error" disabled={isDeleting}>
                              <Icon icon="trash-03" size={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    ) : (
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        disabled={isUploading || isTemplateFetching}>
                        {isUploading || isTemplateFetching ? <CircularProgress size={24} /> : 'PDF Dosyası Yükle'}
                        <input type="file" hidden accept=".pdf" onChange={handleFileUpload} />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={isSubmitting}
                  fullWidth>
                  {isSubmitting && <CircularProgress size={24} />}
                  {!isSubmitting && (isEdit ? 'Güncelle' : 'Oluştur')}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Commission Rate Card - Only for edit */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Entegratör Oranı
              </Typography>

              <CustomInputLabel label="Entegratör Oranı (%)" />
              <TextField
                fullWidth
                size="small"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                type="number"
              />

              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateCommissionRate}
                  disabled={isUpdatingRate}
                  fullWidth>
                  {isUpdatingRate ? <CircularProgress size={24} /> : 'Entegratör Oranını Güncelle'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Parameters */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Yeni Parametre Ekle
              </Typography>

              <Form form={paramForm} schema={paramSchema} />

              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={paramForm.handleSubmit(handleAddParam)}>
                  Ekle
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" color="text.secondary" gutterBottom>
                Eklenen Parametreler
              </Typography>

              <Table<IntegratorParam>
                id="params-table"
                rowId="Key"
                data={params}
                headers={paramsHeaders}
                size="small"
                hidePaging
                rowActions={[{ Element: ParamActionElement }]}
                actionHeaderTitle=""
                notFoundConfig={{
                  title: 'Parametre bulunamadı',
                  subTitle: 'Henüz parametre eklenmemiş',
                }}>
                {/* Order index editable slot */}
                <Slot<IntegratorParam> id="OrderIndex">
                  {(value, row) => {
                    const index = params.findIndex((p) => p.Key === row?.Key && p.SubKey === row?.SubKey);
                    return (
                      <TextField
                        size="small"
                        type="number"
                        value={value || 0}
                        onChange={(e) => handleOrderIndexChange(index, e.target.value)}
                        sx={{ width: 70 }}
                      />
                    );
                  }}
                </Slot>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default IntegratorFormPage;
