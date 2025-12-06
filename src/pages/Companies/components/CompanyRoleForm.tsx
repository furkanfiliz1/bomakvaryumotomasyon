import { useNotice } from '@components';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/shared';
import {
  useCreateCompanyRoleMutation,
  useGetAuthoritiesQuery,
  useGetCompanyByIdQuery,
  useGetCompanyRolesQuery,
  useGetRoleAuthoritiesQuery,
  useUpdateCompanyRoleMutation,
  useUpdateRoleAuthoritiesMutation,
} from '../companies.api';
import { AuthorityProject, CompanyRole, ProcessedAuthorityGroup, SelectedAuthorities } from '../companies.types';

const CompanyRoleForm: React.FC = () => {
  const { companyId, roleId } = useParams<{ companyId: string; roleId: string }>();
  const navigate = useNavigate();
  const notice = useNotice();
  const isEdit = roleId && roleId !== 'yeni';

  // State to control when to fetch roles with delay
  const [shouldFetchRoles, setShouldFetchRoles] = useState(false);

  // Fetch company data to get the company type
  const { data: companyData } = useGetCompanyByIdQuery(
    { companyId: companyId! },
    {
      skip: !companyId,
    },
  );

  const { data: roles } = useGetCompanyRolesQuery(
    { companyId: parseInt(companyId || '0') },
    { skip: !shouldFetchRoles },
  );
  const [createRole, { isLoading: isCreating }] = useCreateCompanyRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateCompanyRoleMutation();

  // Authorities queries - fetch authorities using company type from companyData
  const {
    data: authorities,
    isLoading: authoritiesLoading,
    error: authoritiesError,
  } = useGetAuthoritiesQuery({ companyType: companyData?.Type });

  const {
    data: roleAuthorities,
    isLoading: roleAuthoritiesLoading,
    error: roleAuthoritiesError,
  } = useGetRoleAuthoritiesQuery(
    { companyId: parseInt(companyId || '0'), roleId: parseInt(roleId || '0') },
    { skip: !isEdit || !roleId || roleId === 'yeni' },
  );

  const [updateRoleAuthorities, { isLoading: isUpdatingAuthorities, isSuccess }] = useUpdateRoleAuthoritiesMutation();

  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    CompanyId: parseInt(companyId || '0'),
  });
  const [error, setError] = useState<string | null>(null);

  // State for permissions management
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [projectAuths, setProjectAuths] = useState<ProcessedAuthorityGroup[][]>([]);
  const [selectedAuthorities, setSelectedAuthorities] = useState<SelectedAuthorities>({
    CompanyRoleId: 0,
    AuthorityIds: [],
  });

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Yetkiler başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccess, notice]);

  // Helper function to get company type description
  const getCompanyTypes = (companyTypes: number[]): string => {
    let compDesc = '';
    companyTypes.forEach((compType) => {
      switch (compType) {
        case 0:
          compDesc += 'Tümü, ';
          break;
        case 1:
          compDesc += 'Firma, ';
          break;
        case 2:
          compDesc += 'Finans, ';
          break;
        case 3:
          compDesc += 'Dynamic, ';
          break;
        case 4:
          compDesc += 'Yönetici, ';
          break;
        default:
          compDesc += 'Tanımsız, ';
      }
    });
    return compDesc.slice(0, -2);
  };

  // Process authorities data for UI
  const setDataRelation = (
    authoritiesData: AuthorityProject[],
    roleAuthoritiesData: { AuthorityId: number }[],
    roleIdParam: string,
  ) => {
    const projectNamesArray = authoritiesData.map((project) => project.ProjectName);

    const projectAuthsArray = authoritiesData.map((project) =>
      project.Items.map((group) => ({
        projectName: project.ProjectName,
        groupName: group.GroupName,
        authorities: group.Authorities.map((auth) => ({
          ...auth,
          selected: roleAuthoritiesData.some((userAuth) => auth.Id === userAuth.AuthorityId),
        })),
      })),
    );

    const selectedAuthoritiesData = {
      CompanyRoleId: parseInt(roleIdParam, 10),
      AuthorityIds: roleAuthoritiesData.map((roleAuth) => roleAuth.AuthorityId),
    };

    setProjectNames(projectNamesArray);
    setProjectAuths(projectAuthsArray);
    setSelectedAuthorities(selectedAuthoritiesData);
  };

  // Enable roles fetching after 1 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetchRoles(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Load role data for editing
  useEffect(() => {
    if (roles) {
      const role = roles.find((r: CompanyRole) => r.Id === parseInt(roleId || '0'));
      if (role) {
        setFormData({
          Name: role.Name,
          Description: role.Description || '',
          CompanyId: role.CompanyId || 0,
        });
      }
    }
  }, [roleId, roles]);

  // Process authorities data when authorities are loaded
  useEffect(() => {
    if (authorities && roleId && roleId !== 'yeni') {
      // For existing roles, wait for both authorities and roleAuthorities
      setDataRelation(authorities, roleAuthorities || [], roleId);
    } else if (authorities && (!roleId || roleId === 'yeni')) {
      // For new roles, show authorities without any pre-selected
      setDataRelation(authorities, [], roleId || '0');
    }
  }, [authorities, roleAuthorities, roleId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  // Handle authority checkbox changes
  const handleAuthorityChange = (
    projectIndex: number,
    groupIndex: number,
    authIndex: number,
    authId: number,
    checked: boolean,
  ) => {
    // Deep copy the projectAuths array to avoid mutations
    const updatedProjectAuths = projectAuths.map((projectAuth, pIndex) =>
      pIndex === projectIndex
        ? projectAuth.map((groupAuth, gIndex) =>
            gIndex === groupIndex
              ? {
                  ...groupAuth,
                  authorities: groupAuth.authorities.map((auth, aIndex) =>
                    aIndex === authIndex ? { ...auth, selected: checked } : auth,
                  ),
                }
              : groupAuth,
          )
        : projectAuth,
    );

    const updatedSelectedAuthorities = { ...selectedAuthorities };
    if (checked) {
      if (!updatedSelectedAuthorities.AuthorityIds.includes(authId)) {
        updatedSelectedAuthorities.AuthorityIds.push(authId);
      }
    } else {
      updatedSelectedAuthorities.AuthorityIds = updatedSelectedAuthorities.AuthorityIds.filter((id) => id !== authId);
    }

    setProjectAuths(updatedProjectAuths);
    setSelectedAuthorities(updatedSelectedAuthorities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.Name.trim()) {
      setError('Rol adı zorunludur.');
      return;
    }

    try {
      if (isEdit) {
        await updateRole({
          companyId: parseInt(companyId || '0'),
          roleId: parseInt(roleId || '0'),
          data: formData,
        }).unwrap();
      } else {
        const result = await createRole({
          companyId: parseInt(companyId || '0'),
          data: formData,
        }).unwrap();

        // Navigate to the new role's permissions page
        navigate(`/companies/${companyId}/roller/${result.Id}`);
        return;
      }

      // For existing roles, stay on the permissions page
      if (isEdit) {
        // Just show success message, don't navigate
        return;
      }

      // Redirect back to roles tab
      navigate(`/companies/${companyId}/roller`);
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message || 'İşlem sırasında bir hata oluştu.');
    }
  };

  // Handle permissions update
  const handlePermissionsUpdate = async () => {
    if (!isEdit) return;

    try {
      await updateRoleAuthorities({
        companyId: parseInt(companyId || '0'),
        roleId: parseInt(roleId || '0'),
        data: selectedAuthorities,
      }).unwrap();

      setError(null);
      // Show success message or handle success state
    } catch (err) {
      setError(
        (err as { data?: { message?: string } })?.data?.message || 'Yetki güncellemesi sırasında bir hata oluştu.',
      );
    }
  };

  const handleCancel = () => {
    navigate(`/companies/${companyId}/roller`);
  };

  // Render role header for editing mode
  const renderRoleHeader = () => {
    if (!isEdit) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Rol Adı:{' '}
            <Typography component="span" sx={{ fontWeight: 400 }}>
              {formData.Name}
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    );
  };

  // Render permissions accordion
  const renderPermissionsAccordion = () => {
    if (!isEdit || !projectNames.length) return null;

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Yetkiler
          </Typography>

          {projectNames.map((projectName, projectIndex) => {
            const projectGroups = projectAuths.find((projectAuth) =>
              projectAuth.find((group) => group.projectName === projectName),
            );

            if (!projectGroups) return null;

            return (
              <Accordion key={projectName} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {projectName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {projectGroups
                      .sort((a, b) => (a.authorities?.length || 0) - (b.authorities?.length || 0))
                      .map((group, groupIndex) => (
                        <Grid item xs={12} md={6} key={`${group.groupName}-${groupIndex}`}>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                mb: 2,
                                pb: 1,
                                borderBottom: 1,
                                borderColor: 'divider',
                              }}>
                              {group.groupName}
                            </Typography>
                            <FormGroup>
                              {group.authorities && Array.isArray(group.authorities) ? (
                                group.authorities.map((auth, authIndex) => (
                                  <Box
                                    key={auth.Id}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      py: 1,
                                      borderBottom: '1px solid',
                                      borderColor: 'grey.100',
                                    }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={auth.selected || false}
                                          onChange={(e) =>
                                            handleAuthorityChange(
                                              projectIndex,
                                              groupIndex,
                                              authIndex,
                                              auth.Id,
                                              e.target.checked,
                                            )
                                          }
                                          size="small"
                                          color="primary"
                                        />
                                      }
                                      label={
                                        <Box>
                                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {auth.Description}
                                          </Typography>
                                          <Typography variant="caption" color="textSecondary">
                                            {auth.Code} - {getCompanyTypes(auth.CompanyTypes)}
                                          </Typography>
                                        </Box>
                                      }
                                      sx={{ margin: 0, width: '100%' }}
                                    />
                                  </Box>
                                ))
                              ) : (
                                <Typography variant="body2" color="textSecondary">
                                  Bu grup için yetki bulunamadı.
                                </Typography>
                              )}
                            </FormGroup>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handlePermissionsUpdate}
              disabled={isUpdatingAuthorities}
              startIcon={isUpdatingAuthorities ? <CircularProgress size={20} /> : undefined}>
              {isUpdatingAuthorities ? 'Güncelleniyor...' : 'Yetkileri Güncelle'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <PageHeader title={isEdit ? 'Rol Düzenle' : 'Yeni Rol Oluştur'} subtitle={`Şirket ID: ${companyId}`} />

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Role Header (for edit mode) */}
      {renderRoleHeader()}

      {/* Role Form */}
      {!isEdit && (
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Rol Adı"
                    name="Name"
                    value={formData.Name}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
                    required
                    fullWidth
                    disabled={isLoading}
                  />

                  <TextField
                    label="Açıklama"
                    name="Description"
                    value={formData.Description}
                    onChange={(e) => handleInputChange('Description', e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    disabled={isLoading}
                    helperText="Rol hakkında kısa bir açıklama yazabilirsiniz (isteğe bağlı)"
                  />

                  <FormControl component="fieldset" disabled={isLoading}>
                    <FormLabel component="legend">Rol Tipi</FormLabel>
                    <RadioGroup
                      value={formData.CompanyId > 0 ? 'company' : 'general'}
                      onChange={(e) =>
                        handleInputChange('CompanyId', e.target.value === 'company' ? parseInt(companyId || '0') : 0)
                      }>
                      <FormControlLabel
                        value="company"
                        control={<Radio />}
                        label={`Şirket Rolü (Sadece bu şirket için)`}
                      />
                      <FormControlLabel
                        value="general"
                        control={<Radio />}
                        label="Genel Rol (Tüm şirketler için kullanılabilir)"
                      />
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading || !formData.Name.trim()}
                      startIcon={isLoading ? <CircularProgress size={20} /> : undefined}>
                      {isLoading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Oluştur'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Permissions Section (only for edit mode) */}
      {renderPermissionsAccordion()}

      {/* Loading state for permissions */}
      {isEdit && (authoritiesLoading || roleAuthoritiesLoading) && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Yetkiler yükleniyor...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Error states */}
      {isEdit && (authoritiesError || roleAuthoritiesError) && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Yetkiler yüklenirken bir hata oluştu.
        </Alert>
      )}
    </Container>
  );
};

export default CompanyRoleForm;
