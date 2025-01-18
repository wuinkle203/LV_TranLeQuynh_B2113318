const mongoose = require('mongoose');

const DanhGiaSchema = new mongoose.Schema({
  karaoke_id: { type: String, ref: 'Karaoke' },
  nguoi_dung_id: { type: String, ref: 'User' },
  noi_dung: String,
  so_sao: { type: Number, min: 1, max: 5, required: true },
  ngay_danh_gia: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DanhGia', DanhGiaSchema);
