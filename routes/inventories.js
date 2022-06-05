const express = require("express");
const router = express.Router();
const { requireSignin, userMiddleware, adminMiddleware } = require("../middleware");
require("dotenv/config");
const {
    getInventories,
    createInventory,
} = require("../controllers/inventories");
const { uploadDoc } = require("../utils");



// @route GET /inventories
router.get("/inventories", requireSignin, userMiddleware, getInventories);

// @route POST /inventories
router.post("/inventories", uploadDoc, requireSignin, userMiddleware, createInventory);


module.exports = router;