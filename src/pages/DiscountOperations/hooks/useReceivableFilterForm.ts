import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useForm } from 'react-hook-form';

interface ReceivableFilterFormData {
  OrderNo: string;
  PayableAmount: number | undefined;
  status: string;
}

interface UseReceivableFilterFormProps {
  onFilterChange: (filters: {
    OrderNo: string;
    PayableAmount: number | undefined;
    status: string;
    page: number;
  }) => void;
}

export const useReceivableFilterForm = ({ onFilterChange }: UseReceivableFilterFormProps) => {
  const initialValues: ReceivableFilterFormData = {
    OrderNo: '',
    PayableAmount: undefined,
    status: '',
  };

  const statusOptions = [
    { Value: '', Text: 'Hepsi' },
    { Value: '1', Text: 'Aktif' },
    { Value: '2', Text: 'Beklemede' },
    { Value: '3', Text: 'İptal' },
  ];

  const schema = yup.object({
    OrderNo: fields.text.label('Alacak No').meta({ col: 4 }),
    PayableAmount: fields.number.label('Alacak Tutarı').meta({ col: 4 }),
    status: fields
      .select(statusOptions, 'string', ['Value', 'Text'])
      .label('Alacak Durumu')
      .meta({ col: 4, showSelectOption: true }),
  });

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = () => {
    const formData = form.getValues();

    const filters = {
      OrderNo: formData.OrderNo || '',
      PayableAmount: formData.PayableAmount || undefined,
      status: String(formData.status || ''),
      page: 1, // Reset to first page when filtering
    };

    onFilterChange(filters);
  };

  const handleReset = () => {
    form.reset(initialValues);
    onFilterChange({
      OrderNo: '',
      PayableAmount: undefined,
      status: '',
      page: 1,
    });
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
  };
};
