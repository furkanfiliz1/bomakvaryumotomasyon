import { Theme } from '@mui/material/styles';

export default function Alert(theme: Theme) {
  return {
    MuiAlert: {
      variants: [
        {
          props: { variant: 'filled' },
          style: {
            borderWidth: 1,
            borderStyle: 'solid',
          },
        },
        {
          props: { color: 'error', variant: 'filled' },

          style: {
            backgroundColor: theme.palette.error[100],
            borderColor: theme.palette.error[400],
            '& .MuiAlert-icon': {
              color: theme.palette.error[800],
            },
          },
        },
        {
          props: { color: 'warning', variant: 'filled' },
          style: {
            backgroundColor: theme.palette.warning[100],
            borderColor: theme.palette.warning[400],
            '& .MuiAlert-icon': {
              color: theme.palette.warning[800],
            },
          },
        },
        {
          props: { color: 'success', variant: 'filled' },
          style: {
            backgroundColor: theme.palette.success[100],
            borderColor: theme.palette.success[400],
            '& .MuiAlert-icon': {
              color: theme.palette.success[800],
            },
          },
        },
        {
          props: { color: 'info', variant: 'filled' },
          style: {
            backgroundColor: theme.palette.primary[200],
            borderColor: theme.palette.primary[300],
            '& .MuiAlert-icon': {
              color: theme.palette.primary[800],
            },
          },
        },
        {
          props: { color: 'inherit' },
          // style: {
          //   '&:hover': { backgroundColor: theme.palette.action.hover }
          // }
        },
      ],
      styleOverrides: {
        root: {
          alignItems: 'center',
          color: theme.palette.dark[800],
          fontWeight: 500,
          fontSize: '14px',
          padding: '12px 16px',
          '& .MuiAlert-icon': {
            fontSize: '18px',
            padding: '2.4px 0 0 0',
          },
          '& .MuiAlert-message': {
            padding: 0,
            width: '100%',
          },
        },
      },
    },
  };
}
