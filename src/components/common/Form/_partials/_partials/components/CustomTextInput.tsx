import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import { getPlaceholderTextStyles } from '../shared/placeholder-styles';

export const CustomTextInput = styled(InputBase)(({ theme, error, disabled }) => {
  const placeholderStyles = getPlaceholderTextStyles(theme);
  return {
    width: '100%',
    'label + &': {
      marginTop: theme.spacing(-0.5),
    },
    '& .MuiInputBase-input': {
      borderRadius: 8,
      position: 'relative',
      backgroundColor: disabled ? theme.palette.grey[50] : '#fff',
      border: '1px solid',
      borderColor: error ? theme.palette.error[500] : disabled ? theme.palette.grey[300] : theme.palette.grey.A300,
      fontSize: 14,
      width: '100%',
      padding: '10px 12px',
      '-webkit-text-fill-color': theme.palette.text.primary,
      color: disabled ? 'blue' : theme.palette.text.primary,
      cursor: disabled ? 'not-allowed' : 'text',
      transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
      '&:focus, &:hover ': {
        boxShadow: disabled ? 'none' : `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: disabled ? theme.palette.grey[300] : theme.palette.primary.main,
      },
      '&::placeholder': {
        ...placeholderStyles,
        opacity: 1,
        color: disabled ? theme.palette.text.disabled : placeholderStyles.color,
      },
    },
  };
});
