<template>
  <div class="suggested-rooms">
    <h3>Phòng Tương Tự</h3>
    <div v-if="loading">Đang tải...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="suggestedRooms.length > 0">
      <div v-for="room in suggestedRooms" :key="room._id" class="suggested-room" @click="goToBookingView(room)">
        <img :src="'http://localhost:8080/uploads/' + room.hinh_anh[0]" alt="Room Image" />
        <p><strong>{{ room.ten_phong }} </strong> ({{ room.loai_phong }})</p>
        <!-- <p><strong> Giá: </strong> {{ room.gia_theo_gio[0].gia }} VNĐ</p> -->
        <p><strong> Quán: </strong> ({{ room.ten_quan }})</p>
        
      </div>
    </div>
    <div v-else>
      <p>Không có phòng nào gợi ý.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["roomId"],
  data() {
    return {
      suggestedRooms: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchSuggestedRooms();
  },
  watch: {
    roomId: "fetchSuggestedRooms",
  },
  methods: {
    async fetchSuggestedRooms() {
      if (!this.roomId) {
        console.warn("Không có roomId, không gọi API.");
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        console.log("Fetching rooms for:", this.roomId);
        const response = await axios.get(`http://localhost:8080/api/goi-y-phong/${this.roomId}`);
        this.suggestedRooms = response.data.phongGoiY || [];
      } catch (err) {
        this.error = "Lỗi khi tải phòng gợi ý!";
        console.error("API Error:", err);
      } finally {
        this.loading = false;
      }
    },

    goToBookingView(room) {
  const currentPath = this.$route.fullPath;

  this.$router.push({
    name: "Bookings",
    params: {
      karaokeId: room.karaokeId,
      roomId: room._id,
    },
  }).then(() => {
    if (this.$route.fullPath === currentPath) {
      this.$router.go(0); // Reload trang nếu route không đổi
    }
    this.$router.go(0);
  });
}

    



  },
};
</script>


<style scoped>
.suggested-rooms {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggested-rooms h3 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.suggested-room {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.suggested-room:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.suggested-room img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 15px;
}

.suggested-room p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

.suggested-room p strong {
  color: #222;
}

/* Responsive */
@media (max-width: 768px) {
  .suggested-room {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  .suggested-room img {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
  }
}
</style>

