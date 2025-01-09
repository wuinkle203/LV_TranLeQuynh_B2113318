<template>
  <div>
    <h2>Danh sách quán Karaoke</h2>
    <ul v-if="karaokes.length">
      <li v-for="karaoke in karaokes" :key="karaoke._id">
        {{ karaoke.ten_quan }} - {{ karaoke.dia_chi }}
        <button @click="selectKaraoke(karaoke._id)">Chọn quán</button>
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
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:8080/api/karaokes');
      this.karaokes = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quán karaoke:", error.message);
    }
  },
  methods: {
    selectKaraoke(karaokeId) {
      this.$emit("karaoke-selected", karaokeId); // Gửi karaokeId lên component cha
    }
  }
};
</script>
