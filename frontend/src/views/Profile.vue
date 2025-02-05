<template>
  <div class="profile-container">
    <h1>Thông Tin Người Dùng</h1>
    <div v-if="viewMode === 'view'" class="profile-details">
      <p><strong>Họ và Tên:</strong> {{ user.ho_ten }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Số Điện Thoại:</strong> {{ user.so_dien_thoai }}</p>
      <p><strong>Địa Chỉ:</strong> {{ user.dia_chi }}</p>
      <p><strong>Vai Trò:</strong> {{ user.vai_tro === 'chu_quan' ? 'Chủ Quán' : 'Khách Hàng' }}</p>

      <!-- Nút Cập Nhật Thông Tin và Đăng Ký Chủ Quán -->
      <div class="btn-group">
        <button @click="changeViewMode('edit')" class="btn btn-primary">Cập Nhật Thông Tin</button>
        <button @click="registerAsOwner" v-if="user.vai_tro === 'khach_hang'" class="btn btn-secondary">Đăng Ký Chủ Quán</button>
        <button v-if="user.vai_tro === 'chu_quan'" @click="goToOwnerPage" class="btn btn-secondary">Quản Lý Quán Karaoke</button>
        <button @click="changeViewMode('changePassword')" class="btn btn-warning">Đổi Mật Khẩu</button>
      </div>
    </div>

    <div v-else-if="viewMode === 'edit'" class="profile-details">
  <form @submit.prevent="updateProfile">
    <div class="form-group">
      <label for="ho_ten">Họ và Tên:</label>
      <input
        type="text"
        id="ho_ten"
        v-model="user.ho_ten"
        class="form-control"
        required
        minlength="6"
        maxlength="100"
        placeholder="Nhập họ và tên"
      />
      <p v-if="user.ho_ten && user.ho_ten.length < 6" class="error-text">
        Họ và tên phải có ít nhất 6 ký tự.
      </p>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="user.email"
        class="form-control"
        required
        placeholder="Nhập email"
        :pattern="emailPattern"
      />
      <p v-if="user.email && !isValidEmail(user.email)" class="error-text">
        Email không đúng định dạng.
      </p>
    </div>

    <div class="form-group">
      <label for="so_dien_thoai">Số Điện Thoại:</label>
      <input
        type="text"
        id="so_dien_thoai"
        v-model="user.so_dien_thoai"
        class="form-control"
        required
        placeholder="Nhập số điện thoại"
        pattern="^(0[3|5|7|8|9])+([0-9]{8})$"
      />
      <p v-if="user.so_dien_thoai && !isValidPhoneNumber(user.so_dien_thoai)" class="error-text">
        Số điện thoại không hợp lệ.
      </p>
    </div>

    <div class="form-group">
      <label for="dia_chi">Địa Chỉ:</label>
      <textarea
        id="dia_chi"
        v-model="user.dia_chi"
        class="form-control"
        rows="3"
        required
        placeholder="Nhập địa chỉ"
        minlength="10"
      ></textarea>
      <p v-if="user.dia_chi && user.dia_chi.length < 10" class="error-text">
        Địa chỉ phải có ít nhất 10 ký tự.
      </p>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="isUpdating">Cập Nhật</button>
    <button @click="changeViewMode('view')" type="button" class="btn btn-secondary">Quay Lại</button>
  </form>
</div>


    <div v-else-if="viewMode === 'changePassword'" class="profile-details">
      <h3>Đổi Mật Khẩu</h3>
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="currentPassword">Mật khẩu hiện tại:</label>
          <input
            type="password"
            id="currentPassword"
            v-model="password.currentPassword"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
        <label for="newPassword">Mật khẩu mới:</label>
        <input
          type="password"
          id="newPassword"
          v-model="password.newPassword"
          class="form-control"
          required
        />
        <p v-if="password.newPassword && !isValidPassword" class="error-text">
          Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt.
        </p>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Xác nhận mật khẩu mới:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="password.confirmPassword"
          class="form-control"
          required
        />
        <p v-if="password.confirmPassword && password.newPassword !== password.confirmPassword" class="error-text">
          Mật khẩu xác nhận không khớp!
        </p>
      </div>


        <button type="submit" class="btn btn-primary">Đổi Mật Khẩu</button>
        <button @click="changeViewMode('view')" type="button" class="btn btn-secondary">Quay Lại</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Profile",
  data() {
    return {
      user: {
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        dia_chi: '',
        vai_tro: '',
      },
      viewMode: 'view', // Chế độ hiện tại (view, edit, history)
      password: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      isLoggedIn: true,
    };
  },

  computed: {
  isValidPassword() {
    const password = this.password.newPassword;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  emailPattern() {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    }
},


  methods: {


    isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  },

  isValidPhoneNumber(phone) {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  },

    fetchUserData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.userId) {
        const userId = storedUser.userId;
        this.getUserData(userId);
      }
    },

    async changePassword() {
      if (!this.isValidPassword) {
      alert('Mật khẩu không đạt yêu cầu!');
      return;
    }
      if (this.password.newPassword !== this.password.confirmPassword) {
        alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
        return;
      }

      try {
        const response = await axios.patch(`http://localhost:8080/api/users/${this.user._id}/changePassword`, {
          currentPassword: this.password.currentPassword,
          newPassword: this.password.newPassword,
          confirmPassword: this.password.confirmPassword
        });

        if (response.status === 200) {
          alert('Đổi mật khẩu thành công!');
          this.changeViewMode('view');
          this.logout();
        }
      } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        alert('Không thể đổi mật khẩu.');
      }
    },

    logout() {
      localStorage.removeItem('user'); // Xóa thông tin người dùng trong localStorage
      this.isLoggedIn = false;
      this.ho_ten = '';
      this.$router.push('/login'); // Quay về trang chủ
    },

    async getUserData(userId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        this.user = response.data;
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        alert("Không thể lấy thông tin người dùng");
      }
    },

    async updateProfile() {
      try {
        const response = await axios.put(`http://localhost:8080/api/users/${this.user._id}`, this.user);

        if (response.status === 200) {
          alert("Cập nhật thông tin thành công!");
          this.changeViewMode('view');
        }
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
        alert("Không thể cập nhật thông tin.");
      }
    },

    async registerAsOwner() {
      try {
        this.user.vai_tro = 'chu_quan';

        const response = await axios.put(`http://localhost:8080/api/users/${this.user._id}`, this.user);

        if (response.status === 200) {
          alert("Đăng ký thành công thành Chủ Quán!");
        }
      } catch (error) {
        console.error("Lỗi cập nhật vai trò:", error);
        alert("Không thể cập nhật vai trò.");
      }
    },

    goToOwnerPage() {
      this.$router.push('/owner');
    },

    changeViewMode(mode) {
      this.viewMode = mode;
      if (mode === 'view') {
        this.fetchUserData();
      }
    }
  },
  mounted() {
    this.fetchUserData();
  }
};
</script>






<style scoped>
/* Tổng quan */
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
}

/* Tiêu đề */
.profile-container h1 {
  font-size: 2rem;
  text-align: center;
  color: #4a90e2;
  margin-bottom: 20px;
}

/* Chi tiết thông tin */
.profile-details p {
  font-size: 1rem;
  margin: 10px 0;
  line-height: 1.6;
}

.profile-details strong {
  color: #4a90e2;
}

/* Nhóm nút */
.btn-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4a90e2;
  color: #fff;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-secondary {
  background-color: #ddd;
  color: #333;
}

.btn-secondary:hover {
  background-color: #ccc;
}

/* Form chỉnh sửa */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

/* Lịch sử hoạt động */
.profile-details ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.profile-details li {
  margin-bottom: 10px;
  padding: 10px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.profile-details li strong {
  color: #333;
  font-weight: 600;
}

/* Nút quay lại */
.profile-details button[type="button"] {
  margin-top: 20px;
  width: 100%;
}

/* Hiệu ứng */
.profile-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
