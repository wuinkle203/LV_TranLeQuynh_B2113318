<template>
  <div>
    <h1>Danh sách phòng - {{ karaoke.ten_quan }}</h1>

    <!-- Thanh lọc -->
    <div class="filters">
      <label for="price-range">Giá theo giờ:</label>
      <input type="number" v-model.number="filters.minPrice" placeholder="Giá thấp nhất" />
      <input type="number" v-model.number="filters.maxPrice" placeholder="Giá cao nhất" />

      <label for="capacity">Sức chứa:</label>
      <input type="number" v-model.number="filters.capacity" placeholder="Sức chứa tối thiểu" />

      <label for="room-type">Loại phòng:</label>
      <select v-model="filters.roomType">
        <option value="">Tất cả</option>
        <option value="VIP">VIP</option>
        <option value="Thường">Thường</option>
      </select>

      <button @click="applyFilters" class="apply-filters-button">Áp dụng lọc</button>
    </div>

    <!-- Trạng thái tải -->
    <div v-if="loading" class="loading">Đang tải danh sách phòng...</div>

    <!-- Lỗi nếu có -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Danh sách phòng -->
    <div v-if="roomsToShow.length > 0" class="rooms-container">
      <div v-for="(row, rowIndex) in roomsToShow" :key="rowIndex" class="room-row">
        <div v-for="room in row" :key="room._id" class="room-card" @click="goToBookingView(room)">
          <div class="room-images">
            <img v-if="room.hinh_anh && room.hinh_anh.length > 0"
                 :src="'http://localhost:8080/uploads/' + room.hinh_anh[0]"
                 alt="Hình phòng"
                 class="room-image" />
          </div>
          <div class="room-info">
            <h3>{{ room.ten_phong }}</h3>
            <p><strong>Loại phòng:</strong> {{ room.loai_phong }}</p>
            <p><strong>Sức chứa:</strong> {{ room.suc_chua }} người</p>
            <div v-if="room.trang_thai ==='trong'">
              <p><strong>Trạng thái phòng: </strong>Trống</p>
            </div>
            <div v-if="room.trang_thai ==='dang_su_dung'">
              <p><strong>Trạng thái phòng: </strong>Đang được sử dụng</p>
            </div>
            <div v-if="room.trang_thai ==='can_bao_tri'">
              <p><strong>Trạng thái phòng: </strong>Đang sửa chửa</p>
            </div>
            <!-- <p><strong>Mô tả:</strong> {{ room.mo_ta }}</p> -->

            <!-- Hiển thị giá theo giờ -->
            <div>
              <h4>Giá theo giờ: </h4>
              <ul>
                <li v-for="(gia, index) in room.gia_theo_gio" :key="index">
                <strong>{{ gia.gio_bat_dau }} - {{ gia.gio_ket_thuc }}: </strong>
                <span class="price-format">{{ formatPrice(gia.gia) }}</span>
              </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hiển thị nếu không có phòng -->
    <div v-else-if="!loading && !error" class="no-data">Hiện tại không có phòng nào.</div>

    <!-- Nút phân trang -->
    <div v-if="!loading && !error && filteredRooms.length > itemsPerPage" class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage">Trang trước</button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Trang sau</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RoomList',
  props: ['karaokeId'],
  data() {
    return {
      karaoke: {},
      rooms: [],
      filteredRooms: [],
      roomsToShow: [],
      currentPage: 1,
      itemsPerPage: 8,
      loading: true,
      error: null,
      filters: {
        minPrice: null,
        maxPrice: null,
        capacity: null,
        roomType: '',
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredRooms.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchRooms() {
      try {
        const karaokeRes = await axios.get(`http://localhost:8080/api/karaokes/${this.karaokeId}`);
        this.karaoke = karaokeRes.data;

        const roomRes = await axios.get(`http://localhost:8080/api/karaokes/${this.karaokeId}/phong`);
        this.rooms = roomRes.data.phong || []; // Đảm bảo phòng có dữ liệu

        this.filteredRooms = [...this.rooms];
        this.updateRoomsToShow();
      } catch (error) {
        this.error = "Lỗi khi tải dữ liệu phòng!";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    applyFilters() {
      let filteredRooms = [...this.rooms];

      if (this.filters.minPrice !== null) {
        filteredRooms = filteredRooms.filter(room =>
          room.gia_theo_gio.some(gia => gia.gia >= this.filters.minPrice)
        );
      }
      if (this.filters.maxPrice !== null) {
        filteredRooms = filteredRooms.filter(room =>
          room.gia_theo_gio.some(gia => gia.gia <= this.filters.maxPrice)
        );
      }
      if (this.filters.capacity !== null) {
        filteredRooms = filteredRooms.filter(room => room.suc_chua >= this.filters.capacity);
      }
      if (this.filters.roomType) {
        filteredRooms = filteredRooms.filter(room => room.loai_phong === this.filters.roomType);
      }

      this.filteredRooms = filteredRooms;
      this.currentPage = 1;
      this.updateRoomsToShow();
    },

    updateRoomsToShow() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedRooms = this.filteredRooms.slice(start, end);

      const rows = [];
      for (let i = 0; i < paginatedRooms.length; i += 4) {
        rows.push(paginatedRooms.slice(i, i + 4));
      }
      this.roomsToShow = rows;
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
      this.$router.push({ name: "Bookings", params: { karaokeId: this.karaokeId, roomId: room._id } });
    },

    formatPrice(value) {
    if (!value) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
  },

  },
  mounted() {
    this.fetchRooms();
  }
};
</script>

<style scoped>
/* Container tổng thể */
.container {
  width: 95%;
  /* max-width: 100%;
  max-width: 95%; */
  margin: 0 auto;
  padding: 20px;
}

/* Thanh lọc */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.filters label {
  font-weight: bold;
  color: #333;
}

.filters input,
.filters select {
  padding: 8px;
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.apply-filters-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.apply-filters-button:hover {
  background-color: #0056b3;
}

/* Responsive cho thanh lọc */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filters input,
  .filters select {
    width: 100%;
  }
}

/* Danh sách phòng */
.rooms-container {
  padding: 10px;
  margin: 10px;
  /* max-width: 95%; */
  display: flex;
  flex-direction: column;
  border: 1px solid #435D76;
  border-radius: 15px;
  gap: 20px;
  align-items: center;
}

.room-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.room-card {
  margin: auto;
  width: 300px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.room-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.room-images {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-info {
  padding: 15px;
  text-align: left;
}

.room-info h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.room-info p {
  font-size: 14px;
  color: #555;
  margin: 5px 0;
}

.room-info strong {
  color: #000;
}

.room-info ul {
  list-style-type: none;
  padding: 0;
}

.room-info li {
  font-size: 14px;
  padding: 5px 0;
  color: #555;
}

/* Định dạng tiền VNĐ */
.price-format {
  font-weight: bold;
  color: #ff4500;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 10px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination span {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* Responsive danh sách phòng */
@media (max-width: 768px) {
  .room-card {
    width: 90%;
  }
}


</style>
