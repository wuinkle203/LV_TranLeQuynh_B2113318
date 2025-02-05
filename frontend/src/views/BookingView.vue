<template>
  <div class="booking-view">
    <div v-if="loading" class="loading">Đang tải thông tin phòng...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="room" class="room-detail">
      <button>
        <router-link to='/rooms'>Quay lại</router-link>
      </button>
      <h2>{{ room.ten_phong }} ({{ room.loai_phong }})</h2>
      
      <!-- Hiển thị tên quán karaoke -->
      <p><strong>Quán:</strong> {{ room.ten_quan }}</p>

      <div class="room-images">
        <!-- Hiển thị ảnh theo chỉ số hiện tại -->
        <img :src="'http://localhost:8080/uploads/' + room.hinh_anh[currentImageIndex]" alt="Room Image" class="room-image" />
      </div>

      <!-- Nút điều hướng ảnh -->
      <div class="image-navigation">
        <button @click="prevImage" :disabled="currentImageIndex === 0">Ảnh trước</button>
        <button @click="nextImage" :disabled="currentImageIndex === room.hinh_anh.length - 1">Ảnh sau</button>
      </div>

      <p><strong>Sức chứa:</strong> {{ room.suc_chua }} người</p>
      <p><strong>Giá theo giờ:</strong> {{ room.gia_theo_gio.toLocaleString() }} VND</p>
      <p><strong>Mô tả:</strong> {{ room.mo_ta }}</p>

      <!-- Nút đặt phòng -->
      <button @click="toggleBookingForm">
        {{ isBookingFormVisible ? "Huỷ" : "Đặt phòng" }}
      </button>

      <!-- Hiển thị form đặt phòng khi nút được nhấn -->
      <BookingForm v-if="isBookingFormVisible" @booking-success="handleBookingSuccess" />

      <!-- Đánh giá -->
      <div class="rating">
        <p><strong>Đánh giá:</strong></p>
        <div class="stars">
          <span v-for="star in 5" :key="star" @click="setRating(star)" :class="{'selected': rating >= star}">&#9733;</span>
        </div>
        <p>Số sao: {{ rating }}</p>

        <!-- Bình luận -->
        <textarea v-model="comment" placeholder="Nhập bình luận của bạn"></textarea>
        
        <button @click="submitReview">Gửi đánh giá</button>

        <!-- Hiển thị danh sách đánh giá -->
        <div v-if="reviews.length > 0">
          <div v-for="(review, index) in reviews" :key="index" class="review-item">
            <p><strong>{{ review.nguoi_dung_id.ho_ten }}</strong> - {{ review.so_sao }} sao</p>
            <p>{{ review.noi_dung }}</p>
            <p><small>{{ new Date(review.ngay_danh_gia).toLocaleString() }}</small></p>
            <button v-if="review.nguoi_dung_id._id === userId" @click="deleteDanhGia(review._id)">Xóa</button>
              <!-- Nút phản hồi -->
          <button @click="openReplyForm(review._id)">Phản hồi</button>

          <!-- Form nhập phản hồi -->
          <div v-if="replyForm.reviewId === review._id">
            <textarea v-model="replyForm.noi_dung" placeholder="Nhập phản hồi..."></textarea>
            <button @click="submitReply(review._id)">Gửi</button>
          </div>

                  <!-- Hiển thị danh sách phản hồi -->
        <div v-if="replies[review._id] && replies[review._id].length > 0" class="replies">
          <p><strong>Phản hồi:</strong></p>
          <div v-for="reply in replies[review._id]" :key="reply._id" class="reply-item">
            <p><strong>{{ reply.nguoi_dung_id.ho_ten }}</strong>: {{ reply.noi_dung }}</p>
            <p><small>{{ new Date(reply.ngay_gui).toLocaleString() }}</small></p>
            <!-- Chỉ hiển thị nút Xóa nếu người dùng là người đã gửi phản hồi này -->
            <button v-if="reply.nguoi_dung_id._id === userId" @click="deleteReply(reply._id, review._id)">
              Xóa
            </button>
          </div>
        </div>

          </div>
        </div>
        <div v-else>
          <p>Chưa có đánh giá nào.</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import BookingForm from "@/components/BookingForm.vue";

