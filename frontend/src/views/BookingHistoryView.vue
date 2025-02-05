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

    <!-- Modal chỉnh sửa -->
    <div v-if="showEditModal" class="modal" :class="{ show: showEditModal }">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Chỉnh sửa thông tin đặt phòng</h2>
        <form @submit.prevent="updateBooking">
          <div>
            <label for="thoi_gian_bat_dau">Thời gian bắt đầu:</label>
            <input type="datetime-local" v-model="editData.thoi_gian_bat_dau" required />
          </div>
          <button type="submit">Cập nhật</button>
          <button type="button" @click="closeEditModal">Hủy</button>
        </form>
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
        // Cập nhật trạng thái của booking thành 'da_huy'
        await axios.put(`http://localhost:8080/api/datphongs/${bookingId}`, {
          trang_thai: "da_huy",
        });

        // Cập nhật trạng thái phòng thành 'trong'
        const roomId = this.bookings.find(booking => booking._id === bookingId).phong_info?._id;
        const karaokeId = this.bookings.find(booking => booking._id === bookingId).karaoke_info?._id;

        // Gửi yêu cầu cập nhật trạng thái phòng thành "trống"
        if (roomId && karaokeId) {
          await axios.patch(`http://localhost:8080/api/karaokes/${karaokeId}/rooms/${roomId}`, {
            trang_thai: "trong",  // Cập nhật trạng thái phòng là "trống"
          });
        }

        // Cập nhật trạng thái trong giao diện
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




.booking-history {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
}

.status-filters {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.status-filters button {
  background-color: #348be8;
  color: rgb(0, 0, 0);
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.status-filters button.active {
  background-color: #28a745;
}

.status-filters button:hover {
  background-color: #0056b3;
}

.loading, .error, .no-bookings {
  text-align: center;
  font-size: 18px;
  color: #666;
  padding: 20px;
}

.no-bookings {
  font-style: italic;
  color: #999;
}

.booking-item {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.booking-item h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.booking-item p {
  font-size: 16px;
  margin: 5px 0;
  color: #555;
}

.booking-item strong {
  color: #333;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.actions button {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: #c82333;
}

.actions button:nth-child(2) {
  background-color: #ffc107;
}

.actions button:nth-child(2):hover {
  background-color: #e0a800;
}

/* Responsive Design */
@media (max-width: 768px) {
  .status-filters {
    flex-direction: column;
    align-items: center;
  }

  .status-filters button {
    width: 100%;
    margin-bottom: 10px;
  }

  .booking-item {
    padding: 15px;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .actions button {
    width: 100%;
    margin-bottom: 10px;
  }
}

/* Modal chung */
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
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

.modal.show {
  opacity: 1;
  pointer-events: auto;
}

/* Nội dung modal */
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* Nút đóng modal */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  color: #000;
  cursor: pointer;
  background: transparent;
  border: none;
}

.close:hover {
  color: #f44336;
}

/* Tiêu đề modal */
.modal-content h2 {
  margin: 0;
  font-size: 24px;
  text-align: center;
}

/* Form chỉnh sửa */
form {
  margin-top: 20px;
}

form div {
  margin-bottom: 20px;
}

form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

form button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  margin: 5px;
}

form button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

form button[type="button"] {
  background-color: #f44336;
  color: white;
}

form button:hover {
  opacity: 0.8;
}

/* Đảm bảo modal có hiệu ứng mờ khi hiển thị */
.modal.show .modal-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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