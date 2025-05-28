export interface NavItem {
  route: string;
  label: string;
  icon?: string;
  sideNavItems?: NavItem[];
}
