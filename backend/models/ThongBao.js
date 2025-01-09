const mongoose = require('mongoose');

const ThongBaoSchema = new mongoose.Schema({
  // _id: String,
  karaoke_id: { type: String, ref: 'Karaoke' },
  tieu_de: String,
  noi_dung: String,
  ngay_gui: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ThongBao', ThongBaoSchema);
