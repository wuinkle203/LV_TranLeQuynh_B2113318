const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser, registerUser, loginUser, getUserById } = require('../controllers/userController');
const router = express.Router();

// Các route hiện có
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserById);

// Thêm route đăng ký
router.post('/register', registerUser); // Đăng ký người dùng
router.post('/login', loginUser); // Đăng nhập người dùng

module.exports = router;
