const mongoose = require("mongoose");


const inventorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApplicationUsers",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    category: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    document: {
        type: String,
        required: true,
    },
},
{timestamps: true}
);

module.exports = mongoose.model("Inventory", inventorySchema);