<template>
  <footer class="footer">
    <!-- Thông tin liên hệ -->
    <div class="footer-item contact-info">
      <h3>Thông tin liên hệ</h3>
      <p><strong>Điện thoại:</strong> (+84) 779884200</p>
      <p><strong>Email:</strong> quynhB2113318@student.ctu.edu.vn</p>
      <p><strong>Địa chỉ: </strong>ĐHCT, Khu II, Đường 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ</p>
    </div>

    <!-- Bản quyền -->
    <div class="footer-item copyright">
      <p>&copy; 2025 Karaoke LVTN. All Rights Reserved.</p>
    </div>

    <!-- Google Maps (Đại học Cần Thơ) -->
    <div class="footer-item google-map">
      <h3>Đại học Cần Thơ</h3>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.672915669579!2d105.74637751424007!3d10.034118892080462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a088229bcf3d71%3A0x5b1dd7c0e7451693!2zVHLGsOG7nW5nIMSQaeG7hWkgxJDhuqFpIEjhu41jIEPhuqduIFRo4buL!5e0!3m2!1svi!2s!4v1679987080012!5m2!1svi!2s"
        width="100%" height="200" frameborder="0" style="border:0;" allowfullscreen=""
        aria-hidden="false" tabindex="0"></iframe>
    </div>
  </footer>
</template>


<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
/* Tổng thể Footer */
.footer {
  width: 100%;
  background: #2c3e50;
  color: white;
  padding: 50px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 cột */
  gap: 20px;
  box-sizing: border-box;
  position: relative;
}

/* Thiết kế cho mỗi ô trong Footer */
.footer-item {
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
}

/* Ô thông tin liên hệ */
.contact-info h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.contact-info p {
  font-size: 1rem;
  line-height: 1.6;
}

/* Ô bản quyền */
.copyright {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.copyright p {
  font-size: 1rem;
  margin: 0;
}

/* Ô bản đồ Google Map */
.google-map iframe {
  width: 100%;
  height: 200px;
  border: 0;
  border-radius: 8px;
}

/* Responsive: điều chỉnh cho màn hình nhỏ */
@media (max-width: 768px) {
  .footer {
    grid-template-columns: 1fr; /* Chuyển về một cột trên thiết bị nhỏ */
  }
}
</style>
