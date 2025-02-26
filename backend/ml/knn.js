const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-backend-wasm');
const Karaoke = require('../models/Karaoke');

async function initTensorFlow() {
  await tf.setBackend('wasm');
  console.log('Đã khởi tạo TensorFlow trên WASM');
}

initTensorFlow();

async function layDuLieuPhong() {
    const danhSachKaraoke = await Karaoke.find({});
    let duLieu = [];
    let phongIds = [];
    let phongChiTiet = {}; 

    danhSachKaraoke.forEach(karaoke => {
      karaoke.phong.forEach(phong => {
        const phongId = phong._id.toString();
        phongIds.push(phongId);

        duLieu.push([
          phong.suc_chua,
          phong.gia_theo_gio[0]?.gia || 0,
          phong.loai_phong === 'VIP' ? 1 : 0
        ]);

        // Thêm karaokeId và tên quán vào thông tin phòng
        phongChiTiet[phongId] = {
          ...phong.toObject(),
          karaokeId: karaoke._id.toString(),
          ten_quan: karaoke.ten_quan  
        };
      });
    });

    return { duLieu, phongIds, phongChiTiet };
}

async function goiYPhongKNN(phongId) {
    const { duLieu, phongIds, phongChiTiet } = await layDuLieuPhong();
    const X = tf.tensor2d(duLieu);
    const index = phongIds.indexOf(phongId);
    if (index === -1) return [];

    const phongCanTim = X.slice([index, 0], [1, -1]);
    const k = 5;
    const distances = X.sub(phongCanTim).pow(2).sum(1).sqrt().arraySync();

    const nearestIndexes = distances.map((d, i) => ({ i, d }))
      .sort((a, b) => a.d - b.d)
      .slice(1, k + 1)
      .map(item => phongIds[item.i]);

    return nearestIndexes.map(id => ({
      ...phongChiTiet[id],  
      karaokeId: phongChiTiet[id].karaokeId,
      ten_quan: phongChiTiet[id].ten_quan  
    })); 
}

module.exports = goiYPhongKNN;
