<template>
  <div class="booking-history">
    <h1>Lịch sử đặt phòng</h1>

    <!-- Bộ lọc trạng thái -->
    <div class="status-filters">
      <button :class="{ active: currentStatus === null }" @click="filterBookings(null)">
        Tất cả
      </button>
      <button :class="{ active: currentStatus === 'cho_xac_nhan' }" @click="filterBookings('cho_xac_nhan')">
        Chờ xác nhận
      </button>
      <button :class="{ active: currentStatus === 'da_xac_nhan' }" @click="filterBookings('da_xac_nhan')">
        Đã xác nhận
      </button>
      <button :class="{ active: currentStatus === 'da_hoan_thanh' }" @click="filterBookings('da_hoan_thanh')">
        Hoàn thành
      </button>
      <button :class="{ active: currentStatus === 'da_huy' }" @click="filterBookings('da_huy')">
        Đã hủy
      </button>
    </div>

    <!-- Hiển thị trạng thái tải -->
    <div v-if="loading" class="loading">Đang tải dữ liệu, vui lòng chờ...</div>

    <!-- Hiển thị lỗi -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Hiển thị nếu không có lịch sử đặt phòng -->
    <div v-if="!loading && filteredBookings.length === 0" class="no-bookings">
      Không có lịch sử đặt phòng phù hợp.
    </div>

    <!-- Hiển thị danh sách lịch sử đặt phòng -->
    <div v-else>
      <div v-for="booking in filteredBookings" :key="booking._id" class="booking-item">
        <h3>Phòng: {{ booking.phong_info?.ten_phong || "Không rõ" }}</h3>
        <p><strong>Quán Karaoke:</strong> {{ booking.karaoke_info?.ten_quan || "Không rõ" }}</p>
        <p><strong>Bắt đầu:</strong> {{ formatDate(booking.thoi_gian_bat_dau) }}</p>
        <p><strong>Kết thúc:</strong> {{ formatDate(booking.thoi_gian_ket_thuc) }}</p>
        <p><strong>Tổng tiền:</strong> {{ formatCurrency(booking.tong_tien) }}</p>
        <p><strong>Trạng thái:</strong> {{ formatStatus(booking.trang_thai) }}</p>
        <p v-if="booking.ghi_chu"><strong>Ghi chú:</strong> {{ booking.ghi_chu }}</p>

        <!-- Nút hành động -->
        <div v-if="booking.trang_thai === 'cho_xac_nhan'" class="actions">
          <button @click="cancelBooking(booking._id)">Hủy Đặt Phòng</button>
          <button @click="openEditModal(booking)">Chỉnh Sửa Thông Tin</button>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script>
  import axios from "axios";
  
  export default {
  data() {
    return {
      bookings: [], // Danh sách tất cả lịch sử đặt phòng
      loading: true,
      error: null,
      currentStatus: null, // Trạng thái hiện tại để lọc (null là hiển thị tất cả)
      showEditModal: false,
      editData: {
        bookingId: null,
        thoi_gian_bat_dau: "",
      },
    };
  },
  computed: {
    filteredBookings() {
      if (this.currentStatus === null) {
        return this.bookings;
      }
      return this.bookings.filter((booking) => booking.trang_thai === this.currentStatus);
    },
  },
  methods: {
    filterBookings(status) {
      this.currentStatus = status;
    },
    formatDate(date) {
      return new Date(date).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatStatus(status) {
      const statuses = {
        cho_xac_nhan: "Chờ xác nhận",
        da_xac_nhan: "Đã xác nhận",
        da_hoan_thanh: "Hoàn thành",
        da_huy: "Đã hủy",
      };
      return statuses[status] || "Không rõ";
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    async cancelBooking(bookingId) {
      try {
        await axios.put(`http://localhost:8080/api/datphongs/${bookingId}`, {
          trang_thai: "da_huy",
        });
        this.bookings = this.bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, trang_thai: "da_huy" } : booking
        );
        alert("Hủy đặt phòng thành công.");
      } catch (error) {
        console.error("Lỗi khi hủy đặt phòng:", error);
        alert("Hủy đặt phòng thất bại.");
      }
    },
    openEditModal(booking) {
      if (!booking || !booking._id) return;
      this.editData.bookingId = booking._id;
      this.editData.thoi_gian_bat_dau = booking.thoi_gian_bat_dau || "";
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editData = { bookingId: null, thoi_gian_bat_dau: "" };
    },
    async updateBooking() {
      try {
        const formattedTime = new Date(this.editData.thoi_gian_bat_dau).toISOString();
        await axios.put(`http://localhost:8080/api/datphongs/${this.editData.bookingId}`, {
          thoi_gian_bat_dau: formattedTime,
        });
        this.bookings = this.bookings.map((booking) =>
          booking._id === this.editData.bookingId
            ? { ...booking, thoi_gian_bat_dau: formattedTime }
            : booking
        );
        alert("Cập nhật thông tin thành công.");
        this.closeEditModal();
      } catch (error) {
        console.error("Lỗi khi cập nhật đặt phòng:", error);
        alert("Cập nhật thông tin thất bại.");
      }
    },
  },
  async created() {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;
      if (!userId) {
        this.error = "Người dùng không xác định.";
        return;
      }
      const response = await axios.get(
        `http://localhost:8080/api/datphongs/history/${userId}`
      );
      this.bookings = response.data || [];
    } catch (error) {
      this.error = error.response?.data?.message || "Lỗi khi lấy lịch sử đặt phòng.";
    } finally {
      this.loading = false;
    }
  },
};


  </script>
  
  <style scoped>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}
.status-filters button {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: pointer;
}

.status-filters button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}


</style>