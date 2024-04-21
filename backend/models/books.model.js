const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Nhập tên của quyển sách"],
            unique: true,
        },

        author: {
            type: String,
            required: true,
        },

        year: {
            type: Number,
        },

        image: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
            min: [0, "Nhập giá của quyển sách"],
        },

        summary: {
            type: String,
        },

        quantity: {
            type: Number,
            required:true,
        },
    },

    {
        timestamps: true
    }
)

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;