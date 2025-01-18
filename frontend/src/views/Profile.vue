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
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="so_dien_thoai">Số Điện Thoại:</label>
          <input
            type="text"
            id="so_dien_thoai"
            v-model="user.so_dien_thoai"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="dia_chi">Địa Chỉ:</label>
          <textarea
            id="dia_chi"
            v-model="user.dia_chi"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Cập Nhật</button>
        <button @click="changeViewMode('view')" type="button" class="btn btn-secondary">Quay Lại</button>
      </form>
    </div>

    <div v-else-if="viewMode === 'history'" class="profile-details">
      <h3>Lịch Sử Hoạt Động</h3>
      <ul>
        <li v-for="(activity, index) in user.lich_su_hoat_dong" :key="index">
          <strong>{{ activity.hoat_dong }}</strong> - {{ new Date(activity.thoi_gian).toLocaleString() }}
        </li>
      </ul>
      <button @click="changeViewMode('view')" type="button" class="btn btn-secondary">Quay Lại</button>
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
        lich_su_hoat_dong: []
      },
      viewMode: 'view', // Chế độ hiện tại (view, edit, history)
    };
  },
  methods: {
    fetchUserData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.userId) {
        const userId = storedUser.userId;
        this.getUserData(userId);
      }
    },

    async getUserData(userId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Không thể lấy thông tin người dùng");
      }
    },

    async updateProfile() {
      try {
        // Cập nhật thông tin người dùng vào MongoDB
        const response = await axios.put(`http://localhost:8080/api/users/${this.user._id}`, this.user);

        // Nếu yêu cầu thành công, cập nhật lại dữ liệu người dùng
        if (response.status === 200) {
          // Cập nhật lại thông tin vào localStorage
          // localStorage.setItem("user", JSON.stringify(this.user));

          alert("Cập nhật thông tin thành công!");
          this.changeViewMode('view');
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Không thể cập nhật thông tin người dùng.");
      }
    },

    changeViewMode(mode) {
      this.viewMode = mode;
      // Khi quay lại chế độ view, tải lại dữ liệu người dùng từ localStorage hoặc backend
      if (mode === 'view') {
        this.fetchUserData();
      }
    },

    // Hàm để đăng ký thành Chủ Quán
    async registerAsOwner() {
      try {
        // Cập nhật vai trò người dùng thành 'chu_quan'
        this.user.vai_tro = 'chu_quan';

        // Gửi thông tin cập nhật tới backend
        await axios.put(`http://localhost:8080/api/users/${this.user._id}`, this.user);

        // Lưu lại thông tin người dùng đã cập nhật
        // localStorage.setItem("user", JSON.stringify(this.user));

        alert("Đăng ký thành công thành Chủ Quán!");
      } catch (error) {
        console.error("Error updating role:", error);
        alert("Không thể cập nhật vai trò.");
      }
    },

    // Điều hướng đến trang quản lý quán karaoke
    goToOwnerPage() {
      this.$router.push('/owner');
    }
  },
  mounted() {
    this.fetchUserData();
  }
};
</script>




<style scoped>
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1, h3 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-group{
  justify-content: center;
  display: flex;
  align-items: center;
}
.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 5px;
}

.btn-primary {
  background: linear-gradient(45deg, rgba(114, 153, 193, 0.8) 0%, rgba(44, 62, 80, 0.7) 100%);
  color: #fff;
}

.btn-secondary {
  background: linear-gradient(45deg, rgba(114, 153, 193, 0.8) 0%, rgba(44, 62, 80, 0.7) 100%);
  color: #fff;
}

.btn:hover {
  background: linear-gradient(45deg, #7299c1 0%, #2c3e50);
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}
</style>
