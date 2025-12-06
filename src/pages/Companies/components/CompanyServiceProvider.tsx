import React from 'react';
import { Container } from '@mui/material';
import { ServiceProviderListPage } from '../ServiceProvider/components';

interface CompanyServiceProviderProps {
  companyId: number;
  companyIdentifier: string;
}

/**
 * Main component for company service provider management
 * Integrates the ServiceProvider module into the Companies page
 */
export const CompanyServiceProvider: React.FC<CompanyServiceProviderProps> = ({ companyId, companyIdentifier }) => {
  return (
    <Container maxWidth="xl" disableGutters>
      <ServiceProviderListPage companyId={companyId} companyIdentifier={companyIdentifier} />
    </Container>
  );
};
