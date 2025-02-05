const PhanHoi = require('../models/PhanHoi');
const DanhGia = require('../models/DanhGia');
const { route } = require('../routes/phanHoiRoutes');

exports.addReply = async (req, res) => {
  const { danh_gia_id, noi_dung, nguoi_dung_id } = req.body;

  try {
    // Kiểm tra xem đánh giá có tồn tại không
    const review = await DanhGia.findById(danh_gia_id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Đánh giá không tồn tại' });
    }

    // Tạo phản hồi mới
    const newReply = new PhanHoi({
      danh_gia_id,
      noi_dung,
      nguoi_dung_id,
      karaoke_id: review.karaoke_id, // Tham chiếu tới karaoke từ đánh giá
      phong_id: review.phong_id     // Tham chiếu tới phòng từ đánh giá (nếu có)
    });

    await newReply.save();
    res.status(201).json({ success: true, message: 'Phản hồi đã được thêm', data: newReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi thêm phản hồi' });
  }
};


exports.getReplys = async(req, res) => {
  try {
    const danhGiaId = req.params.danhGiaId;
    const phanHois = await PhanHoi.find({ danh_gia_id: danhGiaId })
      .populate('nguoi_dung_id', 'ho_ten') // Lấy thông tin người dùng phản hồi
      .sort({ ngay_gui: -1 }); // Sắp xếp mới nhất trước

    res.json({ success: true, data: phanHois });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi khi lấy phản hồi!" });
  }
};

exports.deleteReply = async(req, res) => {
  try {
    const { replyId } = req.params;
    const deletedReply = await PhanHoi.findByIdAndDelete(replyId);

    if (!deletedReply) {
      return res.status(404).json({ success: false, message: "Phản hồi không tồn tại" });
    }

    res.json({ success: true, message: "Đã xóa phản hồi thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};