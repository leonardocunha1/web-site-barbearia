/**
 * Account feature types
 */

export interface DashboardTab {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface DashboardLayoutProps {
  title: string;
  iconGroup?: React.ReactNode;
  tabs: DashboardTab[];
}
