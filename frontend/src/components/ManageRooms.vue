<template>
  <div class="container">
    <h3>Quản lý Phòng quán Karaoke</h3>

    <!-- Form Thêm Phòng -->
    <button class="add-room-button" @click="toggleForm">Thêm Phòng</button>
    <form v-if="isFormVisible" @submit.prevent="addRoom">
      <input type="text" v-model="newRoom.ten_phong" placeholder="Tên phòng" required />
      <input type="text" v-model="newRoom.loai_phong" placeholder="Loại phòng" required />
      <input type="number" v-model="newRoom.suc_chua" placeholder="Sức chứa" required />
      <input type="number" v-model="newRoom.gia_theo_gio" placeholder="Giá theo giờ" required />
      <textarea v-model="newRoom.mo_ta" placeholder="Mô tả"></textarea>
      <select v-model="newRoom.trang_thai" required>
        <option value="trong">Đang Hoạt Động</option>
        <option value="dang_hoat_dong">Đã Được Đặt</option>
        <option value="can_bao_tri">Đang Sửa Chửa</option>
      </select>
      <input type="file" @change="onFileChange" multiple />
      <div class="preview-images">
        <div v-for="(image, index) in previewImages" :key="index" class="preview-image">
          <img :src="image" alt="Preview" />
        </div>
      </div>
      <button type="submit">Thêm phòng</button>
    </form>
    <div v-if="rooms.length" class="room-list"><h3>Danh sách phòng</h3></div>
    <!-- Danh sách Phòng -->
    <div v-if="rooms.length" class="room-list">
      <div v-for="room in paginatedRooms" :key="room._id" class="room-card">
  <h4>{{ room.ten_phong }}</h4>
  <p>Loại phòng: {{ room.loai_phong }}</p>
  <p>Sức chứa: {{ room.suc_chua }}</p>
  <p>Giá theo giờ: {{ room.gia_theo_gio }} VNĐ</p>
  <p class="trangthai">
    Trạng thái
    <div v-if="room.trang_thai == 'trong'" class="trang_thai">: Phòng Trống</div>
    <div v-if="room.trang_thai == 'dang_su_dung'" class="trang_thai">: Phòng Đã Được Đặt</div>
    <div v-if="room.trang_thai == 'can_bao_tri'" class="trang_thai">: Phòng Đang Được Bảo Trì</div>
  </p>
  <p>Mô tả: {{ room.mo_ta }}</p>

  <div v-if="room.hinh_anh && room.hinh_anh.length">
  <h5>Hình ảnh phòng:</h5>
  <div class="room-images">
    <!-- Hiển thị ảnh theo chỉ số của từng phòng -->
    <div v-if="imageIndexes[room._id] >= 0 && imageIndexes[room._id] < room.hinh_anh.length">
      <img 
        :src="'http://localhost:8080/uploads/' + room.hinh_anh[imageIndexes[room._id]]" 
        alt="Room Image" 
        class="room-image" 
      />
    </div>
  </div>
  <!-- Điều hướng ảnh -->
  <div class="image-navigation">
    <button @click="prevImage(room)" :disabled="imageIndexes[room._id] <= 0"><</button>
    <button @click="nextImage(room)" :disabled="imageIndexes[room._id] >= room.hinh_anh.length - 1">></button>
  </div>
