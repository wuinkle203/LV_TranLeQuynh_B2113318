const express = require('express');
const { addReply, getReplys , deleteReply} = require('../controllers/phanHoiController');
const router = express.Router();

router.post('/:reviewId', addReply);
router.get('/:danhGiaId', getReplys);
router.delete('/:replyId',deleteReply);

module.exports = router;
