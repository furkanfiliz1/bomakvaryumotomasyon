import { FigoLoading } from '@components';
import { useAppSelector, useErrorListener, useResponsive } from '@hooks';
import { Box } from '@mui/material';
import { useUserSessionSocket } from '@sockets';
import {
  announcementsRedux,
  authRedux,
  breadcrumbsRedux,
  systemRulesRedux,
  useGetSessionsVerifyQuery,
  useLazyGetAnnouncementUserAnnouncementsQuery,
  useLazyGetSessionsSystemRulesQuery,
} from '@store';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Banner from 'src/components/common/Banner';
import { SystemRuleDataState } from 'src/store/slices/systemRules';
import Navbar, { APPBAR_HEIGHT } from './partials/Navbar';
import Sidebar, { DRAWER_WIDTH } from './partials/Sidebar';

export default function AuthorizedLayout() {
  const [open, setOpen] = useState(false);
  const isDesktop = useResponsive('up', 'lg');

  const { token, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const onStatusChange = useUserSessionSocket(user?.Id || 0);
  const VERIFY_PULL_INTERVALL = 1000 * 60 * 1; // 3 mins

  const [getAnnouncements, { data: announcementData, error: announcementsError }] =
    useLazyGetAnnouncementUserAnnouncementsQuery();

  const [getSessionsSystemRules, { data: systemRuleData, isSuccess: isSuccessSystemRuleData }] =
    useLazyGetSessionsSystemRulesQuery();
  useGetSessionsVerifyQuery(undefined, { pollingInterval: VERIFY_PULL_INTERVALL });

  useErrorListener([announcementsError]);

  const lastReadTime = useAppSelector((state) => state.announcements.lastReadTime);

  useEffect(() => {
    onStatusChange(() => {
      dispatch(authRedux.logout());
    });

    return () => {
      dispatch(breadcrumbsRedux.clear());
    };
  }, [dispatch, onStatusChange]);

  useEffect(() => {
    if (token !== '') {
      getSessionsSystemRules();
      getAnnouncements();
    }
  }, [getAnnouncements, getSessionsSystemRules, token]);

  useEffect(() => {
    if (isSuccessSystemRuleData) {
      dispatch(systemRulesRedux.setSystemRule(systemRuleData as unknown as SystemRuleDataState));
    }
  }, [dispatch, isSuccessSystemRuleData, systemRuleData]);

  useEffect(() => {
    const lastReadDate = dayjs(lastReadTime);
    if (announcementData) {
      const newAnouncements =
        announcementData?.Items?.map((announcement) => {
          const notificationDate = dayjs(announcement?.ReleaseDate);
          return {
            ...announcement,
            IsNew: notificationDate.diff(lastReadDate) > 0 || Number.isNaN(lastReadDate.valueOf()),
          };
        }) || [];
      const newData = {
        ...announcementData,
        Items: [...newAnouncements],
      };
      dispatch(announcementsRedux.setAnnouncements(newData));
    }
  }, [announcementData, dispatch, lastReadTime]);

  const onCloseSideBar = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!token) {
      const haveReturnUrl = () => {
        switch (location.pathname) {
          case '/':
          case '/404':
            return false;
          case '/error-page':
            return false;

          default:
            return true;
        }
      };

      navigate({
        pathname: `/login`,
        search: haveReturnUrl() ? `?returnUrl=${location.pathname}` : location.search,
      });
    }
  }, [location, navigate, token]);

  if (!token) return <FigoLoading />;

  return (
    <>
      <Sidebar isOpenSidebar={open} onCloseSidebar={onCloseSideBar} />

      <Navbar
        onOpenSidebar={() => {
          setOpen(true);
        }}
      />
      <Banner />

      <Box
        sx={{
          ml: open ? `${DRAWER_WIDTH}px` : isDesktop ? `${DRAWER_WIDTH}px` : 0,
          mt: `${APPBAR_HEIGHT}px`,
          pb: 2,
          backgroundColor: '#f5f6fa',
        }}>
        <Outlet />
      </Box>
    </>
  );
}
