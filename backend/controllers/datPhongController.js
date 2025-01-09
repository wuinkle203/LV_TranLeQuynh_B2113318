const DatPhong = require('../models/DatPhong');

// Lấy danh sách đặt phòng
exports.getAllDatPhongs = async (req, res) => {
  try {
    const datPhongs = await DatPhong.find().populate('phong_id karaoke_id nguoi_dung_id');
    res.status(200).json(datPhongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo đặt phòng mới
exports.createDatPhong = async (req, res) => {
  try {
    const datPhong = new DatPhong(req.body);
    await datPhong.save();
    res.status(201).json({ message: 'Booking created successfully', datPhong });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật đặt phòng
exports.updateDatPhong = async (req, res) => {
  try {
    const updatedDatPhong = await DatPhong.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Booking updated successfully', updatedDatPhong });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa đặt phòng
exports.deleteDatPhong = async (req, res) => {
  try {
    await DatPhong.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
