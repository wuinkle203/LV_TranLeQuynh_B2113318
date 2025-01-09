const express = require('express');
const { getAllThongBaos, createThongBao, deleteThongBao } = require('../controllers/thongBaoController');
const router = express.Router();

router.get('/', getAllThongBaos);
router.post('/', createThongBao);
router.delete('/:id', deleteThongBao);

module.exports = router;
