<template>
  <div class="container">
  <div class="login">
    <h1>Đăng Nhập</h1>
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
    <div class="dangky">
        Bạn chưa có tài khoản? <router-link to="/register">Đăng Ký</router-link>
      </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import jwt_decode from 'jwt-decode';
import { useId } from 'vue';




export default {
  name: "Login",
  data() {
    return {
      credentials: {
        user_name: '',
        password: '',
        userId:'',
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
      userId: decodedToken.userId,
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
.container {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(45deg, #7299c1 0%, #2c3e50);
  color: #333;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login {
  font-family: 'Segoe UI', sans-serif;
  background: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease-in-out;
}

.login h1 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  color: #444;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 15px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  outline: none;
}

.password-input {
  display: flex;
  align-items: center;
  position: relative;
}

.password-input input {
  flex: 1;
  padding-right: 40px;
}

.eye-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 18px;
  color: #777;
  transition: color 0.3s ease;
}

.eye-icon:hover {
  color: #007bff;
}

button[type="submit"] {
  width: 100%;
  background: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button[type="submit"]:hover {
  background: #0056b3;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  margin-top: 15px;
  border-radius: 15px;
  font-size: 14px;
}

.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px;
  margin-top: 15px;
  border-radius: 15px;
  font-size: 14px;
}

.register-link {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

.dangky{
  margin-top: 4px;
}

.dangky a{
  text-decoration: none;
  font-weight: bold;
}
</style>
