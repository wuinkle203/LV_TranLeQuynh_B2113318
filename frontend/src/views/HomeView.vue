<template>
    <div>
      <h1>Welcome to Karaoke System</h1>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import Footer from '../components/Footer.vue';
  
  export default {
    name: 'HomeView',
    components: {
      Navbar,
      Footer
    }
  }
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  </style>
  