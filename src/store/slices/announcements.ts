import { createSlice } from '@reduxjs/toolkit';
import { AnnouncementSearchResponseModel } from '@store';
import { Dayjs } from 'dayjs';

export interface IAnnouncements {
  announcements: AnnouncementSearchResponseModel | undefined;
  lastReadTime: Dayjs | null;
}

const initialState: IAnnouncements = {
  announcements: undefined,
  lastReadTime: null,
};

const announcementsSlice = createSlice({
  name: 'announcementsSlice',
  initialState,
  reducers: {
    setAnnouncements: (state, action: { payload: AnnouncementSearchResponseModel }) => {
      state.announcements = action.payload;
    },
    setLastReadTime: (state, action: { payload: Dayjs | null }) => {
      state.lastReadTime = action.payload;
    },
  },
});

const { actions, reducer } = announcementsSlice;
export const { setAnnouncements, setLastReadTime } = actions;

export default reducer;
