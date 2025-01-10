<template>
  <div>
    <h3>Quản lý Phòng quán Karaoke</h3>

    <!-- Danh sách Phòng -->
    <div v-if="rooms.length">
      <h3>Danh sách phòng</h3>
      <div v-for="room in rooms" :key="room._id" class="room-card">
        <h4>{{ room.ten_phong }}</h4>
        <p>Loại phòng: {{ room.loai_phong }}</p>
        <p>Sức chứa: {{ room.suc_chua }}</p>
        <p>Giá theo giờ: {{ room.gia_theo_gio }} VNĐ</p>
        <p>Mô tả: {{ room.mo_ta }}</p>

        <!-- Hiển thị hình ảnh phòng (nếu có) -->
        <div v-if="room.hinh_anh && room.hinh_anh.length">
          <h5>Hình ảnh phòng:</h5>
          <div class="room-images">
            <img v-for="(image, index) in room.hinh_anh" :key="index" :src="'http://localhost:8080/uploads/' + image" alt="Room Image" class="room-image" />
          </div>
        </div>

        <!-- Nút Sửa -->
        <button @click="prepareEditRoom(room)">Sửa</button>
        <button @click="deleteRoom(room._id)">Xóa</button>

        <!-- Form Chỉnh sửa phòng (hiển thị khi phòng được chọn để sửa) -->
        <div v-if="isEditing && editingRoomId === room._id">
          <form @submit.prevent="updateRoom">
            <input type="text" v-model="room.ten_phong" placeholder="Tên phòng" required />
            <input type="text" v-model="room.loai_phong" placeholder="Loại phòng" required />
            <input type="number" v-model="room.suc_chua" placeholder="Sức chứa" required />
            <input type="number" v-model="room.gia_theo_gio" placeholder="Giá theo giờ" required />
            <textarea v-model="room.mo_ta" placeholder="Mô tả"></textarea>
            <input type="file" @change="onFileChange" multiple />
            <div class="preview-images">
              <div v-for="(image, index) in previewImages" :key="index" class="preview-image">
                <img :src="image" alt="Preview" />
              </div>
            </div>
            <button type="submit">Cập nhật phòng</button>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Chưa có phòng nào. Hãy thêm phòng mới!</p>
    </div>

    <!-- Form Thêm Phòng (có thể giữ lại ở trên nếu cần) -->
    <button @click="toggleForm">{{ isEditing ? 'Hủy chỉnh sửa' : 'Thêm Phòng' }}</button>
    <form v-if="showForm" @submit.prevent="isEditing ? updateRoom() : addRoom()">
      <input type="text" v-model="room.ten_phong" placeholder="Tên phòng" required />
      <input type="text" v-model="room.loai_phong" placeholder="Loại phòng" required />
      <input type="number" v-model="room.suc_chua" placeholder="Sức chứa" required />
      <input type="number" v-model="room.gia_theo_gio" placeholder="Giá theo giờ" required />
      <textarea v-model="room.mo_ta" placeholder="Mô tả"></textarea>
      <input type="file" @change="onFileChange" multiple />
      <div class="preview-images">
        <div v-for="(image, index) in previewImages" :key="index" class="preview-image">
          <img :src="image" alt="Preview" />
        </div>
      </div>
      <button type="submit">{{ isEditing ? 'Cập nhật phòng' : 'Thêm phòng' }}</button>
    </form>
  </div>
</template>