export default {
  name: "BookingView",
  components: {
    BookingForm,
  },
  data() {
    return {
      room: null,
      loading: true,
      error: null,
      isBookingFormVisible: false,
      rating: 0,
      comment: "",
      reviews: [],
      replies: {}, 
      currentImageIndex: 0, // Chỉ số ảnh hiện tại
      userId: null,
      replyForm: {
      reviewId: null,
      noi_dung: "",// Lưu phản hồi theo từng đánh giá
    } // ID người dùng hiện tại
    };
  },
  mounted() {
    this.loadUserId();
    this.fetchRoomDetails();
    this.fetchReviews();
  },
  methods: {
    // Lấy thông tin userId từ localStorage
    loadUserId() {
      const userData = JSON.parse(localStorage.getItem("user"));
      this.userId = userData?.userId || null;
    },

    openReplyForm(reviewId) {
    this.replyForm.reviewId = reviewId;
    this.replyForm.noi_dung = "";  // Reset nội dung phản hồi
  },

    async submitReply(reviewId) {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.userId; // Lấy userId từ localStorage

    if (!userId) {
      alert("Vui lòng đăng nhập để phản hồi!");
      return;
    }

    const replyData = {
      danh_gia_id: reviewId,
      noi_dung: this.replyForm.noi_dung,
      nguoi_dung_id: userId, // Dùng userId từ localStorage
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/phanhois/${reviewId}`, replyData);
      if (response.data.success) {
        alert("Phản hồi thành công!");
        this.fetchReviews(); // Cập nhật danh sách đánh giá
        this.replyForm.reviewId = null; // Ẩn form sau khi gửi
        this.replyForm.noi_dung = ""; // Xóa nội dung phản hồi
      } else {
        alert(response.data.message || "Không thể gửi phản hồi.");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi gửi phản hồi.");
    }
  },

    async fetchReplies(reviewId) {
    try {
      const response = await axios.get(`http://localhost:8080/api/phanhois/${reviewId}`);
      if (response.data.success) {
        // Kiểm tra nếu `this.replies` chưa tồn tại, khởi tạo nó
        if (!this.replies) {
          this.replies = {};
        }
        // Cập nhật phản hồi theo reviewId
        this.replies[reviewId] = response.data.data;
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải phản hồi!");
    }
  },

  async deleteReply(replyId, reviewId) {
    if (!confirm("Bạn có chắc muốn xóa phản hồi này?")) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/phanhois/${replyId}`);

      if (response.data.success) {
        // Xóa phản hồi khỏi UI
        this.replies[reviewId] = this.replies[reviewId].filter(reply => reply._id !== replyId);
        alert("Xóa phản hồi thành công!");
      } else {
        alert("Xóa phản hồi thất bại.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa phản hồi!");
    }
  },


    async fetchRoomDetails() {
      const { roomId, karaokeId } = this.$route.params;
      try {
        const response = await axios.get(`http://localhost:8080/api/karaokes/${karaokeId}/rooms/${roomId}`);
        if (response.data.success) {
          this.room = response.data.data;
        } else {
          this.error = response.data.message || "Không thể tải thông tin phòng.";
        }
      } catch (err) {
        // this.error = "Đã xảy ra lỗi khi tải thông tin phòng.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // Xóa đánh giá theo reviewId
    async deleteDanhGia(reviewId) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/danhgias/${reviewId}`);
        if (response.data.success) {
          alert("Xóa đánh giá thành công!");
          this.fetchReviews(); // Cập nhật lại danh sách sau khi xóa
        } else {
          alert("Không thể xóa đánh giá.");
        }
      } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi xóa đánh giá.");
      }
    },

    async fetchReviews() {
      const { roomId, karaokeId } = this.$route.params;
      try {
        const response = await axios.get(`http://localhost:8080/api/danhgias/${karaokeId}/rooms/${roomId}/reviews`);
        
        if (response.data.success) {
          this.reviews = response.data.data;
          
          // Gọi API lấy phản hồi cho từng đánh giá
          this.reviews.forEach(review => {
            this.fetchReplies(review._id);
          });
        } else {
          this.reviews = [];
          this.error = "Không thể tải đánh giá.";
        }
      } catch (err) {
        console.error(err);
        this.reviews = [];
      }
    },


    toggleBookingForm() {
      this.isBookingFormVisible = !this.isBookingFormVisible; // Toggle hiển thị form đặt phòng
    },

    handleBookingSuccess(bookingData) {
      console.log("Đặt phòng thành công:", bookingData);
    },

    setRating(star) {
      this.rating = star;
    },

    // Gửi đánh giá
    async submitReview() {
      if (this.rating === 0 || !this.comment) {
        alert("Vui lòng chọn số sao và nhập bình luận.");
        return;
      }
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;
      const { roomId, karaokeId } = this.$route.params;
      const reviewData = {
        karaoke_id: karaokeId,
        nguoi_dung_id: userId,
        noi_dung: this.comment,
        so_sao: this.rating,
      };

      try {
        const response = await axios.post(`http://localhost:8080/api/danhgias/${karaokeId}/rooms/${roomId}/reviews`, reviewData);
        if (response.data.success) {
          alert("Đánh giá thành công!");
          this.comment = "";
          this.rating = 0;
          this.fetchReviews(); // Cập nhật lại danh sách đánh giá sau khi gửi
        } else {
          alert("Không thể gửi đánh giá.");
        }
      } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi gửi đánh giá.");
      }
    },

    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },

    nextImage() {
      if (this.currentImageIndex < this.room.hinh_anh.length - 1) {
        this.currentImageIndex++;
      }
    },
  },
};
</script>



