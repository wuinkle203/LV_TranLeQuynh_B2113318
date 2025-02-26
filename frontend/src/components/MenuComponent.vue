<template>
  <div class="menu-component">
    <h5>Menu dùng thêm</h5>

    <!-- Thanh tìm kiếm món ăn -->
    <div>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Tìm kiếm món ăn" 
        @input="filterMenu"
      />
    </div>

    <!-- Layout chia cột: menu bên trái và danh sách món đã gọi bên phải -->
    <div class="menu-layout">
      <!-- Hiển thị bảng với các món trong menu (bên trái) -->
      <div class="menu-list">
        <table v-if="filteredMenuItems.length > 0">
          <thead>
            <tr>
              <th>Tên món</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentPageMenuItems" :key="item._id">
              <td>{{ item.ten_mon }}</td>
              <td>
                <input 
                  v-model="item.soLuong" 
                  type="number" 
                  min="1" 
                  placeholder="Số lượng" 
                  :disabled="isProcessing"
                />
              </td>
              <td>
                <p>{{ item.gia | currency }}</p> <!-- Giá không thể thay đổi -->
              </td>
              <td>
                <button @click="addMenuToRoom(item)" :disabled="isProcessing">Thêm vào phòng</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Không có món nào trong menu.</p>
      </div>

      <!-- Danh sách món đã gọi (bên phải) -->
      <div class="added-menu">
        <h5>Danh sách món đã gọi</h5>
        <table v-if="addedMenuItemsToRoom.length > 0">
          <thead>
            <tr>
              <th>Tên món</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in addedMenuItemsToRoom" :key="item._id">
              <td>{{ item.ten }}</td>
              <td>{{ item.so_luong }}</td>
              <td>{{ item.don_gia | currency }}</td>
              <td>{{ item.thanh_tien | currency }}</td>
              <td>
                <button @click="removeMenuFromRoom(item._id)" :disabled="isProcessing">Xóa khỏi phòng</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Chưa có món ăn nào trong phòng.</p>
        
        <!-- Hiển thị tổng tiền của danh sách món ăn đã thêm -->
        <div v-if="totalAmount > 0">
          <p><strong>Tổng tiền: {{ totalAmount | currency }}</strong></p>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <div class="pagination">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
      >
        Trang trước
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
      >
        Trang sau
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    karaokeId: {
      type: String,
      required: true
    },
    roomId: {
      type: String,
      required: true
    },
    datPhongId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      menuItems: [], // Danh sách món ăn trong menu
      addedMenuItemsToRoom: [], // Danh sách món đã gọi trong phòng
      searchQuery: '', // Giá trị tìm kiếm
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số lượng món ăn trên mỗi trang
      isProcessing: false, // B
    };
  },

  computed: {
    filteredMenuItems() {
      return this.menuItems.filter(item => 
        item.ten_mon.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredMenuItems.length / this.itemsPerPage);
    },
    currentPageMenuItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredMenuItems.slice(startIndex, startIndex + this.itemsPerPage);
    },
  },


  methods: {
    // Lấy danh sách món ăn từ API
    async fetchDanhSachMonAn() {
      try {
        const response = await axios.get(`http://localhost:8080/api/datphongs/${this.datPhongId}/menu`);
        if (response.data && Array.isArray(response.data)) {
          this.addedMenuItemsToRoom = response.data;
        } else {
          this.addedMenuItemsToRoom = [];
        }
        this.calculateTotalAmount();  // Tính lại tổng tiền sau khi nhận được dữ liệu
      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn:", error);
        alert("Lỗi khi tải danh sách món ăn, vui lòng thử lại.");
      }
    },


    // Lấy danh sách các món ăn có sẵn
    async fetchMenuItems() {
      try {
        const response = await axios.get(`http://localhost:8080/api/karaokes/${this.karaokeId}/menu`);
        if (response.data && response.data.menu) {
          this.menuItems = response.data.menu;
        } else {
          this.menuItems = [];
        }
      } catch (error) {
        console.error("Lỗi khi tải menu:", error);
        alert("Lỗi khi tải menu, vui lòng thử lại.");
      }
    },

    // Thêm món ăn vào phòng
    async addMenuToRoom(item) {
      const { soLuong, gia, _id, ten_mon } = item;
      if (!soLuong || !gia) {
        alert("Vui lòng nhập đầy đủ số lượng và giá!");
        return;
      }

      this.isProcessing = true;

      try {
        await axios.post(`http://localhost:8080/api/datphongs/${this.datPhongId}/addMonAn`, {
          monAnId: _id,
          ten: ten_mon, // Gửi tên món ăn
          soLuong: soLuong,
          gia: gia
        });

        // Thêm món vào danh sách đã chọn
        this.addedMenuItemsToRoom.push({ ...item, ten: ten_mon, soLuong, gia });
        this.calculateTotalAmount(); // Tính lại tổng tiền
        this.fetchDanhSachMonAn();
        alert("Món ăn đã được thêm vào phòng!");
      } catch (error) {
        console.error("Lỗi khi thêm món vào phòng:", error);
        alert("Lỗi khi thêm món vào phòng.");
      } finally {
        this.isProcessing = false;
      }
    },

    // Xóa món ăn khỏi phòng
    async removeMenuFromRoom(monAnId) {
      this.isProcessing = true;

      try {
        await axios.delete(`http://localhost:8080/api/datphongs/${this.datPhongId}/removeMonAn/${monAnId}`);
        // Xóa món khỏi danh sách đã thêm
        this.addedMenuItemsToRoom = this.addedMenuItemsToRoom.filter(item => item._id !== monAnId);
        this.calculateTotalAmount(); // Tính lại tổng tiền
        alert("Món ăn đã được xóa khỏi phòng!");
      } catch (error) {
        console.error("Lỗi khi xóa món ăn khỏi phòng:", error);
        alert("Lỗi khi xóa món ăn khỏi phòng.");
      } finally {
        this.isProcessing = false;
      }
    },


    // Tính tổng tiền bằng cách cộng dồn giá trị của từng món ăn trong danh sách đã thêm
      calculateTotalAmount() {
        if (Array.isArray(this.addedMenuItemsToRoom)) {
          this.totalAmount = this.addedMenuItemsToRoom.reduce((total, item) => {
            return total + (item.so_luong * item.don_gia);  // Cộng tổng thành tiền của mỗi món
          }, 0);
        } else {
          this.totalAmount = 0;  // Đảm bảo giá trị tổng tiền là 0 khi addedMenuItemsToRoom không phải là mảng
        }
      },

      changePage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages) return;
      this.currentPage = pageNumber;
    },
    filterMenu() {
      this.currentPage = 1; // Reset lại trang khi tìm kiếm
    },


  },
  created() {
    this.fetchMenuItems();
    this.fetchDanhSachMonAn();  // Tải danh sách món đã thêm vào phòng
  }
};
</script>


<style scoped>


.menu-component {
  margin: 20px;
}

.menu-component h5 {
  margin-bottom: 10px;
}

.menu-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.menu-list, .added-menu {
  flex: 1;
  min-width: 300px; /* Đảm bảo cả hai phần không quá hẹp */
  max-width: 45%; /* Giới hạn chiều rộng tối đa */
}

.menu-list table, .added-menu table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.menu-list th, .added-menu th,
.menu-list td, .added-menu td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}

.menu-list th, .added-menu th {
  background-color: #f4f4f4;
}

.menu-list input, .added-menu input {
  width: 100%;
  padding: 5px;
}

.menu-list button, .added-menu button {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-list button:disabled, .added-menu button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.menu-list button:hover, .added-menu button:hover {
  background-color: #45a049;
}

.pagination {
  text-align: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  color: white;
  background-color: #435d76;
  border-radius: 10px;
  margin:0px 5px;
}


</style>
