<template>
    <div class="admin-page">
        <welcome-admin v-if="showWelcome"></welcome-admin>
        <div class="vertical-menu">
            <router-link to="/manager/user-management" class="menu-item">
                <i class="fa-solid fa-user"></i>
                Người Dùng
            </router-link>
            <router-link to="/manager/book-management" class="menu-item">
                <i class="fa-solid fa-box"></i>
                Sách
            </router-link>
            <router-link to="/manager/borrow-censor" class="menu-item">
                <i class="fa-solid fa-dolly"></i>
                Mượn Sách
            </router-link>
            <router-link to="/" class="menu-item">
                <i class="fa-solid fa-house"></i>
                Về Trang Chính
            </router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import WelcomeAdmin from '../components/WelcomeAdmin.vue';
export default {
    components: {
        WelcomeAdmin
    },

    computed: {
        showWelcome() {
            const excludedRoutes = ['book-management',
                                'user-management', 'borrow-censor', 'add-book', 'book-form'];
            return !excludedRoutes.includes(this.$route.name);
        },
    }
}
</script>

<style>
.admin-page{
    display: flex;
    /* height:; */
}
.vertical-menu{

    /* justify-content: center; */
    /* align-items: center; */
    /* text-align: center; */
    width: 12%;
    border-right: 2px solid #009688;
    font-weight: bold;
    height: 81vh;
    padding-top: 20px;
}

.menu-item:hover{
    /* border-bottom: 2px solid #009688;
    border-top: 2px solid #009688; */
    text-decoration:underline 2px;
}

.menu-item {
    color: #009688;
    text-decoration: none;
    /* margin: 10px; */
    height: 19vh;
    width: 100%;
    /* border-right: 2px solid #009688 ; */
    /* justify-content: center; */
    display: flex;
    align-items: center;
}

i{
    margin-left: 10px;
    margin-right: 10px;
}
/* .vertical-menu{
    display: flex;
    justify-content: center;
    padding: 5px;
}
.menu-item {
    color: steelblue;
    text-decoration: none;
    margin-right: 20px;
    border: 1px solid steelblue;
    border-radius: 15px;
    padding: 10px;
}
.menu-item:hover {
    background-color: steelblue;
    color: white;
} */
</style>