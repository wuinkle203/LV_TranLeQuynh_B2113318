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
      // user_name: decodedToken.user_name,  // Lấy user_name từ payload của token
      // ho_ten: decodedToken.ho_ten,  // Lấy ho_ten từ payload của token
      isLoggedIn: true,
      // vai_tro:decodedToken.vai_tro
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

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}


.container {
  background: url('D:\Computer Science\HK2-Nam4\LuanVanTotNghiep\Karaoke\frontend\src\image\9959299.jpg') center center fixed; 
  background-size: cover;
  color: white;
  margin: 0;
  padding: 0;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Đảm bảo chiều cao màn hình là 100% */
  width: 100vw; /* Đảm bảo chiều rộng màn hình là 100% */
  box-sizing: border-box;
}


.login {
  background: rgba(255, 255, 255, 0.1); /* Nền trong suốt */
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease-in-out; /* Hiệu ứng chuyển động mượt mà */
}

.login h1 {
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 30px;
  text-align: center;
  color: white;
}

/* Phần còn lại của CSS giữ nguyên */

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
  font-size: 24px;
  font-weight: bold;
}

.form-group input {
  height: 60px;
  width: 100%;
  padding: 10px;
  font-size: 28px;
  background: transparent;
  border: none;
  border-bottom: 3px solid #ddd; /* Nét gạch dưới */
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
}

.password-input {
  display: flex;
  align-items: center;
  position: relative;
}

.password-input input {
  flex: 1;
  padding-right: 40px; /* Adjust for icon space */
}

.eye-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 28px;
  transition: color 0.3s ease;
}

.eye-icon:hover {
  color: #007bff;
}

/* Nút đăng nhập */
button {
  width: 100%;
  padding: 10px;
  font-size: 1.1em;
  color: #fff;
  background: linear-gradient(90deg, #007bff, #0056b3);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.4s ease;
}

/* Hiệu ứng nền lan tỏa */
button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent);
  transition: transform 1s ease, opacity 0.5s ease;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

/* Khi hover vào nút */
button:hover::before {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

button:hover {
  background: linear-gradient(90deg, #0056b3, #003d80);
}


button[type="submit"] {
  margin-top: 5px;
  width: 100%;
  padding: 10px;
  font-size: 28px;
  font-weight: bold;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  border-bottom: 3px solid #435D76;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  margin-top: 15px;
  border-radius: 15px;
  font-size: 24px;
}

.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 10px;
  margin-top: 15px;
  border-radius: 15px;
  font-size: 24px;
}
.login{
  margin-top: 5px;
  font-size: 26px;
}
.login a{
  text-decoration: none;
  font-weight: bold;
  font-size: 28px;
}
</style>
