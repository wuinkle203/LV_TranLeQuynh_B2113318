const DanhGia = require('../models/DanhGia');
const Karaoke = require('../models/Karaoke');
const mongoose = require('mongoose');


exports.getAllDanhGias = async (req, res) => {
  const { karaokeId, roomId } = req.params;

  try {
    // Tạo điều kiện tìm kiếm
    const query = {};

    if (karaokeId) {
      query.karaoke_id = new mongoose.Types.ObjectId(karaokeId); // Lọc theo karaoke_id
    }

    if (roomId) {
      query.phong_id = new mongoose.Types.ObjectId(roomId); // Lọc theo phong_id
    }

    // Lấy tất cả đánh giá của phòng trong quán karaoke
    const reviews = await DanhGia.find(query)
      .populate('karaoke_id', 'ten_quan dia_chi') // Lấy thông tin quán karaoke
      .populate('nguoi_dung_id', 'ho_ten') // Lấy thông tin người dùng
      .sort({ ngay_danh_gia: -1 }); // Sắp xếp theo ngày đánh giá mới nhất

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ success: true, message: 'Không tìm thấy đánh giá.' });
    }

    // Lọc thông tin phòng từ mảng 'phong' trong Karaoke
    const reviewsWithRoomInfo = await Promise.all(
      reviews.map(async (review) => {
        const karaoke = await Karaoke.findById(review.karaoke_id); // Lấy thông tin quán karaoke
        const room = karaoke.phong.find(p => p._id.toString() === review.phong_id.toString()); // Lọc phòng từ mảng 'phong'

        return {
          ...review.toObject(),
          phong_info: room, // Thêm thông tin phòng vào kết quả
        };
      })
    );

    // Trả về dữ liệu đã xử lý
    res.status(200).json({
      success: true,
      data: reviewsWithRoomInfo
    });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đánh giá:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đánh giá.',
      error: err.message
    });
  }
};



// Tạo đánh giá mới
const User = require('../models/User'); // Import model User
const nodemailer = require('nodemailer');

// Cấu hình email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "guiphanhoilv@gmail.com", // Email gửi đi
    pass: "jauv opaf efzg deuk" // Mật khẩu ứng dụng
  }
});

const classifyComment = require('../middlewares/sentimentAnalyzer'); // Import hàm AI

exports.createDanhGia = async (req, res) => {
  const { karaokeId, roomId } = req.params;
  const { nguoi_dung_id, noi_dung, so_sao } = req.body;

  try {
    // Phân loại bình luận
    classifyComment(noi_dung, async (sentiment) => {
      console.log("🔍 Kết quả phân loại:", sentiment);

      // Lưu đánh giá vào DB
      const newReview = new DanhGia({
        phong_id: roomId,
        karaoke_id: karaokeId,
        nguoi_dung_id,
        noi_dung,
        so_sao,
      });

      await newReview.save();

    // Nếu đánh giá tiêu cực, gửi thông báo cho chủ quán
    if (sentiment === "negative") {
      const karaoke = await Karaoke.findById(karaokeId);
      if (!karaoke) {
        return res.status(404).json({ success: false, message: "Không tìm thấy quán karaoke." });
      }

      // Tìm thông tin phòng karaoke
      const room = karaoke.phong.find(p => p._id.toString() === roomId);
      const roomName = room ? room.ten_phong : "Không xác định";

      // Tìm email chủ quán từ `chu_so_huu_id`
      const chuQuan = await User.findById(karaoke.chu_so_huu_id).select('email');
      if (!chuQuan) {
        return res.status(404).json({ success: false, message: "Không tìm thấy chủ quán." });
      }

      // Tìm thông tin người đánh giá
      const nguoiDanhGia = await User.findById(nguoi_dung_id).select('email ho_ten');
      if (!nguoiDanhGia) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người đánh giá." });
      }

      // Gửi email cảnh báo
      const mailOptions = {
        from: "guiphanhoilv@gmail.com",
        to: chuQuan.email,
        subject: "🚨 Cảnh báo: Bình luận tiêu cực từ khách hàng",
        text: `Một khách hàng đã để lại đánh giá tiêu cực:\n
        🔹 Nội dung: "${noi_dung}"
        ⭐ Đánh giá: ${so_sao} sao
        🏠 Quán: ${karaoke.ten_quan}
        📍 Địa chỉ: ${karaoke.dia_chi}
        🔢 Phòng: ${roomName}
        👤 Người đánh giá: ${nguoiDanhGia.ho_ten} (${nguoiDanhGia.email})`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Lỗi gửi email:", error);
        } else {
          console.log("📧 Email gửi thành công:", info.response);
        }
      });
    }
      res.status(200).json({ success: true, message: "Đánh giá thành công!" });
    });

  } catch (err) {
    console.error("Lỗi tạo đánh giá:", err);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};


exports.deleteDanhGia = async (req, res) => {
  try {
    const danhGia = await DanhGia.findById(req.params.id);

    if (!danhGia) {
      return res.status(404).json({ success: false, message: 'Đánh giá không tồn tại.' });
    }
    await DanhGia.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Đánh giá đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error); // Log lỗi chi tiết
    return res.status(500).json({ success: false, message: error.message });
  }
};

