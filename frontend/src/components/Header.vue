<template>
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <img src="D:\Computer Science\HK2-Nam4\LuanVanTotNghiep\Karaoke\frontend\src\image\logo-removebg.png" alt="Logo" height="60px" />
      </div>
  
      <!-- Hotline -->
      <div class="hotline">
        Hotline: 0779884200
      </div>
  
      <!-- Links -->
      <ul class="header-links">
        <!-- Nếu chưa đăng nhập -->
        <li v-if="!isLoggedIn">
          <router-link to="/login">
            <i class="fas fa-sign-in-alt"></i> Đăng Nhập
          </router-link>
        </li>
        <!-- Nếu đã đăng nhập -->
        <li v-else>
            <span>Xin chào, {{ ho_ten }}</span>
            <button @click="logout">Đăng Xuất</button>
        </li>

      </ul>
    </div>
  </template>
  
  <script>export default {
    name: 'Header',
    data() {
      return {
        isLoggedIn: false,
        ho_ten: '',
      };
    },
    watch: {
      // Theo dõi sự thay đổi của `isLoggedIn` hoặc `localStorage` nếu cần
      '$route': 'updateUserInfo', // Theo dõi sự thay đổi route và cập nhật thông tin người dùng
    },
    methods: {
      logout() {
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.ho_ten = '';
        this.$router.push('/');
      },
      updateUserInfo() {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.isLoggedIn) {
          this.isLoggedIn = true;
          this.ho_ten = userData.ho_ten || 'Người dùng';
        } else {
          this.isLoggedIn = false;
          this.ho_ten = '';
        }
      },
    },
    mounted() {
      this.updateUserInfo(); // Gọi khi mounted để cập nhật thông tin ngay lần đầu
    },
  };  
  </script>
  
  <style scoped>
  /* Logo */
  img {
    margin-left: 10px;
    margin-right: 10px;
  }
  
  /* Hotline */
  .hotline {
    color: white;
  }
  
  /* Header container */
  .header-container {
    justify-content: space-between;
    align-items: center;
    display: flex;
    background-color: rgb(33, 114, 68);
  }


  button {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif;
  border-left: 3px solid white;
    padding: 10px;
}

button:hover {
  text-decoration: underline;
}

  
  /* Header links */
  .header-links {
    list-style-type: none;
    margin-right: 10px;
    padding: 0;
    display: flex;
  }
  
  .header-links a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    margin-left: 10px;
    font-weight: bold;
  }
  
  .header-links a:hover {
    text-decoration: underline;

  }
  
  .header-links ul {
    margin-left: 10px;
  }
  
  .header-links a i {
    margin-right: 3px;
  }
  
  .search-container button i {
    margin-right: 5px;
  }
  </style>
  