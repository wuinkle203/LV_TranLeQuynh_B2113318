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
        <h3>Quán: {{ booking.karaoke_info?.ten_quan }}</h3>
        <p><strong>Phòng:</strong> {{ booking.phong_info?.ten_phong || "Không rõ" }}</p>
        <p><strong>Bắt đầu:</strong> {{ formatDate(booking.thoi_gian_bat_dau) }}</p>
        <p><strong>Kết thúc:</strong> {{ formatDate(booking.thoi_gian_ket_thuc) }}</p>
        <p><strong>Tổng tiền:</strong> {{ formatCurrency(booking.tong_tien) }}</p>
        <p><strong>Trạng thái:</strong> {{ formatStatus(booking.trang_thai) }}</p>
        <p v-if="booking.ghi_chu"><strong>Ghi chú:</strong> {{ booking.ghi_chu }}</p>

        <!-- Nút hành động -->
        <div v-if="booking.trang_thai === 'cho_xac_nhan'" class="actions">
          <button @click="cancelBooking(booking._id)">Hủy Đặt Phòng</button>
          <button @click="openEditModal(booking)">Chỉnh Sửa Thông Tin</button>
                  <!-- Modal chỉnh sửa -->
        <div v-if="showEditModal" class="modal" :class="{ show: showEditModal }">
          <div class="modal-content">
            <span class="close" @click="closeEditModal">&times;</span>
            <h2>Chỉnh sửa thông tin đặt phòng</h2>
            <form @submit.prevent="updateBooking(booking._id)">
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

        
      <!-- Nút Hóa đơn khi trạng thái là 'da_hoan_thanh' -->
      <div v-if="booking.trang_thai === 'da_hoan_thanh'" class="actions">
        <button @click="toggleInvoice(booking._id)">Xem Hóa Đơn</button>
      </div>


            <!-- Hiển thị thông tin hóa đơn nếu đã chọn -->
      <div v-if="selectedBooking && selectedBooking._id === booking._id" class="invoice-details">
        <h2>Chi Tiết Hóa Đơn</h2>
        <h3>Món Ăn:</h3>
        <ul>
          <li v-for="item in selectedBooking.danh_sach_mon_an" :key="item.mon_an_id">
            {{ item.ten }} - Số lượng: {{ item.so_luong }} - Thành tiền: {{ formatCurrency(item.thanh_tien) }}
          </li>
        </ul>
        <h3>Giá Theo Giờ:</h3>
        <ul>
          <li v-for="item in selectedBooking.danh_sach_gia_theo_gio" :key="item.gio_bat_dau">
            Bắt đầu: {{ formatDate(item.gio_bat_dau) }} - Kết thúc: {{ formatDate(item.gio_ket_thuc) }} - Giá: {{ formatCurrency(item.gia_theo_gio*item.so_gio) }}
          </li>
        </ul>

        <h3>Khuyến Mãi:</h3>
        <ul v-if="booking.karaoke_info?.khuyen_mai?.length">
          <li v-if="getBestDiscount(booking.karaoke_info.khuyen_mai, booking.thoi_gian_ket_thuc)">
            {{ getBestDiscount(booking.karaoke_info.khuyen_mai, booking.thoi_gian_ket_thuc).ten_chuong_trinh || "Không có tên" }} -  
            Giảm: {{ getBestDiscount(booking.karaoke_info.khuyen_mai, booking.thoi_gian_ket_thuc).gia_giam }} %
          </li>
          <li v-else>Không có khuyến mãi</li>
        </ul>
        <ul v-else>
          <li>Không có khuyến mãi</li>
        </ul>




        <p><strong>Tổng Tiền: </strong>{{ formatCurrency(selectedBooking.tong_tien) }}</p>
        <button @click="closeInvoice">Đóng</button>
      </div>
    </div>
      </div>

  </div>
