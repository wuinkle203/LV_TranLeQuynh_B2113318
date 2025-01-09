<template>
  <div>
    <h2>Thêm quán Karaoke mới</h2>
    <form @submit.prevent="submitForm">
      <label>Tên quán:</label>
      <input v-model="karaoke.ten_quan" type="text" required />

      <label>Địa chỉ:</label>
      <input v-model="karaoke.dia_chi" type="text" required />

      <label>Số điện thoại:</label>
      <input v-model="karaoke.so_dien_thoai" type="text" required />

      <button type="submit">Thêm</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      karaoke: {
        ten_quan: "",
        dia_chi: "",
        so_dien_thoai: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('http://localhost:8080/api/karaokes', this.karaoke);
        // const response = await axios.post("/api/karaokes", this.karaoke);
        alert("Thêm quán thành công!");
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi thêm quán karaoke:", error.message);
      }
    },
  },
};
</script>
