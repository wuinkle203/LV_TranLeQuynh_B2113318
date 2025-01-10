<template>
  <div class="owner-dashboard">
    <h1>Quản lý quán Karaoke</h1>
    <!-- Menu điều hướng -->
    <div class="menu">
      <button :class="{ active: activeComponent === 'KaraokeList' }" 
              @click="setActiveComponent('KaraokeList')">
        Danh sách quán Karaoke
      </button>
      <button :class="{ active: activeComponent === 'AddKaraoke' }" 
              @click="setActiveComponent('AddKaraoke')">
        Thêm quán mới
      </button>
      <button :class="{ active: activeComponent === 'ManagePromotions' }" 
              @click="setActiveComponent('ManagePromotions')">
        Quản lý khuyến mãi
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
import KaraokeList from "@/components/KaraokeList.vue";
import AddKaraoke from "@/components/AddKaraoke.vue";
import ManagePromotions from "@/components/ManagePromotions.vue";
import ManageRooms from "@/components/ManageRooms.vue";

export default {
  components: {
    KaraokeList,
    AddKaraoke,
    ManagePromotions,
    ManageRooms,
  },
  data() {
    return {
      activeComponent: "KaraokeList", // Mặc định hiển thị danh sách quán karaoke
      selectedKaraokeId: null, // Lưu id của quán karaoke được chọn
      validComponents: ["KaraokeList", "AddKaraoke", "ManagePromotions", "ManageRooms"], // Các component hợp lệ
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
      this.activeComponent = "ManageRooms"; // Chuyển sang quản lý phòng
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
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
}

.menu button {
  background-color: #45a049;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.menu button:hover {
  background-color: #387c3f;
  transform: scale(1.05);
}

.menu button.active {
  background-color: #387c3f;
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

</style>
