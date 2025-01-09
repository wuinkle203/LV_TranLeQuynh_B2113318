const ThongBao = require('../models/ThongBao');

// Lấy danh sách thông báo
exports.getAllThongBaos = async (req, res) => {
  try {
    const thongBaos = await ThongBao.find().populate('karaoke_id');
    res.status(200).json(thongBaos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo thông báo mới
exports.createThongBao = async (req, res) => {
  try {
    const thongBao = new ThongBao(req.body);
    await thongBao.save();
    res.status(201).json({ message: 'Notification created successfully', thongBao });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa thông báo
exports.deleteThongBao = async (req, res) => {
  try {
    await ThongBao.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
