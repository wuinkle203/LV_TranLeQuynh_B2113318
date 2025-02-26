const express = require('express');
const goiYPhongKNN = require('../ml/knn');
const router = express.Router();

router.get('/goi-y-phong/:phongId', async (req, res) => {
  const { phongId } = req.params;
  try {
    const phongGoiY = await goiYPhongKNN(phongId);
    res.json({ phongGoiY });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy phòng gợi ý" });
  }
});

module.exports = router;
