import { isMAC } from "getmac";

// eslint-disable-next-line no-unused-vars
import Hub, { IHubModel } from "../mongo/models/Hub";
import LogUtils from "./Log";

export default class HubUtils {
  /**
   * Check if a valid MAC address is provided
   * @param address MAC colon(:) style address
   */
  public static isValidMAC(address: string): boolean {
    return isMAC(address);
  }

  /**
   * Check if hub has been identified
   * @param mac_address MAC address
   */
  public static async isIdentified(mac_address:string): Promise<IHubModel | undefined> {
    try {
      const hub = await Hub.findOne({mac_address: mac_address});
      if(this.isValidMAC(mac_address) && hub) {
        return hub;
      }
      return undefined;
    } catch (error) {
      LogUtils.error(error.message);
      return undefined;
    }
  }
}