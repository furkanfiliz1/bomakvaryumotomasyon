/**
 * Campaign Discount Definition List Component
 * Matches legacy CampaignDiscountDef.js renderList() section exactly
 * Uses Table component with server-side pagination
 */

import { Slot, Table } from '@components';
import { MONTHS } from '@constant';
import { Typography } from '@mui/material';
import type { HeadCell, PagingConfig, SortingConfig } from 'src/components/common/Table/types';
import type { CampaignDiscountItem } from '../campaign-discount-definition.types';
import { formatMonthYearDisplay, formatRatioDisplay, getCampaignTypeLabel } from '../helpers';

/**
 * Table headers configuration
 */
const getTableHeaders = (): HeadCell[] => [
  { id: 'CampaignType', label: 'Kampanya Tipi', width: 200 },
  { id: 'MonthYear', label: 'Ay / Yıl', width: 150, slot: true },
  { id: 'Ratio', label: 'İndirim Oranı', width: 120, slot: true },
];

interface CampaignDiscountDefinitionListProps {
  items: CampaignDiscountItem[];
  isLoading: boolean;
  pagingConfig: PagingConfig;
  sortingConfig?: SortingConfig;
}

export const CampaignDiscountDefinitionList: React.FC<CampaignDiscountDefinitionListProps> = ({
  items,
  isLoading,
  pagingConfig,
  sortingConfig,
}) => {
  const headers = getTableHeaders();

  // Transform data to include CampaignType field for table display
  const tableData = items.map((item, index) => ({
    ...item,
    _id: `${item.Year}-${item.Month}-${index}`,
    CampaignType: getCampaignTypeLabel(1),
  }));

  return (
    <Table<(typeof tableData)[number]>
      id="campaign-discount-definition-table"
      rowId="_id"
      headers={headers}
      data={tableData}
      loading={isLoading}
      pagingConfig={pagingConfig}
      sortingConfig={sortingConfig}
      striped
      size="small"
      disableSorting
      notFoundConfig={{
        title: 'Liste bulunmamaktadır.',
        subTitle: 'Arama kriterlerinizi değiştirerek tekrar deneyebilirsiniz.',
      }}>
      <Slot<(typeof tableData)[number]> id="MonthYear">
        {(_, row) => (
          <Typography variant="body2">{row ? formatMonthYearDisplay(row.Month, row.Year, MONTHS) : '-'}</Typography>
        )}
      </Slot>
      <Slot<(typeof tableData)[number]> id="Ratio">
        {(_, row) => <Typography variant="body2">{row ? formatRatioDisplay(row.Ratio) : '-'}</Typography>}
      </Slot>
    </Table>
  );
};

export default CampaignDiscountDefinitionList;
