const express = require('express');
const { getAllDanhGias, createDanhGia, deleteDanhGia } = require('../controllers/danhGiaController');
const router = express.Router();

router.get('/', getAllDanhGias);
router.post('/', createDanhGia);
router.delete('/:id', deleteDanhGia);

module.exports = router;
