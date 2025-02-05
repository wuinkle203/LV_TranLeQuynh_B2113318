<template>
  <div>
    <h2>Thêm quán Karaoke mới</h2>
    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <label for="ten_quan">Tên quán:</label>
      <input v-model="karaoke.ten_quan" id="ten_quan" type="text" required />
      <span v-if="errors.ten_quan" class="error">{{ errors.ten_quan }}</span>

      <label for="dia_chi">Địa chỉ:</label>
      <input v-model="karaoke.dia_chi" id="dia_chi" type="text" required />
      <span v-if="errors.dia_chi" class="error">{{ errors.dia_chi }}</span>

      <label for="so_dien_thoai">Số điện thoại:</label>
      <input v-model="karaoke.so_dien_thoai" id="so_dien_thoai" type="text" required />
      <span v-if="errors.so_dien_thoai" class="error">{{ errors.so_dien_thoai }}</span>

      <label for="hinh_anh_quan">Hình ảnh quán:</label>
      <input type="file" id="hinh_anh_quan" @change="handleFileUpload" accept="image/*" required />
      <span v-if="errors.hinh_anh_quan" class="error">{{ errors.hinh_anh_quan }}</span>

      <div v-if="previewImage">
        <p>Ảnh xem trước:</p>
        <img :src="previewImage" alt="Preview" style="width: 150px; height: auto;" />
      </div>

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
        chu_so_huu_id: "",
      },
      hinh_anh_quan: null,
      previewImage: null,
      errors: {}, // Lưu lỗi form
    };
  },

  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userId) {
      this.karaoke.chu_so_huu_id = user.userId;
    } else {
      console.error("Không tìm thấy thông tin người dùng!");
    }
  },

  methods: {
    // Xử lý file khi chọn ảnh
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const fileTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!fileTypes.includes(file.type)) {
          this.errors.hinh_anh_quan = "Chỉ chấp nhận ảnh JPG, JPEG, PNG.";
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          this.errors.hinh_anh_quan = "Kích thước ảnh không được vượt quá 2MB.";
          return;
        }

        this.hinh_anh_quan = file;
        this.previewImage = URL.createObjectURL(file);
        this.errors.hinh_anh_quan = ""; // Xóa lỗi nếu hợp lệ
      }
    },

    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.karaoke.ten_quan || this.karaoke.ten_quan.length < 3 || this.karaoke.ten_quan.length > 50) {
        this.errors.ten_quan = "Tên quán phải từ 3 - 50 ký tự.";
        isValid = false;
      }

      if (!this.karaoke.dia_chi || this.karaoke.dia_chi.length < 10 || this.karaoke.dia_chi.length > 100) {
        this.errors.dia_chi = "Địa chỉ phải từ 10 - 100 ký tự.";
        isValid = false;
      }

      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(this.karaoke.so_dien_thoai)) {
        this.errors.so_dien_thoai = "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.";
        isValid = false;
      }

      if (!this.hinh_anh_quan) {
        this.errors.hinh_anh_quan = "Vui lòng chọn ảnh.";
        isValid = false;
      }

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      try {
        const formData = new FormData();
        formData.append("ten_quan", this.karaoke.ten_quan);
        formData.append("dia_chi", this.karaoke.dia_chi);
        formData.append("so_dien_thoai", this.karaoke.so_dien_thoai);
        formData.append("chu_so_huu_id", this.karaoke.chu_so_huu_id);
        formData.append("hinh_anh_quan", this.hinh_anh_quan);

        const response = await axios.post("http://localhost:8080/api/karaokes", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Thêm quán thành công!");
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi thêm quán karaoke:", error.message);
      }
    },
  },
};
</script>


<style scoped>
/* Cấu trúc chính của form */
div {
  font-family: 'Inter', sans-serif;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề của form */
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

/* Các label trong form */
label {
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

/* Các input trong form */
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input:focus {
  border-color: #45a049;
  outline: none;
}

/* Nút submit */
button {
  padding: 12px 20px;
  background-color: #45a049;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #388e3c;
}

/* Nếu có lỗi */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
