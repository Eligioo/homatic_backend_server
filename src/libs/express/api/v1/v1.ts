import express from "express";

import HubRoutes from "./Hub";
import PortalRoutes from "./Portal";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("200 OK");
});

// Prefix routes for Homatic Portal with /portal
router.use("/portal", PortalRoutes);

// Prefix routes for hubs with /hub
router.use("/hub", HubRoutes);

export default router;