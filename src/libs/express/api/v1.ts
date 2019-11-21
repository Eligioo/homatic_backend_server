import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.cookies)
  res.send("200 OK");
});

export default router;