<!-- <template>
    <div class="login_page">
        <div class="container">
            <div class="login">Đăng Nhập Nhân Viên </div>
            <form @submit.prevent="login" class="form">
                <div class="form-item">
                    <label for="username" class="label">Username</label><br>
                    <input v-model="formData.username" type="text" id="username" placeholder="Tên người dùng" class="input" />
                </div>
                <div class="form-item">
                    <label for="password" class="label">Password</label><br>
                    <input v-model="formData.password" type="password" id="password" placeholder="mật khẩu" class="input" />
                </div>
                <button type="submit" class="btn">Đăng nhập</button>
                <div class="register">
                    Bạn chưa có tài khoản?
                    <router-link to="/register">Đăng kí</router-link>
                </div>
            </form>
        </div>
    </div>
</template> -->

<!-- <script>
import authService from '../services/auth.service';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
    data() {
        return {
            formData: {
                username: '',
                password: '',
            },
        };
    },
    methods: {
        async login() {
            try {
                const response = await authService.login(this.formData)
                console.log(response)
                toast.success('Login successfully', {
                    autoClose: 800,
                })
                setTimeout(() => {
                    this.$router.push({name: 'admin'})
                }, 1500);
                this.$router.push({name: 'admin'})
            } catch (error) {
                console.log(error)
            }

        },
    },
};


</script> -->

<template>
    <div class="login_page">
        <div class="container">
            <!-- <h1>Đăng Nha</h1>
            <form @submit.prevent="login" class="form">
                <div class="form-item">
                    <label for="username" class="label">Username</label><br>
                    <input v-model="formData.username" type="text" id="username" placeholder="Tên người dùng" class="input" />
                </div>
                <div class="form-item">
                    <label for="password" class="label">Password</label><br>
                    <input v-model="formData.password" type="password" id="password" placeholder="Mật khẩu" class="input" />
                </div>
                <button type="submit" class="btn">Đăng nhập</button>
                <div class="register">
                    Bạn chưa có tài khoản?
                    <router-link to="/register">Đăng kí</router-link>
                </div>
            </form> -->
            <form @submit.prevent="login" class="form">
                <h1>Đăng Nhập Nhân Viên</h1>
                <div class="login_content">
                    <div class="login_box">
                        <i class="fa-solid fa-book-open-reader"></i>
                            <input v-model="formData.username" type="text" id="username" >
                            <label class="login_label">Username</label>
                    </div>
                    <div class="login_box">
                        <i class="fa-solid fa-lock"></i>
                            <input v-model="formData.password" type="password" id="username" >
                            <label class="login_label">Password</label>
                            <!-- <i class="fa-regular fa-eye" id="login-eye"></i>
                            <i class="fa-regular fa-eye-slash" id=""></i> -->
                    </div>
                </div>
                <div><button type="submit" class="btn">Đăng nhập</button></div>
            </form>
        </div>
    </div>

</template>

<script>
import authService from '../services/auth.service';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
    data() {
        return {
            formData: {
                username: '',
                password: '',
            },
        };
    },
    methods: {
        async login() {
            try {
                const response = await authService.login(this.formData)
                console.log(response)
                toast.success('Login successfully', {
                    autoClose: 800,
                })
                setTimeout(() => {
                    this.$router.push({name: 'admin'})
                }, 1500);
                this.$router.push({name: 'admin'})
            } catch (error) {
                console.log(error)
            }

        },
    },
};
</script>

<style scoped>
.login_page {
    font-family:'Courier New', Courier, monospace;
    /* position: relative; */
    /* width: 50%; */
    height: 100vh;
    background-size: cover;
    display: grid;
    align-items: center;
    justify-content: center;
    background-image: url(../PictureProject/backgroundrg.jpg);
    font-weight: bold;
}

.container {
    border: 2px solid white;
    justify-content: center;
    align-items: center;
    display: flex;
    /* background-color: aqua; */
    backdrop-filter: blur(15px);
    width: 400px;
    height: 450px;
    border-radius: 15px;
}

h1{
    text-align: center;
    font-weight: bold;
    color: white;
}

.login_box{
    position: relative;
    margin: 30px 0;
    width: 360px;
    border-bottom: 2px solid white;
}
.login_box label {
    position: absolute;
    top: 0%;
    left: 5px;
    transform: translateY(-50%);
    color: white;
    transition: 0.5s;
    pointer-events: none;
}
input:focus ~ label,
input:focus ~ :valid{
    top: -15px;
}

.login_box input {
    width: 100%;
    height: 30px;
    background: transparent;
    border: none;
    outline: none;
    padding: 0 35px 0 5px;
}

i{
    position: absolute;
    right: 8px;
    color: white;
    top: 0%;
}

.login_check {
    margin: -15px 0 15px;
    color: white;
    display: flex;
    justify-content: center;
}

.login_check a {
    text-decoration: none;
    color: white;
    margin-left: 30px;
}

.btn {
    width: 100%;
    border: 1px solid white;
    border-radius: 15px;
    font-weight: bold;
    color: white;
}
.login_register {
    justify-content: center;
    display: flex;
    margin: 10px;
    color: white;
}

.login_register a{
    margin-left: 20px;
    color: white;
}

.checkbox {
    margin-right: 5px;
}

.btn:hover {
    background-color: white;
    color: #009688;
    transition: 1s;
}
/* .login_page {
    display: grid;
    justify-content: center;
    align-items: center;
    position: relative;
    position: absolute;
    height: 100vh;
    width: 100%;
    background-image: url('../PictureProject/background-dep-4k.jpg');
}


.container {
    width: 80%;
    height: auto;
    text-align: center;
    padding: 20px;
    margin-top: 10px;
    background-color: lightblue;
    border: 1px solid darkcyan;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login {
    font-weight: bold;
    font-size: 26px;
}

.label {
    font-weight: bold;
}

.input {
    margin-left: 0px;
    border-radius: 15px;
    width: 70%;
    padding:5px 7px;
    border: none;
}

.input:hover{
    border: 1px solid blue;
}
.btn {
    margin: 5px;
    font-size: 18px;
    border-radius: 15px;
    padding:3px 25px;
    border: 1px solid darkcyan;
}
.btn:hover {
    color: lightblue;
    background-color: darkcyan;
} */

</style>
