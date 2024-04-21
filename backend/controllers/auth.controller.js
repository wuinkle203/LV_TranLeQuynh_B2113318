const Users = require("../models/users.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        //Kiểm tra user có tồn tại hay không
        const user = await Users.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy tài khoản' });
        }

        //Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mật khẩu không chính xác' });
        }

        //Đăng nhập thành công, lưu lại dữ liệu mã token.
        const token = jwt.sign({ _id: user._id, borrow: user.borrow, favorite: user.favorite, role: user.role }, 'ma_bi_mat', { expiresIn: '1h' });

        res.json({ token, user: { _id: user._id, firstname: user.firstname ,username: user.username, borrow: user.borrow, favorite: user.favorite, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    login,
};