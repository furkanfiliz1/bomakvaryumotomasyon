import { createSlice } from '@reduxjs/toolkit';

export interface SystemRuleDataState {
  bulk_credıt_enable: boolean;
  max_ınvoıce_count: number;
  max_ınvoıce_group_count: number;
  test_strıng: string;
  flag_lıst_enable: boolean;
  dıgıtal_asset_enable: boolean;
  spotloan_is_active: boolean;
  show_fıgo_score_coupon: boolean;
  show_dashboard_company_score: boolean;
}

interface SystemRuleState {
  data: SystemRuleDataState;
  showRequrimentDocument: boolean;
}

export const initialState: SystemRuleState = {
  data: {
    bulk_credıt_enable: false,
    max_ınvoıce_count: 0,
    max_ınvoıce_group_count: 0,
    test_strıng: '',
    flag_lıst_enable: false,
    dıgıtal_asset_enable: false,
    spotloan_is_active: false,
    show_fıgo_score_coupon: false,
    show_dashboard_company_score: false,
  },
  showRequrimentDocument: false,
};

const systemRuleSlice = createSlice({
  name: 'systemRuleSlice',
  initialState,
  reducers: {
    setSystemRule: (state, action) => {
      state.data = {
        ...action.payload,
        bulk_credıt_enable: JSON.parse(action?.payload?.bulk_credıt_enable?.toLowerCase() || 'false'),
        flag_lıst_enable: JSON.parse(action?.payload?.flag_lıst_enable?.toLowerCase() || 'false'),
        dıgıtal_asset_enable: JSON.parse(action?.payload?.dıgıtal_asset_enable?.toLowerCase() || 'false'),
        spotloan_is_active: JSON.parse(action?.payload?.spotloan_is_active?.toLowerCase() || 'false'),
        show_fıgo_score_coupon: JSON.parse(action?.payload?.show_fıgo_score_coupon?.toLowerCase() || 'false'),
        show_dashboard_company_score: JSON.parse(
          action?.payload?.show_dashboard_company_score?.toLowerCase() || 'false',
        ),
      };
    },
    setShowRequrimentDocument: (state, action) => {
      state.showRequrimentDocument = action.payload;
    },
  },
});

const { actions, reducer } = systemRuleSlice;
export const { setSystemRule, setShowRequrimentDocument } = actions;

export default reducer;
