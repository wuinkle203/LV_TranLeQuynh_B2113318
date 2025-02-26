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
  const userId = userData?.userId;

  if (!userId) {
    this.error = "Không tìm thấy thông tin người dùng!";
    toast.error('Vui lòng đăng nhập để đặt phòng', { autoClose: 800 });
    setTimeout(() => {
      this.$router.push('/login');
    }, 1500);
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
    const user = response.data;

    if (!user.ho_ten || !user.email || !user.so_dien_thoai || !user.dia_chi) {
      this.error = "Vui lòng cập nhật đầy đủ thông tin cá nhân.";
      setTimeout(() => {
        this.$router.push("/profile");
      }, 1500);
      return;
    }

    const karaokeId = this.$route.params.karaokeId;
    const roomId = this.$route.params.roomId;

    // Lấy thông tin phòng
    const roomResponse = await axios.get(`http://localhost:8080/api/karaokes/${karaokeId}/rooms/${roomId}`);
    const room = roomResponse.data;

    console.log("Dữ liệu phòng:", room);
    console.log("Gia theo gio:", room?.data?.gia_theo_gio);

    if (!Array.isArray(room?.data?.gia_theo_gio)) {
      console.error("Khung giờ phòng không hợp lệ hoặc không có dữ liệu khung giờ.");
      return;
    }

    // Kiểm tra xem thời gian đặt có nằm trong các khoảng giá theo giờ không
    const bookingTime = new Date(this.bookingTime);  // Thời gian đặt phòng
    let isTimeValid = false;

    // Chuyển đổi giờ đặt phòng thành giờ trong ngày
    const bookingHour = bookingTime.getHours();
    const bookingMinute = bookingTime.getMinutes();

    for (const timeSlot of room?.data?.gia_theo_gio) {
      const startTimeParts = timeSlot.gio_bat_dau.split(':');
      const endTimeParts = timeSlot.gio_ket_thuc.split(':');

      const startHour = parseInt(startTimeParts[0], 10);
      const startMinute = parseInt(startTimeParts[1], 10);
      const endHour = parseInt(endTimeParts[0], 10);
      const endMinute = parseInt(endTimeParts[1], 10);

      console.log("Khung giờ:", timeSlot.gio_bat_dau, "-", timeSlot.gio_ket_thuc);
      console.log("So sánh:", bookingHour, ":", bookingMinute, "với", startHour, ":", startMinute, "và", endHour, ":", endMinute);

      // Xử lý trường hợp khung giờ qua đêm
      if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
        // Khung giờ qua đêm, chia làm hai phần
        if (
          (bookingHour > startHour || (bookingHour === startHour && bookingMinute >= startMinute)) ||
          (bookingHour < endHour || (bookingHour === endHour && bookingMinute <= endMinute))
        ) {
          isTimeValid = true;
          break;
        }
      } else {
        // Khung giờ bình thường, không qua đêm
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
      this.error = "Xin lỗi, quán chưa mở vào thời gian bạn đặt!";
      this.successMessage = null;
      return;
    }

    const bookingData = {
      name: this.name,
      phone: this.phone,
      thoi_gian_bat_dau: this.bookingTime,
      phong_id: roomId,
      karaoke_id: karaokeId,
      nguoi_dung_id: userId,
    };

    const bookingResponse = await axios.post("http://localhost:8080/api/datphongs", bookingData);
    this.successMessage = "Đặt phòng thành công!";
    this.error = null;

    await axios.patch(`http://localhost:8080/api/karaokes/${karaokeId}/rooms/${roomId}`, {
      trang_thai: "dang_su_dung",
    });

    toast.success('Đặt phòng thành công', { autoClose: 800 });

    setTimeout(() => {
      this.$router.push('/booking-history');
    }, 800);
  } catch (err) {
    this.error = "Đã xảy ra lỗi khi đặt phòng.";
    this.successMessage = null;
    console.error(err);
  }
}




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
  background-color: #435D76;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
  font-weight: bold;
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
  font-weight: bold;
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
  background-color: #435D76;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: rgba(114, 153, 193, 0.8);
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
  