</div>


  <div class="button-container">
    <button @click="toggleEditMode(room)">Sửa</button>
    <button @click="deleteRoom(room._id)">Xóa</button>
  </div>

        <div v-if="currentRoom._id === room._id && editMode">
          <h3>Sửa Phòng</h3>
          <form @submit.prevent="updateRoom">
            <input type="text" v-model="currentRoom.ten_phong" placeholder="Tên phòng" required />
            <input type="text" v-model="currentRoom.loai_phong" placeholder="Loại phòng" required />
            <input type="number" v-model="currentRoom.suc_chua" placeholder="Sức chứa" required />
            <input type="number" v-model="currentRoom.gia_theo_gio" placeholder="Giá theo giờ" required />
            <textarea v-model="currentRoom.mo_ta" placeholder="Mô tả"></textarea>
            <select v-model="currentRoom.trang_thai" required>
              <option value="trong"> Phòng Trống</option>
              <option value="dang_su_dung"> Đã Được Đặt</option>
              <option value="can_bao_tri"> Đang Sửa Chửa</option>
            </select>
            <input type="file" @change="onFileChangeEdit" multiple />
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
          <!-- Điều hướng phân trang -->
      <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Trang trước</button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Trang sau</button>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  props: ["karaokeId", "karaokeName"],
  data() {
    return {
      rooms: [],
      newRoom: {
        ten_phong: "",
        loai_phong: "",
        suc_chua: 0,
        gia_theo_gio: 0,
        mo_ta: "",
        trang_thai: "trong",
        hinh_anh: [],
      },
      currentRoom: {
        _id: null,
        ten_phong: "",
        loai_phong: "",
        suc_chua: 0,
        gia_theo_gio: 0,
        mo_ta: "",
        trang_thai: "",
        hinh_anh: [],
      },
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 6, // Số lượng phòng trên mỗi trang
      previewImages: [],
      editMode: false,
      isFormVisible: false, 
      currentImageIndex: 0, 
      imageIndexes: {},// Biến để kiểm soát hiển thị form thêm phòng
    };
  },
  mounted() {
    if (!this.karaokeId) {
      console.error("karaokeId is missing");
      return;
    }
    this.fetchRooms();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.rooms.length / this.itemsPerPage);
    },
    paginatedRooms() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.rooms.slice(startIndex, endIndex);
    },
  },
  methods: {

  // Di chuyển đến ảnh trước
  prevImage(room) {
    if (this.imageIndexes[room._id] > 0) {
      this.imageIndexes[room._id]--;
    }
  },

  // Di chuyển đến ảnh sau
  nextImage(room) {
    if (this.imageIndexes[room._id] < room.hinh_anh.length - 1) {
      this.imageIndexes[room._id]++;
    }
  },

  
  // Hàm để chuyển về ảnh đầu tiên khi cập nhật thông tin phòng
  resetImageIndex() {
    this.currentImageIndex = 0;
  },
  

    prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  },
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  },
    fetchRooms() {
      axios
        .get(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong`)
        .then((response) => {
          this.rooms = response.data.phong || [];
                  // Khởi tạo giá trị chỉ số ảnh cho từng phòng
        this.rooms.forEach(room => {
          this.imageIndexes[room._id] = 0; // Mặc định hiển thị ảnh đầu tiên
        });
        })
        .catch((error) => {
          alert("Không thể tải danh sách phòng.");
        });
    },

    onFileChange(event) {
      this.newRoom.hinh_anh = event.target.files;
      this.previewImages = Array.from(this.newRoom.hinh_anh).map((file) =>
        URL.createObjectURL(file)
      );
    },

    onFileChangeEdit(event) {
      this.currentRoom.hinh_anh = event.target.files;
      this.previewImages = Array.from(this.currentRoom.hinh_anh).map((file) =>
        URL.createObjectURL(file)
      );
    },

    addRoom() {
      if (this.newRoom.hinh_anh.length === 0) {
        alert("Vui lòng chọn ít nhất một tệp hình ảnh.");
        return;
      }

      const formData = new FormData();
      Object.keys(this.newRoom).forEach((key) => {
        if (key !== "hinh_anh") formData.append(key, this.newRoom[key]);
      });

      Array.from(this.newRoom.hinh_anh).forEach((file) => {
        formData.append("hinh_anh", file);
      });

      axios
        .post(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong`, formData)
        .then(() => {
          this.fetchRooms();
          this.resetForm();
          toast.success("Thêm phòng thành công");
        })
        .catch(() => {
          alert("Thêm phòng không thành công.");
        });
    },

    toggleEditMode(room) {
      if (this.currentRoom._id === room._id && this.editMode) {
        this.editMode = false;
        this.resetForm();
      } else {
        this.currentRoom = { ...room };
        this.editMode = true;
      }
    },

    updateRoom() {
      const formData = new FormData();
      Object.keys(this.currentRoom).forEach((key) => {
        if (key !== "hinh_anh") formData.append(key, this.currentRoom[key]);
      });

      // Nếu không có hình ảnh mới, giữ lại hình ảnh cũ
      if (this.currentRoom.hinh_anh.length === 0) {
        if (this.currentRoom.hinh_anh_cu && this.currentRoom.hinh_anh_cu.length > 0) {
          // Chuyển các hình ảnh cũ vào formData
          this.currentRoom.hinh_anh_cu.forEach((file) => {
            formData.append("hinh_anh", file);
          });
        }
      } else {
        // Nếu có hình ảnh mới, thêm các hình ảnh mới vào formData
        Array.from(this.currentRoom.hinh_anh).forEach((file) => {
          formData.append("hinh_anh", file);
        });
      }

      // Gửi yêu cầu PUT với formData
      axios
        .put(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong/${this.currentRoom._id}`, formData)
        .then(() => {
          this.fetchRooms();
          this.resetForm();
          this.editMode = false;
          toast.success("Cập nhật phòng thành công");
        })
        .catch(() => {
          alert("Cập nhật phòng không thành công.");
        });
    },



    resetForm() {
      this.newRoom = {
        ten_phong: "",
        loai_phong: "",
        suc_chua: 0,
        gia_theo_gio: 0,
        mo_ta: "",
        trang_thai:"",
        hinh_anh: [],
      };
      this.previewImages = [];
    },

    deleteRoom(roomId) {
      if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
        axios
          .delete(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong/${roomId}`)
          .then(() => {
            this.fetchRooms();
            toast.success("Xóa phòng thành công");
          })
          .catch(() => {
            alert("Xóa phòng không thành công.");
          });
      }
    },

    // Hàm để ẩn/hiện form thêm phòng
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
    }
  },
};
</script>


