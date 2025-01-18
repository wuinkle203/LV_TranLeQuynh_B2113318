<template>
  <div class="booking-view">
    <div v-if="loading" class="loading">Đang tải thông tin phòng...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="room" class="room-detail">
      <button>
        <<router-link to='/rooms'>Quay lại</router-link>
      </button>
      <h2>{{ room.ten_phong }} ({{ room.loai_phong }})</h2>
      
      <!-- Hiển thị tên quán karaoke -->
      <p><strong>Quán:</strong> {{ room.ten_quan }}</p>

      <div class="room-images">
        <img v-for="(image, index) in room.hinh_anh" :key="index" :src="'http://localhost:8080/uploads/' + image" alt="Room Image" class="room-image" />
      </div>
      <p><strong>Sức chứa:</strong> {{ room.suc_chua }} người</p>
      <p><strong>Giá theo giờ:</strong> {{ room.gia_theo_gio.toLocaleString() }} VND</p>
      <p><strong>Mô tả:</strong> {{ room.mo_ta }}</p>

      <!-- Nút đặt phòng -->
      <button @click="toggleBookingForm">
        {{ isBookingFormVisible ? "Huỷ" : "Đặt phòng" }}
      </button>

      <!-- Hiển thị form đặt phòng khi nút được nhấn -->
      <BookingForm v-if="isBookingFormVisible" @booking-success="handleBookingSuccess" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BookingForm from "@/components/BookingForm.vue";

export default {
  name: "BookingView",
  components: {
    BookingForm,
  },
  data() {
    return {
      room: null,
      loading: true,
      error: null,
      isBookingFormVisible: false, // Quản lý việc hiển thị form đặt phòng
    };
  },
  mounted() {
    this.fetchRoomDetails();
  },
  methods: {
    async fetchRoomDetails() {
      const { roomId, karaokeId } = this.$route.params;
      try {
        const response = await axios.get(`http://localhost:8080/api/karaokes/${karaokeId}/rooms/${roomId}`);
        if (response.data.success) {
          this.room = response.data.data;
        } else {
          this.error = response.data.message || "Không thể tải thông tin phòng.";
        }
      } catch (err) {
        this.error = "Đã xảy ra lỗi khi tải thông tin phòng.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    toggleBookingForm() {
      this.isBookingFormVisible = !this.isBookingFormVisible; // Toggle hiển thị form đặt phòng
    },
    handleBookingSuccess(bookingData) {
      // Xử lý khi đặt phòng thành công, ví dụ như lưu thông tin đặt phòng
      console.log("Đặt phòng thành công:", bookingData);
    },
  },
};
</script>



<style scoped>
.booking-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 32px;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  font-size: 28px;
  color: #34495e;
  margin-bottom: 15px;
  font-weight: bold;
}

p {
  font-size: 18px;
  color: #7f8c8d;
  margin: 8px 0;
}

strong {
  font-weight: bold;
  color: #2c3e50;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #3498db;
}

.error {
  color: #e74c3c;
  background-color: #f8d7da;
  padding: 12px;
  border-radius: 5px;
  margin-top: 20px;
}

.room-images {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
}

.room-image {
  width: 100%;
  max-width: 250px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
}

.room-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

button {
  background-color: #3498db;
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;
  margin: 20px auto;
  display: block;
  width: 200px;
}

button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(2px);
}

.booking-form {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  text-align: center;
}

.booking-form input,
.booking-form button {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 15px;
}

.booking-form input {
  border: 1px solid #ddd;
}

.booking-form input:focus {
  border-color: #3498db;
  outline: none;
}

.booking-form button {
  background-color: #2ecc71;
  color: white;
  border: none;
  transition: background-color 0.3s;
}

.booking-form button:hover {
  background-color: #27ae60;
}

.booking-form button:active {
  background-color: #1e8449;
}

@media (max-width: 768px) {
  .room-images {
    flex-direction: column;
    align-items: center;
  }

  .room-image {
    max-width: 80%;
  }

  button {
    width: 100%;
  }
}

</style>
