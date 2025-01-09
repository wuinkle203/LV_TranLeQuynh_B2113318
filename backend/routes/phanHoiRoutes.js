const express = require('express');
const { getAllPhanHois, createPhanHoi, deletePhanHoi } = require('../controllers/phanHoiController');
const router = express.Router();

router.get('/', getAllPhanHois);
router.post('/', createPhanHoi);
router.delete('/:id', deletePhanHoi);

module.exports = router;
