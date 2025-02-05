<template>
  <div class="booking-container">
    <div class="booking-form">
      <h3>Đặt phòng</h3>
      <form @submit.prevent="submitBooking">
        <label for="name">Tên của bạn:</label>
        <input type="text" v-model="name" id="name" required />

        <label for="phone">Số điện thoại:</label>
        <input type="text" v-model="phone" id="phone" required />

        <label for="time">Thời gian đặt:</label>
        <input type="datetime-local" v-model="bookingTime" id="time" required />

        <button type="submit">Đặt phòng</button>
      </form>

      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "BookingForm",
  data() {
    return {
      name: "",
      phone: "",
      bookingTime: "",
      error: null,
      successMessage: null,
    };
  },
  methods: {
    async submitBooking() {
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.userId; // Lấy user_id từ localStorage

      if (!userId) {
        this.error = "Không tìm thấy thông tin người dùng!";
        return;
      }

      try {
        // Gửi yêu cầu lấy thông tin người dùng
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        const user = response.data;

        // Kiểm tra nếu các thông tin bị thiếu
        if (!user.ho_ten || !user.email || !user.so_dien_thoai || !user.dia_chi) {
          this.error = "Vui lòng cập nhật đầy đủ thông tin cá nhân.";
          // Chuyển hướng người dùng tới trang cập nhật thông tin
          setTimeout(() => {
            this.$router.push("/profile");
          }, 1500);
          return;
        }

        // Nếu thông tin hợp lệ, tiến hành đặt phòng
        const karaokeId = this.$route.params.karaokeId; 
        const bookingData = {
          name: this.name,
          phone: this.phone,
          thoi_gian_bat_dau: this.bookingTime,
          phong_id: this.$route.params.roomId,
          karaoke_id: karaokeId,
          nguoi_dung_id: userId,
        };

        const bookingResponse = await axios.post("http://localhost:8080/api/datphongs", bookingData);
        this.successMessage = "Đặt phòng thành công!";
        this.error = null;

        // Cập nhật trạng thái phòng sau khi đặt
        const roomId = this.$route.params.roomId;
        await axios.patch(`http://localhost:8080/api/karaokes/${karaokeId}/rooms/${roomId}`, {
          trang_thai: "dang_su_dung",
        });

        toast.success('Đặt phòng thành công', { autoClose: 800 });

        // Chuyển tới lịch sử đặt phòng
        setTimeout(() => {
          this.$router.push('/booking-history');
        }, 800);
      } catch (err) {
        this.error = "Đã xảy ra lỗi khi đặt phòng.";
        this.successMessage = null;
        console.error(err);
      }
    },
  },
};
</script>


  
  
  <style scoped>
  .booking-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

button:hover {
  background-color: #2980b9;
}

.booking-form {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

label {
  font-size: 16px;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

input[type="text"],
input[type="datetime-local"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="datetime-local"]:focus {
  border-color: #3498db;
  outline: none;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #27ae60;
}

.error {
  color: #e74c3c;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
}

.success {
  color: #2ecc71;
  background-color: #d4edda;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
}

@media (max-width: 600px) {
  .booking-container {
    padding: 10px;
  }

  .booking-form {
    padding: 15px;
  }

  button {
    font-size: 14px;
    padding: 8px 16px;
  }
}

  </style>
  