const Infos = require("../models/info.model");
const asyncHandler = require('express-async-handler');

const recieveInfo = asyncHandler(async(req, res) => {
    try {
        const info = await Infos.create(req.body)
        res.status(200).json({message: 'Thông tin đã được gửi', info});
    } catch(error) {
        res.status(500).json({error: error.message});
    }
})

const getAllInfo = asyncHandler(async (req, res) => {
    try {
        const info = await Infos.find({})
        res.status(200).json(info);
    } catch {
        res.status(500).json({ massage: "Lỗi!" });
    }
})

module.exports = {
    recieveInfo,
    getAllInfo
}