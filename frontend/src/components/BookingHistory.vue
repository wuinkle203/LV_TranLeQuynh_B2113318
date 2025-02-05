<template>
  <div class="booking-history">
    <h2>Lịch Sử Đặt Phòng</h2>

    <div v-if="karaokes.length">
      <div v-for="karaoke in karaokes" :key="karaoke._id" class="karaoke-card">
        <h4>{{ karaoke.ten_quan }}</h4>
        <p>Địa chỉ: {{ karaoke.dia_chi }}</p>

        <button @click="fetchDatPhongs(karaoke._id)">Xem Lịch Sử Đặt Phòng</button>

        <div v-if="currentKaraokeId === karaoke._id">
          <h5>Danh sách đặt phòng đã hoàn thành/hủy:</h5>
          <div v-if="datPhongs.length">
            <div v-for="datPhong in datPhongs" :key="datPhong._id" class="dat-phong-card">
              <p>{{ datPhong.phong_info?.ten_phong || "Phòng không có thông tin" }}</p>
              <p>Khách hàng: {{ datPhong.nguoi_dung_id?.ho_ten || "Chưa có người dùng" }}</p>
              <p class="trangthai">
                Trạng thái
                <span v-if="datPhong.trang_thai === 'da_hoan_thanh'" class="trang-thai-cho">: Đã Hoàn Thành</span>
                <span v-if="datPhong.trang_thai === 'da_huy'" class="trang-thai-duyet">: Đã Huỷ</span>
                <!-- <span v-if="datPhong.trang_thai === 'da_hoan_thanh'" class="trang-thai-hoan-thanh">: Đã xong</span> -->
              </p>
              <p>
                Thời gian: Từ {{ formatDate(datPhong.thoi_gian_bat_dau) }}
                đến {{ formatDate(datPhong.thoi_gian_ket_thuc) }}
              </p>
              <p>Ghi chú: {{ datPhong.ghi_chu || "Không có ghi chú" }}</p>
              <p>Tổng tiền: {{ formatCurrency(datPhong.tong_tien) }}</p>
            </div>
          </div>
          <p v-else>Không có lịch sử đặt phòng.</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Không có quán karaoke nào.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      karaokes: [], // Danh sách quán karaoke
      datPhongs: [], // Danh sách đặt phòng của quán hiện tại
      currentKaraokeId: null, // ID quán karaoke hiện tại để hiển thị lịch sử đặt phòng
    };
  },
  methods: {
    async fetchKaraokes() {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;
      if (!userId) {
        console.error("Chưa có userId trong localStorage.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/karaokes", {
          params: { userId },
        });
        this.karaokes = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách quán karaoke:", error);
      }
    },
    async fetchDatPhongs(karaokeId) {
      // Nếu danh sách đang hiển thị, ấn lần nữa để ẩn đi
      if (this.currentKaraokeId === karaokeId) {
        this.currentKaraokeId = null; // Đặt lại ID karaoke
        this.datPhongs = []; // Xóa danh sách đặt phòng
        return;
      }

      // Nếu chưa hiển thị, tải danh sách đặt phòng
      this.currentKaraokeId = karaokeId;

      try {
        const response = await axios.get("http://localhost:8080/api/datphongs", {
          params: { karaoke_id: karaokeId },
        });
        this.datPhongs = response.data.filter(
          (datPhong) =>
            datPhong.trang_thai === "da_hoan_thanh" ||
            datPhong.trang_thai === "da_huy"
        );
      } catch (error) {
        console.error("Lỗi khi tải lịch sử đặt phòng:", error);
      }
    },
    formatDate(value) {
      if (!value) return "";
      const date = new Date(value);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    formatCurrency(value) {
      if (!value) return "0 VND";
      return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    },

  },
  created() {
    this.fetchKaraokes();
  },
};
</script>


<style scoped>
/* Tổng thể */
.booking-history {
  font-family: 'Poppins', sans-serif;
  margin: 20px auto;
  /* max-width: 900px; */
  width: 90%;
  padding: 20px;
  background: #f4f4f9;
  border-radius: 10px;
  color: #333;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề chính */
.booking-history h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

/* Card quán karaoke */
.karaoke-card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.karaoke-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.karaoke-card h4 {
  font-size: 20px;
  color: #333;
}

.karaoke-card p {
  font-size: 14px;
  color: #555;
  margin: 5px 0;
}

/* Nút xem lịch sử đặt phòng */
.karaoke-card button {
  background: #007bff;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background 0.3s, box-shadow 0.3s;
}

.karaoke-card button:hover {
  background: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Card đặt phòng */
.dat-phong-card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.dat-phong-card p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

/* Trạng thái */
.dat-phong-card p span {
  font-weight: bold;
}

.dat-phong-card .trang-thai-hoan-thanh {
  color: #28a745; /* Màu xanh lá */
}

.dat-phong-card .trang-thai-huy {
  color: #dc3545; /* Màu đỏ */
}

/* Không có dữ liệu */
p {
  font-size: 14px;
  color: #555;
  text-align: center;
  font-weight: bold;
}
</style>
