const DatPhong = require('../models/DatPhong');
const Karaoke = require('../models/Karaoke');
const User = require('../models/User'); // Giả sử bạn có model User
const mongoose = require('mongoose');


exports.getAllDatPhongs = async (req, res) => {
  const { karaoke_id, trang_thai, from_date, to_date } = req.query;

  if (!karaoke_id) {
    return res.status(400).json({ message: 'karaoke_id is required' });
  }

  try {
    // Tạo điều kiện tìm kiếm
    const query = {};

    if (karaoke_id) {
      query.karaoke_id = new mongoose.Types.ObjectId(karaoke_id); // Dùng new để tạo ObjectId
    }

    if (trang_thai) {
      query.trang_thai = trang_thai; // Lọc theo trạng thái
    }

    if (from_date && to_date) {
      query.thoi_gian_bat_dau = { $gte: new Date(from_date) }; // Ngày bắt đầu từ ngày nào
      query.thoi_gian_ket_thuc = { $lte: new Date(to_date) }; // Ngày kết thúc đến ngày nào
    }

    // Lấy tất cả đặt phòng của quán karaoke
    const bookings = await DatPhong.find(query)
      .populate('karaoke_id', 'ten_quan dia_chi khuyen_mai') // Lấy thông tin quán karaoke + khuyến mãi
      .populate('nguoi_dung_id', 'ho_ten') // Lấy thông tin người dùng
      .exec();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đặt phòng.' });
    }

    // Lọc và ghép thông tin phòng từ mảng 'phong' trong Karaoke
    const bookingDetails = await Promise.all(
      bookings.map(async (booking) => {
        // Lấy thông tin quán karaoke tương ứng với booking
        const karaoke = await Karaoke.findById(booking.karaoke_id);
        const phong = karaoke.phong.find(
          (p) => p._id.toString() === booking.phong_id.toString()
        ); // Lọc phòng từ mảng 'phong' của quán karaoke

        return {
          ...booking.toObject(),
          karaoke_info: {
            ten_quan: karaoke.ten_quan,
            dia_chi: karaoke.dia_chi,
            khuyen_mai: karaoke.khuyen_mai, // Thêm thông tin khuyến mãi
          },
          phong_info: phong, // Thông tin phòng
        };
      })
    );

    res.status(200).json(bookingDetails);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng:', error);
    res.status(500).send({ message: 'Lỗi khi lấy danh sách đặt phòng', error: error.message });
  }
};




// Tạo đặt phòng mới
exports.createDatPhong = async (req, res) => {
  const { karaoke_id, phong_id, nguoi_dung_id } = req.body;

  if (!karaoke_id || !phong_id || !nguoi_dung_id) {
    return res.status(400).json({ message: 'karaoke_id and phong_id are required' });
  }

  try {
    const datPhong = new DatPhong(req.body);
    await datPhong.save();
    res.status(201).json({ message: 'Đặt phòng thành công', datPhong });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateDatPhong = async (req, res) => {
  const { id } = req.params;

  try {
    const datPhong = await DatPhong.findById(id);

    if (!datPhong) {
      return res.status(404).json({ message: "Không tìm thấy đặt phòng" });
    }

    // Danh sách các trường cho phép cập nhật
    const allowedUpdates = ["trang_thai", "ghi_chu", "thoi_gian_bat_dau", "thoi_gian_ket_thuc", "tong_tien"];
    const updates = Object.keys(req.body).filter((key) =>
      allowedUpdates.includes(key)
    );

    // Cập nhật các trường hợp lệ
    updates.forEach((update) => {
      if (update === "thoi_gian_bat_dau" || update === "thoi_gian_ket_thuc") {
        // Kiểm tra giá trị hợp lệ cho thời gian (bắt đầu hoặc kết thúc)
        const newTime = new Date(req.body[update]);
        if (isNaN(newTime.getTime())) {
          throw new Error(`${update} không hợp lệ`);
        }
        datPhong[update] = newTime;
      }
      else {
        datPhong[update] = req.body[update];
      }
    });

    // Lưu lại thông tin đã cập nhật
    await datPhong.save();

    res.status(200).json({
      message: "Cập nhật đặt phòng thành công",
      datPhong,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật đặt phòng:", error);
    res.status(400).send({ message: error.message });
  }
};


exports.updateTongTien = async(req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    const { tong_tien } = req.body; // Lấy tổng tiền từ body

    // Kiểm tra nếu không có tổng tiền
    if (tong_tien == null || isNaN(tong_tien)) {
      return res.status(400).json({ message: 'Tổng tiền không hợp lệ.' });
    }

    // Tìm và cập nhật tài liệu
    const updatedDatPhong = await DatPhong.findByIdAndUpdate(
      id,
      { tong_tien }, // Cập nhật tổng tiền
      { new: true }  // Trả về dữ liệu đã cập nhật
    );

    // Kiểm tra nếu không tìm thấy tài liệu
    if (!updatedDatPhong) {
      return res.status(404).json({ message: 'Không tìm thấy đặt phòng.' });
    }

    // Phản hồi thành công
    res.status(200).json({
      message: 'Cập nhật tổng tiền thành công.',
      data: updatedDatPhong,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật tổng tiền:', error);
    res.status(500).json({ message: 'Lỗi server.', error });
  }
}

// Xóa đặt phòng (chỉ chủ quán liên quan mới có thể xóa)
exports.deleteDatPhong = async (req, res) => {
  const { id } = req.params;
  const { karaoke_id } = req.body;

  if (!karaoke_id) {
    return res.status(400).json({ message: 'karaoke_id is required' });
  }

  try {
    const datPhong = await DatPhong.findById(id);

    if (!datPhong) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (datPhong.karaoke_id !== karaoke_id) {
      return res.status(403).json({ message: 'You do not have permission to delete this booking' });
    }

    await datPhong.remove();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingHistory = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'User ID không hợp lệ.' });
  }

  try {
    // Lấy lịch sử đặt phòng của người dùng
    const bookings = await DatPhong.find({ nguoi_dung_id: new mongoose.Types.ObjectId(userId) })
      .populate('karaoke_id', 'ten_quan dia_chi') // Lấy thông tin quán karaoke
      .exec();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lịch sử đặt phòng.' });
    }

    // Lọc và ghép thông tin phòng từ mảng 'phong' trong Karaoke
    const bookingDetails = await Promise.all(bookings.map(async (booking) => {
      // Tìm phòng trong mảng phòng của Karaoke
      const karaoke = await Karaoke.findById(booking.karaoke_id);
      const phong = karaoke.phong.find(p => p._id.toString() === booking.phong_id.toString());

      return {
        ...booking.toObject(),
        karaoke_info: karaoke, // Thông tin quán karaoke
        phong_info: phong, // Thông tin phòng
      };
    }));

    res.status(200).json(bookingDetails);
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đặt phòng:', error);
    res.status(500).send({ message: 'Lỗi khi lấy lịch sử đặt phòng', error: error.message });
  }
};
