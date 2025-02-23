import express from "express";
import { validationResult } from "express-validator";

import ExpressValidator from "../../Validator";
import HubUtils from "../../../utils/Hub";
import Log from "../../../utils/Log";

import Hub from "../../../mongo/models/Hub";
import State from "../../../mongo/models/State";

const router = express.Router();

router.post("/instance/identify", ExpressValidator.HubIdentifyRoute, async (req:express.Request, res:express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ error: errors.array() });
  }
  
  try {
    // If true, hub misses auth key in order to identify
    // hub_code is necassary otherwise every device that sends his MAC address to this route can identify as a hub
    // This hub_code proves that the caller has the private key
    if((process.env.HUB_CODE as string) !== req.body.hub_code) {
      Log.error("Hub with invalid hub_code tried to identify");
      return res.json({ error: [{msg: "Foutieve Hub code opgegeven."}] });
    }
    // Invalid MAC address provided
    else if(!HubUtils.isValidMAC(req.body.mac_address)) {
      Log.error("Hub with invalid MAC address tried to identify");
      return res.json({ error: [{msg: "Foutief MAC address."}] });
    }

    let hub = await Hub.findOne({mac_address: req.body.mac_address});
    // New hub to identify
    if(!hub) {
      Log.info(`New hub is identified: ${req.body.mac_address}`);
      hub = new Hub({
        mac_address: req.body.mac_address,
        last_ping: Date.now(),
        discovery_info: req.body.discovery_info
      });
      hub.save();
      return res.json("OK");
    }
    //Hub already identified
    else{
      Log.warn(`Hub with MAC address ${req.body.mac_address} is already identified`);
      return res.json({ error: [{msg: "Hub is al geïdentificeerd."}] });
    }
  } catch (error) {
    Log.error(error.message);
    return res.json({ error: [{msg: "Fout opgetreden tijdens het identificeren van hub."}] });
  }
});

router.post("/instance/ping", async (req, res) => {
  try {
    // MAC address or ha_connected not provided
    if(!req.body.mac_address || req.body.ha_connected == undefined) {
      Log.warn("Instance tried to ping without providing a MAC address or ha_connected in body");
      return res.json({
        error: [{msg: "No MAC address or ha_connected included"}],
        code: 1000
      });
    }
    
    const hub = await HubUtils.isIdentified(req.body.mac_address);
    // Hub identified
    if(hub) {
      hub.last_ping = new Date();
      hub.ha_connected = req.body.ha_connected;
      hub.save();
      return res.json("OK");
    }
    else {
      Log.warn(`Instance ${req.body.mac_address} tried to ping but isn't identified`);
      return res.json({
        error: [{msg: "Hub is not identified"}],
        code: 1001
      });
    }
  } catch (error) {
    Log.error(error.message);
    return res.json({ error: [{msg: "An error occured while pinging the hub."}] });
  }
});

router.post("/instance/services", async (req, res) => {
  try {
    if(!req.body.mac_address || !req.body.services) {
      Log.warn("Instance tried to ping without providing a MAC address");
      return res.json({
        error: [{msg: "Not enough data included"}],
        code: 1000
      });
    }

    const hub = await HubUtils.isIdentified(req.body.mac_address);
    // Hub identified
    if(hub) {
      return res.json("OK");
    }
    else {
      Log.warn(`Instance ${req.body.mac_address} tried to upload services but isn't identified`);
      return res.json({
        error: [{msg: "Hub is not identified"}],
        code: 1001
      });
    }

  } catch (error) {
    Log.warn(`Instance ${req.body.mac_address} tried to upload services but isn't allowed: ${error.message}`);
    return res.json({
      error: [{msg: "Uploading services is not allowed"}],
      code: 1002
    });
  }
});

export default router;