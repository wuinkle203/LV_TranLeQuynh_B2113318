<template>

  <div class="karaoke-list-view">
    <!-- Thanh tìm kiếm -->
    <div class="search-bar">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="Tìm kiếm quán theo khu vực"
        class="search-input"
      />
      <button @click="searchKaraokesByArea" class="search-button">Tìm kiếm</button>
    </div>

    <!-- Hiển thị trạng thái tải -->
    <div v-if="loading" class="loading">Đang tải danh sách quán karaoke...</div>

    <!-- Hiển thị lỗi nếu có -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Danh sách các quán karaoke -->
    <div v-if="karaokesToShow.length > 0" class="karaokes-container">
      <div v-for="(karaoke, index) in karaokesToShow" :key="index" class="karaoke-card">
  <div class="karaoke-images">
    <img :src="'http://localhost:8080/uploads/' + karaoke.hinh_anh_quan" alt="Karaoke Image" class="karaoke-image"  @click="goToRoomsView(karaoke)"/>
  </div>
  <div class="karaoke-info">
    <h2>{{ karaoke.ten_quan }}</h2>
    <p><strong>Địa chỉ:</strong> {{ karaoke.dia_chi }}</p>
    <p><strong>Số phòng còn trống:</strong> {{ karaoke.so_phong_trong }} phòng</p>
    <p><strong></strong> {{ karaoke.mo_ta }}</p>
  </div>

      <div class="promotion-view">
      <h3>Khuyến mãi</h3>
      <ul v-if="getValidPromotions(karaoke.khuyen_mai).length > 0">
        <li v-for="(promo, idx) in getValidPromotions(karaoke.khuyen_mai)" :key="idx" class="blinking">
          <strong>{{ promo.ten_chuong_trinh }}</strong> - Giảm {{ promo.gia_giam }}% tổng hoá đơn
          <p>{{ promo.noi_dung }}</p>
          <p><strong>Thời gian:</strong> {{ formatDate(promo.ngay_bat_dau) }} - {{ formatDate(promo.ngay_ket_thuc) }}</p>
        </li>
      </ul>
      <p v-else>Chưa có khuyến mãi.</p>
    </div>



  <div class="menu-view">
    <h3>Menu quán</h3>
    <ul v-if="karaoke.menuToShow && karaoke.menuToShow.length > 0">
      <li v-for="(item, idx) in karaoke.menuToShow" :key="idx">
        <strong>{{ item.ten_mon }}</strong> - {{ item.gia }} VND
      </li>
    </ul>
    <p v-else>Quán này chưa có menu.</p>

    <!-- Nút phân trang menu của quán karaoke -->
    <div v-if="karaoke.menuToShow && karaoke.menuToShow.length > 0" class="pagination">
      <button :disabled="menuPages[karaoke._id] === 1" @click="prevPageMenu(karaoke)">Trang trước</button>
      <span>Trang {{ menuPages[karaoke._id] }} / {{ Math.ceil(karaoke.menu.length / itemsPerMenu) }}</span>
      <button :disabled="menuPages[karaoke._id] === Math.ceil(karaoke.menu.length / itemsPerMenu)" @click="nextPageMenu(karaoke)">Trang sau</button>
    </div>
  </div>
