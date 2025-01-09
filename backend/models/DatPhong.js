const mongoose = require('mongoose');

const DatPhongSchema = new mongoose.Schema({
  // _id: String,
  phong_id: { type: String, ref: 'Karaoke' },
  karaoke_id: { type: String, ref: 'Karaoke' },
  nguoi_dung_id: { type: String, ref: 'User' },
  thoi_gian_bat_dau: Date,
  thoi_gian_ket_thuc: Date,
  tong_tien: Number,
  trang_thai: { type: String, enum: ['da_dat', 'huy', 'da_hoan_thanh'], default: 'da_dat' },
  ghi_chu: String
});

module.exports = mongoose.model('DatPhong', DatPhongSchema);
