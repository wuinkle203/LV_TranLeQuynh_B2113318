const mongoose = require('mongoose');

const PhanHoiSchema = new mongoose.Schema({
  // _id: String,
  karaoke_id: { type: String, ref: 'Karaoke' },
  nguoi_dung_id: { type: String, ref: 'User' },
  noi_dung: String,
  ngay_gui: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhanHoi', PhanHoiSchema);
