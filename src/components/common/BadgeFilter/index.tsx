import { Box, Button, ButtonProps, styled } from '@mui/material';
import { useState } from 'react';

interface BadgeFilterItemProps extends ButtonProps {
  title: string;
  isActive: boolean;
  count?: number;
}

interface BadgeFilterProps {
  tabs: { title: string; id: number | number[]; count?: number; }[];
  onChange?: (id: number | number[]) => void;
  onChangeName?: (name: string) => void;
  initialSelectedIndex?: number;
}

const BadgeFilterItem = ({ title, isActive, count, ...props }: BadgeFilterItemProps) => {
  const BadgeButton = styled(Button)(({ theme }) => ({
    backgroundColor: isActive ? theme.palette.primary[400] : theme.palette.common.white,
    color: isActive ? theme.palette.primary[700] : theme.palette.neutral[600],
    borderColor: isActive ? theme.palette.primary[700] : theme.palette.grey[300],
    borderWidth: isActive ? 1.5 : 1,
    borderStyle: 'solid',
    fontSize: 14,
    fontWeight: 500,
    padding: '6px 16px',
    '&': {
      borderRadius: 4,
      marginRight: 8,
    },
    cursor: 'pointer',
  }));

  return (
    <BadgeButton id="title" {...props}>
      {`${title} ${count ? `(${count})` : ''}`}
    </BadgeButton>
  );
};

const BadgeFilter = (props: BadgeFilterProps) => {
  const { tabs, onChange, initialSelectedIndex, onChangeName } = props;
  const [current, setCurrent] = useState(initialSelectedIndex || 0);

  return (
    <Box sx={{ display: 'flex', mb: 2, overflowX: 'auto' }}>
      {tabs?.map((item, index) => (
        <BadgeFilterItem
          id={item.title}
          onClick={() => {
            setCurrent(index);
            onChange?.(item?.id);
            onChangeName?.(item?.title);
          }}
          key={index}
          isActive={index === current}
          title={item.title}
          count={item.count}
        />
      ))}
    </Box>
  );
};

export default BadgeFilter;
