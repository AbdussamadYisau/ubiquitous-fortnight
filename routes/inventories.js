const express = require("express");
const router = express.Router();
const { requireSignin, userMiddleware, adminMiddleware } = require("../middleware");
require("dotenv/config");
const {
    getInventories,
    createInventory,
    deleteInventory,
    getInventoriesOfUser,
    searchInventoriesOfUser,
    searchInventories
} = require("../controllers/inventories");
const { uploadDoc } = require("../utils");



// @route GET /inventories
router.get("/inventories", requireSignin, adminMiddleware, getInventories);

// @route POST /inventories
router.post("/inventories", uploadDoc, requireSignin, createInventory);

// @route DELETE /inventories/:id
router.delete("/inventories/:id", requireSignin, adminMiddleware, deleteInventory);

// @route GET /inventories/:id
router.get("/inventories/:id", requireSignin, getInventoriesOfUser);

// @route GET /inventories/search/:id
router.get("/inventories/search/:id", requireSignin, searchInventoriesOfUser);

// @route GET /inventories/searchInventory
router.get("/searchInventory", requireSignin, searchInventories);


module.exports = router;