import { Button, Checkbox } from '@components';
import { HUMAN_READABLE_DATE, RESPONSE_DATE } from '@constant';
import { isHoliday, isWeekend } from '@helpers';
import { Box, FormControlLabel, Grid, TextField, Typography, styled, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { OfficialHolidaysResponseModel } from '@store';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../Icon';
import MenuPopover from '../MenuPopover';

interface Props {
  value: string;
  onChange: (date: Dayjs, isAllSelected: boolean) => void;
  error: string | undefined | boolean;
  holidays?: OfficialHolidaysResponseModel[] | null | undefined;
  applyAllAvailable?: boolean;
  exstraStyle?: object;
  isHolidaysDisable?: boolean;
  disabled?: boolean;
  hideRemainingDay?: boolean;
  hideApply?: boolean;
  showClearButton?: boolean;
}

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isDisabled?: boolean;
}

const CustomPickersDay = styled(PickersDay)<CustomPickerDayProps>(({ theme }) => ({
  borderRadius: 4,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary[300],
    border: '1px solid #6D98F5',
    color: '#6D98F5',
    '&:hover': {
      backgroundColor: theme.palette.primary[200],
    },
    '&:focus': {
      backgroundColor: theme.palette.primary[200],
    },
  },
})) as React.ComponentType<CustomPickerDayProps>;

const daysShortcut = [30, 60, 90, 120, 150, 175];

const Day = (
  props: PickersDayProps<Dayjs> & {
    selectedDay?: Dayjs | null;
    isDisabled?: boolean;
    holidays?: OfficialHolidaysResponseModel[] | null;
  },
) => {
  const { day, selectedDay, holidays, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }

  const _holiday = holidays?.find(
    (item) => dayjs(item.Date).format(RESPONSE_DATE) === dayjs(day).format(RESPONSE_DATE),
  );

  const isBefore = dayjs(day).isBefore(dayjs().add(-1, 'days'));

  return <CustomPickersDay {...other} day={day} disabled={_holiday || isBefore ? true : false} />;
};

const InvoiceDatePicker = ({
  value,
  onChange,
  error,
  holidays,
  applyAllAvailable = true,
  exstraStyle,
  isHolidaysDisable = false,
  disabled,
  hideRemainingDay,
  hideApply,
  showClearButton = false,
}: Props) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(dayjs(value));
  const theme = useTheme();

  const baseTextFieldStyles = {
    cursor: 'pointer',
    height: 40,
    width: 250,
    backgroundColor: '#fff',
    borderRadius: '8px',

    '& input': {
      cursor: 'pointer',
      height: 25,
      borderRadius: '8px 0 0 8px',
    },
  };

  useEffect(() => {
    setDate(dayjs(value));
  }, [value]);

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [remainingDay, setRemainingDay] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDate(dayjs(value));
  };

  useEffect(() => {
    const _remainingDay = Math.ceil(dayjs(date).diff(dayjs(), 'days', true));
    setRemainingDay(_remainingDay);
  }, [date]);

  const updatedHolidays = useMemo(() => {
    return holidays?.map((holiday) => dayjs(holiday.Date)) || [];
  }, [holidays]);

  const inputText = hideRemainingDay
    ? dayjs(date).format(HUMAN_READABLE_DATE)
    : `${remainingDay} Gün - ${dayjs(date).format(HUMAN_READABLE_DATE)}`;

  return (
    <Box>
      <TextField
        disabled={disabled}
        ref={anchorRef}
        onClick={handleOpen}
        size="small"
        error={error ? true : false}
        value={date.isValid() && !Number.isNaN(remainingDay) ? inputText : ''}
        InputProps={{
          endAdornment: <Icon icon="chevron-down" size={20} />,
        }}
        sx={{
          ...baseTextFieldStyles,
          ...exstraStyle,
        }}
      />

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
        <Grid container sx={{ width: 415 }}>
          <Grid item sx={{ width: '100%', borderBottom: '1px solid #dedede' }}>
            {!hideApply && (
              <Box
                sx={{
                  height: 46,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  justifyContent: 'space-between',
                }}>
                {applyAllAvailable && (
                  <FormControlLabel
                    onChange={(__, checked: boolean) => {
                      setIsAllSelected(checked);
                    }}
                    checked={isAllSelected}
                    control={<Checkbox size="small" />}
                    label="Tüm faturalara uygula"
                  />
                )}
                {
                  <Box sx={{ display: 'flex', marginLeft: 'auto', gap: 1 }}>
                    {showClearButton && (
                      <Button
                        id="clear"
                        variant="text"
                        color="secondary"
                        onClick={() => {
                          setDate(dayjs(''));
                          setOpen(false);
                          onChange(dayjs('') || '', false);
                          setIsAllSelected(false);
                        }}>
                        Temizle
                      </Button>
                    )}
                    <Button
                      id="apply"
                      variant="text"
                      color="primary"
                      onClick={() => {
                        setOpen(false);
                        onChange(date || '', isAllSelected);
                        setIsAllSelected(false);
                      }}>
                      Uygula
                    </Button>
                  </Box>
                }
              </Box>
            )}
          </Grid>
          <Grid item sx={{ borderBottom: '1px solid #dedede', width: '100%' }}>
            <Box
              sx={{
                height: 46,
                display: 'flex',
                alignItems: 'center',
                px: 2,
              }}>
              <Typography variant="body5">
                {date.isValid() && !Number.isNaN(remainingDay)
                  ? `${remainingDay} Gün - ${dayjs(date).format(HUMAN_READABLE_DATE)}`
                  : '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item md={3} sx={{ borderRight: '1px solid #dedede' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {daysShortcut.map((day) => (
                <Box
                  onClick={() => {
                    let date = dayjs().add(day, 'day');
                    while (isHoliday(date, updatedHolidays) || isWeekend(date)) {
                      date = date.add(1, 'day');
                    }
                    setDate(date);
                    if (hideApply) {
                      onChange(date || '', isAllSelected);
                      setOpen(false);
                    }
                  }}
                  sx={{
                    flex: 1,
                    borderBottom: '1px solid #dedede',
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    fontSize: 14,
                    cursor: 'pointer',
                    color: day === remainingDay ? theme.palette.primary.main : 'inherit',
                    fontWeight: 400,
                    '&:hover': {
                      backgroundColor: theme.palette.grey[200],
                    },
                  }}
                  key={day}>
                  {day} Gün
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item md={9} sx={{ borderBottom: '1px solid #dedede' }}>
            <LocalizationProvider adapterLocale="tr-TR" dateAdapter={AdapterDayjs}>
              <DateCalendar
                minDate={dayjs()}
                onChange={(e) => {
                  const date = dayjs(e);
                  setDate(date);
                  if (hideApply) {
                    onChange(date || '', isAllSelected);
                    setOpen(false);
                  }
                }}
                sx={{
                  '& .MuiPickersSlideTransition-root': {
                    minHeight: 200,
                  },
                }}
                value={date.isValid() ? date : undefined}
                slots={{ day: Day }}
                shouldDisableDate={(date) =>
                  (isHoliday(dayjs(date), updatedHolidays) || isWeekend(dayjs(date))) && isHolidaysDisable
                }
                disablePast
                slotProps={{
                  day: (ownerState) => ({
                    selected: dayjs(ownerState.day).isSame(date, 'day'),
                    holidays,
                  }),
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </MenuPopover>
    </Box>
  );
};

export default InvoiceDatePicker;
