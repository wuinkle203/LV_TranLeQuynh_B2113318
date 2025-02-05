const express = require('express');
const { getAllDanhGias, createDanhGia, deleteDanhGia } = require('../controllers/danhGiaController');
const router = express.Router();

router.get('/:karaokeId/rooms/:roomId/reviews', getAllDanhGias);
router.post('/:karaokeId/rooms/:roomId/reviews', createDanhGia);
router.delete('/:id', deleteDanhGia);

module.exports = router;
