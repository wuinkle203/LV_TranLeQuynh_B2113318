const Users = require("../models/users.model");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
    try {
        const user = await Users.create(req.body);
        res.status(200).json(user);
    } catch (err){
        res.status(500).json({message: `Lỗi! ${err}`});
    }
})

const getAll = asyncHandler(async (req, res) => {
    try {
        const user = await Users.find({});
        res.status(200).json(user);
    } catch {
        res.status(500).json({ message: "Lỗi!" });
    }
})

const getOne = asyncHandler(async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if (!user) {
            res.status(404).json({ message: `Không thể tìm người dùng với id: ${req.params.id}` })
        }
        res.status(200).json(user);
    } catch {
        res.status(500).json({ message: "Lỗi!" });
    }
})


const updateOne = asyncHandler(async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body)
        if (!user) {
            res.status(404).json({ message: `Không thể tìm người dùng với id: ${req.params.id}` })
        }
        res.status(200).json({ message: "Thông tin người dùng đã được cập nhật" });
    } catch {
        res.status(500).json({ message: "Lỗi!" });
    }
})


const updateFavorite = asyncHandler(async (req, res) => {
    try {
        const response = await Users.findByIdAndUpdate(req.params.id, req.body.favorite);
        res.status(200).json({ message: 'Cập nhật yêu thích thành công', response});
    } catch (error) {
        console.error('Lỗi cập nhật yêu thích:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

const updateBorrow = asyncHandler(async (req, res) => {
    try {
        const response = await Users.findByIdAndUpdate(req.params.id, req.body.borrow);
        res.status(200).json({ message: 'Cập nhật mượn sách thành công', response });
    } catch (error) {
        console.error('Cập nhật mượn sách thất bại:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const deleteBookFromBorrow = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const bookIdToDelete = req.params.bookId;

        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        //Giữ lại các sách không bị xoá
        user.borrow = user.borrow.filter((item) => item.bookId.toString() !== bookIdToDelete);
        //Cập nhật lại các sách
        const response = await Users.findByIdAndUpdate(userId, { borrow: user.borrow });

        res.status(200).json({ message: 'Xoá mượn sách thành công', response });
    } catch (error) {
        console.error('Lỗi xoá sách từ trang mượn sách:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const deleteOne = asyncHandler(async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id, req.body)
        if (!user) {
            res.status(404).json({ message: `Không tìm thấy người dùng với ID: ${req.params.id}` })
        }
        res.status(200).json({ message: `Người dùng với ID: ${req.params.id} đã được xoá` });
    } catch {
        res.status(500).json({ message: "Lỗi!" });
    }
})

const deleteAll = asyncHandler(async (req, res) => {
    try {
        const result = await Users.deleteMany({});
        res.status(200).json({message:`Đã xoá ${result.deletedCount} người dùng.`});
    } catch (error) {
        res.status(500);
        throw new Error(error.message)
    }
})

module.exports = {
    createUser,
    getAll,
    getOne,
    updateOne,
    deleteOne,
    deleteAll,
    updateFavorite,
    updateBorrow,
    deleteBookFromBorrow
}