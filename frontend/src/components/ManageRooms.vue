<template>
  <div>
    <h1>Quản lý Phòng quán Karaoke</h1>

    <!-- Form Thêm hoặc Sửa Phòng -->
    <div>
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



    <button @click="prepareEditRoom(room)">Sửa</button>
    <button @click="deleteRoom(room._id)">Xóa</button>
  </div>
</div>
<div v-else>
  <p>Chưa có phòng nào. Hãy thêm phòng mới!</p>
</div>

  </div>
</template>

<script>
import axios from "axios";

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
  axios
    .delete(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong/${roomId}`)
    .then((response) => {
      this.fetchRooms();  // Cập nhật lại danh sách phòng
    })
    .catch((error) => {
      console.error("Lỗi khi xóa phòng:", error);
      alert("Xóa phòng không thành công.");
    });
}

  },
};
</script>

<style>
.room-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.room-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

</style>