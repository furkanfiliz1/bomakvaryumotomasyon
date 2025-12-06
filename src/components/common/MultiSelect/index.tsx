import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Checkbox, Icon } from '@components';
import { SetStateAction } from 'react';

export interface SelectData {
  Value: string;
  Description: string;
}

interface MultiSelectProps {
  labelId: string;
  id: string;
  data: SelectData[];
  name: string;
  placeholderText?: string;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  sx?: SxProps;
}

const MultiSelect = (props: MultiSelectProps) => {
  const theme = useTheme();
  const { labelId, id, data, name, placeholderText, selectedItems, setSelectedItems, sx = {} } = props;

  const handleSelectChange = (event: SelectChangeEvent<typeof selectedItems>) => {
    setSelectedItems(event.target.value as SetStateAction<string[]>);
  };
  return (
    <Select
      labelId={labelId}
      id={id}
      displayEmpty
      multiple
      value={selectedItems}
      onChange={handleSelectChange}
      IconComponent={(props) => <Icon icon="chevron-down" color={theme.palette.neutral[600]} size={20} {...props} />}
      sx={{
        borderRadius: '8px !important',
        '& .MuiSelect-select': {
          padding: '8px 8px 8px 12px',
          borderRadius: '8px !important',
        },
        backgroundColor: `${selectedItems.length > 0 ? theme.palette.primary[300] : 'white'}`,
        'label + &': {
          marginTop: theme.spacing(-0.5),
        },
        '& .MuiInputBase-input': {
          borderRadius: 8,
          position: 'relative',
          border: '1px solid',
          backgroundColor: '#fff',
          borderColor: theme.palette.grey.A300,
          fontSize: 14,
          width: '100%',
          padding: '8.6px 12px',
          transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
          '&:focus, &:hover': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
          },
        },
        '& fieldset': {
          border: 'none !important',
        },
        ...sx,
      }}
      MenuProps={{
        sx: {
          '&& .Mui-selected': {
            backgroundColor: 'white',
          },
          '&& .Mui-focusVisible': {
            backgroundColor: 'white',
          },
          maxHeight: '300px',
          width: '100%',
        },
      }}
      input={
        <OutlinedInput
          sx={{
            backgroundColor: 'white',
          }}
        />
      }
      renderValue={(selected) => {
        if (selected.length === 0) {
          return (
            <Box sx={{ display: 'flex', minWidth: '250px', maxWidth: '250px' }}>
              <Typography color={theme.palette.neutral[800]} fontWeight={400} mr={0.5} variant="subtitle2">
                {name}:
              </Typography>
              <Typography
                color={theme.palette.neutral[600]}
                fontWeight={400}
                variant="subtitle2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {placeholderText ?? 'Tümü'}
              </Typography>
            </Box>
          );
        }

        return (
          <Box sx={{ display: 'flex', minWidth: '250px', maxWidth: '250px' }}>
            <Typography
              color="#0C54EE"
              fontWeight={400}
              variant="subtitle2"
              mr={0.5}>{`${name} (${selected.length}) :`}</Typography>
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              variant="subtitle2"
              color={theme.palette.dark[800]}
              fontWeight={400}>
              {selected.join(', ')}
            </Typography>
          </Box>
        );
      }}>
      {data?.map((item) => (
        <MenuItem
          key={item.Value}
          value={item.Description}
          disableGutters
          disableRipple
          disableTouchRipple
          dense
          sx={{
            padding: '8px 8px 8px 12px',
            textTransform: 'capitalize',
            '&:hover': { backgroundColor: 'white !important' },
          }}>
          <Checkbox checked={selectedItems.indexOf(item?.Description || '') > -1} />
          <Typography fontWeight={400} color={theme.palette.dark[800]} variant="subtitle1">
            {item.Description}
          </Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiSelect;
