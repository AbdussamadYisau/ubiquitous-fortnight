const express = require("express");
const router = express.Router();
const { requireSignin, userMiddleware, adminMiddleware } = require("../middleware");
require("dotenv/config");
const {
    getInventories,
    createInventory,
    deleteInventory,
    getInventoriesOfUser,
} = require("../controllers/inventories");
const { uploadDoc } = require("../utils");



// @route GET /inventories
router.get("/inventories", requireSignin, userMiddleware, getInventories);

// @route POST /inventories
router.post("/inventories", uploadDoc, requireSignin, userMiddleware, createInventory);

// @route DELETE /inventories/:id
router.delete("/inventories/:id", requireSignin, adminMiddleware, deleteInventory);

// @route GET /inventories/:id
router.get("/inventories/:id", requireSignin, getInventoriesOfUser);

module.exports = router;