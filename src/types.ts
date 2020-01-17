/**
 * GET /api/discovery_info
 */
export interface IDiscoveryInfo {
  base_url: string;
  location_name: string;
  requires_api_password: boolean;
  version: string;
}

export enum Weather {
  SUNNY = "sunny",
  RAINY = "rainy"
}