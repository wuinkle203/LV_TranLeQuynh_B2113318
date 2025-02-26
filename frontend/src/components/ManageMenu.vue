<template>
  <div class="container">
    <h2>Quản lý Menu Quán Karaoke</h2>

    <!-- Danh sách quán karaoke -->
    <div v-if="karaokes.length">
      <div v-for="karaoke in karaokes" :key="karaoke._id" class="karaoke-card">
        <h3>{{ karaoke.ten_quan }}</h3>
        <p>Địa chỉ: {{ karaoke.dia_chi }}</p>

        <!-- Hiển thị menu dưới dạng bảng -->
        <table v-if="karaoke.menu.length" class="menu-table">
          <thead>
            <tr>
              <th>Tên món</th>
              <th>Giá (VND)</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in karaoke.menu" :key="item._id">
              <!-- Nếu item đang được sửa, hiển thị ô input -->
              <td>
                <template v-if="currentItem && currentItem._id === item._id">
                  <input type="text" v-model="currentItem.ten_mon" required />
                </template>
                <template v-else>
                  {{ item.ten_mon }}
                </template>
              </td>

              <td>
                <template v-if="currentItem && currentItem._id === item._id">
                  <input type="number" v-model="currentItem.gia" required />
                </template>
                <template v-else>
                  {{ item.gia }}
                </template>
              </td>

              <td>
                <template v-if="currentItem && currentItem._id === item._id">
                  <button class="update-btn" @click="updateMenuItem(karaoke._id)">Cập nhật</button>
                  <button class="cancel-btn" @click="cancelEdit">Hủy</button>
                </template>
                <template v-else>
                  <button class="edit-btn" @click="toggleEditForm(karaoke._id, item)">Sửa</button>
                  <button class="delete-btn" @click="deleteMenuItem(karaoke._id, item._id)">Xóa</button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Chưa có món nào trong menu.</p>

        <!-- Form thêm món mới vào menu -->
        <button class="add-menu-button" @click="toggleAddForm(karaoke._id)">Thêm Món</button>
        <form v-if="isAddFormVisible === karaoke._id" @submit.prevent="addMenuItem(karaoke._id)">
          <input type="text" v-model="newItem.ten_mon" placeholder="Tên món" required />
          <input type="number" v-model="newItem.gia" placeholder="Giá (VND)" required />
          <button type="submit">Thêm</button>
        </form>
      </div>
    </div>
    <p v-else>Không có quán karaoke nào.</p>
  </div>
</template>


  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        karaokes: [],
        newItem: {
          ten_mon: "",
          gia: 0,
        },
        currentItem: null,
        isAddFormVisible: null,
      };
    },
    methods: {
      async fetchKaraokes() {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.userId;
        if (!userId) {
          console.error("Chưa có userId trong localStorage.");
          return;
        }
  
        try {
          const response = await axios.get("http://localhost:8080/api/karaokes", { params: { userId } });
          this.karaokes = response.data;
        } catch (error) {
          console.error("Lỗi khi tải danh sách quán karaoke:", error);
        }
      },
      toggleAddForm(karaokeId) {
        this.isAddFormVisible = this.isAddFormVisible === karaokeId ? null : karaokeId;
      },
      toggleEditForm(karaokeId, item) {
        if (this.currentItem && this.currentItem._id === item._id) {
          this.currentItem = null; // Tắt form nếu đã mở
        } else {
          this.currentItem = { ...item, karaokeId };
        }
      },

          // Hủy sửa
      cancelEdit() {
        this.currentItem = null;
      },

      async addMenuItem(karaokeId) {
        if (!karaokeId || !this.newItem.ten_mon || !this.newItem.gia) {
          console.error("Thiếu thông tin để thêm món");
          return;
        }
  
        try {
          const response = await axios.post(
            `http://localhost:8080/api/karaokes/${karaokeId}/menu`,
            { ...this.newItem }
          );
          const karaoke = this.karaokes.find(k => k._id === karaokeId);
          karaoke.menu.push(response.data);
          this.resetNewItem();
          this.fetchKaraokes();
          this.isAddFormVisible = null;
        } catch (error) {
          console.error("Lỗi khi thêm món:", error);
        }
      },
      async updateMenuItem(karaokeId) {
        if (!this.currentItem || !this.currentItem._id) {
          console.error("Thiếu thông tin món cần cập nhật");
          return;
        }
  
        try {
          await axios.put(
            `http://localhost:8080/api/karaokes/${karaokeId}/menu/${this.currentItem._id}`,
            { ...this.currentItem }
          );
          const karaoke = this.karaokes.find(k => k._id === karaokeId);
          const index = karaoke.menu.findIndex(i => i._id === this.currentItem._id);
          karaoke.menu[index] = { ...this.currentItem };
          this.currentItem = null;
        } catch (error) {
          console.error("Lỗi khi cập nhật món:", error);
        }
      },
      async deleteMenuItem(karaokeId, itemId) {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa món này?");
        if (confirmDelete) {
          try {
            await axios.delete(
              `http://localhost:8080/api/karaokes/${karaokeId}/menu/${itemId}`
            );
            const karaoke = this.karaokes.find(k => k._id === karaokeId);
            karaoke.menu = karaoke.menu.filter(item => item._id !== itemId);
          } catch (error) {
            console.error("Lỗi khi xóa món:", error);
          }
        } else {
          console.log("Đã hủy việc xóa.");
        }
      },
      resetNewItem() {
        this.newItem = {
          ten_mon: "",
          gia: 0,
        };
      },
    },
    created() {
      this.fetchKaraokes();
    },
  };
  </script>
  
  <style scoped>
 /* Định dạng container chính */
/* Tổng thể */
.container {
  max-width: 95%;
  margin: auto;
  padding: 20px;
  background: linear-gradient(to right, #f9f9f9, #ffffff);
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

h2 {
  text-align: center;
  color: #333;
  font-size: 26px;
  font-weight: bold;
}

/* Thẻ card hiển thị quán */
.karaoke-card {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.karaoke-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

/* Bảng menu */
.menu-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.menu-table th,
.menu-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 16px;
  transition: background 0.3s ease-in-out;
}

.menu-table th {
  background: linear-gradient(to right, #007bff, #0056b3);
  color: white;
  font-weight: bold;
}

.menu-table tr:hover {
  background: #f1f1f1;
  transition: background 0.3s ease-in-out;
}

/* Input khi sửa */
.menu-table input {
  width: 90%;
  padding: 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}


/* Hiệu ứng nút */
.edit-btn,
.delete-btn,
.add-menu-button ,
.update-btn,
.cancel-btn {
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  margin-left: 5px;
  transition: all 0.2s ease-in-out;
}

.update-btn {
  background: #28a745;
  color: white;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}


.edit-btn {
  background: #ffc107;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.add-menu-button {
  margin-top: 10px;
  background: #28a745;
  color: white;
}

.edit-btn:hover,
.delete-btn:hover,
.add-menu-button:hover ,
.update-btn:hover,
.cancel-btn:hover{
  filter: brightness(1.2);
  transform: scale(1.05);
}

.edit-btn:active,
.delete-btn:active,
.add-menu-button:active {
  transform: scale(0.95);
}

/* Hiệu ứng input */
form input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
}

form input:focus {
  border-color: #007bff;
  box-shadow: 0px 0px 5px rgba(0, 123, 255, 0.5);
}

/* Hiệu ứng nút trong form */
form button {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

form button:hover {
  background: #0056b3;
  transform: scale(1.05);
}

form button:active {
  transform: scale(0.95);
}



  </style>
  