import { IRouteObject } from 'src/router';
import DesignGuide from '.';
import DesignGuidePalette from './Palette';
import DesignGuideButton from './Button';
import DesignGuideAlert from './Alert';
import DesignGuideFont from './Font';
import DesignGuideIcons from './Icons';
import DesignGuideModal from './Modal';
import DesignGuideForm from './Form';
import DesignGuideFilterTabs from './Tabs';
import DesignGuideBreadcrumb from './Breadcrumb';
import DesignGuideMobileBanner from './MobileBanner';
import DesignGuideMobileChart from './Chart';
import DesignGuideFileUpload from './FileUpload';
import DesignGuideLoading from './Loading';
import DesignGuideDrawer from './Drawer';
import DesignGuidePopover from './Popover';
import DesignGuideTable from './Table';
import DesignGuideBadge from './Badge';
import DesignGuideCard from './Card';
import { isProd } from '@helpers';

const DesignGuideRouter: IRouteObject[] = !isProd
  ? [
      {
        path: '',
        element: <DesignGuide />,
      },
      {
        path: 'button',
        element: <DesignGuideButton />,
      },
      {
        path: 'alert',
        element: <DesignGuideAlert />,
      },
      {
        path: 'palette',
        element: <DesignGuidePalette />,
      },
      {
        path: 'font',
        element: <DesignGuideFont />,
      },
      {
        path: 'icon',
        element: <DesignGuideIcons />,
      },
      {
        path: 'modal',
        element: <DesignGuideModal />,
      },
      {
        path: 'form',
        element: <DesignGuideForm />,
      },
      {
        path: 'tabs',
        element: <DesignGuideFilterTabs />,
      },
      {
        path: 'breadcrumb',
        element: <DesignGuideBreadcrumb />,
      },
      {
        path: 'mobile-banner',
        element: <DesignGuideMobileBanner />,
      },
      {
        path: 'chart',
        element: <DesignGuideMobileChart />,
      },
      {
        path: 'file-upload',
        element: <DesignGuideFileUpload />,
      },
      {
        path: 'loading',
        element: <DesignGuideLoading />,
      },
      {
        path: 'drawer',
        element: <DesignGuideDrawer />,
      },
      {
        path: 'popover',
        element: <DesignGuidePopover />,
      },
      {
        path: 'table',
        element: <DesignGuideTable />,
      },
      {
        path: 'badge',
        element: <DesignGuideBadge />,
      },
      {
        path: 'card',
        element: <DesignGuideCard />,
      },
    ]
  : [];

export default DesignGuideRouter;
