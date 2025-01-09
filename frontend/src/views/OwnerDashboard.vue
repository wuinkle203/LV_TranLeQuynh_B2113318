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
