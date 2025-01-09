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
</style>
