<template>
  <div class="navbar-container">
    <ul class="nav-links" :class="{ 'active': isMenuOpen }">
      <li>
        <router-link 
          to="/" 
          :class="{ active: $route.path === '/' }">
          <i class="fas fa-home"></i> Trang Chủ
        </router-link>
      </li>
      <li>
        <router-link 
          to="/rooms" 
          :class="{ active: $route.path === '/rooms' }">
          <i class="fa-solid fa-location-dot"></i> Xem Phòng
        </router-link>
      </li>
      <li>
        <router-link 
          to="/booking-history" 
          :class="{ active: $route.path === '/booking-history' }">
          <i class="fa-solid fa-bag-shopping"></i> Đơn Đặt Phòng
        </router-link>
      </li>
      <!-- Hiển thị nếu vai trò là chủ quán -->
      <li v-if="isOwner">
        <router-link 
          to="/owner" 
          :class="{ active: $route.path === '/owner' }">
          <i class="fa-solid fa-building"></i> Quản Lý Quán Karaoke
        </router-link>
      </li>
    </ul>
    <!-- Menu Hamburger for small screens -->
    <div class="hamburger" @click="toggleMenu">
      <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isMenuOpen: false, // Kiểm tra trạng thái menu
      userRole: null,    // Vai trò của người dùng
      userId: null,      // ID người dùng từ localStorage
    };
  },
  computed: {
    isHomeView() {
      return this.$route.path === '/'; // Kiểm tra nếu đang ở HomeView
    },
    isOwner() {
      return this.userRole === 'chu_quan'; // Kiểm tra nếu người dùng là chủ quán
    },
  },
  mounted() {
    this.userId = JSON.parse(localStorage.getItem('user'))?.userId; // Lấy userId từ localStorage
    if (this.userId) {
      this.getUserRole(); // Gọi API để lấy vai trò người dùng
    }
  },
  methods: {
    toggleMenu() {
      // Đảo ngược trạng thái của menu
      this.isMenuOpen = !this.isMenuOpen;
    },
    async getUserRole() {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${this.userId}`);
        const data = await response.json();
        if (data && data.vai_tro) {
          this.userRole = data.vai_tro; // Gán vai trò người dùng từ API
        } else {
          this.userRole = null; // Nếu không có vai trò, đặt là null
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        this.userRole = null;
      }
    },
  },
  watch: {
    $route: 'updateUserRole', // Theo dõi thay đổi của route để cập nhật lại vai trò
  },
};
</script>



<style scoped>
/* Navbar container */
.navbar-container {
  display: flex;
  /* justify-content: center;
  align-items: center; */
  /* margin: 10px 10px; */
  height: 80px;
  background: radial-gradient(circle, #34495e 0%, #2c3e50 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
}

.transparent-header {
  background: transparent !important;
  box-shadow: none !important;
}

.nav-links {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.nav-links li {
  margin-right: 60px;
}

.nav-links a {
  display: inline-block;
  text-decoration: none;
  padding: 15px 30px;
  font-size: 15px;
  font-weight: bold;
  color: rgb(255, 255, 255);
  /* background: linear-gradient(45deg, rgba(114, 153, 193, 0.8) 0%, rgba(44, 62, 80, 0.7) 100%); */
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  transition: transform 0.3s ease, background 0.3s ease;
  /* border: 5px double ; */
}

.nav-links a:hover {
  transform: scale(1.1);
  background: linear-gradient(0deg, #7299c1 0%, #2c3e50);
}

/* Thêm khoảng cách cho biểu tượng FontAwesome */
.nav-links a i {
  margin-right: 6px;
}


/* Thêm màu cho router-link đang ở trạng thái active */
.nav-links a.active {
  background: linear-gradient(45deg, rgba(114, 153, 193, 0.8) 0%, rgba(44, 62, 80, 0.7) 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}


/* Logo bên trái */
.logo img {
  height: 50px;
  width: auto;
}

/* Hamburger menu for small screens */
.hamburger {
  display: none;
  cursor: pointer;
}

.hamburger i {
  font-size: 2rem;
  color: #2c3e50;
}

/* Responsive styles */
@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 90px;
    left: 0;
    width: 100%;
    background-color: none;
    flex-direction: column;
    align-items: center;
    display: none;
  }

  .nav-links.active {
    display: flex;
  }

  .nav-links li {
    margin: 20px 0;
  }

  .hamburger {
    display: block;
    z-index: 1;
    }
}
</style>
