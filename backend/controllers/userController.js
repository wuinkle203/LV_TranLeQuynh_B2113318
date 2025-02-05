const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
  const { user_name, password } = req.body;
  try {
    // Kiểm tra user_name tồn tại
    const user = await User.findOne({ user_name });
    if (!user) {
      return res.status(400).json({ message: 'Tên đăng nhập không tồn tại' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.mat_khau);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    // Tạo token và thêm ho_ten vào payload
    const token = jwt.sign(
      { 
        userId: user._id, 
        // user_name: user.user_name,
        // ho_ten: user.ho_ten,
        // vai_tro: user.vai_tro // Thêm ho_ten vào token payload
      },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1h' }
    );

    // Trả về token và thông báo đăng nhập thành công
    res.status(200).json({ message: 'Đăng nhập thành công', token });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};



// Đăng ký người dùng
exports.registerUser = async (req, res) => {
  try {
    const {
      email = null, // Nếu email không được gửi, đặt giá trị mặc định là null
      mat_khau,
      ho_ten = "",
      user_name,
      so_dien_thoai = "",
      dia_chi = "",
      vai_tro = "khach_hang",
    } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Tạo người dùng mới
    const newUser = new User({
      email,
      mat_khau,
      ho_ten,
      user_name,
      so_dien_thoai,
      dia_chi,
      vai_tro,
    });

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    newUser.mat_khau = await bcrypt.hash(newUser.mat_khau, salt);

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};



// Đổi mật khẩu người dùng
exports.changePassword = async (req, res) => {
  try {
    // console.log("Params nhận được:", req.params);
    // console.log("Body nhận được:", req.body);

    const { id } = req.params; //  Sửa lại cách lấy id
    const { currentPassword, newPassword, confirmPassword } = req.body;

    //  Kiểm tra nhập đầy đủ mật khẩu
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ mật khẩu." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Mật khẩu mới và xác nhận mật khẩu không khớp." });
    }

    // Tìm người dùng
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }

    // console.log("Người dùng tìm thấy:", user.email);

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.mat_khau); // Sửa từ user.password thành user.mat_khau
    if (!isMatch) {
      return res.status(400).json({ error: "Mật khẩu hiện tại không đúng." });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    user.mat_khau = hashedPassword; //  Sửa từ user.password thành user.mat_khau
    await user.save();

    console.log("Mật khẩu đã thay đổi thành công.");
    return res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công!" });

  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({ error: "Đã xảy ra lỗi khi đổi mật khẩu." });
  }
};



exports.checkUserName = async (req, res) => {
  const { user_name } = req.body;
  
  try {
    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Lỗi kiểm tra tên đăng nhập." });
  }
}

// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'User updated successfully'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin người dùng theo userId
exports.getUserById = async (req, res) => {
  try {
    // Tìm người dùng theo userId
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Không trả về mật khẩu và các thông tin không cần thiết
    const { mat_khau, ...userInfo } = user.toObject();
    
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi', error });
  }
};

