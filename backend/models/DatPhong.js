const mongoose = require('mongoose');

const DatPhongSchema = new mongoose.Schema({
  phong_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Karaoke.phong' },
  karaoke_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Karaoke' },
  nguoi_dung_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thoi_gian_bat_dau: Date,
  thoi_gian_ket_thuc: Date,
  danh_sach_mon_an: [
    {
      mon_an_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Karaoke.menu' },
      ten: String,
      so_luong: Number,
      don_gia: Number,
      thanh_tien: Number,
    }
  ],
  tong_tien: Number,
  trang_thai: { type: String, enum: ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_thanh', 'da_huy'], default: 'cho_xac_nhan' },
  ghi_chu: String,
  danh_sach_gia_theo_gio: [
    {
      gio_bat_dau: { type: Date },
      gio_ket_thuc: { type: Date },
      so_gio: { type: Number }, // Số giờ
      gia_theo_gio: { type: Number } // Giá theo giờ
    }
  ]
});

module.exports = mongoose.model('DatPhong', DatPhongSchema);
