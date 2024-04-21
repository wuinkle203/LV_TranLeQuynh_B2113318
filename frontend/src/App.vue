<template>
  <div class = "page">
    <Header v-if="showHeader" :isHomePage="isHomePage"></Header>

    <router-view class = "router-view"></router-view>  

    <Footer v-if="showFooter"></Footer>
  </div>
</template>

<script>
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";

export default {
  components: {
    Header,
    Footer,
  },
  computed: {
    showHeader(){
      const excludedRoutes = ['login','login-admin','register','notfound', 'add-book', 'book-from'];
      return !excludedRoutes.includes(this.$route.name);
    },

    showFooter(){
      const excludedRoutes = ['home','login','borrow', 'admin', 'user-managements', 'login-admin', 'notfound','register', 'add-book', 'book-from', 'borrow-censor', 'overall'];
      return !excludedRoutes.includes(this.$route.name);
    },
    isHomePage(){
      return this.$route.name === 'home';
    },
  },
}
</script>

<style >
    .page{
      height: auto;
      width: 100%;
    }
    
    .router-view {
      width: 100%; 
    }
</style>