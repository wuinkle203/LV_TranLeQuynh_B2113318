import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import KaraokeListView from '../views/KaraokesListView.vue';
import BookingView from '../views/BookingView.vue';
import RoomList from '../views/RoomList.vue';
import NotFound from '../views/NotFound.vue';  // Import trang NotFound

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Trang Chủ' }  // Thêm title cho trang chủ
  },
  {
    path: '/:pathMatch(.*)*',  // Định nghĩa đường dẫn không hợp lệ
    name: 'notfound',
    component: NotFound
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
    path: '/rooms/:karaokeId', 
    name: 'RoomList', 
    component: RoomList,
    props: true, 
    meta: { title: 'Danh Sách Phòng Karaoke' }
    },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { title: 'Trang cá nhân' }  // Thêm title cho trang cá nhân người dùng
  },
  {
    path: '/karaokes',
    name: 'KaraokeListView',
    component: KaraokeListView,
    meta: { title: 'Danh Sách Phòng Karaoke' }  // Thêm title cho trang danh sách phòng
  },
  {
    path: '/bookings/:karaokeId/rooms/:roomId',
    name: 'Bookings',
    component: BookingView,
    meta: { title: 'Quản Lý Đặt Phòng' }, // Thêm title cho trang đặt phòng
    props: true, // Truyền tham số roomId vào component dưới dạng prop
  },
    {
      path: "/booking-history",
      name: "BookingHistory",
      component: () => import("@/views/BookingHistoryView.vue"),
      meta: { title: "Lịch sử Đặt Phòng" },
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
      {
        path: 'manage-bookings',
        name: 'ManageBookings',
        component: () => import("@/components/ManageBookings.vue"), // Trang quản lý khuyến mãi
        meta: { title: 'Quản Lý Đặt Phòng' }, // Title cho trang quản lý khuyến mãi
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
