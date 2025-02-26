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
      .populate('karaoke_id', 'ten_quan dia_chi khuyen_mai menu') // Lấy thông tin quán karaoke + khuyến mãi
      .populate('nguoi_dung_id', 'ho_ten') // Lấy thông tin người dùng
      .exec();

    // if (!bookings || bookings.length === 0) {
    //   return res.status(404).json({ message: 'Không tìm thấy đặt phòng.' });
    // }

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
            menu: karaoke.menu,
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


exports.updateTongTien = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    const { tong_tien, danh_sach_gia_theo_gio } = req.body; // Lấy tổng tiền và danh sách giá theo giờ từ body

    // Kiểm tra nếu không có tổng tiền
    if (tong_tien == null || isNaN(tong_tien)) {
      return res.status(400).json({ message: 'Tổng tiền không hợp lệ.' });
    }

    // Kiểm tra nếu không có danh sách giá theo giờ
    if (!Array.isArray(danh_sach_gia_theo_gio) || danh_sach_gia_theo_gio.length === 0) {
      return res.status(400).json({ message: 'Danh sách giá theo giờ không hợp lệ.' });
    }

    // Tìm và cập nhật tài liệu
    const updatedDatPhong = await DatPhong.findByIdAndUpdate(
      id,
      { tong_tien, danh_sach_gia_theo_gio }, // Cập nhật tổng tiền và danh sách giá theo giờ
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
};

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
      .populate('karaoke_id', 'ten_quan dia_chi menu') // Lấy thông tin quán karaoke
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


exports.getDoanhThu = async (req, res) => {
  try {
    const karaoke_id = req.query.karaoke_id;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    if (!karaoke_id || !start_date || !end_date) {
      return res.status(400).json({ error: "Thiếu dữ liệu (karaoke_id, start_date, end_date)" });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    endDate.setHours(23, 59, 59, 999); // Đặt cuối ngày

    if (startDate > endDate) {
      return res.status(400).json({ error: "Ngày bắt đầu không được lớn hơn ngày kết thúc" });
    }

    const datPhongs = await DatPhong.find({
      karaoke_id,
      trang_thai: "da_hoan_thanh",
      thoi_gian_bat_dau: { $gte: startDate, $lte: endDate },
    });

    const totalRevenue = datPhongs.reduce((sum, dp) => sum + (dp.tong_tien || 0), 0);

    res.json({ totalRevenue });
  } catch (error) {
    console.error("Lỗi khi thống kê doanh thu:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};



exports.addMonAnToDatPhong = async (req, res) => {
  try {
    const datPhong = await DatPhong.findById(req.params.id);
    if (!datPhong) return res.status(404).json({ message: 'Đặt phòng không tìm thấy.' });

    const { monAnId, ten, soLuong, gia } = req.body;
    if (!ten || !monAnId || !soLuong || !gia) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    // Kiểm tra xem món ăn đã tồn tại trong danh sách chưa
    const existingItemIndex = datPhong.danh_sach_mon_an.findIndex(item => item.mon_an_id.toString() === monAnId);
    
    if (existingItemIndex !== -1) {
      // Nếu món ăn đã có, chỉ cần tăng số lượng và tính lại tổng tiền
      datPhong.danh_sach_mon_an[existingItemIndex].so_luong += soLuong;
      datPhong.danh_sach_mon_an[existingItemIndex].thanh_tien = datPhong.danh_sach_mon_an[existingItemIndex].so_luong * gia;
    } else {
      // Nếu món ăn chưa có, thêm món ăn mới vào danh sách
      const thanhTien = soLuong * gia;
      datPhong.danh_sach_mon_an.push({ mon_an_id: monAnId, ten: ten, so_luong: soLuong, don_gia: gia, thanh_tien: thanhTien });
    }

    // Tính lại tổng tiền của đặt phòng
    // datPhong.tong_tien = datPhong.danh_sach_mon_an.reduce((total, item) => total + item.thanh_tien, 0);

    await datPhong.save();  // Lưu thông tin

    return res.json(datPhong);
  } catch (error) {
    console.error("Lỗi khi thêm món ăn:", error);
    return res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu.' });
  }
};



exports.getDanhSachMonAn = async (req, res) => {
  try {
    // Tìm đặt phòng theo id
    const datPhong = await DatPhong.findById(req.params.id);
    if (!datPhong) {
      return res.status(404).json({ message: 'Đặt phòng không tìm thấy.' });
    }

    // Trả về danh sách món ăn của đặt phòng
    return res.json(datPhong.danh_sach_mon_an);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    return res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu.' });
  }
};


// Sửa món ăn trong đơn đặt phòng
exports.updateMonAnInDatPhong = async (req, res) => {
  const { datPhongId, monAnId, soLuong, gia } = req.body;

  if (!datPhongId || !monAnId || !soLuong || !gia) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
  }

  try {
    const datPhong = await DatPhong.findById(datPhongId);

    if (!datPhong) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
    }

    // Tìm món ăn trong danh sách món ăn
    const monAn = datPhong.danh_sach_mon_an.find(item => item.mon_an_id.toString() === monAnId.toString());

    if (!monAn) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn trong đơn đặt phòng' });
    }

    // Cập nhật số lượng và giá món ăn
    const oldTotal = monAn.so_luong * monAn.gia;
    monAn.so_luong = soLuong;
    monAn.gia = gia;

    // Cập nhật tổng tiền của đơn đặt phòng
    const newTotal = soLuong * gia;
    datPhong.tong_tien += (newTotal - oldTotal);

    await datPhong.save();

    res.status(200).json({
      message: 'Cập nhật món ăn thành công',
      datPhong
    });
  } catch (error) {
    console.error('Lỗi khi sửa món ăn trong đơn đặt phòng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


// Xóa món ăn trong đơn đặt phòng
// Xóa món ăn trong đơn đặt phòng
exports.removeMonAnFromDatPhong = async (req, res) => {
  const { datPhongId, monAnId } = req.params;  // Lấy tham số từ req.params

  if (!datPhongId || !monAnId) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
  }

  try {
    const datPhong = await DatPhong.findById(datPhongId);

    if (!datPhong) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
    }

    const monAnIndex = datPhong.danh_sach_mon_an.findIndex(item => item._id.toString() === monAnId.toString());

    if (monAnIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn trong đơn đặt phòng' });
    }

    datPhong.danh_sach_mon_an.splice(monAnIndex, 1);

    await datPhong.save();

    res.status(200).json({
      message: 'Xóa món ăn khỏi đơn đặt phòng thành công',
      datPhong
    });
  } catch (error) {
    console.error('Lỗi khi xóa món ăn khỏi đơn đặt phòng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};



