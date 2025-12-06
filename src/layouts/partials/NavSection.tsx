import { FC, memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Icon } from '@components';
import { getNavTitle, getUserType } from '@helpers';
import { useUser } from '@hooks';
import { INavConfig, UserTypes } from '@types';
import { checkIfAuthenticatedRoute, isActive } from '@utils';
import { IconTypes } from '../../components/common/Icon/types';

interface NavProps {
  navItem: INavConfig;
  open: boolean;
  handleOpen: () => void;
}

interface GroupNameProps {
  name: string;
}

const ListItemStyle = styled(ListItemButton)(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: 400,
  position: 'relative',
  textTransform: 'capitalize',
  color: '#130F26 !important',
  marginLeft: '12px',
  borderRadius: theme.shape.borderRadius,
  letterSpacing: 0.4,

  '&:hover': {
    opacity: 0.8,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  width: 24,
  height: 24,
  color: 'inherit !important',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 'auto',
  marginRight: theme.spacing(1),
}));

const activeRootStyle = {
  color: 'white',
  bgcolor: '#12163a !important',
  borderLeft: `4px solid #EB5146`,
  marginLeft: '8px',
};

const activeSubStyle = {
  color: 'white !important',
  fontWeight: 'fontWeightMedium',
};

const getIcon = (name: keyof typeof IconTypes) => <Icon color="#130F26" icon={name} size={18} />;

const GetGroupName: FC<GroupNameProps> = (props) => {
  const { name } = props;
  const theme = useTheme();

  return (
    <Box sx={{ paddingBlock: 1, paddingInline: 1 }}>
      <hr style={{ borderColor: theme.palette.common.white3, opacity: 0.3 }} />

      <Typography
        variant="body2"
        sx={{
          paddingTop: 1,
          paddingLeft: 0.7,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
        }}
        color={theme.palette.neutral[500]}>
        {' '}
        {name}
      </Typography>
    </Box>
  );
};

