const Karaoke = require('../models/Karaoke');
const path = require('path');


// Lấy danh sách quán karaoke của người dùng đang đăng nhập
exports.getAllKaraokes = async (req, res) => {
  try {
    // Lấy userId từ query, body hoặc từ session nếu có
    const userId = req.body.userId || req.query.userId;  // Hoặc từ session nếu dùng session
    if (!userId) {
      return res.status(400).json({ message: "userId không được cung cấp" });
    }

    // Lọc các quán karaoke theo userId
    const karaokes = await Karaoke.find({ chu_so_huu_id: userId });
    res.status(200).json(karaokes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createKaraoke = async (req, res) => {
  // console.log("Dữ liệu nhận được từ client:", req.body);  // Kiểm tra dữ liệu từ client
  try {
    const karaoke = new Karaoke({
      ...req.body,
      chu_so_huu_id: req.body.chu_so_huu_id || req.userId  // Lưu chu_so_huu_id từ request nếu có
    });

    await karaoke.save();

    res.status(201).json({
      message: 'Karaoke created successfully',
      id: karaoke._id,
      karaoke,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Cập nhật thông tin quán karaoke của người dùng hiện tại
exports.updateKaraoke = async (req, res) => {
  try {
    // Tìm quán karaoke của người dùng hiện tại
    const karaoke = await Karaoke.findOneAndUpdate(
      { _id: req.params.id},  // Chỉ tìm quán của người dùng hiện tại
      req.body,
      { new: true }  // Trả về quán karaoke đã cập nhật
    );

    if (!karaoke) {
      return res.status(404).json({ message: 'Quán karaoke không tìm thấy hoặc bạn không có quyền cập nhật' });
    }

    res.status(200).json({ message: 'Karaoke updated successfully', karaoke });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa quán karaoke
exports.deleteKaraoke = async (req, res) => {
  try {
    await Karaoke.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Karaoke deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getAllRooms = async (req, res) => {
  const { karaokeId } = req.params;
  if (!karaokeId) {
    return res.status(400).json({ message: 'Karaoke ID is required' });
  }
  // Fetch rooms based on karaokeId
};

// Thêm phòng karaoke mới
exports.addRoom = async (req, res) => {
  const { ten_phong, loai_phong, suc_chua, gia_theo_gio, mo_ta } = req.body;
  const { karaokeId } = req.params;

  
  if (!karaokeId) {
    return res.status(400).json({ message: 'Karaoke ID is required' });
  }

  try {
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Karaoke not found' });
    }

    // Xử lý ảnh
    const hinh_anh = req.files ? req.files.map(file => `${file.filename}`) : [];

    // console.log(req.files)
    // console.log(hinh_anh)

    // Tạo đối tượng phòng
    const newRoom = {
      ten_phong,
      loai_phong,
      suc_chua,
      gia_theo_gio,
      mo_ta,
      hinh_anh
    };

    // Thêm phòng vào quán karaoke
    karaoke.phong.push(newRoom);
    await karaoke.save();

    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add room', error: error.message });
  }
};


const updateRoomById = async (karaokeId, roomId, updateData) => {
  try {
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      throw new Error('Karaoke not found');
    }

    const room = karaoke.phong.id(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Cập nhật thông tin phòng
    room.set(updateData);
    await karaoke.save();
    return room;  // Trả về phòng đã được cập nhật
  } catch (error) {
    throw new Error(error.message);
  }
};



// Sửa thông tin phòng karaoke
exports.updateRoom = async (req, res) => {
  const { karaokeId, phongId } = req.params;
  const { ten_phong, loai_phong, suc_chua, gia_theo_gio, mo_ta } = req.body;
  const hinh_anh = req.files ? req.files.map(file => `${file.filename}`) : [];

  try {
    const updatedRoom = await updateRoomById(karaokeId, phongId, {
      ten_phong,
      loai_phong,
      suc_chua,
      gia_theo_gio,
      mo_ta,
      hinh_anh
    });

    res.status(200).json(updatedRoom);
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng:", error);
    res.status(500).send({ message: "Lỗi khi cập nhật phòng", error: error.message });
  }
};




const fs = require('fs');

// Xóa phòng karaoke
exports.deleteRoom = async (req, res) => {
  try {
    const { karaokeId, phongId } = req.params;  // Thay roomId thành phongId

    // Tìm karaoke theo karaokeId
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Karaoke not found' });
    }

    // Tìm phòng trong mảng phòng của karaoke
    const room = karaoke.phong.id(phongId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

  // Kiểm tra nếu phòng có ảnh
  if (Array.isArray(room.hinh_anh)) {
    // Lặp qua mảng ảnh để xóa từng ảnh
    room.hinh_anh.forEach((imageName) => {
      console.log(imageName);
      const imagePath = path.join(__dirname, '..', 'uploads', imageName);
      console.log('Đường dẫn ảnh:', imagePath);

      // Kiểm tra tệp có tồn tại không trước khi xóa
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Lỗi khi xóa ảnh:", err);
          } else {
            console.log("Ảnh đã được xóa thành công:", imageName);
          }
        });
      } else {
        console.log("Ảnh không tồn tại tại đường dẫn:", imagePath);
      }
    });
  } else {
    console.log("Không có ảnh hoặc ảnh không phải kiểu mảng.");
  }


    // Sử dụng pull để xóa phòng khỏi mảng
    karaoke.phong.pull(phongId);

    // Lưu lại tài liệu karaoke sau khi đã xóa phòng
    await karaoke.save();

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error("Lỗi khi xóa phòng:", error);
    res.status(500).json({ message: 'Lỗi xóa phòng', error: error.message });
  }
};






// Lấy danh sách phòng của quán karaoke
// Karaoke Controller (karaokeController.js)
exports.getRoomByKaraokeId = async (req, res) => {
  const karaokeId = req.params.karaokeId;
  
  if (!karaokeId) {
    return res.status(400).json({ message: 'Karaoke ID is required' });
  }

  try {
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) return res.status(404).json({ message: 'Karaoke not found' });
    res.status(200).json({ phong: karaoke.phong });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





