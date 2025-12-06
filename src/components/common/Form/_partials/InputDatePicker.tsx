import { HUMAN_READABLE_DATE, RESPONSE_DATE } from '@constant';
import { Box, alpha, styled } from '@mui/material';
import { LocalizationProvider, trTR } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePickerProps, DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from 'react-hook-form';
import Icon from '../../Icon/index';
import { IInput } from '../types';
import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';

export interface IInputDate extends IInput {
  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
  id?: string;
  views?: ('year' | 'month' | 'day')[];
}

type ControllerProps = {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  id?: string;
};

export const makeLocalAppearUTC = (value: string) => {
  if (dayjs(value).isValid()) {
    return dayjs(value).format(RESPONSE_DATE);
  }
};

export const localToUTC = (dateTime: string) => {
  if (dayjs(dateTime).isValid()) {
    const date = dayjs(dateTime).format(RESPONSE_DATE);
    return date;
  }
};

export const CustomDatePicker = styled(MUIDatePicker)(({ theme }) => ({
  transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
  borderRadius: 8,
  backgroundColor: '#fff',
  border: '1px solid',
  borderColor: theme.palette.grey.A300,
  width: '100%',
  'label + &': {
    marginTop: theme.spacing(-0.5),
  },
  '& fieldset': {
    borderRadius: 8,
    border: '1px solid',
    borderColor: '#E0E3E7',
  },
  '&:focus, &:hover': {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
  '& .MuiInputBase-root': {
    '&:hover': {
      fieldset: {
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
    },
  },
  input: {
    fontSize: 14,
    padding: '11.5px 12px',
  },
}));

export default function DatePicker(props: IInputDate) {
  const {
    name,
    form,
    label,
    readonly,
    disabled,
    minDate = null,
    maxDate = null,
    disableFuture,
    disablePast,
    views,
  } = props;
  const minDates = dayjs(minDate);
  const maxDates = dayjs(maxDate);

  // Helper: Keyboard event oluşturur
  const createArrowKeyEvent = (direction: 'ArrowLeft' | 'ArrowRight') => {
    return new KeyboardEvent('keydown', {
      key: direction,
      code: direction,
      keyCode: direction === 'ArrowLeft' ? 37 : 39,
      bubbles: true,
      cancelable: true,
    });
  };

  // Helper: Field section boş mu kontrol eder
  const isFieldSectionEmpty = (fieldValue: string) => {
    return !fieldValue || /^[A-Z_\s]*$/.test(fieldValue) || !/\d/.test(fieldValue);
  };

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, ref, value, ...rest }, fieldState: { error } }: ControllerProps) => {
        const temp = {
          onChange: (value: string) => {
            if (value) {
              onChange(dayjs(value).format(RESPONSE_DATE));
            } else {
              onChange('');
            }
          },
          format: views && views.length === 1 && views[0] === 'year' ? 'YYYY' : HUMAN_READABLE_DATE,
          views: views || ['year', 'month', 'day'],
        } as DatePickerProps<unknown>;

        // Focus olduğunda yıl alanına git
        const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
          setTimeout(() => {
            const input = e.target;
            // Gün -> Ay -> Yıl için 2 ArrowRight eventi gönder
            input.dispatchEvent(createArrowKeyEvent('ArrowRight'));

            setTimeout(() => {
              input.dispatchEvent(createArrowKeyEvent('ArrowRight'));
            }, 10);
          }, 0);
        };

        // Input değişikliklerini dinle
        const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
          const input = e.target as HTMLInputElement;

          requestAnimationFrame(() => {
            const value = input.value;
            // Tüm alanlar placeholder ise temizle
            if (value === 'DD.MM.YYYY' || value.length === 0) {
              onChange('');
            }
          });
        };

        // Backspace ile alan boşaldığında otomatik önceki alana geç
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Backspace') {
            const input = e.target as HTMLInputElement;

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const newValue = input.value;
                const cursorPos = input.selectionStart || 0;

                // DD.MM.YYYY formatı - pozisyonlar: gün(0-2), ay(3-5), yıl(6-10)

                // Yıl alanında ve boş ise ay alanına geç
                if (cursorPos >= 6 && isFieldSectionEmpty(newValue.substring(6, 10))) {
                  input.dispatchEvent(createArrowKeyEvent('ArrowLeft'));
                }
                // Ay alanında ve boş ise gün alanına geç
                else if (cursorPos >= 3 && cursorPos < 6 && isFieldSectionEmpty(newValue.substring(3, 5))) {
                  input.dispatchEvent(createArrowKeyEvent('ArrowLeft'));
                }
                // Gün alanında ve boş ise tüm değeri temizle
                else if (cursorPos < 3 && isFieldSectionEmpty(newValue.substring(0, 2))) {
                  onChange('');
                }
              });
            });
          }
        };

        return (
          <Box sx={{ width: '100%', opacity: readonly || disabled ? 0.6 : 1 }}>
            <LocalizationProvider
              adapterLocale="TR-tr"
              dateAdapter={AdapterDayjs}
              localeText={trTR.components.MuiLocalizationProvider.defaultProps.localeText}>
              <CustomInputLabel label={label} />
              <CustomDatePicker
                inputRef={ref}
                disabled={readonly || disabled}
                disablePast={disablePast}
                disableFuture={disableFuture}
                slotProps={{
                  textField: {
                    size: 'medium',
                    error: Boolean(error),
                    id: name,
                    onFocus: handleInputFocus,
                    onKeyDown: handleKeyDown,
                    onInput: handleInput,
                  },
                  actionBar: {
                    actions: ['clear', 'accept'],
                  },
                }}
                minDate={minDates}
                maxDate={maxDates}
                slots={{
                  openPickerIcon: () => <Icon icon="calendar" size={20} />,
                }}
                {...rest}
                {...temp}
                value={value ? dayjs(new Date(value)) : ''}
              />
              <CustomHelperText id={`${name}Error`} error={error} />
            </LocalizationProvider>
          </Box>
        );
      }}
    />
  );
}
