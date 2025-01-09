const PhanHoi = require('../models/PhanHoi');

// Lấy danh sách phản hồi
exports.getAllPhanHois = async (req, res) => {
  try {
    const phanHois = await PhanHoi.find().populate('karaoke_id nguoi_dung_id');
    res.status(200).json(phanHois);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo phản hồi mới
exports.createPhanHoi = async (req, res) => {
  try {
    const phanHoi = new PhanHoi(req.body);
    await phanHoi.save();
    res.status(201).json({ message: 'Feedback created successfully', phanHoi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa phản hồi
exports.deletePhanHoi = async (req, res) => {
  try {
    await PhanHoi.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
