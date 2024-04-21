// import './assets/main.css'
import router from './routes/route'
import { createApp } from 'vue'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle';

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Default Title'; 
    next();
})  

createApp(App).use(router).mount('#app')
