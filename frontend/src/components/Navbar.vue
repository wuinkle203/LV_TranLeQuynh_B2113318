<template>
  <nav>
    <div class="navbar-container">

      <!-- Logo bên trái -->
      <div class="logo">
          <img src="D:\Computer Science\HK2-Nam4\LuanVanTotNghiep\Karaoke\frontend\src\image\logo.jpg" alt="Logo"/>
      </div>
      <!-- Các nút bên trái -->
      <ul class="nav-links">
        <li><router-link to="/"><i class="fas fa-home"></i> Trang chủ</router-link></li>
        <li><router-link to="/login"><i class="fas fa-sign-in-alt"></i> Đăng Nhập</router-link></li>
      </ul>

      <!-- Ô tìm kiếm -->
      <div class="search-container">
        <input type="text" placeholder="Tìm kiếm quán karaoke..." />
        <button type="submit"><i class="fas fa-search"></i> Tìm</button>
      </div>

    </div>
  </nav>
</template>

  <script>
  export default {
    name: 'Navbar',
  };
  </script>
  
  <style scoped>
  /* Navbar container */
  nav {
    background-color: #0e895e;
    color: white;
    padding: 10px 20px;
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Các nút điều hướng */
  .nav-links {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
  }
  
  .nav-links li {
    margin-right: 20px;
  }
  
  .nav-links a {
    color: white;
    text-decoration: none;
    font-size: 16px;
  }
  
  .nav-links a:hover {
    text-decoration: underline;
  }
  
  /* Ô tìm kiếm */
  .search-container {
    display: flex;
    align-items: center;
  }
  
  .search-container input {
    padding: 7px 14px;
    border: none;
    border-radius: 12px;
    margin-right: 4px;
  }
  
  .search-container button {
    padding: 7px 14px;
    background-color: #056809;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }

  /* Thêm khoảng cách cho biểu tượng FontAwesome */
.nav-links a i {
  margin-right: 3px;
}

.search-container button i {
  margin-right: 5px;
}

  
  .search-container button:hover {
    background-color: #45a049;
  }
  
  /* Logo bên phải */
  .logo img {
    height: 50px;
    width: auto;
  }
  </style>
  