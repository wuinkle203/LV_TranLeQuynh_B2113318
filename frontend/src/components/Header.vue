<template>
    <div class="page" :class="{ 'transparent-header': isHomePage, 'normal-header': !isHomePage }">
        <div class="logo">TVS</div>
        <nav class="nav">
            <!-- <user-popover
            v-if="isUserPopoverVisible"
            :show-popover = "isUserPopoverVisible"
            :current-user = "currentUser"
            @logout = "logout"
            @mouseleave = "closePopover"
            /> -->
            <!-- <div class="other">
                <template v-if="!isLoggedIn">
                    <router-link to="/login" class="login">Đăng nhập</router-link>
                </template>
                <template v-else>
                    <div class="profile" @click="togglePopover">
                        <i class="fa-solid fa-circle-user"></i>
                    </div>
                </template>
                <router-link to="/favorite" class="favorite">
                    Yêu Thích
                </router-link>
                <router-link to="/borrow" class="borrow">
                    <i class="fa-solid fa-book-open-reader"></i>
                    <span v-if="updateBookCount">[{{ countBook }}]</span>
                </router-link>
            </div> -->

            <div class="navbar">
            <ul>
                <li class="book">
                    <router-link to="/books">Xem Sách</router-link>
                </li>
                <li>
                    <router-link to="/borrow">Mượn Sách</router-link>
                </li>
                <li>
                    <router-link to="/favorite">Yêu Thích</router-link>
                </li>
                <li>
                    <template v-if="!isLoggedIn">
                    <router-link to="/login" class="login">Đăng nhập</router-link>
                </template>
                <template v-else>
                    <div class="profile" @click="togglePopover">
                        <i class="fa-solid fa-circle-user"></i>
                    </div>
                </template>
                <user-popover
            v-if="isUserPopoverVisible"
            :show-popover = "isUserPopoverVisible"
            :current-user = "currentUser"
            @logout = "logout"
            @mouseleave = "closePopover"
            />
                </li>
            </ul>
        </div>
        </nav>
    </div>
</template>

<script>
import UserPopover from '../components/PopupUser.vue';

export default {
    components: {
        UserPopover
    },

    props: {
        isHomePage: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            isUserPopoverVisible: false,
            countBook: 0,
        }
    },

    created() {
        this.updateBookCount();
    },

    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('user');
        },

        currentUser() {
            return JSON.parse(localStorage.getItem('user'));
        }
    },

    methods: {
        togglePopover() {
            this.isUserPopoverVisible = !this.isUserPopoverVisible;
        },
        logout() {
            //Xoá dữ liệu tạm thời khi đăng xuất
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.isUserPopoverVisible = false;
            //Quay lại trang khi đăng xuất
            this.$router.push({name: 'login'});
        },

        updateBookCount() {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                this.countBook = userData.borrow.length;
            } else {
                this.countBook = 0;
            }
        },

        closePopover() {
            this.isUserPopoverVisible = !this.isUserPopoverVisible;
        },

    }
};
</script>

<style scoped>
.page {
    background-image: url('../PictureProject/building-table-wood-books-library-interior-design-693868-wallhere.com (1).jpg');
    height: 100px;
    opacity: 0.6;
}   
.page{
    display: flex;
    justify-content: space-between;
    /* background-color: steelblue; */
}
.logo {
    font-weight: bold;
    color: white;
    font-size: 80px;
    margin-left: 20px;
    font-family:'Courier New', Courier, monospace;
}

/* .navbar{
    top: 10px;
} */

.profile{
    cursor: pointer;
    /* color: #009688;
     */
     color: white;
}

/* .favorite{
    margin: 5px;
    padding: 5px;
    cursor: pointer;
}

.borrow {
    margin: 5px;
    padding: 5px;
    cursor: pointer;
} */

.navbar ul {
    padding: 10px;
    margin: 10px;
}

.navbar ul li{
        list-style: none;
        display: inline-block;
        margin: 0 20px;
        position: relative;
    }

    .navbar ul li a{
        text-decoration: none;
        color: #009688;
        color: white;
        text-transform: uppercase;
        font-weight: bold;
    }

    
    .navbar ul li::after{
        content: '';
        height: 3px;
        width: 0;
        background: #009688;
        position: absolute;
        left: 0;
        bottom: -10px;
        transition: 0.5s;
    }

    .navbar ul li:hover::after{
        width: 100%;
    }
/* .normal-header { */
    /* display: flex;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 70px;
    background-color: var(--black); */
    /* position: fixed; */
/* } */

/* .logo {
    background-color: aliceblue;
    display: flex;
    justify-content: center;
    align-content: center;
    font-size: 50px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif ;
    color: steelblue;
}

.nav {
    border-top: 3px steelblue solid;
    border-bottom: 3px steelblue solid;
    justify-content: space-between;
}
.nav-bar {
    font-weight:500;
    padding: 6px;
}

.other {
    padding: 6px;
    font-weight:500;
    display: flex;
}

.login {
    color: steelblue;
    text-decoration: none;
}

.profile {
    color: steelblue;
    margin-right: 10px;
}

.home {
    text-decoration: none;
    color: steelblue;
    margin: 10px;
}

.borrow {
    text-decoration: none;
    color: steelblue;
    margin-right: 4px;
    margin-left: 10px;
}
.favorite {
    text-decoration: none;
    color: steelblue;
    margin-right: 10px;
    margin-left: 10px;
}
.trangchu {
    text-decoration: none;
    color: steelblue;
    margin-right: 10px;
    margin-left: 10px;
}
.book {
    color: steelblue;
    text-decoration: none;
} */

</style>