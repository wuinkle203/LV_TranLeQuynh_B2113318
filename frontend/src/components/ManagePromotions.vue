<template>
    <div class="container">
      <h2>Quản lý Khuyến Mãi</h2>
  
      <!-- Danh sách quán karaoke -->
      <div v-if="karaokes.length">
        <div v-for="karaoke in karaokes" :key="karaoke._id" class="karaoke-card">
          <h4>{{ karaoke.ten_quan }}</h4>
          <p>Địa chỉ: {{ karaoke.dia_chi }}</p>
  
          <!-- Danh sách khuyến mãi cho từng quán -->
          <div v-if="karaoke.khuyen_mai.length">
            <h5>Khuyến mãi:</h5>
            <div v-for="promotion in karaoke.khuyen_mai" :key="promotion._id" class="promotion-card">
              <p>Tên: {{ promotion.ten_chuong_trinh }}</p>
              <p>Nội dung: {{ promotion.noi_dung }}</p>
              <p>Thời gian: Từ {{ formatDate(promotion.ngay_bat_dau) }} Đến {{ formatDate(promotion.ngay_ket_thuc) }}</p>
              <p>Giảm giá: {{ promotion.gia_giam }}%</p>
              <button @click="toggleEditForm(karaoke._id, promotion)">Sửa</button>
              <button @click="deletePromotion(karaoke._id, promotion._id)">Xóa</button>
  
              <!-- Form sửa khuyến mãi -->
              <form
                v-if="currentPromotion && currentPromotion._id === promotion._id"
                @submit.prevent="updatePromotion(karaoke._id)"
              >
                <input type="text" v-model="currentPromotion.ten_chuong_trinh" required />
                <textarea v-model="currentPromotion.noi_dung" required></textarea>
                <input type="date" v-model="currentPromotion.ngay_bat_dau" required />
                <input type="date" v-model="currentPromotion.ngay_ket_thuc" required />
                <input type="number" v-model="currentPromotion.gia_giam" required />
                <button type="submit">Cập nhật</button>
              </form>
            </div>
          </div>
          <div v-else>
            <p>Chưa có khuyến mãi nào cho quán này.</p>
          </div>
  
          <!-- Form thêm khuyến mãi -->
          <button class="add-promotion-button" @click="toggleAddForm(karaoke._id)">Thêm Khuyến Mãi</button>
          <form
            v-if="isAddFormVisible === karaoke._id"
            @submit.prevent="addPromotion(karaoke._id)"
          >
            <input type="text" v-model="newPromotion.ten_chuong_trinh" placeholder="Tên chương trình" required />
            <textarea v-model="newPromotion.noi_dung" placeholder="Nội dung khuyến mãi" required></textarea>
            <input type="date" v-model="newPromotion.ngay_bat_dau" required />
            <input type="date" v-model="newPromotion.ngay_ket_thuc" required />
            <input type="number" v-model="newPromotion.gia_giam" placeholder="Giảm giá (%)" required />
            <button type="submit">Thêm</button>
          </form>
        </div>
      </div>
      <div v-else>
        <p>Không có quán karaoke nào.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        karaokes: [],
        newPromotion: {
          ten_chuong_trinh: "",
          noi_dung: "",
          ngay_bat_dau: "",
          ngay_ket_thuc: "",
          gia_giam: 0,
        },
        currentPromotion: null,
        isAddFormVisible: null,
      };
    },
    methods: {
      async fetchKaraokes() {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.userId; // Đảm bảo userId đã được lưu/ Lấy userId từ localStorage
        if (!userId) {
          console.error("Chưa có userId trong localStorage.");
          return;
        }
  
        try {
          const response = await axios.get("http://localhost:8080/api/karaokes", {
            params: { userId }, // Gửi userId trong query params
          });
          this.karaokes = response.data;
        } catch (error) {
          console.error("Lỗi khi tải danh sách quán karaoke:", error);
        }
      },
      toggleAddForm(karaokeId) {
        this.isAddFormVisible = this.isAddFormVisible === karaokeId ? null : karaokeId;
      },
      toggleEditForm(karaokeId, promotion) {
        if (this.currentPromotion && this.currentPromotion._id === promotion._id) {
          this.currentPromotion = null; // Tắt form nếu đã mở
        } else {
          this.currentPromotion = { ...promotion, karaokeId }; // Mở form sửa
        }
      },
      async addPromotion(karaokeId) {
        if (!karaokeId || !this.newPromotion.ten_chuong_trinh || !this.newPromotion.ngay_bat_dau || !this.newPromotion.ngay_ket_thuc) {
          console.error("Thiếu thông tin cần thiết để thêm khuyến mãi");
          return;
        }
  
        try {
          const response = await axios.post(
            `http://localhost:8080/api/karaokes/${karaokeId}/promotions`,
            {
              ...this.newPromotion,
              ngay_bat_dau: this.formatDate(this.newPromotion.ngay_bat_dau), // Đảm bảo định dạng ngày
              ngay_ket_thuc: this.formatDate(this.newPromotion.ngay_ket_thuc), // Đảm bảo định dạng ngày
            }
          );
          const karaoke = this.karaokes.find(k => k._id === karaokeId);
          karaoke.khuyen_mai.push(response.data);
          this.resetNewPromotion();
          this.fetchKaraokes();
          this.isAddFormVisible = null;
        } catch (error) {
          console.error("Lỗi khi thêm khuyến mãi:", error);
        }
      },
      async updatePromotion(karaokeId) {
        if (!this.currentPromotion || !this.currentPromotion._id) {
          console.error("Thiếu thông tin khuyến mãi cần cập nhật");
          return;
        }
  
        try {
          await axios.put(
            `http://localhost:8080/api/karaokes/${karaokeId}/promotions/${this.currentPromotion._id}`,
            {
              ...this.currentPromotion,
              ngay_bat_dau: this.formatDate(this.currentPromotion.ngay_bat_dau), // Đảm bảo định dạng ngày
              ngay_ket_thuc: this.formatDate(this.currentPromotion.ngay_ket_thuc), // Đảm bảo định dạng ngày
            }
          );
          const karaoke = this.karaokes.find(k => k._id === karaokeId);
          const index = karaoke.khuyen_mai.findIndex(p => p._id === this.currentPromotion._id);
          karaoke.khuyen_mai[index] = { ...this.currentPromotion };
          this.currentPromotion = null;
        } catch (error) {
          console.error("Lỗi khi cập nhật khuyến mãi:", error);
        }
      },
      async deletePromotion(karaokeId, promotionId) {
        try {
          await axios.delete(
            `http://localhost:8080/api/karaokes/${karaokeId}/promotions/${promotionId}`
          );
          const karaoke = this.karaokes.find(k => k._id === karaokeId);
          karaoke.khuyen_mai = karaoke.khuyen_mai.filter(promotion => promotion._id !== promotionId);
        } catch (error) {
          console.error("Lỗi khi xóa khuyến mãi:", error);
        }
      },
      formatDate(value) {
        if (!value) return "";
        const date = new Date(value);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
      },
      resetNewPromotion() {
        this.newPromotion = {
          ten_chuong_trinh: "",
          noi_dung: "",
          ngay_bat_dau: "",
          ngay_ket_thuc: "",
          gia_giam: 0,
        };
      },
    },
    created() {
      this.fetchKaraokes();
    },
  };
  </script>
  


  <style scoped>
  /* Container chính */
  .container {
    /* max-width: 1000px; */
    width: 90%;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #f4f4f9;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h2 {
    /* font-size: 2em; */
    color: #333;
    text-align: center;
    margin-bottom: 40px;
  }

  /* Thẻ quán karaoke */
  .karaoke-card {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .karaoke-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .karaoke-card h4 {
    font-size: 1.6em;
    color: #333;
    margin: 0 0 10px;
  }

  .karaoke-card p {
    font-size: 1em;
    color: #666;
    margin-bottom: 15px;
  }

  /* Thẻ khuyến mãi */
  .promotion-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .promotion-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .promotion-card p {
    font-size: 1em;
    color: #333;
    margin-bottom: 10px;
  }

  .promotion-card button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s ease;
  }

  .promotion-card button:hover {
    background-color: #0056b3;
  }

  /* Form sửa khuyến mãi */
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }

  form input,
  form textarea,
  form button {
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1em;
  }

  form input,
  form textarea {
    width: 100%;
  }

  form button {
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  form button:hover {
    background-color: #218838;
  }

  /* Form thêm khuyến mãi */
  .add-promotion-button {
    background-color: #ffc107;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.3s ease;
  }

  .add-promotion-button:hover {
    background-color: #e0a800;
  }

  /* Định dạng lỗi */
  .error-message {
    color: red;
    font-size: 1.1em;
    margin-top: 10px;
  }

  /* Lọc và chỉnh sửa hình ảnh khuyến mãi */
  .promotion-card img {
    max-width: 97%;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  /* Thông báo khi không có dữ liệu */
  .no-data {
    text-align: center;
    color: #999;
    font-size: 1.2em;
  }

  /* Áp dụng hiệu ứng loading */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    color: #007bff;
  }
</style>