<script>
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  props: ["karaokeId", "karaokeName"], // Nhận karaokeId và karaokeName từ props
  data() {
    return {
      rooms: [],
      showForm: false,
      isEditing: false,
      editingRoomId: null, // ID của phòng đang sửa
      room: {
        ten_phong: "",
        loai_phong: "",
        suc_chua: 0,
        gia_theo_gio: 0,
        mo_ta: "",
        hinh_anh: [],
      },
      selectedFiles: [],  // Dữ liệu lưu các tệp đã chọn
      previewImages: [],  // Dữ liệu lưu preview của các hình ảnh
    };
  },
  mounted() {
    if (!this.karaokeId) {
      console.error("karaokeId is missing");
      return;
    }
    console.log("Karaoke ID:", this.karaokeId); // Log karaokeId
    this.fetchRooms();
  },
  methods: {
    // Lấy danh sách phòng từ server
    fetchRooms() {
      axios
        .get(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong`)
        .then((response) => {
          console.log("Dữ liệu phòng nhận được:", response.data);
          if (response.data && Array.isArray(response.data.phong)) {
            this.rooms = response.data.phong;
          } else {
            console.log("Không có phòng nào.");
            this.rooms = [];
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách phòng:", error);
          alert("Không thể tải danh sách phòng.");
        });
    },




    // Bật/Tắt form thêm/sửa phòng
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.resetForm();
      }
    },

    // Xử lý khi chọn tệp (hình ảnh)
    onFileChange(event) {
      this.selectedFiles = event.target.files;
      console.log("Selected files:", this.selectedFiles);
      this.previewImages = Array.from(this.selectedFiles).map((file) =>
        URL.createObjectURL(file)
      );
    },

    // Đặt lại form về trạng thái ban đầu
    resetForm() {
      this.room = {
        ten_phong: "",
        loai_phong: "",
        suc_chua: 0,
        gia_theo_gio: 0,
        mo_ta: "",
        hinh_anh: [],
      };
      this.selectedFiles = [];
      this.previewImages = [];
    },

    // Chuẩn bị sửa phòng
    prepareEditRoom(room) {
      this.room = { ...room };
      this.isEditing = true;
      this.editingRoomId = room._id;
      this.showForm = true;
    },

    // Thêm phòng mới
        // Thêm kiểm tra file trước khi gửi
    addRoom() {
      if (!this.karaokeId) {
        console.error("karaokeId is missing");
        return;
      }

      if (this.selectedFiles.length === 0) {
        alert("Vui lòng chọn ít nhất một tệp hình ảnh.");
        return;
      }

      const formData = new FormData();
      Object.keys(this.room).forEach((key) => {
        if (key !== "hinh_anh") formData.append(key, this.room[key]);
      });

      Array.from(this.selectedFiles).forEach((file) => {
        formData.append("hinh_anh", file);
      });

      axios
        .post(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong`, formData)
        .then((response) => {
          this.fetchRooms();  // Cập nhật lại danh sách phòng
          this.resetForm();  // Đặt lại form
          this.showForm = false;
          toast.success("Thêm phòng thành công");
        })
        .catch((error) => {
          if (error.response) {
            console.error("Lỗi từ server:", error.response.data);
            alert(`Lỗi khi thêm phòng: ${error.response.data.message || 'Không rõ'}`);
          } else {
            console.error("Lỗi không xác định:", error);
            alert("Thêm phòng không thành công.");
          }
        });
    },

  // Cập nhật phòng
  updateRoom() {
    if (!this.karaokeId || !this.editingRoomId) {
      console.error("karaokeId or editingRoomId is missing");
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert("Vui lòng chọn ít nhất một tệp hình ảnh.");
      return;
    }

    const formData = new FormData();
    Object.keys(this.room).forEach((key) => {
      if (key !== "hinh_anh") formData.append(key, this.room[key]);
    });

    Array.from(this.selectedFiles).forEach((file) => {
      formData.append("hinh_anh", file);
    });

    axios
      .put(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong/${this.editingRoomId}`, formData)
      .then((response) => {
        this.fetchRooms();  // Cập nhật lại danh sách phòng
        this.resetForm();  // Đặt lại form
        this.showForm = false;
        this.isEditing = false;  // Dừng trạng thái chỉnh sửa
        toast.success("Cập nhật phòng thành công!");

      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật phòng:", error.response ? error.response.data : error);
        alert("Cập nhật phòng không thành công.");
      });
  },




deleteRoom(roomId) {
  if (!this.karaokeId) {
    console.error("karaokeId is missing");
    return;
  }

  // Hiển thị thông báo xác nhận trước khi xóa
  const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");

  if (isConfirmed) {
    axios
      .delete(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong/${roomId}`)
      .then((response) => {
        this.fetchRooms();  // Cập nhật lại danh sách phòng
        toast.success("Xoá phòng thành công");
      })
      .catch((error) => {
        console.error("Lỗi khi xóa phòng:", error);
        alert("Xóa phòng không thành công.");
      });
  } else {
    console.log("Xóa phòng bị hủy bỏ.");
  }
}

  },
};
</script>

<style scoped>
/* Cấu trúc chung */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h1, h2, h3 {
  color: #333;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

h3 {
  color: #555;
}

/* Form */
form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  transition: transform 0.3s ease;
}

form input, form textarea, form button {
  width: 95%;
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

form button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #0056b3;
}

form input:focus, form textarea:focus {
  border-color: #007bff;
  outline: none;
}

form textarea {
  min-height: 100px;
  resize: vertical;
}

/* Preview Images */
.preview-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.preview-image {
  position: relative;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 8px;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Danh sách phòng */
.room-card {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.room-card h4 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.room-card p {
  font-size: 1rem;
  color: #666;
}

.room-card button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.room-card button:hover {
  background-color: #218838;
}

.room-card button:nth-child(2) {
  background-color: #dc3545;
}

.room-card button:nth-child(2):hover {
  background-color: #c82333;
}

/* Flexbox cho các phòng */
.room-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
}

.room-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Chỉnh sửa button Thêm/Sửa */
button {
  font-size: 1rem;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #e55b00;
}

button:focus {
  outline: none;
}

button:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .room-images {
    justify-content: flex-start;
  }

  form {
    width: 100%;
    padding: 15px;
  }

  .preview-image {
    width: 80px;
    height: 80px;
  }
}
</style>
