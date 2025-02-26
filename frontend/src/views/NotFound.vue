<template>
    <div class="not-found">
      <h1>404 - Trang Không Tìm Thấy</h1>
      <p>Rất tiếc, trang bạn đang tìm không tồn tại.</p>
      <router-link to="/">Quay lại trang chủ</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound"
  };
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 50px;
    font-size: 1.5em;
  }
  
  .not-found h1 {
    color: #f44336;
  }
  
  .not-found p {
    margin: 20px 0;
  }
  
  .not-found a {
    text-decoration: none;
    color: #007bff;
  }
  </style>
  