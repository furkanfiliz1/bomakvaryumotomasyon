export default function Label() {
  return {
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderRadius: 0,
        },
      },
    },
  };
}
