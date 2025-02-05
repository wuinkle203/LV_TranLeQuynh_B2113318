<template>
  <div>
    <h2>Danh sách quán Karaoke</h2>
    <ul v-if="karaokes.length">
      <li v-for="karaoke in karaokes" :key="karaoke._id">
        <div>
          {{ karaoke.ten_quan }} - {{ karaoke.dia_chi }}
          
          <!-- Bao các nút vào div flex để giữ cố định -->
          <div class="button-group">
            <button @click="selectKaraoke(karaoke._id)">Chọn quán</button>
            <button @click="editKaraoke(karaoke)">Chỉnh sửa</button>
            <button @click="confirmDelete(karaoke._id)">Xoá quán</button>
          </div>
        </div>
        
        <!-- Form chỉnh sửa quán karaoke -->
        <div v-if="isEditing && editingKaraoke._id === karaoke._id">
          <form @submit.prevent="submitEdit(karaoke._id)" enctype="multipart/form-data">
            <label for="ten_quan">Tên quán:</label>
            <input v-model="editingKaraoke.ten_quan" type="text" required />
            
            <label for="dia_chi">Địa chỉ:</label>
            <input v-model="editingKaraoke.dia_chi" type="text" required />
            
            <label for="so_dien_thoai">Số điện thoại:</label>
            <input v-model="editingKaraoke.so_dien_thoai" type="text" required />
            
            <label for="hinh_anh_quan">Hình ảnh mới:</label>
            <input type="file" @change="onFileChange" />

            <div v-if="editingKaraoke.hinh_anh_quan">
              <h4>Hình ảnh hiện tại:</h4>
              <img :src="`http://localhost:8080/uploads/${editingKaraoke.hinh_anh_quan}`" alt="Current Image" width="100" />
            </div>

            <button type="submit">Lưu thay đổi</button>
            <button @click="cancelEdit">Hủy</button>
          </form>
        </div>
      </li>
    </ul>
    <p v-else>Không có quán nào để hiển thị.</p>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      karaokes: [],
      isEditing: false,
      editingKaraoke: null,
      newImage: null, // Để lưu trữ file hình ảnh mới
    };
  },
  async mounted() {
    await this.loadKaraokes();
  },
  methods: {
    async loadKaraokes() {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.userId;

        if (!userId) {
          console.error('Người dùng chưa đăng nhập');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/karaokes', {
          params: { userId }
        });
        this.karaokes = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quán karaoke:", error.message);
      }
    },
    selectKaraoke(karaokeId) {
      this.$emit("karaoke-selected", karaokeId);
    },

    editKaraoke(karaoke) {
      this.isEditing = true;
      this.editingKaraoke = { ...karaoke };
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingKaraoke = null;
      this.newImage = null; // Reset hình ảnh mới
    },

    // Xử lý khi người dùng chọn ảnh mới
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newImage = file;
      }
    },

    async submitEdit(karaokeId) {
      try {
        const formData = new FormData();
        formData.append("ten_quan", this.editingKaraoke.ten_quan);
        formData.append("dia_chi", this.editingKaraoke.dia_chi);
        formData.append("so_dien_thoai", this.editingKaraoke.so_dien_thoai);
        if (this.newImage) {
          formData.append("hinh_anh_quan", this.newImage);
        }

        const response = await axios.put(`http://localhost:8080/api/karaokes/${karaokeId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        const index = this.karaokes.findIndex(karaoke => karaoke._id === karaokeId);
        if (index !== -1) {
          this.karaokes[index] = response.data;
        }
        this.isEditing = false;
        this.editingKaraoke = null;
        this.newImage = null;
        alert("Cập nhật quán karaoke thành công!");
        await this.loadKaraokes(); // Tải lại danh sách quán sau khi chỉnh sửa
      } catch (error) {
        console.error("Lỗi khi cập nhật quán karaoke:", error.message);
        alert("Có lỗi xảy ra khi cập nhật quán karaoke.");
      }
    },

    confirmDelete(karaokeId) {
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn xoá quán karaoke này?");
      if (isConfirmed) {
        this.deleteKaraoke(karaokeId);
      }
    },

    async deleteKaraoke(karaokeId) {
      try {
        await axios.delete(`http://localhost:8080/api/karaokes/${karaokeId}`);
        this.karaokes = this.karaokes.filter(karaoke => karaoke._id !== karaokeId);
        alert("Quán karaoke đã được xoá thành công!");
      } catch (error) {
        console.error("Lỗi khi xoá quán karaoke:", error.message);
        alert("Có lỗi xảy ra khi xoá quán karaoke.");
      }
    }
  }
};
</script>




<style scoped>
/* Tổng quan */
div {
  /* max-width: 900px; */
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
}

h2 {
  text-align: center;
  color: #4a90e2;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

/* Danh sách quán */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 15px;
  margin-bottom: 15px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}

li:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Thông tin quán */
li div:first-child {
  font-size: 1rem;
  margin-bottom: 10px;
}

/* Nhóm nút */
.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

button {
  padding: 8px 15px;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: scale(1.05);
}

button:active {
  transform: scale(1);
}

button:first-child {
  background: #4caf50;
  color: #fff;
}

button:first-child:hover {
  background: #45a049;
}

button:nth-child(2) {
  background: #ffa500;
  color: #fff;
}

button:nth-child(2):hover {
  background: #e69500;
}

button:last-child {
  background: #ff4d4d;
  color: #fff;
}

button:last-child:hover {
  background: #e63939;
}

/* Form chỉnh sửa */
form {
  margin-top: 15px;
  padding: 15px;
  background: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

form input {
  width: 100%;
  padding: 10px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;
}

form input:focus {
  border-color: #4a90e2;
  outline: none;
}

form button {
  padding: 10px 20px;
  font-size: 0.9rem;
  margin-right: 10px;
}

form button[type="submit"] {
  background: #4a90e2;
  color: #fff;
}

form button[type="submit"]:hover {
  background: #357abd;
}

form button:last-child {
  background: #ccc;
}

form button:last-child:hover {
  background: #b3b3b3;
}

/* Khi không có quán */
p {
  text-align: center;
  color: #999;
  font-size: 1rem;
  margin-top: 20px;
}

/* Hiệu ứng */
div {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
