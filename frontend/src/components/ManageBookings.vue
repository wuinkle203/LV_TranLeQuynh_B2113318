<template>
  <div class="container">
    <h2>Quản lý Đặt Phòng</h2>

    <!-- Danh sách quán karaoke -->
    <div v-if="karaokes.length">
      <div v-for="karaoke in karaokes" :key="karaoke._id" class="karaoke-card">
        <h4>{{ karaoke.ten_quan }}</h4>
        <p>Địa chỉ: {{ karaoke.dia_chi }}</p>

        <button @click="fetchDatPhongs(karaoke._id)">Xem Danh Sách Đặt Phòng</button>

        <!-- Danh sách đặt phòng -->
        <div v-if="currentKaraokeId === karaoke._id">
          <h5>Danh sách đặt phòng:</h5>

          <!-- Bộ lọc trạng thái -->
          <div class="filter-group">
            <label for="filter">Lọc trạng thái:</label>
            <select v-model="selectedTrangThai" @change="applyFilter">
              <option value="">Tất cả</option>
              <option value="cho_xac_nhan">Chờ duyệt</option>
              <option value="da_xac_nhan">Đã duyệt</option>
              <!-- <option value="da_hoan_thanh">Đã xong</option> -->
            </select>
          </div>

          <div v-if="filteredDatPhongs.length">
            <div v-for="datPhong in filteredDatPhongs" :key="datPhong._id" class="dat-phong-card">
              <p>{{ datPhong.phong_info?.ten_phong || "Phòng không có thông tin" }}</p>
              <p>Khách hàng: {{ datPhong.nguoi_dung_id?.ho_ten || "Chưa có người dùng" }}</p>
              <p class="trangthai">
                Trạng thái
                <span v-if="datPhong.trang_thai === 'cho_xac_nhan'" class="trang-thai-cho">: Chờ duyệt</span>
                <span v-if="datPhong.trang_thai === 'da_xac_nhan'" class="trang-thai-duyet">: Đã duyệt</span>
                <!-- <span v-if="datPhong.trang_thai === 'da_hoan_thanh'" class="trang-thai-hoan-thanh">: Đã xong</span> -->
              </p>
              <p>
                Thời gian: {{ formatDate(datPhong.thoi_gian_bat_dau) }}
                <!-- đến {{ formatDate(datPhong.thoi_gian_ket_thuc) }} -->
              </p>
              <p>Ghi chú: {{ datPhong.ghi_chu || "Không có ghi chú" }}</p>

              <!-- Nút hành động -->
              <div class="actions">
                <button
                  v-if="datPhong.trang_thai === 'cho_xac_nhan'"
                  @click="updateTrangThai(datPhong._id, 'da_xac_nhan')"
                >
                  Duyệt
                </button>
                <button
                  v-if="datPhong.trang_thai === 'cho_xac_nhan' || datPhong.trang_thai === 'da_xac_nhan'"
                  @click="updateTrangThai(datPhong._id, 'da_huy')"
                >
                  Huỷ đặt phòng
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
          <p v-else>Không có đơn đặt phòng phù hợp.</p>
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
      filteredDatPhongs: [], // Danh sách đặt phòng đã lọc
      currentKaraokeId: null, // ID quán karaoke hiện tại để hiển thị đặt phòng
      selectedTrangThai: "", // Trạng thái được chọn để lọc
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
      if (this.currentKaraokeId === karaokeId) {
        this.currentKaraokeId = null;
        this.datPhongs = [];
        this.filteredDatPhongs = [];
        return;
      }

      this.currentKaraokeId = karaokeId;

      try {
        const response = await axios.get("http://localhost:8080/api/datphongs", {
          params: {
            karaoke_id: karaokeId,
            trang_thai: ["cho_xac_nhan", "da_xac_nhan"], // Gửi trạng thái cần lọc
          },
        });

        this.datPhongs = response.data;
        this.filteredDatPhongs = this.datPhongs;
      } catch (error) {
        console.error("Lỗi khi tải danh sách đặt phòng:", error);
      }
    },

    applyFilter() {
      if (!this.selectedTrangThai) {
        this.filteredDatPhongs = this.datPhongs;
      } else {
        this.filteredDatPhongs = this.datPhongs.filter(
          (datPhong) => datPhong.trang_thai === this.selectedTrangThai
        );
      }
    },


    async updateTrangThai(datPhongId, newTrangThai) {
      try {
        const thoiGianKetThuc = 
          newTrangThai === "da_hoan_thanh" ? new Date().toISOString() : null;

        // Cập nhật trạng thái và thời gian kết thúc
        await axios.put(`http://localhost:8080/api/datphongs/${datPhongId}`, {
          trang_thai: newTrangThai,
          thoi_gian_ket_thuc: thoiGianKetThuc,
        });

        // Tính tổng tiền khi đã trả phòng
        if (newTrangThai === "da_hoan_thanh") {
          const datPhong = this.datPhongs.find((dp) => dp._id === datPhongId);
          if (datPhong) {
            datPhong.thoi_gian_ket_thuc = thoiGianKetThuc; // Cập nhật thời gian kết thúc
            await this.calculateTotal(datPhong); // Gọi hàm tính tổng tiền
          }
        }

        // Cập nhật trạng thái phòng nếu cần
        if (newTrangThai === "da_hoan_thanh" || newTrangThai === "da_huy") {
          const datPhong = this.datPhongs.find((dp) => dp._id === datPhongId);
          if (datPhong && datPhong.phong_info) {
            await axios.patch(
              `http://localhost:8080/api/karaokes/${this.currentKaraokeId}/rooms/${datPhong.phong_info._id}`,
              { trang_thai: "trong" }
            );
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

    async calculateTotal(datPhong) {
      try {
        // Kiểm tra dữ liệu cơ bản
        if (
          !datPhong.thoi_gian_bat_dau ||
          !datPhong.thoi_gian_ket_thuc ||
          !datPhong.phong_info?.gia_theo_gio
        ) {
          return 0; // Nếu thiếu dữ liệu trả về 0
        }

        // Chuyển đổi thời gian sang timestamp
        const startTime = new Date(datPhong.thoi_gian_bat_dau).getTime();
        const endTime = new Date(datPhong.thoi_gian_ket_thuc).getTime();

        // Kiểm tra tính hợp lệ của thời gian
        if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
          console.error("Thời gian không hợp lệ:", {
            thoi_gian_bat_dau: datPhong.thoi_gian_bat_dau,
            thoi_gian_ket_thuc: datPhong.thoi_gian_ket_thuc,
          });
          return 0;
        }

        // Kiểm tra giá theo giờ
        const giaTheoGio = parseFloat(datPhong.phong_info.gia_theo_gio);
        if (isNaN(giaTheoGio) || giaTheoGio <= 0) {
          console.error("Giá theo giờ không hợp lệ:", datPhong.phong_info.gia_theo_gio);
          return 0;
        }

        // Tính thời gian chênh lệch (phút)
        const durationInMinutes = (endTime - startTime) / (1000 * 60);

        // Tính tổng tiền cơ bản
        let total = (durationInMinutes / 60) * giaTheoGio; // Chuyển phút sang giờ

        // Kiểm tra khuyến mãi
        if (datPhong.karaoke_info?.khuyen_mai?.length > 0) {
          let maxDiscount = 0; // Lưu trữ giá trị giảm giá lớn nhất

          datPhong.karaoke_info.khuyen_mai.forEach((km) => {
            const kmStart = new Date(km.ngay_bat_dau).getTime();
            const kmEnd = new Date(km.ngay_ket_thuc).getTime();

            // Nếu thời gian kết thúc nằm trong khoảng khuyến mãi
            if (endTime >= kmStart && endTime <= kmEnd) {
              maxDiscount = Math.max(maxDiscount, km.gia_giam); // Lấy giảm giá lớn nhất
            }
          });

          // Áp dụng giảm giá lớn nhất (nếu có)
          if (maxDiscount > 0) {
            total *= 1 - (maxDiscount / 100);
          }
        }

        total = Math.max(0, total); // Đảm bảo giá trị không âm

        // Gọi API để cập nhật tổng tiền vào cơ sở dữ liệu
        await axios.put(`http://localhost:8080/api/datphongs/tongtien/${datPhong._id}`, {
          tong_tien: total,
        });

        return total;
      } catch (error) {
        console.error("Lỗi khi tính tổng tiền:", error);
        return 0; // Trả về 0 nếu xảy ra lỗi
      }
    }



  },
  created() {
    this.fetchKaraokes();
  },
};
</script>

  
<style scoped>
/* Phong cách tổng thể */
.container {
  font-family: Arial, sans-serif;
  margin: 20px auto;
  /* max-width: 900px; */
  width: 90%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề */
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

/* Card quán karaoke */
.karaoke-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.karaoke-card:hover {
  transform: scale(1.02);
}

.karaoke-card h4 {
  font-size: 20px;
  color: #4CAF50;
}

.karaoke-card p {
  font-size: 14px;
  color: #555;
  margin: 5px 0;
}

.karaoke-card button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.karaoke-card button:hover {
  background-color: #45a049;
}

/* Danh sách đặt phòng */
.dat-phong-card {
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}

.dat-phong-card p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.actions button {
  margin-right: 8px;
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.actions button:first-child {
  background-color: #2196F3;
  color: #fff;
}

.actions button:first-child:hover {
  background-color: #1976D2;
}

.actions button:last-child {
  background-color: #f44336;
  color: #fff;
}

.actions button:last-child:hover {
  background-color: #d32f2f;
}

/* Bộ lọc */
.filter-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.filter-group label {
  margin-right: 10px;
  font-size: 14px;
  color: #555;
}

.filter-group select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
}

.filter-group select:focus {
  border-color: #4CAF50;
  outline: none;
}

/* Trạng thái */
.trangthai span {
  font-weight: bold;
}

.trang-thai-cho {
  color: #FF9800;
}

.trang-thai-duyet {
  color: #2196F3;
}

.trang-thai-hoan-thanh {
  color: #4CAF50;
}

/* Không có dữ liệu */
p {
  font-size: 14px;
  color: #888;
  text-align: center;
}
</style>
