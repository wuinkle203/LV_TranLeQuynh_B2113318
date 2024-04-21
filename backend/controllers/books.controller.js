const Books = require("../models/books.model");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const upload = require('../middlewares/upload');
const path = require('path');

const createBook = asyncHandler(async (req, res) => {
    try {
        const book = await Books.create({
            ...req.body,
            image: req.file ? req.file.filename : null
        });
        res.status(200).json({message: 'Thêm sách thành công!', book});
    }
    catch(error) {
        res.status(500).json({message: `Error! ${error}`});
    }
})

const getAll = asyncHandler(async (req, res) =>{
    try {
        const book = await Books.find({});
        res.status(200).json(book);
    } catch(error){
        res.status(500);
        throw new Error(error.message)
    }
})

const getOne = asyncHandler(async (req, res) =>{
    try {
        const book = await Books.findById(req.params.id)
        if(!book){
            res.status(404).json({message: `Không tìm thấy sách với ID: ${req.params.id}` })
        }
        res.status(200).json(book);
    } catch(error){
        res.status(500);
        throw new Error(error.message)
    }
})

const updateOne = asyncHandler(async (req, res) =>{
    try {
        const bookId = req.params.id;
        const existingBook = await Books.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: `Không tìm thấy sách với ID: ${bookId}` });
        }
// Xoá tệp ảnh cũ
        if (req.file) {
            if (existingBook.image) {
                const imagePath = path.join(__dirname, '..', 'uploads', existingBook.image);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Lỗi xoá tệp ảnh: ${err}`);
                    } else {
                        console.log(`Ảnh đã được xoá: ${existingBook.image}`);
                    }
                });
            }
        }

        const data = {
            ...req.body,
            image: req.file ? req.file.filename : existingBook.image
        };
        const book = await Books.findByIdAndUpdate(bookId, data, {new: true})
        if(!book){
            res.status(404).json({message: `Không tìm thấy sách với ID: ${req.params.id}` })
        }
        res.status(200).json({message: "Sách đã được cập nhật"});
    } catch(error) {
        res.status(500);
        throw new Error(error.message)
    }
})


const deleteOne = asyncHandler(async (req, res) =>{
    try {
        const book = await Books.findByIdAndDelete(req.params.id, req.body)
        if(!book){
            res.status(404).json({message: `Không tìm thấy sách với ID: ${req.params.id}` })
        }
        const imagePath = path.join(__dirname, '..', 'uploads', book.image);

        if (book.image) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Lỗi xoá tệp ảnh: ${err}`);
                } else {
                    console.log(`Ảnh đã được xoá: ${product.image}`);
                }
                });
        }
        res.status(200).json({message: `Sách với ID: ${req.params.id} đã được xoá`});
    } catch(error) {
        res.status(500);
        throw new Error(error.message)
    }
})

const deleteAll = asyncHandler(async (req, res) => {
    try {
        const result = await Books.deleteMany({});
        res.status(200).json({message:`Đã xoá ${result.deletedCount} quyển sách.`});
    } catch (error) {
        res.status(500);
        throw new Error(error.message)
    }
})

module.exports = {
    createBook,
    getAll,
    getOne,
    updateOne,
    deleteOne,
    deleteAll,
} 