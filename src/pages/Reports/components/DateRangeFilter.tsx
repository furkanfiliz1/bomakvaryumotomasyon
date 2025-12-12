import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/tr';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }: DateRangeFilterProps) => {
  const handleStartDateChange = (newValue: Dayjs | null) => {
    onStartDateChange(newValue ? newValue.toDate() : null);
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    onEndDateChange(newValue ? newValue.toDate() : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <DatePicker
          label="Başlangıç Tarihi"
          value={startDate ? dayjs(startDate) : null}
          onChange={handleStartDateChange}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }}
        />
        <DatePicker
          label="Bitiş Tarihi"
          value={endDate ? dayjs(endDate) : null}
          onChange={handleEndDateChange}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }}
        />
      </Box>
    </LocalizationProvider>
  );
};