<style scoped>
.booking-view {
  font-family: Arial, sans-serif;
  padding: 30px;
}

.loading, .error {
  text-align: center;
  font-size: 18px;
  color: #f44336;
}

.room-detail {
  /* max-width: 1000px; Tăng chiều rộng của khu vực chi tiết phòng */
  width: 90%;
  margin: 0 auto;
  background-color: #fff;
  padding: 30px; /* Tăng padding để nội dung thoải mái hơn */
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1); /* Tăng bóng đổ */
}

.room-detail h2 {
  font-size: 28px; /* Tăng kích thước chữ tiêu đề */
  color: #333;
}

.room-detail p {
  font-size: 18px; /* Tăng kích thước chữ thông tin phòng */
  color: #555;
  margin-bottom: 15px;
}

.room-images {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Tăng khoảng cách giữa các hình ảnh */
  justify-content: center;
}

.room-image {
  width: 400px; /* Thiết lập chiều rộng cố định cho tất cả hình ảnh */
  /* height: 200px; Thiết lập chiều cao cố định cho tất cả hình ảnh */
  object-fit: cover; /* Đảm bảo hình ảnh không bị méo và phủ kín khung */
  border-radius: 8px;
}

.image-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 25px; /* Tăng kích thước nút */
  cursor: pointer;
  border-radius: 5px;
  margin: 15px 0;
}

button:hover {
  background-color: #45a049;
}

button:focus {
  outline: none;
}

button a {
  color: white;
  text-decoration: none;
}

button a:hover {
  text-decoration: underline;
}

.rating {
  margin-top: 30px; /* Tăng khoảng cách giữa đánh giá và nội dung bên trên */
}

.stars {
  display: flex;
  gap: 8px; /* Tăng khoảng cách giữa các sao */
}

.stars span {
  font-size: 28px; /* Tăng kích thước các sao */
  color: #f0f0f0;
  cursor: pointer;
}

.stars span.selected {
  color: #ffb400;
}

textarea {
  width: 100%;
  height: 120px; /* Tăng chiều cao của textarea */
  padding: 12px;
  margin-top: 15px; /* Tăng khoảng cách với phần trên */
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 18px; /* Tăng kích thước chữ trong textarea */
  resize: none;
}

.review-item {
  padding: 20px; /* Tăng padding để đánh giá thoải mái hơn */
  border: 1px solid #ddd;
  margin-top: 20px; /* Tăng khoảng cách giữa các đánh giá */
  border-radius: 8px;
  background-color: #f9f9f9;
}

.review-item p {
  margin: 8px 0;
}

.review-item small {
  color: #888;
}

.no-reviews {
  text-align: center;
  color: #888;
}

.booking-form {
  margin-top: 25px; /* Tăng khoảng cách với các phần trên */
  padding: 20px; /* Tăng padding */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

</style>
