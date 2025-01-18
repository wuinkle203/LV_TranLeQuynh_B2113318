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
          <form @submit.prevent="submitEdit(karaoke._id)">
            <label for="ten_quan">Tên quán:</label>
            <input v-model="editingKaraoke.ten_quan" type="text" required />
            
            <label for="dia_chi">Địa chỉ:</label>
            <input v-model="editingKaraoke.dia_chi" type="text" required />
            
            <label for="so_dien_thoai">Số điện thoại:</label>
            <input v-model="editingKaraoke.so_dien_thoai" type="text" required />
            
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
      isEditing: false,  // Biến điều kiện để hiển thị form chỉnh sửa
      editingKaraoke: null,  // Dữ liệu quán karaoke đang được chỉnh sửa
    };
  },
  async mounted() {
    await this.loadKaraokes();
  },
  methods: {
    async loadKaraokes() {
      try {
        // Lấy userId từ localStorage (hoặc nơi bạn lưu thông tin người dùng)
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.userId; // Đảm bảo userId đã được lưu

        if (!userId) {
          console.error('Người dùng chưa đăng nhập');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/karaokes', {
          params: { userId }  // Gửi userId theo query params
        });
        this.karaokes = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quán karaoke:", error.message);
      }
    },
    selectKaraoke(karaokeId) {
      if (!karaokeId) {
        console.error("karaokeId không hợp lệ:", karaokeId);
        return;
      }
      this.$emit("karaoke-selected", karaokeId); // Gửi lên cha
    },

    editKaraoke(karaoke) {
      this.isEditing = true;
      this.editingKaraoke = { ...karaoke }; // Sao chép dữ liệu của quán karaoke vào editingKaraoke
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingKaraoke = null;
    },
    async submitEdit(karaokeId) {

      try {
        const response = await axios.put(`http://localhost:8080/api/karaokes/${karaokeId}`, {
          ...this.editingKaraoke,
          // chu_so_huu_id: userId, // Thêm trường này nếu backend yêu cầu
        });

        const index = this.karaokes.findIndex(karaoke => karaoke._id === karaokeId);
        if (index !== -1) {
          this.karaokes[index] = response.data;
        }
        this.isEditing = false;
        this.editingKaraoke = null;
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
        this.karaokes = this.karaokes.filter(karaoke => karaoke._id !== karaokeId); // Xoá quán khỏi danh sách
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
/* Danh sách quán karaoke */

/* Điều chỉnh các nút trong thẻ li */
button {
  padding: 8px 16px;
  background: linear-gradient(0deg, #2707dc 0%, #78aadc);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  margin-left: 10px; /* Khoảng cách giữa các nút */
  transition: transform 0.3s ease, background 0.3s ease;
}

button:hover {
  background-color: #9baf9c;
  transform: scale(1.1);
}

/* Nút chỉnh sửa quán karaoke */
button:nth-child(2) {
  background: linear-gradient(45deg, #88e168 0%, #296a0d);
  transition: transform 0.3s ease, background 0.3s ease;
}

button:nth-child(2):hover {
  background-color: #e68900;
  transform: scale(1.1);
}

/* Nút xoá quán karaoke */
button:last-child {
  background: linear-gradient(45deg, #dd0a0a 0%, #9d5f5f);
  transition: transform 0.3s ease, background 0.3s ease;
}

button:last-child:hover {
  background-color: #c62828;
  transform: scale(1.1);
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

li:hover {
  background-color: #f1f1f1;
  transform: translateX(5px); /* Đẩy nhẹ sang phải khi hover */
}

/* Điều chỉnh các phần tử trong li */
li span {
  flex-grow: 1; /* Đẩy phần tử span (thông tin quán karaoke) chiếm không gian còn lại */
  font-size: 16px;
  color: #555;
}

/* Form chỉnh sửa quán karaoke */
form {
  margin-top: 20px;
  padding: 15px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form button {
  background-color: #45a049;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
}

form button[type="submit"] {
  margin-right: 10px;
}

form button:hover {
  background-color: #388e3c;
}

form button[type="button"] {
  background-color: #e53935;
}

form button[type="button"]:hover {
  background-color: #c62828;
}

/* Đảm bảo các nút không di chuyển */
.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 10px; /* Khoảng cách giữa các nút */
}
</style>
