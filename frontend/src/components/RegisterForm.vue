<template>
    <div class="register">
      <h1>Đăng Ký Người Dùng</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="ho_ten">Họ và Tên</label>
          <input v-model="user.ho_ten" type="text" id="ho_ten" required />
        </div>
  
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="user.email" type="email" id="email" required />
        </div>
  
        <div class="form-group">
          <label for="user_name">Tên Đăng Nhập</label>
          <input v-model="user.user_name" type="text" id="user_name" required />
        </div>
  
        <div class="form-group">
          <label for="mat_khau">Mật Khẩu</label>
          <input v-model="user.mat_khau" type="password" id="mat_khau" required />
        </div>
  
        <div class="form-group">
          <label for="so_dien_thoai">Số Điện Thoại</label>
          <input v-model="user.so_dien_thoai" type="text" id="so_dien_thoai" />
        </div>
  
        <div class="form-group">
          <label for="dia_chi">Địa Chỉ</label>
          <input v-model="user.dia_chi" type="text" id="dia_chi" />
        </div>
  
        <div class="form-group">
          <label for="vai_tro">Vai Trò</label>
          <select v-model="user.vai_tro" id="vai_tro" required>
            <option value="chu_quan">Chủ Quán</option>
            <option value="khach_hang">Khách Hàng</option>
          </select>
        </div>
  
        <button type="submit">Đăng Ký</button>
      </form>
  
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
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
          ho_ten: '',
          email: '',
          user_name: '',
          mat_khau: '',
          so_dien_thoai: '',
          dia_chi: '',
          vai_tro: 'khach_hang'
        },
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await axios.post('http://localhost:8080/api/users/register', this.user);
          this.errorMessage = '';
          this.user = {
            ho_ten: '',
            email: '',
            user_name: '',
            mat_khau: '',
            so_dien_thoai: '',
            dia_chi: '',
            vai_tro: 'khach_hang'
          };
          toast.success('Đăng ký thành công', {
                    autoClose: 1500,
                })
        //   setTimeout(() => {
        //   this.successMessage = '';
        // }, 5000);
        } catch (error) {
          this.successMessage = '';
          toast.error(this.errorMessage);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register {
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
  
  input, select, button {
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
  
  .success {
    color: green;
  }
  </style>
  