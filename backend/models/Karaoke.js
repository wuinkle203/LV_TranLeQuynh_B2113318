const mongoose = require('mongoose');

const KhuyenMaiSchema = new mongoose.Schema({
  // _id: String,
  ten_chuong_trinh: String,
  noi_dung: String,
  ngay_bat_dau: Date,
  ngay_ket_thuc: Date,
  gia_giam: Number
});

const PhongSchema = new mongoose.Schema({
  // _id: String,
  ten_phong: String,
  loai_phong: String,
  suc_chua: Number,
  gia_theo_gio: Number,
  trang_thai: { type: String, enum: ['trong', 'dang_su_dung', 'can_bao_tri'], default: 'trong' },
  mo_ta: String,
  hinh_anh: [String],
});

const KaraokeSchema = new mongoose.Schema({
  // _id: String,
  ten_quan: String,
  dia_chi: String,
  so_dien_thoai: String,
  hinh_anh_quan: String,
  mo_ta: String,
  chu_so_huu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phong: [PhongSchema],
  khuyen_mai: [KhuyenMaiSchema]
});

module.exports = mongoose.model('Karaoke', KaraokeSchema);
