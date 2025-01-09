const express = require('express');
const { getAllDatPhongs, createDatPhong, updateDatPhong, deleteDatPhong } = require('../controllers/datPhongController');
const router = express.Router();

router.get('/', getAllDatPhongs);
router.post('/', createDatPhong);
router.put('/:id', updateDatPhong);
router.delete('/:id', deleteDatPhong);

module.exports = router;
