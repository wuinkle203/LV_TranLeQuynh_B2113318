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
        user_name: user.user_name,
        ho_ten: user.ho_ten // Thêm ho_ten vào token payload
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




// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  const { email, user_name, mat_khau, ho_ten, so_dien_thoai, dia_chi, vai_tro } = req.body;

  // Kiểm tra nếu email hoặc tên người dùng đã tồn tại
  const existingEmail = await User.findOne({ email });
  const existingUserName = await User.findOne({ user_name });

  if (existingEmail) {
    return res.status(400).json({ message: 'Email đã tồn tại' });
  }
  
  if (existingUserName) {
    return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(mat_khau, salt);

  // Tạo người dùng mới
  const user = new User({
    email,
    user_name,
    mat_khau: hashedPassword,
    ho_ten,
    so_dien_thoai,
    dia_chi,
    vai_tro
  });

  try {
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'User updated successfully', updatedUser });
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

