<template>
  <div class="filters">
  <label for="price-range">Giá theo giờ:</label>
  <input
    type="number"
    id="min-price"
    v-model="filters.minPrice"
    placeholder="Giá thấp nhất"
  />
  <input
    type="number"
    id="max-price"
    v-model="filters.maxPrice"
    placeholder="Giá cao nhất"
  />

  <label for="capacity">Sức chứa:</label>
  <input
    type="number"
    id="capacity"
    v-model="filters.capacity"
    placeholder="Sức chứa tối thiểu"
  />

  <label for="room-type">Loại phòng:</label>
  <select id="room-type" v-model="filters.roomType">
    <option value="">Tất cả</option>
    <option value="VIP">VIP</option>
    <option value="Thường">Thường</option>
  </select>

  <button @click="applyFilters" class="apply-filters-button">Áp dụng lọc</button>
</div>

<div class="room-list-view">
  <h1>Danh sách các phòng</h1>

  <!-- Thanh tìm kiếm -->
  <div class="search-bar">
    <input
      v-model="searchKeyword"
      type="text"
      placeholder="Tìm kiếm quán theo khu vực"
      class="search-input"
    />
    <button @click="searchRoomsByArea" class="search-button">Tìm kiếm</button>
  </div>

  <!-- Hiển thị trạng thái tải -->
  <div v-if="loading" class="loading">Đang tải danh sách phòng...</div>

  <!-- Hiển thị lỗi nếu có -->
  <div v-if="error" class="error">{{ error }}</div>

  <!-- Danh sách các phòng -->
  <div v-if="roomsToShow.length > 0" class="rooms-container">
    <div v-for="(room, index) in roomsToShow" :key="index" class="room-card" @click="goToBookingView(room)">
      <div class="room-images">
        <img
          v-for="(image, index) in room.hinh_anh"
          :key="index"
          :src="'http://localhost:8080/uploads/' + image"
          alt="Room Image"
          class="room-image"
        />
      </div>
      <div class="room-info">
        <h2>{{ room.ten_phong }} ({{ room.loai_phong }})</h2>
        <p><strong>Quán:</strong> {{ room.ten_quan }}</p>
        <p><strong>Địa chỉ:</strong> {{ room.dia_chi }}</p>
        <p><strong>Sức chứa:</strong> {{ room.suc_chua }} người</p>
        <p><strong>Giá theo giờ:</strong> {{ room.gia_theo_gio.toLocaleString() }} VND</p>
        <p><strong>Trạng thái:</strong> Trống</p>
      </div>
    </div>
  </div>

  <!-- Hiển thị nếu không có phòng -->
  <div v-else-if="!loading && !error" class="no-data">Hiện tại không có phòng nào.</div>

  <!-- Nút chuyển trang -->
  <div v-if="!loading && !error && rooms.length > 8" class="pagination">
    <button :disabled="currentPage === 1" @click="prevPage">Trang trước</button>
    <span>Trang {{ currentPage }} / {{ totalPages }}</span>
    <button :disabled="currentPage === totalPages" @click="nextPage">Trang sau</button>
  </div>
</div>

</template>


<script>
import axios from "axios";

