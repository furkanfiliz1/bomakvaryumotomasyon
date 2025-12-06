// Icon.tsx
import IcoMoon, { IconProps } from 'react-icomoon';
import iconSet from 'selection.json';
import { IconTypes } from './types';

interface IIconProps extends IconProps {
  icon: keyof typeof IconTypes;
}

const Icon = (props: IIconProps) => <IcoMoon iconSet={iconSet} {...props} />;

export default Icon;
