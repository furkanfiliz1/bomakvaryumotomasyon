import * as React from 'react';
import { useEffect } from 'react';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@components';
import { IconTypes } from '../Icon/types';
import { useResponsive } from '@hooks';

export interface RouteTabsProps extends TabsProps {
  pages: {
    path: string;
    title: string;
    icon?: keyof typeof IconTypes;
    component: JSX.Element;
  }[];
}

const RouteTabs = (props: RouteTabsProps) => {
  const { pages, sx = {} } = props;

  const [value, setValue] = React.useState(0);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const smDown = useResponsive('down', 'sm');

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const pageIndex = pages?.indexOf(pages?.find((item) => item.path === pathname) as never);

  useEffect(() => {
    if (pageIndex === -1) {
      navigate(pages[0].path);
    }
  }, [navigate, pageIndex, pages]);

  const Component = pages?.[pageIndex]?.component || pages[0].component;

  return (
    <>
      <Box>
        <Box sx={{ borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={!!smDown}
            allowScrollButtonsMobile={!!smDown}
            aria-label="scrollable auto tabs example"
            {...props}
            sx={{
              maxHeight: '60px !important',
              ...sx,
            }}>
            {pages.map((page, index) => (
              <Tab
                id={page.title}
                key={index}
                label={page.title}
                onClick={() => {
                  navigate(page.path);
                }}
                {...(page?.icon && {
                  iconPosition: 'start',
                  icon: <Icon icon={page?.icon} size={18} color={value === index ? '#447fe2' : 'grey'} />,
                })}
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Box mt={2}>{Component}</Box>
    </>
  );
};

export default RouteTabs;
