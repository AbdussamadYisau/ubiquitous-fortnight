const InventoriesModel = require("../models/inventories");
require("dotenv/config");

// @route  POST api/inventories
// @desc   Create a new inventory
// @access Private
exports.createInventory = async (req, res, next) => {
  const { name, description, category } = req.body;

  if (!req.file) {
    return res.status(400).json({
      msg: "Please upload a file",
    });
  } else {
    try {
      const document = req.file.path;

      let inventoryCheck = await InventoriesModel.find({
        name,
        description,
        category,
      });

      if (inventoryCheck.length > 0) {
        return res.status(400).json({
          status: "Failed",
          statusCode: 0,
          message: "Inventory with this name already exists",
        });
      } else {
        const newInventory = new InventoriesModel({
          user: req.user._id,
          name,
          description,
          category,
          document,
        });

        await newInventory
          .save()
          .then(() => {
            res.status(201).json({
              msg: "Inventory created successfully",
              data: newInventory,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "Error occured",
            });
          });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Failed",
        statusCode: 0,
        message: "There was an error with this request",
        error: `${error.message}`,
      });
    }
  }
};

// @route  GET api/inventories
// @desc   Get all inventories
// @access Private
exports.getInventories = async (req, res, next) => {
  try {
    const Inventories = await InventoriesModel.find().populate(
      "user",
      "_id fullname email role psnNumber localGovernmentArea ministry dateOfFirstAssignment lastPromotionDate "
    );
    if (Inventories.length > 0) {
      res.status(200).json({
        status: "Success",
        statusCode: 1,
        message: "Inventories retrieved successfully",
        data: Inventories,
      });
    } else {
      res.status(404).json({
        msg: "No inventories found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      statusCode: 0,
      message: "There was an error with this request",
      error: `${error.message}`,
    });
  }
};

exports.deleteInventory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const inventory = await InventoriesModel.findById(id);
    console.log(inventory);
    if (!inventory) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 0,
        message: "Inventory not found",
      });
    } else {
      await InventoriesModel.findByIdAndDelete(id);
      return res.status(200).json({
        status: "Success",
        statusCode: 1,
        message: "Inventory deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      statusCode: 0,
      message: "There was an error with this request",
      error: `${error.message}`,
    });
  }
}
