import { Users, ArrowLeftRight, LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Employees',
    href: '/employees',
    icon: Users,
  },
  {
    label: 'Movement',
    href: '/employee-list',
    icon: ArrowLeftRight,
  },
];
