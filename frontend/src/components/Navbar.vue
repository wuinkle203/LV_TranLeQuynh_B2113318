<template>
  <div class="navbar-container" :class="['navbar-container', { 'transparent-header': isHomeView }]">
    <ul class="nav-links" :class="{ 'active': isMenuOpen }">
      <li><router-link to="/"><i class="fas fa-home"></i> Trang Chủ</router-link></li>
      <li><router-link to="/rooms"><i class="fa-solid fa-location-dot"></i>Xem Phòng</router-link></li>
      <li><router-link to="/booking-history"><i class="fa-solid fa-bag-shopping"></i>Đơn Đặt Phòng</router-link></li>
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
      isMenuOpen: false,  // Biến kiểm tra menu đang mở hay không
    };
  },
  computed: {
    isHomeView() {
      return this.$route.path === '/'; // Kiểm tra nếu đang ở HomeView
    },
  },
  methods: {
    toggleMenu() {
      // Đảo ngược trạng thái của menu
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>


<style scoped>
/* Navbar container */
.navbar-container {
  display: flex;
  /* justify-content: center;
  align-items: center; */
  margin: 10px 10px;
  height: 80px;
  background-color: none;
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
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, rgba(114, 153, 193, 0.8) 0%, rgba(44, 62, 80, 0.7) 100%);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  transition: transform 0.3s ease, background 0.3s ease;
  border: 5px double ;
}

.nav-links a:hover {
  transform: scale(1.1);
  background: linear-gradient(0deg, #7299c1 0%, #2c3e50);
}

/* Thêm khoảng cách cho biểu tượng FontAwesome */
.nav-links a i {
  margin-right: 4px;
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
