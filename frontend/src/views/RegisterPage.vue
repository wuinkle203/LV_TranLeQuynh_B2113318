<template>
    <div class="register-page">
        <div class="container">
        <div>

            <h1>Đăng Ký</h1>
            <form @submit.prevent="register" class="form">
                <div class="form-item">
                        
                        <input 
                        class="input" 
                        type="text" 
                        id="firstname" 
                        :class="{ 'input-error': submitted && (!formData.firstname || usernameError), 'input-success': submitted && !usernameError }"
                        v-model="formData.firstname" />

                        <label class="label" for="firstname">Họ</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input 
                        class="input" 
                        type="text" 
                        id="lastname" 
                        :class="{ 'input-error': submitted && (!formData.username || usernameError), 'input-success': submitted && !usernameError }"
                        v-model="formData.lastname" />
                        <label class="label" for="lastname">Tên</label><br />
                    </div>
                    <!-- <div class="form-item">
                        <select class="input" id="gender" v-model="formData.gender">
                            <option value="" disabled>Choose the category</option>
                            <option value="0">Nam</option>
                            <option value="1">Nữ</option>
                            <option value="2">Khác</option>
                        </select>
                    </div> -->
                    <div class="form-item">
                       
                        <input class="input"
                            :class="{ 'input-error': submitted && (!formData.username || usernameError), 'input-success': submitted && !usernameError }"
                            type="text" id="username" v-model="formData.username"
                            @input="validateUsername" />
                        <label class="label" for="username">Username</label><br />
                        <span class="error-message" v-if="submitted && !formData.username">Username is required</span>
                        <span class="error-message" v-if="submitted && usernameError">{{ usernameError }}</span>
                    </div>

                    <div class="form-item">
                       
                        <input class="input"
                            :class="{ 'input-error': submitted && (!formData.email || emailError), 'input-success': submitted && !emailError }"
                            type="text" id="email" v-model="formData.email" @input="validateEmail" />
                        <label class="label" for="email">Email</label><br />
                        <span class="error-message" v-if="submitted && emailError">{{ emailError }}</span>
                        <span class="error-message" v-if="submitted && !formData.email">Email is required</span>
                    </div>

                    <div class="form-item">
                        
                        <input class="input"
                            :class="{ 'input-error': submitted && passwordError, 'input-success': submitted && !passwordError }"
                            :type="passwordFieldType" id="password" v-model="formData.password"
                            @input="validatePassword" />
                        <label class="label" for="password">Mật Khẩu</label><br />
                        <!-- <i v-if="formData.password" class="icon-eye"
                            :class="[showPassword ? 'fa fa-eye-slash' : 'fa fa-eye']" @click="togglePasswordVisibility"></i> -->
                        <span class="error-message" v-if="submitted && passwordError">{{ passwordError }}</span>
                    </div>

                    <div class="form-item">
                       
                        <input class="input"
                            :class="{ 'input-error': submitted && confirmPasswordError, 'input-success': submitted && !confirmPasswordError }"
                            :type="passwordFieldType" id="password2"
                            v-model="formData.password2" @input="validateConfirmPassword" />
                        <label class="label" for="password2">Nhập lại mật khẩu</label><br />
                        <span class="error-message" v-if="submitted && confirmPasswordError">{{ confirmPasswordError}}</span>
                    </div>

                    <div class="form-item">
                        
                        <input class="input" type="text" id="address" v-model="formData.address" />
                        <label class="label" for="address">Địa chỉ</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input" type="text" id="phone" v-model="formData.phone" />
                        <label class="label" for="phone">Số Điện thoại</label><br />
                    </div>
                    <button type="submit" class="btn" >Đăng kí</button>    
                    <div class="login">
                        Bạn đã có tài khoản?
                        <router-link to="/login">Đăng nhập</router-link>
                    </div>

                            
                </form>
        </div>
    </div>
    </div>
</template>
<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import UserService from "../services/users.service";
export default {
    data() {
        return {
            formData: {
                firstname: "",
                lastname: "",
                username: "",
                email: "",
                password: "",
                password2: "",
                address: "",
                phone: "",

            },
            usernameError: "",
            emailError: "",
            passwordError: "",
            confirmPasswordError: "",
            showPassword: false,
            submitted: false,
        }
    },
    computed: {
        passwordFieldType() {
            return this.showPassword ? 'text' : 'password';
        },
    },
    methods: {
        async register() {
        try {
                const response = await UserService.createUser(this.formData);
                console.log(response);
                toast.success('Đăng kí thành công!', {
                    autoClose: 1500,
                })
                setTimeout(() => {
                    this.$router.push({ name: "login" });
                }, 800);
            } catch (error) {
                console.error("Đăng kí không thành công!", error);
            }
        },

        validateUsername() {
            if (this.formData.username.length < 3) {
                this.usernameError = "Tên người dùng phải nhiều hơn 3 ký tự!";
            } else {
                this.usernameError = "";
            }
        },
        validateEmail() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(this.formData.email)) {
                this.emailError = "Email sai định dạng!";
            } else {
                this.emailError = "";
            }
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
    },
}
</script>
<style>
.register-page {
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
    height: 600px;
    border-radius: 15px;
}

h1{
    text-align: center;
    font-weight: bold;
    color: white;
}


.form-item{
    position: relative;
    margin: 20px 0;
    width: 310px;
    border-bottom: 2px solid white;
}

.form-item label {
    position: absolute;
    top: 0px;
    left: 5px;
    transform: translateY(-50%);
    color: white;
    transition: 0.5s;
    pointer-events: none;
}

input:focus ~ label,
input:focus ~ :valid{
    top: -10px;
}

.form-item input {
    width: 100%;
    height: 30px;
    background: transparent;
    border: none;
    outline: none;
    padding: 0 35px 0 5px;
}

.btn {
    width: 100%;
    border: 1px solid white;
    border-radius: 15px;
    font-weight: bold;
    color: white;
}

.btn:hover {
    background-color: white;
    color: #009688;
    transition: 1s;
}

.login {
    margin: 10px 0 15px;
    color: white;
    display: flex;
    justify-content: center;
}

.login a {
    /* text-decoration: none; */
    color: white;
    margin-left: 30px;
}
</style>

<!-- 
<style scoped>
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
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

.register {
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
    padding: 5px 7px;
    border: none;
}

.input:hover{
    border: 1px solid blue;
}
.login {
    margin: 5px;
}
.btn {
    font-size: 18px;
    border-radius: 15px;
    padding:3px 25px;
    border: 1px solid darkcyan;
}
.btn:hover {
    color: lightblue;
    background-color: darkcyan;
}

.error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    display: block;
}

.icon-eye {
    position: relative;
    cursor: pointer;
    display: inline-block;
    font-size: 18px;
    margin-left: -22px;
}

</style> -->
