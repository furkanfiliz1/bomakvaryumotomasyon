import { useResponsive } from '@hooks';
import { Box, FormHelperText, TextField, useTheme } from '@mui/material';
import { FC, useEffect } from 'react';

interface InputVerificationCodeProps {
  color: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const InputVerificationCode: FC<InputVerificationCodeProps> = ({ color, onChange, disabled = false }) => {
  const smDown = useResponsive('down', 'sm');
  const theme = useTheme();

  useEffect(() => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('.MuiInputBase-input'));

    function getFirstEmptyIndex() {
      return inputs.findIndex((input) => input.value === '');
    }

    inputs.forEach((input, i) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (input.value === '' && i > 0) {
            inputs[i - 1].value = '';
            inputs[i - 1].focus();
            onChange('');
          }

          for (let j = i; j < inputs.length; j++) {
            const value = inputs[j + 1] ? inputs[j + 1].value : '';
            inputs[j].setRangeText(value, 0, 1, 'start');
          }
        }

        if (e.key === 'ArrowLeft' && i > 0) {
          inputs[i - 1].focus();
        }

        if (e.key === 'ArrowRight' && i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      });

      interface IEvent extends Event {
        data?: string;
      }
      input.addEventListener('input', (e: IEvent) => {
        input.value = '';

        const start = getFirstEmptyIndex();

        inputs[start].value = e.data || '';

        let textFieldData = '';
        inputs.forEach((input) => {
          textFieldData = textFieldData + input.value;
        });
        // TODO Daha sonra burayı
        if (start + 1 === 6) {
          textFieldData + e.data;
        }
        onChange(textFieldData);

        if (start + 1 < inputs.length) inputs[start + 1].focus();
      });

      input.addEventListener('paste', (e: ClipboardEvent) => {
        e.preventDefault();

        const text = e.clipboardData?.getData('text') || '';
        const firstEmpty = getFirstEmptyIndex();
        const start = firstEmpty !== -1 ? Math.min(i, firstEmpty) : i;

        for (let i = 0; start + i < inputs.length && i < text.length; i++) {
          inputs[start + i].value = text.charAt(i);
        }

        inputs[Math.min(start + text.length, inputs.length - 1)].focus();
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <div id="verification-input">
        <TextField
          disabled={disabled}
          size="small"
          type="number"
          inputMode="numeric"
          autoFocus
          sx={{
            width: smDown ? '42px' : '48px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: color,
            },
            '.MuiInputBase-input': {
              fontSize: '32px',
              color: color,
              fontWeight: 600,

              textAlign: 'center',
              p: `6px 0px`,
            },
            mr: smDown ? 1 : 1.5,
          }}
          className="input"
        />
        <TextField
          disabled={disabled}
          size="small"
          type="number"
          inputMode="numeric"
          sx={{
            width: smDown ? '42px' : '48px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: color,
            },
            '.MuiInputBase-input': {
              fontSize: '32px',
              color: color,

              fontWeight: 600,
              textAlign: 'center',
              p: `6px 0px`,
            },
            mr: smDown ? 1 : 1.5,
          }}
          className="input"
        />
        <TextField
          disabled={disabled}
          size="small"
          type="number"
          inputMode="numeric"
          sx={{
            width: smDown ? '42px' : '48px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: color,
            },
            '.MuiInputBase-input': {
              fontSize: '32px',
              color: color,
              fontWeight: 600,
              textAlign: 'center',
              p: `6px 0px`,
            },
            mr: smDown ? 1 : 1.5,
          }}
          className="input"
        />
        <TextField
          disabled={disabled}
          size="small"
          type="number"
          inputMode="numeric"
          sx={{
            width: smDown ? '42px' : '48px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: color,
            },
            '.MuiInputBase-input': {
              fontSize: '32px',
              color: color,
              fontWeight: 600,
              textAlign: 'center',
              p: `6px 0px`,
            },
            mr: smDown ? 1 : 1.5,
          }}
          className="input"
        />
        <TextField
          disabled={disabled}
          size="small"
          type="number"
          inputMode="numeric"
          sx={{
            width: smDown ? '42px' : '48px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: color,
            },
            '.MuiInputBase-input': {
              fontSize: '32px',
              color: color,
              fontWeight: 600,
              textAlign: 'center',
              p: `6px 0px`,
            },
            mr: smDown ? 1 : 1.5,
          }}
          className="input"
        />
        <TextField
          disabled={disabled}
          size="small"
          sx={{
            width: smDown ? '42px' : '48px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: color,
            },
            '.MuiInputBase-input': {
              fontSize: '32px',
              color: color,
              fontWeight: 600,
              textAlign: 'center',
              p: `6px 0px`,
            },
          }}
          className="input"
        />
      </div>
      {color === theme.palette.error[700] && (
        <Box id={'verification-error'} sx={{ display: 'flex', alignItems: 'start', mt: 1 }}>
          <FormHelperText sx={{ color: theme.palette.error[700], ml: 1, mt: '-1.2px', fontSize: '14px' }}>
            Doğrulama kodu hatalı
          </FormHelperText>
        </Box>
      )}
    </Box>
  );
};

export default InputVerificationCode;
