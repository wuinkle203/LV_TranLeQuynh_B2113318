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
  // uploadImage,
} = require('../controllers/karaokeController');

// Quản lý quán karaoke
router.get('/', getAllKaraokes);
router.post('/', createKaraoke);
router.put('/:id', updateKaraoke);
router.delete('/:id', deleteKaraoke);

// Quản lý phòng karaoke
router.get('/:karaokeId/phong', getRoomByKaraokeId);
// Quản lý phòng karaoke
router.post('/:karaokeId/phong', upload.array('hinh_anh',10), addRoom); // Thêm phòng với hình ảnh
router.put('/:karaokeId/phong/:phongId', upload.array('hinh_anh', 10), updateRoom);
router.delete('/:karaokeId/phong/:phongId', deleteRoom);


module.exports = router;