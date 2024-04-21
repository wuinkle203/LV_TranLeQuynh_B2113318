const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    //Vị trí lưu ảnh
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../uploads/'));
    },
    //Tên file ảnh
    filename: (req, file, callback) => {
        const filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    },
})

//Lưu loại ảnh
const fileFilter = (req, file, callback) => {
    const allowedMimes = ['image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Chỉ cho phép lưu dạng PNG hoặc JPEG.'), false);
    }
};

//Giới hạn dung lượng
const limits = {
    fileSize: 1024 * 1024 * 5,
};

const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
});

module.exports = upload;