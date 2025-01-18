<template>
  <div class="booking-history">
    <h2>Lịch sử Đặt Phòng</h2>

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
              <p>Trạng thái: {{ datPhong.trang_thai }}</p>
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
.karaoke-card {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.dat-phong-card {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
}
</style>