<style scoped>
/* Container chính */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Tiêu đề */
h3 {
  font-family: 'Roboto', sans-serif;
  color: #333;
  font-size: 24px;
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: 1px;
}

/* Form Thêm Phòng */
form {
  background-color: #f4f7fc;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  animation: slideIn 0.5s ease-out;
}

form input, form textarea, form button {
  width: 100%;
  font-size: 16px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition: all 0.3s ease;
}

form input:focus, form textarea:focus {
  border-color: #007bff;
  outline: none;
}

form input[type="file"] {
  border: none;
  padding: 0;
}

form textarea {
  resize: vertical;
  min-height: 120px;
}

.trangthai{
  display: flex;
}

form button {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

form button:hover {
  background-color: #0056b3;
}

form button:active {
  transform: scale(0.98);
}

.preview-images {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.preview-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.preview-image img:hover {
  transform: scale(1.1);
}

/* Hiệu ứng khi form được hiện ra */
@keyframes slideIn {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
/* Danh sách phòng */
.room-list {
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  justify-items: center;
}

/* Card phòng */
.room-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}



.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.room-card h4 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.room-card p {
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
}

.room-card .button-container {
  display: flex;
  gap: 10px; /* Khoảng cách giữa các nút */
  margin-top: 10px; /* Khoảng cách từ dưới nội dung phòng */
}

.room-card button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.room-card button:hover {
  background-color: #e03e24;
}


.room-images img {
  width: 120px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
  transition: transform 0.3s ease;
}

.room-images img:hover {
  transform: scale(1.1);
}

/* Button Thêm Phòng */
.add-room-button {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-room-button:hover {
  background-color: #218838;
}

.add-room-button:active {
  transform: scale(0.98);
}

/* Đảm bảo responsive */
@media (max-width: 1024px) {
  .room-list {
    grid-template-columns: repeat(2, 1fr); /* 2 cột trên một hàng với màn hình nhỏ hơn */
  }
}

@media (max-width: 768px) {
  .room-list {
    grid-template-columns: 1fr; /* 1 cột trên một hàng với màn hình rất nhỏ */
  }

  .room-card {
    margin-bottom: 15px;
  }
}

/* Chung */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f7fb;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h3 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

h4 {
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

h5 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 10px;
}

p {
  color: #555;
  font-size: 16px;
}

/* Card phòng */
.room-card {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  transition: transform 0.3s;
}

.room-card:hover {
  transform: translateY(-5px);
}

/* Style cho các ảnh phòng karaoke */
.room-images {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  position: relative;
}

/* Hình ảnh phòng karaoke */
.room-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.room-image:hover {
  transform: scale(1.05);
}

/* Style cho nút điều hướng ảnh */
.image-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  width: 100%;
}

.image-navigation button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.image-navigation button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.image-navigation button:hover {
  background-color: #45a049;
}


button {
  background-color: #4CAF50;

  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

/* Form Thêm và Sửa */
form {
  background-color: white;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

form input,
form textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #fafafa;
}

form input[type="file"] {
  padding: 10px;
  background-color: #fff;
}

form button {
  background-color: #008CBA;
  padding: 12px 24px;
  width: auto;
  cursor: pointer;
}

form button:hover {
  background-color: #007bb5;
}

/* Hiển thị Form */
form {
  background-color: white;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: block;  /* Đảm bảo form luôn hiển thị */
}


form.show {
  display: block;
}

/* Preview hình ảnh */
.preview-images {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.preview-image img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

/* Phần Danh sách */
.room-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.room-list h3 {
  text-align: left;
  margin-bottom: 20px;
}

.room-list .room-card {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.room-list .room-card h4 {
  width: 100%;
}

/* Button toggle form */
.toggle-btn {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.toggle-btn:hover {
  background-color: #e64a19;
}

select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 16px;
}

select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

/* Thêm màu nền cho từng trạng thái */
select option[value="trong"] {
  background-color: #d4edda; /* Màu xanh nhạt */
}

select option[value="dang_su_dung"] {
  background-color: #fff3cd; /* Màu vàng nhạt */
}

select option[value="can_bao_tri"] {
  background-color: #f8d7da; /* Màu đỏ nhạt */
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  background-color: #47b72b;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:hover {
  background-color: #eaeaea;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
}



</style>


