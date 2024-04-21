const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/quanlymuonsach");
        console.log("Đã kết nối đến MongoDB");
    } catch (error) {
        console.error("Xảy ra lỗi khi kết nối đến MongoDB:", error);
        process.exit(1);
    }
};

module.exports = { connect: connectDB };