<template>
  <div class="container">
    <h2>Quản lý Đặt Phòng Cho Các Quán Karaoke</h2>

    <!-- Danh sách quán karaoke -->
    <div v-if="karaokes.length">
      <div v-for="karaoke in karaokes" :key="karaoke._id" class="karaoke-card">
        <h4>{{ karaoke.ten_quan }}</h4>
        <p>Địa chỉ: {{ karaoke.dia_chi }}</p>

        <button @click="fetchDatPhongs(karaoke._id)">Xem Danh Sách Đặt Phòng</button>

        <!-- Danh sách đặt phòng -->
        <div v-if="currentKaraokeId === karaoke._id">
          <h5>Danh sách đặt phòng:</h5>
          <div v-if="datPhongs.length">
            <div v-for="datPhong in datPhongs" :key="datPhong._id" class="dat-phong-card">
              <p>{{ datPhong.phong_info?.ten_phong || "Phòng không có thông tin" }}</p>
              <p>Khách hàng: {{ datPhong.nguoi_dung_id?.ho_ten || "Chưa có người dùng" }}</p>
              <p class="trangthai">
                Trạng thái
                <span v-if="datPhong.trang_thai === 'cho_xac_nhan'" class="trang-thai-cho">: Chờ duyệt</span>
                <span v-if="datPhong.trang_thai === 'da_xac_nhan'" class="trang-thai-duyet">: Đã duyệt</span>
                <span v-if="datPhong.trang_thai === 'da_hoan_thanh'" class="trang-thai-hoan-thanh">: Đã xong</span>
              </p>
              <p>
                Thời gian: Từ {{ formatDate(datPhong.thoi_gian_bat_dau) }}
                đến {{ formatDate(datPhong.thoi_gian_ket_thuc) }}
              </p>
              <p>Ghi chú: {{ datPhong.ghi_chu || "Không có ghi chú" }}</p>
              <p>Tổng tiền: {{ formatCurrency(datPhong.tong_tien) }}</p>

              <!-- Nút hành động -->
              <div class="actions">
                <button
                  v-if="datPhong.trang_thai === 'cho_xac_nhan'"
                  @click="updateTrangThai(datPhong._id, 'da_xac_nhan')"
                >
                  Duyệt
                </button>
                <button
                  v-if="datPhong.trang_thai === 'da_xac_nhan'"
                  @click="updateTrangThai(datPhong._id, 'da_hoan_thanh')"
                >
                  Đã Trả Phòng
                </button>
              </div>
            </div>
          </div>
          <p v-else>Chưa có đơn đặt phòng nào.</p>
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
        currentKaraokeId: null, // ID quán karaoke hiện tại để hiển thị đặt phòng
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
        // console.log(this.currentKaraokeId);
        try {
          const response = await axios.get("http://localhost:8080/api/datphongs", {
            params: { karaoke_id: karaokeId },
          });

          // Lọc ra các phòng không có trạng thái 'da_hoan_thanh'
          this.datPhongs = response.data.filter(datPhong => datPhong.trang_thai !== "da_hoan_thanh");
        } catch (error) {
          console.error("Lỗi khi tải danh sách đặt phòng:", error);
        }
      },


      async updateTrangThai(datPhongId, newTrangThai) {
        try {
          // Cập nhật trạng thái của đặt phòng
          await axios.put(`http://localhost:8080/api/datphongs/${datPhongId}`, {
            trang_thai: newTrangThai,
          });

          // Nếu trạng thái là 'da_hoan_thanh' hoặc 'da_huy', cập nhật trạng thái phòng
          if (newTrangThai === "da_hoan_thanh" || newTrangThai === "da_huy") {
            const datPhong = this.datPhongs.find((dp) => dp._id === datPhongId);
            if (datPhong && datPhong.phong_info) {
              // Gọi API để cập nhật trạng thái phòng
              await axios.patch(`http://localhost:8080/api/karaokes/${this.currentKaraokeId}/rooms/${datPhong.phong_info._id}`, {
                trang_thai: "trong",
              });
            }
          }

          // Tải lại danh sách đặt phòng
          this.fetchDatPhongs(this.currentKaraokeId);
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
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
      this.fetchKaraokes(); // Lấy danh sách quán karaoke khi khởi tạo
    },
  };
  </script>
  
  <style scoped>
  .container {
    margin: 20px;
  }
  
  .karaoke-card {
    margin-bottom: 20px;
    border: 1px solid #ddd;
    padding: 10px;
  }
  
  .dat-phong-card {
    margin-top: 10px;
    border: 1px solid #eee;
    padding: 8px;
  }
  
  .trangthai{
    display: flex;
  }

  button {
    margin-top: 10px;
    padding: 5px 10px;
  }
  </style>
  
  <style scoped>
.container {
  margin: 20px auto;
  max-width: 800px;
  font-family: Arial, sans-serif;
  color: #333;
}

h2 {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 20px;
  font-weight: bold;
}

.karaoke-card {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.karaoke-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.karaoke-card h4 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.karaoke-card p {
  margin: 5px 0;
  font-size: 1rem;
  color: #555;
}

.dat-phong-card {
  margin-top: 10px;
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 15px;
  transition: box-shadow 0.3s ease;
}

.dat-phong-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dat-phong-card p {
  font-size: 0.95rem;
  color: #444;
  margin: 5px 0;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

button:focus {
  outline: none;
  box-shadow: 0 0 3px #4CAF50;
}

p {
  line-height: 1.6;
}

</style>