const NavItem: FC<NavProps> = (props) => {
  const theme = useTheme();
  const { navItem, open, handleOpen } = props;
  const user = useUser();
  const userType = getUserType(user);

  const { pathname } = useLocation();
  const isActiveRoot =
    isActive(navItem.path, pathname) || !!navItem.children?.find((item) => isActive(item.path, pathname) === true);
  const navigate = useNavigate();

  const { title: navTitle, path = '', icon, children, hidden, Badge, groupTitle, description, className } = navItem;
  const title = getNavTitle(navTitle, userType);

  const isAuth = checkIfAuthenticatedRoute(user, navItem);

  if (hidden || !isAuth) return null;

  const getColor = (isActive: boolean): string => {
    if (isActive) {
      return '#130F26';
    } else {
      return '#130F26';
    }
  };

  const handleItemClick = (e: React.MouseEvent<HTMLElement>, callback: () => void) => {
    const isMiddleClick = e.button === 1;
    const isCtrlOrCmd = (e.metaKey || e.ctrlKey) && e.button === 0;

    if (isMiddleClick || isCtrlOrCmd) {
      return;
    }

    e.preventDefault();
    callback();
  };

  if (children && children.some((c) => !c.hidden)) {
    return (
      <div className={className}>
        {!!groupTitle && <GetGroupName name={groupTitle} />}
        {!!title && (
          <Box component="a" href={path} sx={{ textDecoration: 'none', display: 'block' }}>
            <ListItemStyle
              id={title}
              onClick={(e) => handleItemClick(e as React.MouseEvent<HTMLElement>, handleOpen)}
              sx={{
                pl: 1,

                ...(isActiveRoot && activeRootStyle),
                backgroundColor: 'transparent',
              }}>
              <ListItemIconStyle sx={{ borderRadius: 20, backgroundColor: 'transparent' }}>
                {icon && getIcon(icon)}
              </ListItemIconStyle>
              <ListItemText
                disableTypography
                primary={
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        color: getColor(isActiveRoot),
                      }}>
                      {title}
                      {Badge ? <Badge /> : null}
                    </Typography>
                    <Typography color={theme.palette.common.white3} variant="caption">
                      {description && description}
                    </Typography>
                  </>
                }
              />
              <Icon size={20} icon={open ? 'chevron-up' : 'chevron-down'} />
            </ListItemStyle>
          </Box>
        )}

        <Collapse in={!!groupTitle || open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((navItem) => {
              const {
                title: navTitle,
                path = '',
                icon,
                hidden,
                Badge,
                description: childDescription,
                className: childClassName,
              } = navItem;
              const title = getNavTitle(navTitle, userType);
              const isAuth = checkIfAuthenticatedRoute(user, navItem);

              if (hidden || !isAuth || !title) return null;

              const isActiveSub = isActive(path, pathname);

              return (
                <Box component="a" href={path} key={title} sx={{ textDecoration: 'none', display: 'block' }}>
                  <ListItemStyle
                    id={title}
                    className={childClassName}
                    onClick={(e) => handleItemClick(e as React.MouseEvent<HTMLElement>, () => navigate(path))}
                    sx={{
                      pl: 2,

                      ...(isActiveSub && activeSubStyle),
                    }}>
                    {icon ? (
                      <ListItemIconStyle
                        sx={{
                          borderRadius: 20,
                        }}>
                        {icon && getIcon(icon)}
                      </ListItemIconStyle>
                    ) : (
                      <Box sx={{ ml: 3 }}></Box>
                    )}
                    <ListItemText
                      disableTypography
                      primary={
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              color: getColor(isActiveSub),
                            }}>
                            {title}

                            {Badge ? <Badge /> : null}
                          </Typography>
                          <Typography variant="caption" color={theme.palette.common.white3}>
                            {childDescription && childDescription}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemStyle>
                </Box>
              );
            })}
          </List>
        </Collapse>
      </div>
    );
  }

  return (
    <>
      {!!groupTitle && <GetGroupName name={groupTitle} />}
      {!!title && (
        <div className={className}>
          <Box component="a" href={path} sx={{ textDecoration: 'none', display: 'block' }}>
            <ListItemStyle
              id={title}
              onClick={(e) => handleItemClick(e as React.MouseEvent<HTMLElement>, () => navigate(path))}
              sx={{
                pl: 1,
                ...(isActiveRoot && activeRootStyle),
                backgroundColor: 'transparent',
                opacity: 1,
                paddingBlock: description ? 0 : 1,
              }}>
              <ListItemIconStyle sx={{ borderRadius: 20, backgroundColor: 'transparent' }}>
                {icon && getIcon(icon)}
              </ListItemIconStyle>
              <ListItemText
                disableTypography
                primary={
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        color: getColor(isActiveRoot),
                      }}>
                      {title}

                      {Badge ? <Badge /> : null}
                    </Typography>
                    <Typography color={'##130F26'} variant="caption">
                      {description && description}
                    </Typography>
                  </>
                }
              />
            </ListItemStyle>
          </Box>
        </div>
      )}
    </>
  );
};

interface NavSectionProps {
  navConfig: INavConfig[];
}

function NavSection({ navConfig, ...other }: NavSectionProps) {
  const user = useUser();
  const { pathname } = useLocation();
  const userType = getUserType(user);
  const isBuyer = userType === UserTypes.BUYER;
  const [openPathName, setOpenPathName] = useState(isBuyer ? 'buyer' : 'invoices');

  useEffect(() => {
    if (pathname === '/') return;
    setOpenPathName(pathname.split('/')[1]);
  }, [pathname]);

  const handleOpen = (path: string) => {
    if (openPathName === path) setOpenPathName('');
    else {
      setOpenPathName(path);
    }
  };

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1, pl: 0.5 }}>
        {navConfig.map((navItem) => {
          return (
            <NavItem
              handleOpen={() => handleOpen(navItem.path)}
              open={openPathName === navItem.path}
              key={navItem.path}
              navItem={navItem}
            />
          );
        })}
      </List>
    </Box>
  );
}

export default memo(NavSection);
