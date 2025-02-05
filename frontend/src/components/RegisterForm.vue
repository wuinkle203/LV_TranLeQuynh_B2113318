<template>
  <div class="container">
    <div class="register">
      <h1>Tạo Tài Khoản</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="user_name">Tên Đăng Nhập</label>
          <input 
            v-model="user.user_name" 
            type="text" 
            id="user_name" 
            required 
            autocomplete="username"
            pattern="^[a-zA-Z0-9_]{5,20}$" 
            title="Tên đăng nhập phải có từ 5 đến 20 ký tự và chỉ chứa chữ cái, số hoặc dấu gạch dưới."
          />
          <p v-if="user.user_name && !isValidUsername" class="error-text">
            Tên đăng nhập phải có từ 5 đến 20 ký tự và chỉ chứa chữ cái, số hoặc dấu gạch dưới.
          </p>
        </div>

        <div class="form-group">
          <label for="mat_khau">Mật Khẩu</label>
          <div class="password-input">
            <input 
              v-model="user.mat_khau" 
              :type="showPassword ? 'text' : 'password'" 
              id="mat_khau" 
              required 
              autocomplete="new-password"
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$" 
              title="Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái và số."
            />
            <i 
              :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" 
              @click="togglePasswordVisibility"
              class="eye-icon"
            ></i>
          </div>
          <p v-if="user.mat_khau && !isValidPassword" class="error-text">
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số.
          </p>
        </div>

        <div class="form-group">
          <label for="xac_nhan_mat_khau">Xác Nhận Mật Khẩu</label>
          <div class="password-input">
            <input 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="xac_nhan_mat_khau" 
              required 
              autocomplete="new-password"
            />
            <i 
              :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" 
              @click="toggleConfirmPasswordVisibility"
              class="eye-icon"
            ></i>
          </div>
          <p v-if="confirmPassword && confirmPassword !== user.mat_khau" class="error-text">
            Mật khẩu xác nhận không khớp.
          </p>
        </div>

        <button type="submit">Đăng Ký</button>
      </form>

      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <div class="login">Bạn đã có tài khoản? <router-link to="/login">Đăng Nhập</router-link></div>
    </div>
  </div>
</template>


<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        user_name: '',
        mat_khau: ''
      },
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      errorMessage: '',
      successMessage: ''
    };
  },

  computed: {
    isValidUsername() {
      const usernamePattern = /^[a-zA-Z0-9_]{5,20}$/;
      return usernamePattern.test(this.user.user_name);
    },
    isValidPassword() {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordPattern.test(this.user.mat_khau);
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async submitForm() {
      if (!this.isValidUsername) {
        this.errorMessage = "Tên đăng nhập không hợp lệ.";
        return;
      }
      if (!this.isValidPassword) {
        this.errorMessage = "Mật khẩu không hợp lệ.";
        return;
      }
      if (this.confirmPassword !== this.user.mat_khau) {
        this.errorMessage = "Mật khẩu xác nhận không khớp.";
        return;
      }

      try {
        // Kiểm tra xem tên đăng nhập đã tồn tại chưa
        const checkUsernameResponse = await axios.post(
          "http://localhost:8080/api/users/check-username", 
          { user_name: this.user.user_name }
        );

        if (checkUsernameResponse.data.exists) {
          this.errorMessage = "Tài khoản đã tồn tại.";
          return;
        }

        // Nếu tên đăng nhập chưa tồn tại, tiếp tục gửi yêu cầu đăng ký
        const userData = {
          ...this.user,
          mat_khau: this.user.mat_khau || "",
          user_name: this.user.user_name || "",
        };

        const response = await axios.post(
          "http://localhost:8080/api/users/register",
          userData
        );

        this.errorMessage = "";
        this.successMessage = "Đăng ký thành công";
        toast.success(this.successMessage, { autoClose: 1500 });

        // Reset dữ liệu
        this.user = { user_name: "", mat_khau: "" };
        this.confirmPassword = "";
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500); 
      } catch (error) {
        this.successMessage = "";
        this.errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
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
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(45deg, #7299c1 0%, #2c3e50);
  color: #333;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Đảm bảo chiều cao màn hình là 100% */
  width: 100vw; /* Đảm bảo chiều rộng màn hình là 100% */
  box-sizing: border-box;
}


.register {
  font-family: 'Segoe UI', sans-serif;
  background: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease-in-out; /* Hiệu ứng chuyển động mượt mà */
}

.register h1 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  color: #444;
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
  padding-right: 40px; /* Adjust for icon space */
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
.login{
  margin-top: 5px;
}
.login a{
  text-decoration: none;
  font-weight: bold;
}
</style>
