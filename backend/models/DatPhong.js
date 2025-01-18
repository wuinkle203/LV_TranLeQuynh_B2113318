const mongoose = require('mongoose');

const DatPhongSchema = new mongoose.Schema({
  phong_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Karaoke.phong' },  // Tham chiếu đến phòng trong Karaoke
  karaoke_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Karaoke' }, // Tham chiếu đến quán karaoke
  nguoi_dung_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tham chiếu đến người dùng
  thoi_gian_bat_dau: Date,
  thoi_gian_ket_thuc: Date,
  tong_tien: Number,
  trang_thai: { type: String, enum: ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_thanh', 'da_huy'], default: 'cho_xac_nhan' },
  ghi_chu: String
});

module.exports = mongoose.model('DatPhong', DatPhongSchema);
