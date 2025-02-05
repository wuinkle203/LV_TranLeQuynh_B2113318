const express = require('express');
const { getAllUsers, updateUser, deleteUser, registerUser, loginUser, getUserById , changePassword, checkUserName} = require('../controllers/userController');
const router = express.Router();

// Các route hiện có
router.get('/', getAllUsers);
// router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserById);

// Thêm route đăng ký
router.post('/register', registerUser); // Đăng ký người dùng
router.post('/login', loginUser); // Đăng nhập người dùng
router.patch('/:id/changePassword', changePassword);
router.post("/check-username", checkUserName)

module.exports = router;
