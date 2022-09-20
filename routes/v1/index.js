const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const router = express.Router();
const authRoutes = require("./auth");
const eventRoutes = require("./event");

router.use("/auth", authRoutes)
router.use("/event", verifyToken, eventRoutes)

module.exports = router