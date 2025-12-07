import { Icon } from '@components';
import { Box, useTheme, Breadcrumbs as BreadcrumbsMui, Link, Typography, styled } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MouseEventHandler, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { breadcrumbsRedux } from '@store';
import { useAppSelector, useResponsive } from '@hooks';
import { useDispatch } from 'react-redux';
import { getNavTitle } from '@helpers';
import { getActiveNavItemThroughPath } from '@utils';

const StyledBreadcrumb = styled(BreadcrumbsMui)(({ theme }) => ({
  marginLeft: 34,
  ...theme.typography.body2,
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}));

const Breadcrumbs = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const smDown = useResponsive('down', 'sm');

  const { stack, activeCrumb } = useAppSelector((state) => state.breadcrumbs);

  useEffect(() => {
    const result = getActiveNavItemThroughPath(pathname);
    dispatch(breadcrumbsRedux.setActiveBreadcrumb(result.activeCrumb));
    dispatch(breadcrumbsRedux.setBreadcrumbStack(result.stack));
  }, [dispatch, pathname]);

  const { title: navTitle, icon: activeIcon, path } = activeCrumb || {};
  const title = getNavTitle(navTitle);

  const parentNavConfig = stack.find((navItem) => navItem?.children?.find((childRoute) => childRoute.path === path));
  const icon = activeIcon || parentNavConfig?.icon;

  return (
    <>
      <Box display="flex" alignItems="center">
        {smDown ? null : (
          <Box
            sx={{
              backgroundColor: theme.palette.primary[200],
              width: '24px',
              height: '24px',
              borderRadius: theme.spacing(1),
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing(1.2),
            }}>
            {icon && <Icon icon={icon} size="14" color={theme.palette.primary[700]} />}
          </Box>
        )}

        <Box>
          <Typography variant="subtitle1" color={theme.palette.dark[900]} sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
      </Box>
      <Box>
        {!smDown && (
          <StyledBreadcrumb separator={<NavigateNextIcon style={{ marginInline: -8 }} fontSize="small" />}>
            {stack?.length > 1 &&
              stack.map((bc, index) => {
                const { breadcrumbTitle: bcTitle } = bc || {};
                let breadcrumbTitle = getNavTitle(bcTitle);
                const { path, children } = bc || {};
                const hasChildren = !!children && children.length > 0;
                const isLast = stack?.length === index + 1;

                Object.keys(params).forEach((param) => {
                  breadcrumbTitle = breadcrumbTitle.replace(`{{${param}}}`, params[param] || '');
                });

                if (isLast || hasChildren) {
                  return (
                    <Typography fontWeight={300} variant="caption" key={path} color="text.primary">
                      {breadcrumbTitle}
                    </Typography>
                  );
                }

                const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
                  e.preventDefault();
                  navigate(path === '/' ? '/home' : path);
                };

                if (breadcrumbTitle) {
                  return (
                    <Link onClick={onClick} underline="hover" key={path} color="inherit" href={path}>
                      <Typography fontWeight={500} variant="caption" key={path} color="text.primary">
                        {breadcrumbTitle}
                      </Typography>
                    </Link>
                  );
                }
              })}
          </StyledBreadcrumb>
        )}
      </Box>
    </>
  );
};

export default Breadcrumbs;
