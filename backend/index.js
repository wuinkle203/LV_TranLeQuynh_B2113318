require('dotenv').config();

const express = require('express');
const app = express();  // Khởi tạo app trước khi sử dụng
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
const axios = require("axios");

const karaokeRoutes = require('./routes/karaokeRoutes');
const userRoutes = require('./routes/userRoutes');
const datPhongRoutes = require('./routes/datPhongRoutes');
const danhGiaRoutes = require('./routes/danhGiaRoutes');
const phanHoiRoutes = require('./routes/phanHoiRoutes');

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3001', // Hoặc '*' để cho phép tất cả nguồn gốc
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Thêm PATCH vào danh sách phương thức
  allowedHeaders: ['Content-Type', 'Authorization'], // Đảm bảo các header được phép
}));

// Sử dụng middleware
app.use(bodyParser.json());
app.use(express.json());
// Đảm bảo 'uploads' được public để truy cập ảnh
app.use('/uploads', express.static('uploads'));


// Kết nối MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));



// Routes
app.use('/api/karaokes', karaokeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/datphongs', datPhongRoutes);
app.use('/api/danhgias', danhGiaRoutes);
app.use('/api/phanhois', phanHoiRoutes);
app.use('/api', require('./routes/recommendation'));
//Chat bot

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
      const response = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
          sender: "user",
          message: message
      });

      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: "Lỗi kết nối Rasa" });
  }
});

// Server lắng nghe
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


