const express = require('express');
const { getAllDatPhongs, createDatPhong, updateDatPhong, deleteDatPhong, getBookingHistory, updateTongTien } = require('../controllers/datPhongController');
const router = express.Router();

router.get('/', getAllDatPhongs);
router.post('/', createDatPhong);
router.put('/:id', updateDatPhong);
router.delete('/:id', deleteDatPhong);
router.put('/tongtien/:id', updateTongTien);

// Lấy lịch sử đặt phòng của user
router.get('/history/:userId',getBookingHistory);


module.exports = router;
