const DanhGia = require('../models/DanhGia');

// Lấy danh sách đánh giá
exports.getAllDanhGias = async (req, res) => {
  try {
    const danhGias = await DanhGia.find().populate('karaoke_id nguoi_dung_id');
    res.status(200).json(danhGias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo đánh giá mới
exports.createDanhGia = async (req, res) => {
  try {
    const danhGia = new DanhGia(req.body);
    await danhGia.save();
    res.status(201).json({ message: 'Review created successfully', danhGia });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa đánh giá
exports.deleteDanhGia = async (req, res) => {
  try {
    await DanhGia.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
