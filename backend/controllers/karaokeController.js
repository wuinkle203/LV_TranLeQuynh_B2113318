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

exports.getKaraokeById = async (req, res) => {
  try {
      const karaokeId = req.params.karaokeId;

      if (!karaokeId) {
          return res.status(400).json({ message: 'Karaoke ID is required' });
      }

      const karaoke = await Karaoke.findById(karaokeId);

      if (!karaoke) {
          return res.status(404).json({ message: 'Karaoke not found' });
      }

      res.status(200).json(karaoke);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



// Hàm thêm quán karaoke
exports.createKaraoke = async (req, res) => {
  try {
    const { ten_quan, dia_chi, so_dien_thoai, chu_so_huu_id , giay_phep_kinh_doanh, mo_ta} = req.body;
    const hinh_anh_quan = req.file ? req.file.filename : ""; // Lấy tên file ảnh

    const karaoke = new Karaoke({
      ten_quan,
      dia_chi,
      so_dien_thoai,
      chu_so_huu_id,
      hinh_anh_quan,
      mo_ta,
      giay_phep_kinh_doanh,
    });

    await karaoke.save();

    res.status(201).json({
      message: "Karaoke created successfully",
      id: karaoke._id,
      karaoke,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Cập nhật thông tin quán karaoke của người dùng hiện tại
// exports.updateKaraoke = async (req, res) => {
//   try {
//     // Tìm quán karaoke của người dùng hiện tại
//     const karaoke = await Karaoke.findOneAndUpdate(
//       { _id: req.params.id},  // Chỉ tìm quán của người dùng hiện tại
//       req.body,
//       { new: true }  // Trả về quán karaoke đã cập nhật
//     );

//     if (!karaoke) {
//       return res.status(404).json({ message: 'Quán karaoke không tìm thấy hoặc bạn không có quyền cập nhật' });
//     }

//     res.status(200).json({ message: 'Karaoke updated successfully', karaoke });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.updateKaraoke = async (req, res) => {
  try {
    // Lấy hình ảnh mới từ request
    const hinh_anh_moi = req.file ? req.file.filename : null;

    // Tìm quán karaoke theo ID
    const karaoke = await Karaoke.findById(req.params.id);

    if (!karaoke) {
      return res.status(404).json({ message: "Quán karaoke không tìm thấy" });
    }

    // Nếu có ảnh mới thì cập nhật, nếu không thì giữ nguyên ảnh cũ
    const hinh_anh_quan = hinh_anh_moi || karaoke.hinh_anh_quan;

    // Cập nhật thông tin quán karaoke
    const updatedKaraoke = await Karaoke.findByIdAndUpdate(
      req.params.id,
      { ...req.body, hinh_anh_quan },
      { new: true }
    );

    res.status(200).json({
      message: "Cập nhật quán karaoke thành công!",
      karaoke: updatedKaraoke,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật quán karaoke:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật quán karaoke", error: error.message });
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



// Thêm phòng karaoke mới
exports.addRoom = async (req, res) => {
  const { ten_phong, loai_phong, suc_chua, gia_theo_gio, mo_ta } = req.body;
  const { karaokeId } = req.params;

  if (!karaokeId) {
    return res.status(400).json({ message: 'Karaoke ID is required' });
  }

  // Kiểm tra định dạng của gia_theo_gio (phải là mảng của đối tượng với gio_bat_dau, gio_ket_thuc, và gia)
  if (!Array.isArray(gia_theo_gio) || gia_theo_gio.some(item => !item.gio_bat_dau || !item.gio_ket_thuc || !item.gia)) {
    return res.status(400).json({ message: 'Gia theo gio is not valid. It should be an array of objects with gio_bat_dau, gio_ket_thuc, and gia.' });
  }

  try {
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Karaoke not found' });
    }

    // Xử lý ảnh
    const hinh_anh = req.files ? req.files.map(file => `${file.filename}`) : [];

    // Tạo đối tượng phòng
    const newRoom = {
      ten_phong,
      loai_phong,
      suc_chua,
      gia_theo_gio, // Mảng giá theo giờ được truyền vào từ body
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


// Sửa thông tin phòng karaoke
exports.updateRoom = async (req, res) => {
  const { karaokeId, phongId } = req.params;
  const { ten_phong, loai_phong, suc_chua, gia_theo_gio, mo_ta, trang_thai } = req.body;

  // Kiểm tra định dạng gia_theo_gio (mảng các đối tượng với gio_bat_dau, gio_ket_thuc, gia)
  // if (!Array.isArray(gia_theo_gio) || gia_theo_gio.some(item => !item.gio_bat_dau || !item.gio_ket_thuc || item.gia <= 0)) {
  //   return res.status(400).json({ message: 'Gia theo gio is not valid. It should be an array of objects with gio_bat_dau, gio_ket_thuc, and gia.' });
  // }

  // Lấy danh sách hình ảnh mới từ request
  const hinh_anh_moi = req.files ? req.files.map(file => `${file.filename}`) : [];

  try {
    // Tìm phòng trong cơ sở dữ liệu
    const room = await findRoomById(karaokeId, phongId);

    if (!room) {
      return res.status(404).send({ message: "Không tìm thấy phòng." });
    }

    // Nếu không có hình ảnh mới, sử dụng hình ảnh cũ
    const hinh_anh = hinh_anh_moi.length > 0 ? hinh_anh_moi : room.hinh_anh;

    // Cập nhật thông tin phòng
    const updatedRoom = await updateRoomById(karaokeId, phongId, {
      ten_phong,
      loai_phong,
      suc_chua,
      gia_theo_gio,  // Cập nhật giá theo giờ từ request
      mo_ta,
      trang_thai,
      hinh_anh
    });

    res.status(200).json(updatedRoom);
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng:", error);
    res.status(500).send({ message: "Lỗi khi cập nhật phòng", error: error.message });
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


const findRoomById = async (karaokeId, phongId) => {
  try {
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      throw new Error('Karaoke not found');
    }

    const room = karaoke.phong.id(phongId);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  } catch (error) {
    console.error("Lỗi khi tìm phòng:", error);
    throw error; // Ném lỗi để catch ở các nơi khác
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


exports.getMenuByKaraokeId = async (req, res) => {
  const karaokeId = req.params.karaokeId;

  if (!karaokeId) {
    return res.status(400).json({ message: 'Karaoke ID is required' });
  }

  try {
    const karaoke = await Karaoke.findById(karaokeId);

    if (!karaoke) {
      return res.status(404).json({ message: 'Karaoke not found' });
    }

    // Trả về danh sách món ăn trong menu của karaoke
    res.status(200).json({ menu: karaoke.menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Thêm khuyến mãi
exports.addPromotion = async (req, res) => {
  try {
    const { karaokeId } = req.params; // ID của quán karaoke
    const promotion = req.body; // Thông tin khuyến mãi

    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Không tìm thấy quán karaoke!' });
    }

    karaoke.khuyen_mai.push(promotion); // Thêm khuyến mãi mới vào danh sách
    await karaoke.save();

    res.status(200).json({ message: 'Thêm khuyến mãi thành công!', data: karaoke });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm khuyến mãi!', error: error.message });
  }
};

// Sửa khuyến mãi
exports.updatePromotion = async (req, res) => {
  try {
    const { karaokeId, promotionId } = req.params; // ID quán karaoke và khuyến mãi
    const updatedData = req.body; // Dữ liệu sửa đổi

    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Không tìm thấy quán karaoke!' });
    }

    const promotion = karaoke.khuyen_mai.id(promotionId); // Tìm khuyến mãi
    if (!promotion) {
      return res.status(404).json({ message: 'Không tìm thấy khuyến mãi!' });
    }

    Object.assign(promotion, updatedData); // Cập nhật dữ liệu
    await karaoke.save();

    res.status(200).json({ message: 'Sửa khuyến mãi thành công!', data: promotion });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi sửa khuyến mãi!', error: error.message });
  }
};

// Xóa khuyến mãi
exports.deletePromotion = async (req, res) => {
  try {
    const { karaokeId, promotionId } = req.params; // ID quán karaoke và khuyến mãi

    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Không tìm thấy quán karaoke!' });
    }

    // Tìm index của khuyến mãi trong mảng khuyến mãi
    const promotionIndex = karaoke.khuyen_mai.findIndex(
      (promotion) => promotion._id.toString() === promotionId
    );

    if (promotionIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy khuyến mãi!' });
    }

    // Xóa khuyến mãi tại vị trí index tìm được
    karaoke.khuyen_mai.splice(promotionIndex, 1);
    await karaoke.save(); // Lưu lại thay đổi

    res.status(200).json({ message: 'Xóa khuyến mãi thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi khi xóa khuyến mãi!', error: error.message });
  }
};


// exports.getAllRooms = async (req, res) => {
//   const { karaokeId } = req.params;
//   if (!karaokeId) {
//     return res.status(400).json({ message: 'Karaoke ID is required' });
//   }
//   // Fetch rooms based on karaokeId
// };


// Lấy thông tin tất cả các phòng
exports.getAllRooms = async (req, res) => {
  // const { karaokeId } = req.params;
  // if (!karaokeId) {
  //   return res.status(400).json({ message: 'Karaoke ID is required' });
  // }
  try {
    // Lấy tất cả các quán karaoke và chỉ truy xuất thông tin các phòng
    const karaokes = await Karaoke.find({}, 'ten_quan dia_chi phong _id').exec();

    // Tạo danh sách chứa thông tin tất cả các phòng
    const allRooms = karaokes.flatMap((karaoke) =>
      karaoke.phong.map((room) => ({
        karaoke_id: karaoke._id, // Thêm karaokeId vào mỗi phòng
        ten_quan: karaoke.ten_quan,
        dia_chi:karaoke.dia_chi,
        ...room.toObject(),
      }))
    );

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách tất cả các phòng thành công.',
      data: allRooms,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách các phòng:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách các phòng.',
    });
  }
};


exports.getRoomDetails = async (req, res) => {
  const { roomId, karaokeId } = req.params;
  try {
    // Tìm quán karaoke theo karaokeId
    const karaoke = await Karaoke.findById(karaokeId).exec();
    if (!karaoke) {
      return res.status(404).json({ success: false, message: "Quán karaoke không tồn tại" });
    }

    // Tìm phòng theo roomId trong quán karaoke
    const room = karaoke.phong.id(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Phòng không tồn tại" });
    }

    // Trả về thông tin phòng và tên quán
    return res.status(200).json({
      success: true,
      data: { ...room.toObject(), ten_quan: karaoke.ten_quan },
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin phòng.',
    });
  }
};


const updateRoomStatusById = async (karaokeId, phongId, trang_thai) => {
  try {
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      throw new Error("Karaoke not found");
    }

    // Tìm phòng trong karaoke
    const room = karaoke.phong.id(phongId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Cập nhật trạng thái phòng
    room.trang_thai = trang_thai || 'dang_su_dung';  // Trạng thái mặc định
    await karaoke.save();

    return room;  // Trả về phòng đã cập nhật
  } catch (error) {
    throw new Error(error.message);
  }
};



// Cập nhật trạng thái phòng karaoke
exports.updateRoomStatus = async (req, res) => {
  const { karaokeId, roomId } = req.params; // Lấy ID từ URL
  const { trang_thai } = req.body;          // Lấy trạng thái từ request body
  try {
    const updatedRoom = await updateRoomStatusById(karaokeId, roomId, trang_thai);

    res.status(200).json({
      message: "Cập nhật trạng thái phòng thành công",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái phòng:", error);
    res.status(500).send({ message: "Lỗi khi cập nhật trạng thái phòng", error: error.message });
  }
};

// Lấy tất cả các quán karaoke kèm số phòng trống
exports.getKaraokes = async (req, res) => {
  try {
    // Lấy danh sách quán karaoke và populate khuyến mãi + phòng
    const karaokes = await Karaoke.find().populate('khuyen_mai').populate('phong');

    // Duyệt từng quán karaoke và tính số phòng trống
    const karaokesWithRooms = karaokes.map(karaoke => {
      const soPhongTrong = karaoke.phong.filter(p => p.trang_thai === 'trong').length;
      return {
        ...karaoke.toObject(),
        so_phong_trong: soPhongTrong
      };
    });

    // Trả về danh sách quán karaoke có thông tin số phòng trống
    res.status(200).json(karaokesWithRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Thêm menu cho quán
exports.addMenuItem = async (req, res) => {
  try {
    const { karaokeId } = req.params; // ID của quán karaoke
    const menuItem = req.body; // Thông tin món ăn/thức uống

    // Tìm quán karaoke theo ID
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Không tìm thấy quán karaoke!' });
    }

    // Thêm món mới vào menu
    karaoke.menu.push(menuItem);
    await karaoke.save();

    res.status(200).json({ message: 'Thêm món vào menu thành công!', data: karaoke });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm món vào menu!', error: error.message });
  }
};


exports.updateMenuItem = async (req, res) => {
  try {
    const { karaokeId, menuId } = req.params; // ID của quán và ID của món trong menu
    const updatedData = req.body; // Dữ liệu món ăn cần cập nhật

    // Tìm quán karaoke theo ID
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Không tìm thấy quán karaoke!' });
    }

    // Tìm món ăn trong menu theo ID
    const menuItem = karaoke.menu.id(menuId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn trong menu!' });
    }

    // Cập nhật thông tin món ăn
    Object.assign(menuItem, updatedData);
    await karaoke.save();

    res.status(200).json({ message: 'Cập nhật món ăn thành công!', data: karaoke });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật món ăn!', error: error.message });
  }
};


exports.deleteMenuItem = async (req, res) => {
  try {
    const { karaokeId, menuId } = req.params; // ID của quán và ID của món cần xóa

    // Tìm quán karaoke theo ID
    const karaoke = await Karaoke.findById(karaokeId);
    if (!karaoke) {
      return res.status(404).json({ message: 'Không tìm thấy quán karaoke!' });
    }

    // Lọc bỏ món có `menuId` ra khỏi danh sách menu
    karaoke.menu = karaoke.menu.filter(item => item._id.toString() !== menuId);
    await karaoke.save();

    res.status(200).json({ message: 'Xóa món ăn thành công!', data: karaoke });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa món ăn!', error: error.message });
  }
};
