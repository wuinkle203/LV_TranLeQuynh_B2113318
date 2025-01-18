const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// Schema cho lịch sử hoạt động của người dùng
const LichSuHoatDongSchema = new mongoose.Schema({
  hoat_dong: String,
  thoi_gian: Date
});

// Schema cho người dùng
const UserSchema = new mongoose.Schema({
  ho_ten: { type: String, default: "" },
  email: { type: String, default: "" },
  user_name: { type: String, required: true, unique: true, trim: true },
  mat_khau: { type: String, required: true },
  so_dien_thoai: { type: String, default: "" },
  dia_chi: { type: String, default: "" },
  vai_tro: { type: String, enum: ['chu_quan', 'khach_hang'], required: true},
  lich_su_hoat_dong: [LichSuHoatDongSchema]
});

module.exports = mongoose.model('User', UserSchema);
