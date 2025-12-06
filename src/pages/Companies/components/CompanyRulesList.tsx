import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import {
  useGetCompanyRuleFinancersQuery,
  useGetCompanyRulesQuery,
  useGetFinancierCompaniesByTypeQuery,
  useUpdateCompanyRuleFinancersMutation,
} from '../companies.api';
import { CompanyRule, CompanyRuleFinancerUpdateRequest } from '../companies.types';

interface CompanyRulesListProps {
  companyId: number;
}

const CompanyRulesList: React.FC<CompanyRulesListProps> = ({ companyId }) => {
  const notice = useNotice();
  const [senderIdentifier, setSenderIdentifier] = useState('');
  const [senderCompanyName, setSenderCompanyName] = useState('');
  const [selectedRule, setSelectedRule] = useState<CompanyRule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchFinancier, setSearchFinancier] = useState('');
  const [selectedFinancers, setSelectedFinancers] = useState<string[]>([]);

  // Fetch rules
  const {
    data: rules = [],
    isLoading,
    error: rulesError,
  } = useGetCompanyRulesQuery({
    notifyBuyer: 1,
    ReceivercompanyId: companyId,
    productType: 2,
  });

  // Fetch financier companies
  const {
    data: financierCompanies = [],
    isLoading: isLoadingFinanciers,
    error: financiersError,
  } = useGetFinancierCompaniesByTypeQuery();

  // Fetch current rule financers (only when modal is open)
  const {
    data: currentRuleFinancers = [],
    isLoading: isLoadingRuleFinancers,
    error: ruleFinancersError,
    refetch: refetchRuleFinancers,
  } = useGetCompanyRuleFinancersQuery(
    {
      companyId,
      ruleId: selectedRule?.Id || 0,
    },
    {
      skip: !selectedRule || !isEditModalOpen,
    },
  );

  // Update mutation
  const [updateRuleFinancers, { isLoading: isUpdating, error: updateError }] = useUpdateCompanyRuleFinancersMutation();

  // Error listeners
  useErrorListener([rulesError, financiersError, ruleFinancersError, updateError]);

  // Initialize selected financers when rule financers are loaded
  useEffect(() => {
    if (currentRuleFinancers.length > 0) {
      const identifiers = currentRuleFinancers.map((item) => item.FinancerIdentifier);
      setSelectedFinancers(identifiers);
    } else if (isEditModalOpen && !isLoadingRuleFinancers) {
      setSelectedFinancers([]);
    }
  }, [currentRuleFinancers, isEditModalOpen, isLoadingRuleFinancers]);

  // Filter rules based on search inputs
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesIdentifier =
        !senderIdentifier ||
        rule.SenderIdentifier?.toLocaleUpperCase('tr-TR').includes(senderIdentifier.toLocaleUpperCase('tr-TR'));
      const matchesCompanyName =
        !senderCompanyName ||
        rule.SenderCompanyName?.toLocaleUpperCase('tr-TR').includes(senderCompanyName.toLocaleUpperCase('tr-TR'));
      return matchesIdentifier && matchesCompanyName;
    });
  }, [rules, senderIdentifier, senderCompanyName]);

  // Filter financier companies based on search
  const filteredFinanciers = useMemo(() => {
    if (!searchFinancier) return financierCompanies;
    return financierCompanies.filter((company) =>
      company.CompanyName?.toLocaleUpperCase('tr-TR').includes(searchFinancier.toLocaleUpperCase('tr-TR')),
    );
  }, [financierCompanies, searchFinancier]);

  const handleEditRule = (rule: CompanyRule) => {
    setSelectedRule(rule);
    setIsEditModalOpen(true);
    setSearchFinancier('');
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedRule(null);
    setSelectedFinancers([]);
    setSearchFinancier('');
  };

  const handleToggleFinancier = (identifier: string) => {
    setSelectedFinancers((prev) => {
      if (prev.includes(identifier)) {
        return prev.filter((id) => id !== identifier);
      }
      return [...prev, identifier];
    });
  };

  const handleSave = async () => {
    if (!selectedRule) return;

    try {
      const data: CompanyRuleFinancerUpdateRequest[] = selectedFinancers.map((identifier) => ({
        CompanyDefinitionId: selectedRule.Id.toString(),
        FinancerIdentifier: identifier,
        ProductType: 2,
      }));

      await updateRuleFinancers({
        companyId,
        ruleId: selectedRule.Id,
        data,
      }).unwrap();

      await notice({
        variant: 'success',
        title: 'Başarılı',
        message:
          'Kural başarıyla güncellendi. Lütfen yaptığınız işleme istinaden alıcıdan gelen talep mailinin görüntüsünü dokümanlara yükleyiniz! Doküman Tipi: Diğer',
      });

      refetchRuleFinancers();
      handleCloseModal();
    } catch (err) {
      console.error('Kural güncellenirken hata oluştu', err);
    }
  };

  const getDisplayRuleIdentifier = (rule: CompanyRule | null) => {
    if (!rule) return '';
    return rule.SenderIdentifier || 'Genel Kural';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (rulesError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Kurallar yüklenirken bir hata oluştu.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Kural Listesi
      </Typography>

      {/* Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box>
            <CustomInputLabel label="VKN" />
            <TextField value={senderIdentifier} onChange={(e) => setSenderIdentifier(e.target.value)} size="small" />
          </Box>
          <Box>
            <CustomInputLabel label="Şirket Adı" />
            <TextField value={senderCompanyName} onChange={(e) => setSenderCompanyName(e.target.value)} size="small" />
          </Box>
        </Stack>
      </Box>

      {/* Rules List */}
      {filteredRules.length === 0 ? (
        <Alert severity="info">Henüz kural bulunmamaktadır.</Alert>
      ) : (
        <Stack spacing={1}>
          {filteredRules.map((rule) => (
            <Card
              key={rule.Id}
              variant="outlined"
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box flex={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {rule.SenderCompanyName || 'Genel Kural'}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      {rule.SenderIdentifier || '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditRule(rule)}>
                      Düzenle
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Edit Rule Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Kural Düzenle ({getDisplayRuleIdentifier(selectedRule)})</Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isLoadingFinanciers || isLoadingRuleFinancers ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Search */}
              <Box sx={{ mb: 2 }}>
                <CustomInputLabel label="Finansör Ara" />
                <TextField
                  value={searchFinancier}
                  onChange={(e) => setSearchFinancier(e.target.value)}
                  size="small"
                  fullWidth
                />
              </Box>

              {/* Financiers List */}
              {filteredFinanciers.length === 0 ? (
                <Alert severity="info">Finansör bulunamadı.</Alert>
              ) : (
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 1,
                    }}>
                    {filteredFinanciers.map((financier) => {
                      const isSelected = selectedFinancers.includes(financier.Identifier);
                      return (
                        <Box
                          key={financier.Id}
                          sx={{
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                            py: 0.5,
                            px: 2,
                          }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={isSelected}
                                onChange={() => handleToggleFinancier(financier.Identifier)}
                                color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" fontWeight="medium">
                                {financier.CompanyName}
                              </Typography>
                            }
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Save Button */}
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 1 }}>
                  İptal
                </Button>
                <LoadingButton loading={isUpdating} variant="contained" color="primary" onClick={handleSave}>
                  Güncelle
                </LoadingButton>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CompanyRulesList;
