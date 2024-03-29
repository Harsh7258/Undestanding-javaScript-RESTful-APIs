const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Error message']
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;