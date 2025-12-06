export default function FormControl() {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFormLabel-root:not(.MuiInputLabel-shrink)': {},
        },
      },
    },
  };
}
