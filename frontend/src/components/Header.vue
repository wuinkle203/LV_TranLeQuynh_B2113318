<template>
  <div :class="['header-container', { 'transparent-header': isHomeView }]">
    <!-- Logo -->
    <div class="logo">
      <img src="D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/frontend/src/image/logo-removebg.png" alt="Logo" height="60px" />
    </div>

    <!-- Links -->
    <ul class="header-links">
      <!-- Nếu chưa đăng nhập -->
      <li v-if="!isLoggedIn">
        <router-link to="/login">
          <i class="fas fa-sign-in-alt"></i> Đăng Nhập
        </router-link>
        <router-link to="/register">
          <i class="fa-solid fa-user"></i> Đăng Ký
        </router-link>
      </li>
      <!-- Nếu đã đăng nhập -->
      <li v-else class="user-menu">
        <span @click="toggleDropdown" class="user-icon">
          Xin chào, {{ ho_ten }} <i class="fa-solid fa-circle-user"></i>
        </span>
        <div v-if="isDropdownVisible" class="dropdown-box">
          <router-link to="/profile" class="dropdown-item" @click="toggleDropdown">
            <i class="fa-solid fa-id-card"></i> Trang cá nhân
          </router-link>
          <button @click="logout" class="dropdown-item">
            <i class="fa-solid fa-right-to-bracket"></i> Đăng Xuất
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isLoggedIn: false,
      ho_ten: '',
      isDropdownVisible: false,
    };
  },
  computed: {
    isHomeView() {
      return this.$route.path === '/'; // Kiểm tra nếu đang ở HomeView
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    logout() {
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.ho_ten = '';
      this.isDropdownVisible = false;
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
    this.updateUserInfo();
  },
  watch: {
    $route: 'updateUserInfo',
  },
};
</script>

<style scoped>
/* Nền mặc định */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #6c2d1f;
  color: white;
  font-family: 'Segoe UI', sans-serif;
  background: radial-gradient(circle, #34495e 0%, #2c3e50 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* Nền trong suốt khi ở HomeView */
.transparent-header {
  background: transparent !important;
  box-shadow: none !important;
}

/* Các style còn lại giữ nguyên */
.logo img {
  height: 40px;
  object-fit: cover;
}

.header-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.header-links li {
  display: inline-block;
  font-size: 16px;
}

.header-links a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.header-links a:hover {
  background-color: #555;
}

.user-menu {
  position: relative;
}

.user-icon {
  cursor: pointer;
  color: white;
  font-weight: 600;
}

.user-icon:hover {
  text-decoration: underline;
}

.dropdown-box {
  position: absolute;
  top: 30px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 150px;
}

.dropdown-item {
  display: block !important;
  padding: 10px 15px !important;
  text-decoration: none !important;
  color: #333 !important;
  font-weight: 500;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0 !important;
  color: #007bff;
}
</style>
