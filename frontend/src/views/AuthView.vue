<template>
    <div>
      <Navbar />
      <h1>Login or Register</h1>
      <router-view /> <!-- Dynamic rendering of Login or Register form -->
      <Footer />
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import Footer from '../components/Footer.vue';
  
  export default {
    name: 'AuthView',
    components: {
      Navbar,
      Footer
    }
  }
  </script>
  