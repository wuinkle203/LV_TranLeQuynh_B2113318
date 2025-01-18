<template>
  <div class="home-view">
    <div class="background-overlay">
      <h1>HÃY CHỌN ĐỊA ĐIỂM HÁT KARAOKE NGAY BÂY GIỜ!</h1>
      <!-- <button class="start-button" @click="navigateToRegister">BẮT ĐẦU</button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    navigateToRegister() {
      this.$router.push('/register'); // Điều hướng đến trang đăng ký
    },
  },
};
</script>

<style scoped>
.home-view {
  opacity: 0.9;
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/frontend/src/image/background-karaoke.jpg') center center no-repeat;
  background-size: cover;
  top: -170px;
  z-index: -1;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Overlay mờ */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 3rem;
  color: white;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: 2px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6); /* Tạo bóng cho chữ */
  transition: transform 0.3s ease, opacity 0.3s ease;
  animation: zoomInOut 5s infinite ease-in-out;
}

/* Nút Bắt Đầu */
.start-button {
  margin-top: 20px;
  padding: 15px 30px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #ff6a00, #ee0979);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  transition: transform 0.3s ease, background 0.3s ease;
}

.start-button:hover {
  transform: scale(1.1);
  background: linear-gradient(45deg, #ee0979, #ff6a00);
}

.start-button:active {
  transform: scale(0.95);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

/* Animation để chữ phóng to và thu nhỏ */
@keyframes zoomInOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
