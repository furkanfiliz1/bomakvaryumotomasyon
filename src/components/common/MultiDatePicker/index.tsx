import { Icon, MenuPopover } from '@components';
import { Autocomplete, Box, IconButton, TextField, Typography, styled, useTheme } from '@mui/material';
import { LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import {
  CompanyPaymentDaysResponseModel,
  OfficialHolidaysResponseModel,
  useGetCompaniesByCompanyIdDefinitionsPaymentDaysQuery,
} from '@store';
import dayjs, { Dayjs } from 'dayjs';
import { Ref, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { HUMAN_READABLE_DATE, RESPONSE_DATE } from '@constant';
import { useUser } from '@hooks';
interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isDisabled?: boolean;
  isSelected?: Dayjs | null | undefined | boolean;
}

export interface MultiDatePickerMethods {
  value: () => string[] | undefined;
  setValue: (dates: string[] | null | undefined) => void;
}

const CustomPickersDay = styled(PickersDay)<CustomPickerDayProps>(({ theme, isSelected }) => ({
  borderRadius: 4,
  ...(isSelected && {
    backgroundColor: theme.palette.primary[300],
    border: '1px solid #6D98F5',
    color: '#6D98F5',
  }),
  '&.Mui-selected': {
    ...(isSelected
      ? {
          backgroundColor: theme.palette.primary[300],
          border: '1px solid #6D98F5',
          color: '#6D98F5',
          '&:hover': {
            backgroundColor: 'white',
          },
          '&:focus': {
            backgroundColor: theme.palette.primary[300],
          },
        }
      : {
          backgroundColor: 'white',
          color: '#000',
          '&:hover': {
            backgroundColor: 'white',
          },
          '&:focus': {
            backgroundColor: 'white',
          },
        }),
  },
})) as React.ComponentType<CustomPickerDayProps>;

const Day = (
  props: PickersDayProps<Dayjs> & {
    selectedDays?: (Dayjs | null)[];
    isDisabled?: boolean;
    holidays?: OfficialHolidaysResponseModel[] | null;
    weekdays: CompanyPaymentDaysResponseModel[];
    days: CompanyPaymentDaysResponseModel[];
    id?: string;
  },
) => {
  const { day, selectedDays, weekdays, days, holidays, ...other } = props;

  if (selectedDays == null) {
    return <PickersDay day={day} {...other} />;
  }

  const isHoliday = holidays
    ? holidays?.find((item) => dayjs(item.Date).format(RESPONSE_DATE) === dayjs(day).format(RESPONSE_DATE))
    : false;

  const selectedDay = dayjs(day).day();
  const _day = selectedDay === 0 ? 6 : selectedDay - 1;
  const isWeekday = weekdays?.find((item) => item.Id === days[_day].Id);
  const isSelected = selectedDays.find(
    (item) => dayjs(item).format(RESPONSE_DATE) === dayjs(day).format(RESPONSE_DATE),
  );
  return (
    <CustomPickersDay
      {...other}
      day={day}
      isSelected={isSelected}
      disabled={isWeekday || isHoliday ? true : false}
      id={`day-${day.format('DD')}`}
    />
  );
};

const MultiDatePicker = (
  {
    weekdays,
    holidays,
    dates: defaultDates,
  }: {
    weekdays: CompanyPaymentDaysResponseModel[] | null | undefined;
    holidays?: OfficialHolidaysResponseModel[] | null | undefined;
    dates: string[] | null | undefined;
  },
  ref: Ref<MultiDatePickerMethods>,
) => {
  const user = useUser();
  const { data: days } = useGetCompaniesByCompanyIdDefinitionsPaymentDaysQuery(String(user?.CompanyId));

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState<string[] | null | undefined>(defaultDates || []);
  const [lastFocusedValue, setLastFocusedValue] = useState<Dayjs | null | string | undefined>(dayjs(dates?.[0]));

  useImperativeHandle(ref, () => ({
    value: () => dates?.map((item) => dayjs(item).format(RESPONSE_DATE)),
    setValue: (dates) => {
      setDates(dates);
      setLastFocusedValue(null);
    },
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: Dayjs | null | string | undefined) => {
    const date = dayjs(e);
    setLastFocusedValue(date);

    const isInclude = dates?.some((item) => dayjs(item).format(RESPONSE_DATE) === dayjs(date).format(RESPONSE_DATE));

    if (isInclude) {
      const temp = dates?.filter((item) => dayjs(item).format(RESPONSE_DATE) !== dayjs(date).format(RESPONSE_DATE));
      setDates(temp);
    } else {
      setDates([...(dates || []), date] as never);
    }
  };

  const theme = useTheme();

  return (
    <>
      <Box>
        <Autocomplete
          id="select-from-calendar"
          multiple
          options={[]}
          disableClearable
          onChange={(e) => {
            const value = (e.target as HTMLElement)?.closest('svg')?.parentElement?.textContent;
            handleChange(dayjs(value));
          }}
          PopperComponent={() => <></>}
          getOptionLabel={(option) => option.value}
          renderTags={(option) => {
            return option.map((item) => (
              <Box
                className="badge-container"
                raw-value={item.value}
                sx={{
                  height: 30,
                  background: theme.palette.primary[300],
                  border: `1px solid ${theme.palette.primary[700]}`,
                  fontSize: 11,
                  px: 1.5,
                  pr: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 1,
                  justifyContent: 'center',
                  color: theme.palette.primary[700],
                  mr: 1,
                  my: 0.5,
                }}
                key={item.value}>
                <Typography color={theme.palette.primary[700]} sx={{ mr: 1 }} variant="caption">
                  {dayjs(item.value).format(HUMAN_READABLE_DATE)}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    const value = (e.target as HTMLElement).closest('.badge-container')?.getAttribute('raw-value');
                    handleChange(value);
                  }}
                  size="small">
                  <Icon icon="x-close" size={14} color={theme.palette.primary.main} />
                </IconButton>
              </Box>
            ));
          }}
          value={dates?.map((item) => ({ value: dayjs(item).format('YYYY-MM-DD') }))}
          renderInput={(params) => (
            <TextField
              onClick={handleOpen}
              sx={{
                cursor: 'pointer',
                '& input': {
                  cursor: 'pointer',
                  height: 25,
                },
              }}
              {...params}
              inputRef={anchorRef}
              ref={anchorRef}
              fullWidth
              size="small"
              placeholder="Takvimden Seçin"
            />
          )}
        />
      </Box>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}>
        <LocalizationProvider adapterLocale="tr" dateAdapter={AdapterDayjs}>
          <DateCalendar
            onChange={handleChange}
            value={lastFocusedValue}
            slots={{ day: Day as never }}
            slotProps={
              {
                day: {
                  selectedDays: dates as never,
                  days,
                  weekdays,
                  holidays,
                },
              } as never
            }
          />
        </LocalizationProvider>
      </MenuPopover>
    </>
  );
};

export default forwardRef(MultiDatePicker);
