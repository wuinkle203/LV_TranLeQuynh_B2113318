import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RoomListView from '../views/RoomListView.vue';
import BookingView from '../views/BookingView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Trang Chủ' }  // Thêm title cho trang chủ
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/LoginForm.vue'),
    meta: { title: 'Đăng Nhập' }  // Thêm title cho trang đăng nhập
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/RegisterForm.vue'),
    meta: { title: 'Đăng Ký Tài Khoản' }  // Thêm title cho trang đăng ký tài khoản
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: RoomListView,
    meta: { title: 'Danh Sách Phòng Karaoke' }  // Thêm title cho trang danh sách phòng
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: BookingView,
    meta: { title: 'Quản Lý Đặt Phòng' }  // Thêm title cho trang đặt phòng
  },
  // Route cho trang Owner (bảng điều khiển chủ quán)
  {
    path: "/owner",
    component: () => import("@/views/OwnerDashboard.vue"), // Trang chính của chủ quán
    meta: { title: 'Bảng Điều Khiển Chủ Quán' }, // Thêm title cho trang Owner
    children: [
      {
        path: '',
        name: 'OwnerDashboard', // Route mặc định sẽ hiển thị OwnerDashboard
        component: () => import("@/views/OwnerDashboard.vue"),
        meta: { title: 'Bảng Điều Khiển Chủ Quán' }, // Title cho dashboard chủ quán
      },
      {
        path: 'karaokes',
        name: 'OwnerKaraokes',
        component: () => import("@/components/KaraokeList.vue"), // Trang danh sách quán karaoke
        meta: { title: 'Danh Sách Quán Karaoke' }, // Title cho trang danh sách quán karaoke
      },
      // {
      //   path: '/karaokes/:karaokeId/rooms',  // Định nghĩa URL với param karaokeId
      //   name: 'ManageRooms',
      //   component: () => import('@/components/ManageRooms.vue'),
      //   props: true,  // Đảm bảo prop karaokeId được truyền vào component
      // },
      
      {
        path: 'add-karaoke',
        name: 'AddKaraoke',
        component: () => import("@/components/AddKaraoke.vue"), // Trang thêm quán mới
        meta: { title: 'Thêm Quán Karaoke' }, // Title cho trang thêm quán karaoke
      },
      {
        path: 'manage-rooms',
        name: 'ManageRooms',
        component: () => import("@/components/ManageRooms.vue"), // Trang quản lý phòng hát
        meta: { title: 'Quản Lý Phòng Karaoke' }, // Title cho trang quản lý phòng karaoke
      },
      {
        path: 'manage-promotions',
        name: 'ManagePromotions',
        component: () => import("@/components/ManagePromotions.vue"), // Trang quản lý khuyến mãi
        meta: { title: 'Quản Lý Khuyến Mãi' }, // Title cho trang quản lý khuyến mãi
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Đổi title trang dựa trên route meta
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