</template>


  
  <script>
  import axios from "axios";
  import { toast } from 'vue3-toastify';
  
  export default {
  data() {
    return {
      showInvoiceModal: false,
      selectedBooking: null, // Chỉ lưu booking đã chọn để hiển thị hóa đơn
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

    getBestDiscount(khuyenMaiList, thoiGianKetThuc) {
    if (!khuyenMaiList || khuyenMaiList.length === 0) {
      return null; // Không có khuyến mãi
    }

    // Chuyển đổi thời gian kết thúc thành timestamp để so sánh
    const ketThucTimestamp = new Date(thoiGianKetThuc).getTime();

    // Lọc các khuyến mãi có hiệu lực vào thời điểm giờ kết thúc
    const khuyenMaiHieuLuc = khuyenMaiList.filter(km => {
      const batDau = new Date(km.ngay_bat_dau).getTime();
      const ketThuc = new Date(km.ngay_ket_thuc).getTime();
      return ketThucTimestamp >= batDau && ketThucTimestamp <= ketThuc;
    });

    if (khuyenMaiHieuLuc.length === 0) {
      return null; // Không có khuyến mãi hợp lệ
    }

    // Tìm khuyến mãi có mức giảm giá cao nhất
    return khuyenMaiHieuLuc.reduce((max, km) => {
      return (km.gia_giam > max.gia_giam) ? km : max;
    });
  },
      // Hàm để toggle hiển thị hóa đơn
      toggleInvoice(bookingId) {
        // Nếu đã chọn booking, thì đóng (ẩn hóa đơn)
        if (this.selectedBooking && this.selectedBooking._id === bookingId) {
          this.selectedBooking = null;
        } else {
          // Nếu chưa chọn hoặc muốn đổi hóa đơn, thì cập nhật booking hiện tại
          this.selectedBooking = this.bookings.find(booking => booking._id === bookingId);
        }
      },

      closeInvoice() {
        this.selectedBooking = null; // Ẩn thông tin hóa đơn khi đóng
      },


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


    async updateBooking(bookingId) {
  try {
    console.log("Bắt đầu cập nhật đặt phòng...", bookingId);

    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?.userId;

    if (!userId) {
      this.error = "Không tìm thấy thông tin người dùng!";
      toast.error('Vui lòng đăng nhập để cập nhật đặt phòng', { autoClose: 800 });
      setTimeout(() => {
        this.$router.push('/login');
      }, 1500);
      return;
    }

    console.log("Lấy thông tin người dùng...");
    const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
    const user = response.data;

    if (!user.ho_ten || !user.email || !user.so_dien_thoai || !user.dia_chi) {
      this.error = "Vui lòng cập nhật đầy đủ thông tin cá nhân.";
      setTimeout(() => {
        this.$router.push("/profile");
      }, 1500);
      return;
    }

    const formattedTime = new Date(this.editData.thoi_gian_bat_dau).toISOString();
    console.log("Thời gian cập nhật:", formattedTime);

    const booking = this.bookings.find(booking => booking._id === bookingId);
    console.log("Thông tin booking:", booking);

    const roomId = booking?.phong_info?._id;
    const karaokeId = booking?.karaoke_info?._id;

    if (!roomId || !karaokeId) {
      console.error("Không tìm thấy thông tin phòng hoặc quán karaoke.");
      this.error = "Không tìm thấy thông tin phòng hoặc quán karaoke.";
      return;
    }

    console.log("Lấy thông tin phòng...");
    const roomResponse = await axios.get(`http://localhost:8080/api/karaokes/${karaokeId}/rooms/${roomId}`);
    const room = roomResponse.data;

    // if (!Array.isArray(room?.gia_theo_gio)) {
    //   console.error("Thông tin giá theo giờ không hợp lệ.");
    //   this.error = "Thông tin giá theo giờ không hợp lệ.";
    //   return;
    // }

    console.log("Danh sách giá theo giờ:", room.gia_theo_gio);

    const bookingTime = new Date(formattedTime);
    const bookingHour = bookingTime.getHours();
    const bookingMinute = bookingTime.getMinutes();
    let isTimeValid = false;

    for (const timeSlot of room?.data?.gia_theo_gio) {
      const startTimeParts = timeSlot.gio_bat_dau.split(':');
      const endTimeParts = timeSlot.gio_ket_thuc.split(':');

      const startHour = parseInt(startTimeParts[0], 10);
      const startMinute = parseInt(startTimeParts[1], 10);
      const endHour = parseInt(endTimeParts[0], 10);
      const endMinute = parseInt(endTimeParts[1], 10);

      console.log(`Khung giờ: ${timeSlot.gio_bat_dau} - ${timeSlot.gio_ket_thuc}`);

      if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
        if (
          (bookingHour > startHour || (bookingHour === startHour && bookingMinute >= startMinute)) ||
          (bookingHour < endHour || (bookingHour === endHour && bookingMinute <= endMinute))
        ) {
          isTimeValid = true;
          break;
        }
      } else {
        if (
          (bookingHour > startHour || (bookingHour === startHour && bookingMinute >= startMinute)) &&
          (bookingHour < endHour || (bookingHour === endHour && bookingMinute <= endMinute))
        ) {
          isTimeValid = true;
          break;
        }
      }
    }

    if (!isTimeValid) {
      console.warn("Thời gian không hợp lệ!");
      this.closeEditModal();
      toast.error("Thời gian này quán chưa mở cửa")
      this.error = "Xin lỗi, quán chưa mở vào thời gian bạn muốn cập nhật!";
      return;
    }

    console.log("Thời gian hợp lệ, gửi yêu cầu cập nhật...");

    const updateResponse = await axios.put(`http://localhost:8080/api/datphongs/${bookingId}`, {
      thoi_gian_bat_dau: formattedTime,
    });

    console.log("Kết quả cập nhật API:", updateResponse.data);

    this.bookings = this.bookings.map((booking) =>
      booking._id === bookingId
        ? { ...booking, thoi_gian_bat_dau: formattedTime }
        : booking
    );

    toast.success("Cập nhật đặt phòng thành công!", { autoClose: 800 });
    this.closeEditModal();
  } catch (error) {
    console.error("Lỗi khi cập nhật đặt phòng:", error);
    this.error = "Cập nhật thông tin thất bại.";
  }
}




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
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

/* ===== BỘ LỌC TRẠNG THÁI ===== */
.status-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.status-filters button {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.status-filters button.active {
  background: #ff5722;
  color: white;
}

.status-filters button:hover {
  background: #ff8a50;
}

/* ===== DANH SÁCH LỊCH SỬ ===== */
.booking-item {
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.booking-item h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #ff5722;
}

.booking-item p {
  margin: 5px 0;
  font-size: 16px;
}

.actions {
  margin-top: 10px;
}

.actions button {
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
  margin-right: 5px;
}

.actions button:first-child {
  background: #ff1744;
  color: white;
}

.actions button:last-child {
  background: #ff9800;
  color: white;
}

.actions button:hover {
  opacity: 0.8;
}

/* ===== MODAL CHỈNH SỬA ===== */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal.show {
  display: flex;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content .close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #ff5722;
}

/* ===== HÓA ĐƠN ===== */
.invoice-details {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.invoice-details h2 {
  font-size: 20px;
  color: #ff5722;
}

.invoice-details ul {
  padding-left: 20px;
}

.invoice-details button {
  background: #ff1744;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.invoice-details button:hover {
  opacity: 0.8;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .status-filters {
    flex-direction: column;
    align-items: center;
  }

  .status-filters button {
    width: 100%;
    font-size: 14px;
  }

  .booking-item {
    padding: 10px;
  }

  .actions button {
    width: 100%;
    margin-bottom: 5px;
  }

  .modal-content {
    max-width: 90%;
  }
}


</style>