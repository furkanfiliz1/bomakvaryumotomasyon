import { MouseEventHandler, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Grid, IconButton, Typography, styled, useTheme } from '@mui/material';

import { Icon, MenuPopover } from '@components';

import { IconTypes } from 'src/components/common/Icon/types';
import { useAppSelector, useResponsive } from '@hooks';
import dayjs from 'dayjs';
import { AnnouncementSearchResponseModel, announcementsRedux } from '@store';
import { useDispatch } from 'react-redux';

type Icon = keyof typeof IconTypes;

export default function AnnouncementsPopover() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const smDown = useResponsive('down', 'sm');

  const anchorRef = useRef(null);

  const [open, setOpen] = useState<Element | null>(null);

  const announcementsData = useAppSelector(
    (state) => state.announcements.announcements as AnnouncementSearchResponseModel,
  );
  const isThereAnyAnnouncement = announcementsData && announcementsData?.Items && announcementsData?.Items?.length > 0;
  const isThereAnyNewAnnouncements =
    announcementsData &&
    announcementsData?.Items &&
    announcementsData?.Items?.filter((announcement) => announcement.IsNew);

  const handleOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
    setOpen(e.currentTarget);
  };

  const handleClose = () => {
    const today = dayjs();
    setOpen(null);
    dispatch(announcementsRedux.setLastReadTime(today));
  };

  const BadgeBox = styled(Box)(({ theme }) => ({
    ':after': {
      content: '""',
      width: '10px',
      height: '10px',
      background: theme.palette.primary[700],
      position: 'absolute',
      borderRadius: '50%',
      right: '2px',
      top: '2px',
    },
  }));

  const NewAnnouncementsBox = styled(Box)(({ theme }) => ({
    ':before': {
      content: '""',
      width: '10px',
      height: '10px',
      background: theme.palette.primary[700],
      position: 'absolute',
      borderRadius: '50%',
      left: '-10px',
      top: '7px',
    },
  }));

  return (
    <>
      <Box sx={{ borderRight: `1px solid${theme.palette.grey.A300}` }}>
        <IconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{ mr: 2, position: 'relative', padding: '6px' }}
          id="announcement">
          {isThereAnyNewAnnouncements && isThereAnyNewAnnouncements?.length > 0 ? <BadgeBox /> : null}
          <Icon icon="announcement-01" size={24} color={open ? theme.palette.primary[700] : 'default'} />
        </IconButton>
      </Box>

      <MenuPopover open={Boolean(open)} anchorEl={open} onClose={handleClose}>
        <Box sx={{ width: smDown ? '100%' : '520px' }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="body1" sx={{ fontSize: '20px', fontWeight: 500 }}>
                Duyurular
              </Typography>

              {isThereAnyAnnouncement ? (
                <Box sx={{ display: 'flex' }}>
                  <IconButton
                    onClick={() => window.open(`${window.location.origin}/announcements`)}
                    sx={{ ml: 2 }}
                    id="linkExternal">
                    <Icon icon="link-external-02" size={20} />
                  </IconButton>
                </Box>
              ) : null}
            </Box>
          </Box>

          <Divider />

          {isThereAnyAnnouncement ? (
            announcementsData?.Items?.slice(0, 4).map((announcement) => {
              const description = { __html: announcement?.Content || '' };
              const date = dayjs(announcement?.ReleaseDate).format('DD.MM.YYYY');
              return (
                <>
                  <Grid
                    container
                    key={announcement.Id}
                    alignItems="center"
                    sx={{
                      padding: '24px',
                      backgroundColor: announcement.IsNew ? '#F5F6FA' : 'white',
                    }}>
                    <Grid item lg={12} position="relative">
                      {announcement.IsNew ? <NewAnnouncementsBox /> : null}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item lg={10}>
                          <Typography sx={{ px: 1, fontWeight: 'bold', wordBreak: 'break-word' }}>
                            {announcement?.Title}
                          </Typography>
                        </Grid>
                        <Grid item lg={2}>
                          <Typography variant="body5" sx={{ px: 1 }}>
                            {date}
                          </Typography>
                        </Grid>
                      </Box>
                      <Box sx={{ px: 1, wordBreak: 'break-word' }}>
                        <div dangerouslySetInnerHTML={description} />
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              );
            })
          ) : (
            <>
              <Grid container alignItems="center" sx={{ p: 2 }}>
                <Grid item lg={12}>
                  <Box>
                    <Typography variant="body5">Duyuru bulunamadı</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider />
            </>
          )}

          {isThereAnyAnnouncement ? (
            <Grid container alignItems="center" sx={{ p: 2 }}>
              <Grid item lg={12}>
                <Box
                  onClick={() => {
                    handleClose();
                    navigate('/announcements');
                  }}>
                  <Typography variant="button" color={theme.palette.primary[700]} sx={{ cursor: 'pointer' }}>
                    Hepsini Gör
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : null}
        </Box>
      </MenuPopover>
    </>
  );
}
