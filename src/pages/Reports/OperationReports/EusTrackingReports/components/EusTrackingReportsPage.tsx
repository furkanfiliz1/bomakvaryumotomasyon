import { PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyGetCompanyByIdentifierQuery, useLazyGetEusTrackingReportQuery } from '../eus-tracking-reports.api';
import type { EusTrackingFilters, EusTrackingItem } from '../eus-tracking-reports.types';
import { generateCompanyDetailPath, getEusTrackingTableHeaders } from '../helpers';
import { useEusTrackingDropdownData, useEusTrackingQueryParams } from '../hooks';
import { EusTrackingFilters as FiltersComponent } from './EusTrackingFilters';
import { EusTrackingTableSlots } from './EusTrackingTableSlots';

/**
 * EUS Tracking Reports List Page Component
 * Displays EUS tracking data with filters and actions
 * Matches legacy system UI and functionality exactly
 */
export const EusTrackingReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [additionalFilters, setAdditionalFilters] = useState<Partial<EusTrackingFilters>>({});

  // Get dropdown data
  const { eusFormulaTypes, eusStatusTypes, monthOptions, yearOptions } = useEusTrackingDropdownData();

  // Company lookup for navigation
  const [getCompanyByIdentifier] = useLazyGetCompanyByIdentifierQuery();

  // Filter form is now handled internally by EusTrackingFilters component

  // Generate query parameters
  const { baseQueryParams } = useEusTrackingQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig } = useServerSideQuery(
    useLazyGetEusTrackingReportQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table configuration
  const tableHeaders = getEusTrackingTableHeaders();

  // Handle detail button click - matches legacy navigation exactly
  const handleDetailClick = async (item: EusTrackingItem) => {
    try {
      const response = await getCompanyByIdentifier(item.companyIdentifier).unwrap();
      const detailPath = generateCompanyDetailPath(response.id);
      navigate(detailPath);
    } catch (error) {
      // Error will be handled by global error handler
      console.error('Failed to get company details:', error);
    }
  };

  // Helper functions are now handled internally by filter component

  return (
    <>
      <PageHeader
        title="EUS Takip Raporu"
        subtitle="Erken uyarı sistemi kapsamında ay bazlı bloke/uyarı alan firma listesi"
      />
      <Box mx={2}>
        {/* Filter Form */}
        <FiltersComponent
          eusFormulaTypes={eusFormulaTypes}
          eusStatusTypes={eusStatusTypes}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          onFilterChange={setAdditionalFilters}
          isLoading={isLoading || isFetching}
        />

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<EusTrackingItem>
            id="eus-tracking-table"
            rowId="companyIdentifier"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}
            disableSorting={true} // Legacy doesn't support sorting
          >
            {/* Custom cell renderers following OperationPricing pattern */}
            <Slot<EusTrackingItem> id="supplier">
              {(_, row) => row && <EusTrackingTableSlots.SupplierSlot item={row} />}
            </Slot>

            <Slot<EusTrackingItem> id="totalPaymentMonthlyDecreaseRatio">
              {(_, row) =>
                row && (
                  <EusTrackingTableSlots.StatusValueSlot
                    value={row.totalPaymentMonthlyDecreaseRatio}
                    status={row.totalPaymentMonthlyDecreaseStatus}
                  />
                )
              }
            </Slot>

            <Slot<EusTrackingItem> id="totalPaymentThreeMonthlyDecreaseRatio">
              {(_, row) =>
                row && (
                  <EusTrackingTableSlots.StatusValueSlot
                    value={row.totalPaymentThreeMonthlyDecreaseRatio}
                    status={row.totalPaymentThreeMonthlyDecreaseStatus}
                  />
                )
              }
            </Slot>

            <Slot<EusTrackingItem> id="invoiceMonthlyIncreaseRatio">
              {(_, row) =>
                row && (
                  <EusTrackingTableSlots.StatusValueSlot
                    value={row.invoiceMonthlyIncreaseRatio}
                    status={row.invoiceMonthlyIncreaseStatus}
                  />
                )
              }
            </Slot>

            <Slot<EusTrackingItem> id="invoiceThreeMonthlyIncreaseRatio">
              {(_, row) =>
                row && (
                  <EusTrackingTableSlots.StatusValueSlot
                    value={row.invoiceThreeMonthlyIncreaseRatio}
                    status={row.invoiceThreeMonthlyIncreaseStatus}
                  />
                )
              }
            </Slot>

            <Slot<EusTrackingItem> id="senderAndReceiverRelation">
              {(_, row) =>
                row && (
                  <EusTrackingTableSlots.StatusValueSlot
                    value={row.senderAndReceiverRelation}
                    status={row.senderAndReceiverRelationStatus}
                  />
                )
              }
            </Slot>

            <Slot<EusTrackingItem> id="senderAndReceiverReturnedAllowance">
              {(_, row) => row && <EusTrackingTableSlots.ReturnedAllowanceSlot item={row} />}
            </Slot>

            <Slot<EusTrackingItem> id="companyIntegratorCount">
              {(_, row) => row && <EusTrackingTableSlots.IntegratorSlot item={row} />}
            </Slot>

            <Slot<EusTrackingItem> id="detail">
              {(_, row) =>
                row && <EusTrackingTableSlots.DetailButtonSlot item={row} onDetailClick={handleDetailClick} />
              }
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};
