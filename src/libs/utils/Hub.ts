import { isMAC } from "getmac";

// eslint-disable-next-line no-unused-vars
import Hub, { IHubModel } from "../mongo/models/Hub";

export default class HubUtils {
  public static isValidMAC(address: string): boolean {
    return isMAC(address);
  }

  public static async isIdentified(mac_address:string): Promise<IHubModel | undefined> {
    const hub = await Hub.findOne({mac_address: mac_address});
    if(this.isValidMAC(mac_address) && hub) {
      return hub;
    }
    return undefined;
  }
}