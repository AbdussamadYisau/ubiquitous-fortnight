const InventoriesModel = require("../models/inventories");
require("dotenv/config");

// @route  POST api/inventories
// @desc   Create a new inventory
// @access Private
exports.createInventory = async (req, res, next) => {
  const { name, description, category, psnNumber } = req.body;

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
        psnNumber
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
          psnNumber
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
    const limitValue = parseInt(req.query.limit) || 10;
    const skipValue = parseInt(req.query.page) || 1;

    //  Find total number of inventories
    const totalInventories = await InventoriesModel.find({});
    const totalInventoriesCount = totalInventories.length;
    const totalPages = Math.ceil(totalInventoriesCount / limitValue);

    InventoriesModel.find().populate(
      "user",
      "_id fullname email role psnNumber localGovernmentArea ministry dateOfFirstAssignment lastPromotionDate "
    )
    .skip(limitValue * ( skipValue - 1))
    .limit(limitValue)
    .exec()
    .then((data) => {

      if (data.length > 0) {
        return res.status(200).json({
          status: "Success",
          statusCode: 1,
          message: "Inventories retrieved successfully",
          page: skipValue,
          size: limitValue,
          totalPages,
          data: data,
        });
      } else {
        return res.status(404).json({
          msg: "No inventories found",
        });
      }
    });
   
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

// @route  GET all inventories of a user
// @desc   Get all inventories of a user
// @access Private
exports.getInventoriesOfUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const limitValue = parseInt(req.query.limit) || 10;
    const skipValue = parseInt(req.query.page) || 1;

    //  Find total number of inventories
    const totalInventories = await InventoriesModel.find({user: id});
    const totalInventoriesCount = totalInventories.length;

    const totalPages = Math.ceil(totalInventoriesCount / limitValue);

    InventoriesModel.find({user:id}).populate(
      "user",
      "_id fullname email role psnNumber localGovernmentArea ministry dateOfFirstAssignment lastPromotionDate "
    )
    .skip(limitValue * ( skipValue - 1))
    .limit(limitValue)
    .exec()
    .then((data) => {

      if (data.length > 0) {
        return res.status(200).json({
          status: "Success",
          statusCode: 1,
          message: "Inventories retrieved successfully",
          page: skipValue,
          size: limitValue,
          totalPages,
          data: data,
        });
      } else {
        return res.status(404).json({
          msg: "No inventories found",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      statusCode: 0,
      message: "There was an error with this request",
      error: `${error.message}`,
    });
  }
}

// search inventories by psnNumber
exports.searchInventories = async (req, res, next) => {
  const { psnNumber } = req.query;
  try {
    const limitValue = parseInt(req.query.limit) || 10;
    const skipValue = parseInt(req.query.page) || 1;
  
    //  Find total number of inventories
    const totalInventories = await InventoriesModel.find({psnNumber});
    const totalInventoriesCount = totalInventories.length;
  
    const totalPages = Math.ceil(totalInventoriesCount / limitValue);
  
    InventoriesModel.find({ psnNumber }).populate(
      "user",
      "_id fullname email role psnNumber localGovernmentArea ministry dateOfFirstAssignment lastPromotionDate "
    )
    .skip(limitValue * ( skipValue - 1))
    .limit(limitValue)
    .exec()
    .then((data) => {
  
      if (data.length > 0) {
        return res.status(200).json({
          status: "Success",
          statusCode: 1,
          message: "Inventories retrieved successfully",
          page: skipValue,
          size: limitValue,
          totalPages,
          data: data,
        });
      } else {
        return res.status(404).json({
          msg: "No inventories found",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      statusCode: 0,
      message: "There was an error with this request",
      error: `${error.message}`,
    });
  }
};

// search inventories of a user by psnNumber
exports.searchInventoriesOfUser = async (req, res, next) => {
  const { id } = req.params;
  const { psnNumber } = req.query;
  try {
  const limitValue = parseInt(req.query.limit) || 10;
  const skipValue = parseInt(req.query.page) || 1;

  //  Find total number of inventories
  const totalInventories = await InventoriesModel.find({user: id, psnNumber});
  const totalInventoriesCount = totalInventories.length;

  const totalPages = Math.ceil(totalInventoriesCount / limitValue);

  InventoriesModel.find({user:id, psnNumber}).populate(
    "user",
    "_id fullname email role psnNumber localGovernmentArea ministry dateOfFirstAssignment lastPromotionDate "
  )
  .skip(limitValue * ( skipValue - 1))
  .limit(limitValue)
  .exec()
  .then((data) => {

    if (data.length > 0) {
      return res.status(200).json({
        status: "Success",
        statusCode: 1,
        message: "Inventories retrieved successfully",
        page: skipValue,
        size: limitValue,
        totalPages,
        data: data,
      });
    } else {
      return res.status(404).json({
        msg: "No inventories found",
      });
    }
  });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      statusCode: 0,
      message: "There was an error with this request",
      error: `${error.message}`,
    });
  }
};
