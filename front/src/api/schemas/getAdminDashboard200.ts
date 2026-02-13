import type { GetAdminDashboard200Metrics } from "./getAdminDashboard200Metrics";
import type { GetAdminDashboard200TopProfessionalsItem } from "./getAdminDashboard200TopProfessionalsItem";
import type { GetAdminDashboard200TopServicesItem } from "./getAdminDashboard200TopServicesItem";
import type { GetAdminDashboard200Financial } from "./getAdminDashboard200Financial";

export type GetAdminDashboard200 = {
  metrics: GetAdminDashboard200Metrics;
  /** @maxItems 3 */
  topProfessionals: GetAdminDashboard200TopProfessionalsItem[];
  /** @maxItems 3 */
  topServices: GetAdminDashboard200TopServicesItem[];
  financial: GetAdminDashboard200Financial;
};