</div>

    </div>



    <!-- Hiển thị nếu không có quán -->
    <div v-else-if="!loading && !error" class="no-data">Hiện tại không có quán karaoke nào.</div>

    <!-- Nút chuyển trang -->
    <div v-if="!loading && !error && karaokes.length" class="pagination">
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
  name: "KaraokeListView",
  data() {
    return {
      karaokes: [], // Danh sách tất cả quán karaoke
      filteredKaraokes: [], // Lưu trữ các quán đã lọc hoặc tìm kiếm
      karaokesToShow: [], // Dữ liệu hiển thị trên trang hiện tại
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 6, // Số lượng quán karaoke trên mỗi trang
      loading: true, // Trạng thái tải
      error: null, // Lỗi nếu có
      searchKeyword: "", // Từ khóa tìm kiếm
      filters: {
        minPrice: null, // Giá thấp nhất
        maxPrice: null, // Giá cao nhất
        capacity: null, // Sức chứa tối thiểu
        roomType: "", // Loại phòng
      },
    menuPages: {}, // // Trang hiện tại của menu
    itemsPerMenu: 6, // Số món ăn hiển thị trên mỗi trang
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredKaraokes.length / this.itemsPerPage);
    },

    totalPagesMenu() {
      if (this.karaokesToShow.length > 0) {
        return Math.ceil(this.karaokesToShow[0].menu.length / this.itemsPerMenu); // Lấy menu của quán đầu tiên
      }
      return 0;
    },
  },
  methods: {

    getValidPromotions(khuyenMaiList) {
    if (!khuyenMaiList || khuyenMaiList.length === 0) {
      return [];
    }

    const currentTime = new Date().getTime();

    // Lọc các chương trình còn hạn sử dụng
    const validPromotions = khuyenMaiList.filter(km => {
      const start = new Date(km.ngay_bat_dau).getTime();
      const end = new Date(km.ngay_ket_thuc).getTime();
      return currentTime >= start && currentTime <= end;
    });

    if (validPromotions.length === 0) {
      return [];
    }

    // Sắp xếp theo mức giảm giá từ cao xuống thấp
    validPromotions.sort((a, b) => b.gia_giam - a.gia_giam);

    // Chỉ lấy khuyến mãi có mức giảm cao nhất
    return validPromotions.slice(0, 1);
  },

    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN"); // Định dạng ngày kiểu Việt Nam
    },

    searchKaraokesByArea() {
      let filteredKaraokes = [...this.karaokes];

      if (this.searchKeyword) {
        filteredKaraokes = filteredKaraokes.filter((karaoke) =>
          karaoke.dia_chi.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      }

      this.filteredKaraokes = filteredKaraokes; // Lưu trữ danh sách quán đã lọc
      this.updateKaraokesToShow(); // Cập nhật dữ liệu hiển thị cho trang hiện tại
      this.currentPage = 1; // Reset lại trang
    },

    applyFilters() {
      let filteredKaraokes = [...this.karaokes];

      if (this.filters.minPrice !== null) {
        filteredKaraokes = filteredKaraokes.filter(
          (karaoke) => karaoke.gia_theo_gio >= this.filters.minPrice
        );
      }
      if (this.filters.maxPrice !== null) {
        filteredKaraokes = filteredKaraokes.filter(
          (karaoke) => karaoke.gia_theo_gio <= this.filters.maxPrice
        );
      }
      if (this.filters.capacity !== null) {
        filteredKaraokes = filteredKaraokes.filter(
          (karaoke) => karaoke.suc_chua >= this.filters.capacity
        );
      }
      if (this.filters.roomType) {
        filteredKaraokes = filteredKaraokes.filter(
          (karaoke) => karaoke.loai_phong === this.filters.roomType
        );
      }

      this.filteredKaraokes = filteredKaraokes; // Lưu trữ danh sách quán đã lọc
      this.updateKaraokesToShow(); // Cập nhật dữ liệu hiển thị cho trang hiện tại
      this.currentPage = 1; // Reset lại trang
    },

    updateKaraokesToShow() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.karaokesToShow = this.filteredKaraokes.slice(start, end); // Dùng filteredKaraokes thay vì karaokes
        // Cập nhật phân trang menu sau khi lấy quán karaoke
    // Cập nhật phân trang menu cho từng quán karaoke
      this.karaokesToShow.forEach(karaoke => {
        if (!this.menuPages[karaoke._id]) {
          this.menuPages[karaoke._id] = 1; // Mặc định trang 1
        }
        this.updateMenuToShow(karaoke); // Cập nhật menu cho từng quán karaoke
      });
   
    },

      updateMenuToShow(karaoke) {
      const menuPage = this.menuPages[karaoke._id];
      const start = (menuPage - 1) * this.itemsPerMenu;
      const end = start + this.itemsPerMenu;
      karaoke.menuToShow = karaoke.menu.slice(start, end); // Lọc menu theo trang hiện tại
    },



    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateKaraokesToShow(); // Cập nhật lại danh sách quán sau khi chuyển trang
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateKaraokesToShow(); // Cập nhật lại danh sách quán sau khi chuyển trang
      }
    },

      nextPageMenu(karaoke) {
      if (this.menuPages[karaoke._id] < Math.ceil(karaoke.menu.length / this.itemsPerMenu)) {
        this.menuPages[karaoke._id]++;
        this.updateMenuToShow(karaoke);
      }
    },

    prevPageMenu(karaoke) {
      if (this.menuPages[karaoke._id] > 1) {
        this.menuPages[karaoke._id]--;
        this.updateMenuToShow(karaoke);
      }
  },

    async fetchKaraokes() {
      try {
        const response = await axios.get('http://localhost:8080/api/karaokes/all');
        this.karaokes = response.data;
        this.filteredKaraokes = this.karaokes; 
          // console.log(this.filteredKaraokes);
          // Ban đầu không lọc, lưu trữ tất cả quán
          this.updateKaraokesToShow(); 
      } catch (err) {
        this.error = 'Không thể tải dữ liệu quán karaoke';
      } finally {
        this.loading = false;
      }
    },

    // Chuyển đến trang xem phòng của quán karaoke
    goToRoomsView(karaoke) {
      this.$router.push({ name: "RoomList", params: { karaokeId: karaoke._id } });
    },
  },

  mounted() {
    this.fetchKaraokes(); // Gọi API khi component được mount
  },
};
</script>



