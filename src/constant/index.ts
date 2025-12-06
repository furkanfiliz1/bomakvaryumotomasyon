const isProd = process.env.REACT_APP_ENV_NAME === 'production';
const isQA = process.env.REACT_APP_ENV_NAME === 'qa';

export const HUMAN_READABLE_DATE = 'DD.MM.YYYY';
export const HUMAN_READABLE_CLOCK = 'HH:mm:ss';

export const HUMAN_READABLE_DATE_TIME = 'DD.MM.YYYY HH:mm:ss';
export const RESPONSE_DATE = 'YYYY-MM-DD';

export const FIBABANK_IDENTIFIER = '2090007808';

export const DIA_ENTEGRATOR_IDENTIFIER = 37;

export const ISBANK_FINANCER_ID = (() => {
  if (isProd) return 16422;
  if (isQA) return 6781;
  return 12901;
})();

export const FIBABANKA_FINANCER_ID = (() => {
  if (isProd) return 185;
  if (isQA) return 446;
  return 446;
})();

export const INITIAL_TABLE_PAGE_SIZE = 100;

export const FIGOSKOR_CREDIT_OPT_URL = 'figo-skor/credit-operations';
export const FIGOSKOR_FINANCIAL_PERFORMANCE = 'figo-skor/financial-performance';

export const FIGOPARA_HELP_DESK_LINK =
  'https://efinansman.atlassian.net/servicedesk/customer/portal/5/group/21/create/80';

export const FIGOSKOR_QUERY_FEE = 1;

export const FIGOSKOR_FOLLOW_FEE = 3;

export const FIGOSKOR_FINDEKS_FEE = 2;

export const FIGOSKOR_SUBSCRITION_TIME = 'Ay';

export const FIGOSKOR_KDV_RATE = 20;

export const PRIVATE_COMPANY_VKN_LENGTH = 11;

export const ITO = 'ito';

export const SICIL = 'sicil';

export const MONTHS = [
  { id: 1, name: 'Ocak' },
  { id: 2, name: 'Şubat' },
  { id: 3, name: 'Mart' },
  { id: 4, name: 'Nisan' },
  { id: 5, name: 'Mayıs' },
  { id: 6, name: 'Haziran' },
  { id: 7, name: 'Temmuz' },
  { id: 8, name: 'Ağustos' },
  { id: 9, name: 'Eylül' },
  { id: 10, name: 'Ekim' },
  { id: 11, name: 'Kasım' },
  { id: 12, name: 'Aralık' },
];
