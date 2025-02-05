<template>
  <div id="app">
    <!-- Ẩn Header nếu là trang đăng ký hoặc trang đăng nhập -->
    <Header v-if="!isAuthPage" />
    
    <!-- Ẩn Navbar nếu là trang đăng ký hoặc trang đăng nhập -->
    <Navbar v-if="!isAuthPage" />
    
    <router-view @route-changed="checkRoute"></router-view>
    
    <!-- Ẩn Footer nếu là trang đăng ký hoặc trang đăng nhập -->
    <Footer v-if="!isAuthPage || !isHomePage" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    Header
  },
  data() {
    return {
      isAuthPage: false,
      isHomePage: false, // Biến kiểm tra nếu đang ở trang đăng ký hoặc đăng nhập
    };
  },
  methods: {
    checkRoute(route) {
      // Kiểm tra nếu route hiện tại là trang đăng ký hoặc đăng nhập
      this.isAuthPage = route === '/register' || route === '/login';
      if(route === '/register' || route === '/login')
        this.isAuthPage = true;
      if(route === '/')
        this.isHomePage = true;
    }
  },
  watch: {
    // Theo dõi thay đổi của route
    $route(to) {
      this.checkRoute(to.path);
    }
  },
  mounted() {
    // Kiểm tra route khi tải trang
    this.checkRoute(this.$route.path);
  }
};
</script>

<style scoped>
/* Đặt font chữ mặc định cho toàn bộ ứng dụng */
* {
  font-family: 'Segoe UI', sans-serif !important; /* Hoặc chọn font chữ bạn muốn */
  box-sizing: border-box; /* Giúp dễ quản lý kích thước của các phần tử */
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
}
</style>