<style scoped>
/* Cấu trúc của toàn bộ giao diện */
.karaoke-list-view {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

/* Thanh tìm kiếm */
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 90%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

/* Trạng thái tải */
.loading, .error {
  text-align: center;
  font-size: 18px;
  color: #ff5722;
}

/* Danh sách các quán karaoke */
.karaokes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Thẻ mỗi quán karaoke */
.karaoke-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.karaoke-card:hover {
  transform: translateY(-5px);
}

/* Hình ảnh quán karaoke */
.karaoke-images {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.karaoke-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* Thông tin quán karaoke */
.karaoke-info {
  padding: 15px;
}

.karaoke-info h2 {
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}

.karaoke-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

/* Khuyến mãi */
.promotion-view {
  padding: 15px;
  background-color: #f0f0f0;
}

.promotion-view h3 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}

.promotion-view ul {
  list-style-type: none;
  padding: 0;
}

.promotion-view li {
  margin-bottom: 10px;
}

.promotion-view strong {
  color: #007BFF;
}

.promotion-view p {
  font-size: 14px;
  color: #333;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.2; }
  100% { opacity: 1; }
}

.blinking {
  animation: blink 1s infinite;
  color: red; /* Làm nổi bật */
  font-weight: bold;
}

/* Menu quán karaoke */
.menu-view {
  padding: 15px;
  background-color: #f9f9f9;
}

.menu-view h3 {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

.menu-view ul {
  list-style-type: none;
  padding: 0;
}

.menu-view li {
  margin-bottom: 10px;
}

.menu-view strong {
  color: #007BFF;
}

.menu-view p {
  font-size: 14px;
  color: #333;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  margin: 0 10px;
}

/* Phần không có dữ liệu */
.no-data {
  text-align: center;
  font-size: 18px;
  color: #777;
}

/* Media Query cho các thiết bị di động (màn hình dưới 768px) */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .search-button {
    width: 100%;
  }

  .karaokes-container {
    grid-template-columns: 1fr;
  }

  .karaoke-card {
    margin-bottom: 20px;
  }

  .pagination {
    flex-direction: column;
  }

  .pagination button {
    width: 100%;
    margin-bottom: 10px;
  }
}

/* Media Query cho các thiết bị máy tính bảng (màn hình từ 768px đến 1024px) */
@media (max-width: 1024px) {
  .karaokes-container {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .search-input {
    width: 80%;
  }

  .search-button {
    width: 18%;
  }
}


</style>
