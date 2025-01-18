import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/index'; // Đảm bảo đường dẫn đúng
// Thêm Font Awesome
import '@fortawesome/fontawesome-free/css/all.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle';

import './reset.css'



router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default Title'; // Đặt tiêu đề trang
  next();
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
  
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
      next('/login');
    } else {
      next();
    }
  });
  

const app = createApp(App);

app.use(router).mount('#app');
