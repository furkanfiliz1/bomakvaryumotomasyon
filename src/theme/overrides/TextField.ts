import { Theme, alpha } from '@mui/material/styles';

export default function TextField(theme: Theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            borderRadius: 8,
            backgroundColor: '#fff',
            border: '1px solid',
            borderColor: theme.palette.grey.A300,
            fontSize: 14,
            transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),

            '&:hover': {
              borderColor: theme.palette.primary.main,
              boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            },

            '&.Mui-focused': {
              borderColor: theme.palette.primary.main,
              boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            },

            '&.Mui-error': {
              borderColor: theme.palette.error[500],
              '&:hover, &.Mui-focused': {
                borderColor: theme.palette.error[500],
                boxShadow: `${alpha(theme.palette.error.main, 0.25)} 0 0 0 0.2rem`,
              },
            },

            '&.Mui-disabled': {
              backgroundColor: theme.palette.grey[50],
              borderColor: theme.palette.grey[300],
              cursor: 'not-allowed',
              '&:hover': {
                boxShadow: 'none',
                borderColor: theme.palette.grey[300],
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.disabled,
                cursor: 'not-allowed',
                '-webkit-text-fill-color': theme.palette.text.disabled,
              },
            },

            // Remove default MUI styling
            '&:before, &:after': {
              display: 'none',
            },

            '&.MuiOutlinedInput-root': {
              '& fieldset': {
                display: 'none',
              },
            },
          },

          '& .MuiInputBase-input': {
            padding: '10px 12px',
            fontSize: 14,
            color: theme.palette.text.primary,
            '-webkit-text-fill-color': theme.palette.text.primary,

            '&::placeholder': {
              color: theme.palette.text.disabled,
              opacity: 1,
            },

            '&:focus': {
              outline: 'none',
            },
          },

          // Multiline textarea styling
          '& .MuiInputBase-inputMultiline': {
            padding: '10px 12px',
            resize: 'vertical',
          },

          // Input label styling - using CustomInputLabel component styles
          '& .MuiInputLabel-root': {
            position: 'static',
            transform: 'none',
            fontSize: 14,
            fontWeight: 500,
            color: theme.palette.neutral[800], // Using CustomInputLabel color
            marginBottom: theme.spacing(0.5),
            paddingTop: 0,

            '&.Mui-focused, &.Mui-error': {
              color: theme.palette.neutral[800], // Maintain CustomInputLabel color
            },

            '&.Mui-disabled': {
              color: theme.palette.text.disabled,
            },

            // Support for shrink behavior like CustomInputLabel
            '&.MuiInputLabel-shrink': {
              transform: 'none',
            },
          },

          // Form helper text styling
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginTop: theme.spacing(0.5),
            fontSize: 12,

            '&.Mui-error': {
              color: theme.palette.error.main,
            },
          },
        },
      },

      // Default props
      defaultProps: {
        variant: 'outlined' as const,
        size: 'medium' as const,
        fullWidth: true,
      },
    },
  };
}
