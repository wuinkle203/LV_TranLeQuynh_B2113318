<template>
  <div id="app">
    <Header />
    <Navbar />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import RegisterForm from './components/RegisterForm.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    RegisterForm,
    Footer,
    Header
  }
};
</script>

<style scoped>
h1 {
  color: blue;
}


/* Đặt font chữ mặc định cho toàn bộ ứng dụng */
* {
  font-family: 'Arial', sans-serif !important; /* Hoặc chọn font chữ bạn muốn */
  box-sizing: border-box; /* Giúp dễ quản lý kích thước của các phần tử */
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
}

/* Cải tiến các font chữ cho các phần tử cụ thể nếu cần */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Arial', sans-serif;
}

</style>