export default {
  emits: ["routeChanged"],
  name: "RoomListView",
  data() {
  return {
    rooms: [], // Danh sách tất cả phòng
    roomsToShow: [], // Dữ liệu hiển thị trên trang hiện tại
    currentPage: 1, // Trang hiện tại
    itemsPerPage: 8, // Số lượng phòng trên mỗi trang
    loading: true, // Trạng thái tải
    error: null, // Lỗi nếu có
    searchKeyword: "", // Từ khóa tìm kiếm
    filters: {
      minPrice: null, // Giá thấp nhất
      maxPrice: null, // Giá cao nhất
      capacity: null, // Sức chứa tối thiểu
      roomType: "", // Loại phòng
    },
  };
},

  computed: {
    totalPages() {
      return Math.ceil(this.rooms.length / this.itemsPerPage);
    },
  },
methods: {
  searchRoomsByArea() {
  let filteredRooms = this.rooms;

  // Tìm kiếm theo địa chỉ
  if (this.searchKeyword) {
    filteredRooms = filteredRooms.filter((room) =>
      room.dia_chi.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }

  // Áp dụng các bộ lọc khác
  if (this.filters.minPrice !== null) {
    filteredRooms = filteredRooms.filter(
      (room) => room.gia_theo_gio >= this.filters.minPrice
    );
  }
  if (this.filters.maxPrice !== null) {
    filteredRooms = filteredRooms.filter(
      (room) => room.gia_theo_gio <= this.filters.maxPrice
    );
  }
  if (this.filters.capacity !== null) {
    filteredRooms = filteredRooms.filter(
      (room) => room.suc_chua >= this.filters.capacity
    );
  }
  if (this.filters.roomType) {
    filteredRooms = filteredRooms.filter(
      (room) => room.loai_phong === this.filters.roomType
    );
  }

  // Cập nhật danh sách hiển thị
  this.roomsToShow = filteredRooms.slice(0, this.itemsPerPage);
  this.currentPage = 1; // Reset lại trang
},

  applyFilters() {
    // Áp dụng lọc theo giá, sức chứa, và loại phòng
    let filteredRooms = this.rooms;

    // Lọc theo giá
    if (this.filters.minPrice !== null) {
      filteredRooms = filteredRooms.filter(
        (room) => room.gia_theo_gio >= this.filters.minPrice
      );
    }
    if (this.filters.maxPrice !== null) {
      filteredRooms = filteredRooms.filter(
        (room) => room.gia_theo_gio <= this.filters.maxPrice
      );
    }

    // Lọc theo sức chứa
    if (this.filters.capacity !== null) {
      filteredRooms = filteredRooms.filter(
        (room) => room.suc_chua >= this.filters.capacity
      );
    }

    // Lọc theo loại phòng
    if (this.filters.roomType) {
      filteredRooms = filteredRooms.filter(
        (room) => room.loai_phong === this.filters.roomType
      );
    }

    // Cập nhật danh sách hiển thị
    this.roomsToShow = filteredRooms.slice(0, this.itemsPerPage);
    this.currentPage = 1; // Reset lại trang
  },
  async fetchRooms() {
    try {
      const response = await axios.get("http://localhost:8080/api/karaokes/rooms"); // Đường dẫn API
      if (response.data.success) {
        // Lọc các phòng có trạng thái "trống"
        this.rooms = response.data.data.filter((room) => room.trang_thai === "trong");
        this.updateRoomsToShow(); // Cập nhật dữ liệu hiển thị cho trang đầu tiên
      } else {
        this.error = response.data.message || "Không thể tải danh sách phòng.";
      }
    } catch (err) {
      this.error = "Đã xảy ra lỗi khi tải danh sách phòng.";
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  updateRoomsToShow() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.roomsToShow = this.rooms.slice(start, end);
  },
  searchRoomsByArea() {
    if (!this.searchKeyword) {
      this.updateRoomsToShow(); // Hiển thị lại tất cả phòng nếu không có từ khóa
      return;
    }

    const filteredRooms = this.rooms.filter((room) =>
      room.dia_chi.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );

    this.roomsToShow = filteredRooms.slice(0, this.itemsPerPage); // Hiển thị kết quả tìm kiếm
    this.currentPage = 1; // Reset lại trang
  },
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateRoomsToShow();
    }
  },
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateRoomsToShow();
    }
  },
  goToBookingView(room) {
    this.$router.push({ name: "Bookings", params: { karaokeId: room.karaoke_id, roomId: room._id } });
  },
},

  mounted() {
    this.fetchRooms(); // Gọi API khi component được mount
  },
};
</script>

<style scoped>
.room-list-view {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* Trạng thái tải và lỗi */
.loading,
.error,
.no-data {
  text-align: center;
  font-size: 18px;
  color: #777;
  margin: 20px 0;
}

/* Container danh sách phòng */
.rooms-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
  justify-items: center;
}

/* Card hiển thị thông tin phòng */
.room-card {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  padding: 5px 10px;
}

.room-card:hover {
  transform: scale(1.05);
}

/* Ảnh phòng */
.room-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* Thông tin phòng */
.room-info {
  padding: 15px;
}

.room-info h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.room-info p {
  font-size: 14px;
  margin: 5px 0;
}

.room-info strong {
  color: #333;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 15px;
  background-color: #45a049;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.pagination button:hover {
  background-color: #387c3f;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Media Queries */
@media (max-width: 768px) {
  h1 {
    font-size: 20px;
  }

  .room-card {
    max-width: 250px;
  }

  .room-info h2 {
    font-size: 16px;
  }

  .room-info p {
    font-size: 13px;
  }

  .pagination button {
    font-size: 12px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .rooms-container {
    grid-template-columns: 1fr;
  }

  .room-card {
    max-width: 90%;
  }

  .room-info h2 {
    font-size: 14px;
  }

  .room-info p {
    font-size: 12px;
  }
}


.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filters input,
.filters select,
.filters button {
  padding: 5px 10px;
  font-size: 16px;
}


</style>
