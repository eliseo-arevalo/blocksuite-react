import { icons, type IconName } from '@shared/icons/icon-registry';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size = 16, className = '' }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent size={size} className={className} />;
};
