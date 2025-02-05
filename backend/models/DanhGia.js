const mongoose = require('mongoose');

const DanhGiaSchema = new mongoose.Schema({
  phong_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Karaoke.phong' },  
  karaoke_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Karaoke' },
  nguoi_dung_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  noi_dung: String,
  so_sao: { type: Number, min: 1, max: 5, required: true },
  ngay_danh_gia: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DanhGia', DanhGiaSchema);
