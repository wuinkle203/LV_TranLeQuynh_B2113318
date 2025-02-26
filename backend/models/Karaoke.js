const mongoose = require('mongoose');

// Schema cho menu quán karaoke
const MenuSchema = new mongoose.Schema({
  ten_mon: String,           // Tên món ăn/thức uống   
  gia: Number,               // Giá tiền
  mo_ta: String,             // Mô tả món ăn
});

// Schema cho chương trình khuyến mãi
const KhuyenMaiSchema = new mongoose.Schema({
  ten_chuong_trinh: String,
  noi_dung: String,
  ngay_bat_dau: Date,
  ngay_ket_thuc: Date,
  gia_giam: Number
});

// Schema cho phòng karaoke
const PhongSchema = new mongoose.Schema({
  ten_phong: String,
  loai_phong: String,
  suc_chua: Number,
  gia_theo_gio: [{
    gio_bat_dau: { type: String }, 
    gio_ket_thuc: { type: String }, 
    gia: Number
  }],
  trang_thai: { type: String, enum: ['trong', 'dang_su_dung', 'can_bao_tri'], default: 'trong' },
  mo_ta: String,
  hinh_anh: [String]
});


// Schema chính cho quán karaoke
const KaraokeSchema = new mongoose.Schema({
  ten_quan: String,
  dia_chi: String,
  so_dien_thoai: String,
  hinh_anh_quan: String,
  so_phong_trong: Number,
  mo_ta: String,
  giay_phep_kinh_doanh: String, // 🆕 Thêm giấy phép kinh doanh
  chu_so_huu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phong: [PhongSchema],          // Danh sách phòng
  khuyen_mai: [KhuyenMaiSchema],  // Danh sách khuyến mãi
  menu: [MenuSchema]              // 🆕 Danh sách món ăn/thức uống của quán
});

module.exports = mongoose.model('Karaoke', KaraokeSchema);
