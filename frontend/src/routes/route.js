import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: "home",
        component: () => import('@/views/HomePage.vue'),
        meta: { title: "Home"},
    },
    {
        path: '/books',
        name: "book",
        component: () => import('../views/BooksPage.vue'),
        meta: {title: "Books"}
    },
    {
        path: "/books/:id",
        name: "book-detail",
        component: () => import ('../views/BookDetail.vue'),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import('../views/NotFound.vue'),
        meta: {title: 'Error'}
    },

    {
        path: "/manager",
        name: "admin",
        component: () => import('@/views/Admin.vue'),
        meta: { title: 'Admin' },
        beforeEnter: (to, from, next) => {
            // Check if the user is logged in
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert("Bạn cần phải đăng nhập để sử dụng chức năng này!")
                next({name: 'login-admin'});
            } else {
                // Check if the user is an admin
                const role = user.role;
                if (role === 'admin') {
                    // Allow access for admin users
                    next()
                } else {
                    alert("Chỉ có admin mới được sử dụng chức năng này!")
                    // localStorage.removeItem('token');
                    // localStorage.removeItem('user');
                    next('/')
                }
            }
        },
        children: [

            {
                path: "book-management",
                name: "book-management",
                component: () => import("@/components/BookManagement.vue"),
            },

            {
                path: "add-book",
                name: "add-book",
                component: () => import("@/components/BookAdd.vue"),
            },

            {
                path: "book-form/:id",
                name: "book-form",
                component: () => import("../components/BookForm.vue"),
            },

            {
                path: "user-management",
                name: "user-management",
                component: () => import("@/components/UserManagement.vue")
            },

            {
                path: "borrow-censor",
                name: "borrow-censor",
                component: () => import("@/components/BorrowCensorPage.vue")
            },
        ]
    },

    {
        path: "/login",
        name: "login",
        component: () => import('../views/LoginPage.vue'),
        meta: { title: 'Login' },
    },

    {
        path: "/login-admin",
        name: "login-admin",
        component: () => import('../views/LoginAdminPage.vue'),
        meta: { title: 'Login Admin' },
    },

    {
        path: "/register",
        name: "register",
        component: () => import('../views/RegisterPage.vue'),
        meta: { title: 'Register' }
    },

    {
        path: "/profile",
        name: "profile",
        component: () => import('../views/Profile.vue'),
        meta: { title: 'Register' }
    },

    {
        path: "/borrow",
        name: "borrow",
        component: () => import('../views/BorrowPage.vue'),
        meta: { title: 'Borrow' },
        beforeEnter: (to, from, next) => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert("Bạn cần đăng nhập để sử dụng chức năng này!")
                next('/login');
            } else {
                next()
            }
        },
    },

    {
        path: "/favorite",
        name: "favorite",
        component: () => import('../views/FavoritePage.vue'),
        meta: { title: 'Favorite' },
        beforeEnter: (to, from, next) => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert("Bạn cần đăng nhập để sử dụng chức năng này!")
                next('/login');
            } else {
                next()
            }
        },
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;