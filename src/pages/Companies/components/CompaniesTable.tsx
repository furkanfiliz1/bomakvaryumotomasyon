import { Button, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Visibility } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeadCell } from 'src/components/common/Table/types';
import { useLazyGetCompaniesQuery } from '../companies.api';
import { Company } from '../companies.types';

const headers: HeadCell[] = [
  { id: 'Status', slot: true, label: '' },
  { id: 'CompanyName', label: 'Ünvan' },
  { id: 'Identifier', label: 'VKN/TCKN' },
  { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi' },
  { id: 'InsertDateTime', label: 'Kayıt Tarihi', type: 'date' },
  { id: 'Actions', slot: true, label: 'İşlemler' },
];

const CompaniesTable = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Convert URL params to API params
  const apiParams = useMemo(() => {
    const urlParams = Object.fromEntries(searchParams.entries());
    return {
      page: parseInt(urlParams.page || '1', 10),
      pageSize: parseInt(urlParams.pageSize || '50', 10),
      sort: urlParams.sort || 'InsertDateTime',
      sortType: (urlParams.sortType || 'Desc') as 'Asc' | 'Desc',
      GetByIntegrators: urlParams.GetByIntegrators === 'true',
      // Basic filters
      type: urlParams.type ? parseInt(urlParams.type, 10) : undefined,
      status: urlParams.status ? parseInt(urlParams.status, 10) : undefined,
      companyIdentifier: urlParams.companyIdentifier || '',
      companyName: urlParams.companyName || '',
      activityType: urlParams.activityType || '',
      // Advanced filters
      startDate: urlParams.startDate || '',
      endDate: urlParams.endDate || '',
      onboardingStatusTypes: urlParams.onboardingStatusTypes || '',
      signedContract: urlParams.signedContract || '',
      LeadingChannelId: urlParams.LeadingChannelId || '',
      UserMail: urlParams.UserMail || '',
      UserPhone: urlParams.UserPhone || '',
      UserName: urlParams.UserName || '',
      NameSurname: urlParams.NameSurname || '',
      userIds: urlParams.userIds ? urlParams.userIds.split(',').map((id) => parseInt(id, 10)) : [],
      CityId: urlParams.CityId ? parseInt(urlParams.CityId, 10) : undefined,
      CityLabel: urlParams.CityLabel || '',
    };
  }, [searchParams]);

  const { data, error, isLoading, isFetching, pagingConfig } = useServerSideQuery(useLazyGetCompaniesQuery, apiParams);

  useErrorListener(error);

  return (
    <Table<Company>
      id="CompaniesTable"
      rowId="Id"
      headers={headers}
      data={data?.Items || []}
      loading={isLoading || isFetching}
      pagingConfig={pagingConfig}
      notFoundConfig={{ title: 'Şirket bulunamadı' }}>
      <Slot<Company> id="Status">
        {(_, row) => {
          if (!row) return '-';
          return (
            <Chip
              size="small"
              label={row.Status === 1 ? 'Aktif' : 'Pasif'}
              color={row.Status === 1 ? 'success' : 'error'}
              variant="filled"
            />
          );
        }}
      </Slot>
      <Slot<Company> id="Actions">
        {(_, row) => {
          if (!row) return '-';
          return (
            <Button
              id="company-detail-button"
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<Visibility />}
              onClick={() => navigate(`/companies/${row.Id}/genel`)}>
              Detay
            </Button>
          );
        }}
      </Slot>
    </Table>
  );
};

export default CompaniesTable;
