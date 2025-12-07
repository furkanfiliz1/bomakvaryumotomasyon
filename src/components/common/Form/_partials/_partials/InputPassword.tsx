import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Box, IconButton, useTheme } from '@mui/material';
import { IInput } from '../types';
import { CustomTextInput } from './components/CustomTextInput';
import CustomInputLabel from './components/CustomInputLabel';
import CustomHelperText from './components/CustomHelperText';
import Icon from 'src/components/common/Icon';

interface AdornmentProps {
  show: boolean;
  capsLockIconShow: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
}

export default function InputPassword({
  name,
  form,
  label,
  visible = true,
  readonly = false,
  mb = 2,
  minRows = 3,
  maxRows = 6,
}: IInput) {
  const [show, setShow] = React.useState<boolean>(false);
  const [isOnFocus, setIsOnFocus] = React.useState<boolean>(false);
  const theme = useTheme();
  const [isCapsLockOn, setIsCapsLockOn] = React.useState(false);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const Adornment: React.FC<AdornmentProps> = ({ show, onClick, onMouseDown, capsLockIconShow }) => (
    <Box
      sx={{
        width: '70px',
        position: 'absolute',
        top: '2px',
        right: '2px',
        bottom: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 55,
        fontSize: 16,
        fontWeight: 800,
      }}>
      <Box mr={0} minWidth={20} component="span">
        <Icon
          icon="capslock"
          color={theme.palette.neutral[500]}
          size={16}
          style={{ display: capsLockIconShow ? 'block' : 'none' }}
        />
      </Box>

      <IconButton
        aria-label="toggle password visibility"
        onClick={onClick}
        onMouseDown={onMouseDown}
        edge="end"
        id="visibility">
        {show ? (
          <Icon icon="eye-off" color={theme.palette.neutral[500]} size={20} />
        ) : (
          <Icon icon="eye" color={theme.palette.neutral[500]} size={20} />
        )}
      </IconButton>
    </Box>
  );

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isSafari) return;
    document.addEventListener('keyup', (e) => {
      if ((e as KeyboardEvent).key === 'CapsLock') {
        setIsCapsLockOn(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'CapsLock') {
        setIsCapsLockOn(true);
      }
    });
  }, [isSafari]);

  return visible ? (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Box sx={{ width: '100%' }}>
          <CustomInputLabel label={label} />
          <CustomTextInput
            id={name}
            size={'medium'}
            disabled={readonly}
            minRows={minRows}
            maxRows={maxRows}
            type={show ? 'text' : 'password'}
            sx={{ mb, width: '100%' }}
            error={!!error}
            onFocus={() => {
              if (isSafari) return;
              setIsOnFocus(true);
            }}
            onBlur={() => {
              if (isSafari) return;
              setIsOnFocus(false);
            }}
            onChange={(e) => {
              onChange(e.target.value.trim());
            }}
            value={value}
            endAdornment={
              <>
                <Adornment
                  show={show}
                  capsLockIconShow={isCapsLockOn && isOnFocus}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                />
              </>
            }
            inputProps={{
              ref: ref,
            }}
          />
          <CustomHelperText id={`${name}Error`} error={error} />
        </Box>
      )}
    />
  ) : (
    <></>
  );
}
