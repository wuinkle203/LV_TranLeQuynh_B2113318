<template>
  <div class="login">
    <h1>Đăng nhập</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="user_name">Tên Đăng Nhập</label>
        <input v-model="credentials.user_name" type="text" id="user_name" required />
      </div>

      <div class="form-group">
        <label for="password">Mật Khẩu</label>
        <input v-model="credentials.password" type="password" id="password" required />
      </div>

      <button type="submit">Đăng nhập</button>
    </form>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import jwt_decode from 'jwt-decode';




export default {
  name: "Login",
  data() {
    return {
      credentials: {
        user_name: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {

    async submitForm() {
  try {
    const response = await axios.post('http://localhost:8080/api/users/login', this.credentials);
    
    // Giải mã token để lấy thông tin người dùng
    const token = response.data.token;
    const decodedToken = jwt_decode(token);  // Sử dụng jwt_decode

    // Lưu token và thông tin người dùng vào localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      user_name: decodedToken.user_name,  // Lấy user_name từ payload của token
      ho_ten: decodedToken.ho_ten,  // Lấy ho_ten từ payload của token
      isLoggedIn: true
    }));

    // Hiển thị thông báo thành công
    toast.success('Đăng nhập thành công', {
      autoClose: 800,
    });

    // Điều hướng về trang chủ
    setTimeout(() => {
      this.$router.push('/');
    }, 1500);
  } catch (error) {
    this.errorMessage = error.response?.data?.message || 'Đăng nhập thất bại!';
    toast.error(this.errorMessage);
  }
}



  }
};
</script>

<style scoped>
.login {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
}
</style>
