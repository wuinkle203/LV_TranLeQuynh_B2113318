const express = require('express');
const { getAllDatPhongs, createDatPhong, updateDatPhong, deleteDatPhong, getBookingHistory, updateTongTien, getDoanhThu, addMonAnToDatPhong, getDanhSachMonAn, removeMonAnFromDatPhong } = require('../controllers/datPhongController');
const router = express.Router();

router.get('/', getAllDatPhongs);
router.post('/', createDatPhong);
router.put('/:id', updateDatPhong);
router.delete('/:id', deleteDatPhong);
router.put('/tongtien/:id', updateTongTien);

// Lấy lịch sử đặt phòng của user
router.get('/history/:userId',getBookingHistory);
router.get('/doanhthu',getDoanhThu);


//Thêm menu cho đơn đặt phòng
router.post('/:id/addMonAn', addMonAnToDatPhong);

// Route lấy danh sách món ăn theo DatPhongId
router.get('/:id/menu', getDanhSachMonAn);

router.delete('/:datPhongId/removeMonAn/:monAnId', removeMonAnFromDatPhong);
module.exports = router;
