<template>
  <div class="owner-dashboard">
    <h1>TRANG QUẢN LÝ KARAOKE CỦA CHỦ QUÁN</h1>
    <!-- Menu điều hướng -->
    <div class="menu">
      <button :class="{ active: activeComponent === 'ManageKaraokes' }" 
              @click="setActiveComponent('ManageKaraokes')">
      QUÁN KARAOKE
      </button>
      <button :class="{ active: activeComponent === 'AddKaraoke' }" 
              @click="setActiveComponent('AddKaraoke')">
        THÊM QUÁN MỚI
      </button>
      <button :class="{ active: activeComponent === 'ManagePromotions' }" 
              @click="setActiveComponent('ManagePromotions')">
        QUẢN LÝ KHUYẾN MÃI
      </button>
      <button :class="{ active: activeComponent === 'ManageBookings' }" 
              @click="setActiveComponent('ManageBookings')">
        QUẢN LÝ ĐẶT PHÒNG
      </button>
      <button :class="{ active: activeComponent === 'BookingHistory' }" 
              @click="setActiveComponent('BookingHistory')">
        LỊCH SỬ ĐẶT PHÒNG
      </button>
      <button :class="{ active: activeComponent === 'ManageMenu' }" 
              @click="setActiveComponent('ManageMenu')">
        QUẢN LÝ MENU
      </button>
    </div>
    <!-- Nội dung hiển thị -->
    <div class="content">
      <component 
        v-if="isComponentValid(activeComponent)" 
        :is="activeComponent" 
        :karaoke-id="selectedKaraokeId" 
        @karaoke-selected="handleKaraokeSelected" 
        @error="handleError"
      />
      <p v-else class="error-message">Thành phần không hợp lệ!</p>
    </div>
  </div>
</template>

<script>
import ManageKaraokes from "@/components/ManageKaraokes.vue";
import AddKaraoke from "@/components/AddKaraoke.vue";
import ManagePromotions from "@/components/ManagePromotions.vue";
import ManageRooms from "@/components/ManageRooms.vue";
import ManageBookings from "@/components/ManageBookings.vue";
import BookingHistory from "@/components/BookingHistory.vue";
import ManageMenu from "@/components/ManageMenu.vue"; // ✅ Thêm component quản lý menu

export default {
  components: {
    ManageKaraokes,
    AddKaraoke,
    ManagePromotions,
    ManageRooms,
    ManageBookings, 
    BookingHistory,
    ManageMenu, // ✅ Thêm vào danh sách component
  },
  data() {
    return {
      activeComponent: "ManageKaraokes",
      selectedKaraokeId: null,
      validComponents: [
        "ManageKaraokes", 
        "AddKaraoke", 
        "ManagePromotions", 
        "ManageRooms", 
        "ManageBookings", 
        "BookingHistory",
        "ManageMenu", // ✅ Thêm vào danh sách hợp lệ
      ],
    };
  },
  methods: {
    setActiveComponent(component) {
      if (this.validComponents.includes(component)) {
        this.activeComponent = component;
      } else {
        console.error(`Component không hợp lệ: ${component}`);
      }
    },
    handleKaraokeSelected(karaokeId) {
      if (!karaokeId) {
        console.error("Karaoke ID không hợp lệ:", karaokeId);
        return;
      }
      this.selectedKaraokeId = karaokeId;
      this.activeComponent = "ManageRooms";
    },
    isComponentValid(component) {
      return this.validComponents.includes(component);
    },
    handleError(message) {
      console.error("Lỗi từ component con:", message);
    },
  },
};
</script>


<style scoped>
/* Cấu trúc tổng thể của dashboard */
.owner-dashboard {
  font-family: 'Times New Roman', Times, serif;
  background-color: #f4f7fc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  /* max-width: 1200px; */
  width: 100%;
  margin: 30px auto;
}

h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

/* Menu điều hướng */
.menu {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap; /* Cho phép các nút bẻ xuống hàng nếu màn hình nhỏ */
}

.menu button {
  /* background: linear-gradient(45deg, rgba(114, 153, 193, 0.8) 0%, rgba(44, 62, 80, 0.7) 100%); */
  color: rgb(0, 0, 0);
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  /* border: 4px double; */
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 10px; /* Thêm margin dưới mỗi nút */
}

.menu button:hover {
  /* background-color: #387c3f; */
  transform: scale(1.05);
}

.menu button.active {
  background: linear-gradient(45deg, rgba(114, 153, 193, 0.8) 0%, rgba(44, 62, 80, 0.7) 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Nội dung hiển thị */
.content {
  margin-top: 20px;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

/* Cải tiến bố cục cho các components bên trong */
.component-container {
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.component-container h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 15px;
  text-align: center;
}

/* Đảm bảo responsive */
@media (max-width: 768px) {
  /* Chỉnh sửa menu cho phù hợp với màn hình nhỏ */
  .menu {
    flex-direction: column;
    align-items: center; /* Canh giữa các nút */
  }

  /* Nút khi ở trên màn hình nhỏ */
  .menu button {
    width: 100%; /* Các nút sẽ chiếm toàn bộ chiều rộng */
    max-width: 300px; /* Giới hạn độ rộng tối đa */
    padding: 15px;
  }

  /* Làm cho văn bản tiêu đề lớn hơn trong các màn hình nhỏ */
  h1 {
    font-size: 24px;
  }
  
  /* Điều chỉnh padding và khoảng cách cho nội dung */
  .owner-dashboard {
    padding: 10px;
  }
}

/* Responsive cho các màn hình rất nhỏ (ví dụ: điện thoại di động) */
@media (max-width: 480px) {
  /* Đảm bảo các button sẽ có kích thước dễ dàng bấm */
  .menu button {
    font-size: 14px; /* Giảm kích thước font chữ */
    padding: 12px 20px;
  }

  .error-message {
    font-size: 16px; /* Giảm kích thước font chữ thông báo lỗi */
  }

  .component-container h2 {
    font-size: 20px; /* Giảm kích thước tiêu đề */
  }
}

.hamburger-menu {
  font-size: 30px;
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.close-menu {
  font-size: 30px;
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.menu-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

</style>
