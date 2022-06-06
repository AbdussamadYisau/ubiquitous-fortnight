const InventoriesModel = require('../models/inventories');
require("dotenv/config");





// @route  POST api/inventories
// @desc   Create a new inventory
// @access Private
exports.createInventory = async (req, res, next) => {
    const {
        name,
        description,
        category,
    } = req.body;

    if(!req.file) {
        return res.status(400).json({
            msg: 'Please upload a file'
        })
    } else {
        try {
            const document = req.file.path;

            let inventoryCheck = await InventoriesModel.find({
                name,
                description,
                category
            })

            if(inventoryCheck) {
                return res.status(400).json({
                    status: "Failed",
                    statusCode: 0,
                    message: "Inventory with this name already exists",
                  });
            }

            else {
                const newInventory = new InventoriesModel({
                    name,
                    description,
                    category,
                    document,
                });
        
                await newInventory.save()
                    .then(() => {
                        res.status(201).json({
                            msg: 'Inventory created successfully'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            msg: 'Error occured'
                        })
                    })
            }
        } catch(error) {
            return res.status(500).json({
                status: "Failed",
                statusCode: 0,
                message: "There was an error with this request",
                error: `${error.message}`,
              });
        }
        
        
    };

};

// @route  GET api/inventories
// @desc   Get all inventories
// @access Private
exports.getInventories = async (req, res, next) => {
    await InventoriesModel.find()
        .then(inventories => {
            res.status(200).json({
                inventories
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Error occured'
            })
        })
};

