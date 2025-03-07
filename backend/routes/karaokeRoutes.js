const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require("../middlewares/uploadConfig");

const {
  getAllKaraokes,
  createKaraoke,
  updateKaraoke,
  deleteKaraoke,
  getRoomByKaraokeId,
  addRoom,
  updateRoom,
  deleteRoom,
  addPromotion,
  updatePromotion,
  deletePromotion,
  getAllRooms,
  getRoomDetails,
  updateRoomStatus,
  getKaraokes,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByKaraokeId,
  getKaraokeById
} = require('../controllers/karaokeController');

// Quản lý quán karaoke
router.get('/all',getKaraokes);

router.get('/', getAllKaraokes);
router.post('/', upload.single("hinh_anh_quan"),createKaraoke);
router.put('/:id', upload.single("hinh_anh_quan"), updateKaraoke);
router.delete('/:id', deleteKaraoke);
router.get('/:karaokeId', getKaraokeById);

// Quản lý phòng karaoke
router.get('/:karaokeId/phong', getRoomByKaraokeId);
// Quản lý phòng karaoke
router.post('/:karaokeId/phong', upload.array('hinh_anh',10), addRoom); // Thêm phòng với hình ảnh
router.put('/:karaokeId/phong/:phongId', upload.array('hinh_anh', 10), updateRoom);
router.delete('/:karaokeId/phong/:phongId', deleteRoom);

// Quản lý khuyến mãi
router.post('/:karaokeId/promotions', addPromotion); // Thêm khuyến mãi
router.put('/:karaokeId/promotions/:promotionId', updatePromotion); // Sửa khuyến mãi
router.delete('/:karaokeId/promotions/:promotionId', deletePromotion); // Xóa khuyến mãi

// Route lấy danh sách tất cả các phòng
router.get('/rooms', getAllRooms);
router.get('/:karaokeId/rooms/:roomId', getRoomDetails); //Thông tin chi tiết phòng
router.patch('/:karaokeId/rooms/:roomId', updateRoomStatus);

//Quản lý menu
router.post('/:karaokeId/menu/', addMenuItem); // Thêm khuyến mãi
router.put('/:karaokeId/menu/:menuId',updateMenuItem ); // Thêm khuyến mãi
router.delete('/:karaokeId/menu/:menuId', deleteMenuItem); // Thêm khuyến mãi
router.get('/:karaokeId/menu', getMenuByKaraokeId);



module.exports = router;