<template>
    <div class="profile1">
        <div class="container">
            <div class="user-container">
                <!-- <div class="avatar">
                    <img class="img" src="../../public/image/avatar.jpg" alt="">
                </div> -->
                <div class="info">
                    <h1>Trang Cá Nhân</h1>
                    <div class="name">Tên: {{ user.firstname }} {{ user.lastname }}</div>
                    <div class="email">Email: {{ user.email }}</div>
                    <div class="phone">Số Điện Thoại: {{ user.phone }}</div>
                    <div class="address">Địa Chỉ: {{ user.address }}</div>
                    <button class="btn-edit" @click="openEditForm">Chỉnh Sửa</button>
                    <button class="btn-delete" @click="deleteUser">Xoá Tài Khoản</button>
                </div>
            </div>
        </div>
        <div v-if="showEditForm" class="edit-form-overlay">
            <div class="edit-form">
                <h1>Chỉnh sửa trang cá nhân</h1>
                <form class="form" @submit.prevent="saveChanges">
                    <div class="form-item">
                       
                        <input type="text" id="firstname" placeholder="Họ" v-model="formData.firstname">
                        <label>Tên</label>
                    </div>
                    <div class="form-item">
                        
                        <input type="text" id="lastname" placeholder="Tên" v-model="formData.lastname">
                        <label>Họ</label>
                    </div>
                    <div class="form-item">
                        
                        <input type="text" id="eamil" placeholder="Email" v-model="formData.email">
                        <label>Email</label>
                    </div>
                    <div class="form-item">
                        
                        <input type="text" id="phone" placeholder="Số Điện Thoại" v-model="formData.phone">
                        <label>Số Điện Thoại</label>
                    </div>
                    <div class="form-item">
                        
                        <input type="text" id="address" placeholder="Địa chỉ" v-model="formData.address">
                        <label>Địa Chỉ</label>
                    </div>
                    <div class="button">
                        <button class="btn-save" type="submit">Lưu Thay Đổi</button>
                        <button class="btn-cancel" @click="closeEditForm">Quay Lại</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import UserService from '../services/users.service';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    data() {
        return {
            user: '',
            showEditForm: false,
            formData: {
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                address: ''
            }
        }
    },

    created() {
        this.retrieveUser();
    },

    methods: {
        async retrieveUser() {
            try {
                const user = localStorage.getItem("user");
                if (user) {
                    const userData = JSON.parse(user);
                    this.user = await UserService.getUserById(userData._id)
                    this.formData.firstname = this.user.firstname
                    this.formData.lastname = this.user.lastname
                    this.formData.email = this.user.email
                    this.formData.phone = this.user.phone
                    this.formData.address = this.user.address
                }
            } catch (error) {
                console.error("Error updating quantity on the server:", error);
            }
        },

        openEditForm() {
            this.showEditForm = true;
        },

        closeEditForm() {
            this.showEditForm = false;
        },

        async saveChanges() {
            try {
                const response = await UserService.updateUser(this.user._id, this.formData)
                console.log(response)
                toast.success('Update user profile successfully', {
                    autoClose: 800,
                })
                setTimeout(() => {
                    this.$router.go()
                }, 1200);
            } catch (error) {
                console.error(error)
            }
            this.closeEditForm();
        },

        async deleteUser() {
            try {
                const response = await UserService.deleteUser(this.user._id)
                console.log(response)
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            } catch (error) {
                console.error(error)
            }
        },
    }
}
</script>

<style>

.form-item{
    position: relative;
    margin: 20px 0;
    width: 310px;
    border-bottom: 2px solid #009688;
}

.form-item label {
    position: absolute;
    top: 0px;
    left: 5px;
    transform: translateY(-50%);
    color: #009688;
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

.profile1{
    display: flex;
    /* justify-content: start; */
    justify-content: end;
}
h1{
    color: #009688;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    text-decoration: underline;
}

.info {
    display: grid;
    align-items: center;
    justify-content: left;
}

.info div,button{
    margin: 20px;
    text-align: center;
    font-weight: bold;
    /* text-transform: uppercase; */
    color: #009688;
}

.btn-edit,.btn-delete {
    border: #009688 2px solid;
    border-radius: 10px;
    padding: 5px 15px;
    background-color: white;
}

.btn-save, .btn-cancel{
    border: #009688 2px solid;
    border-radius: 10px;
    width: 70%;
    padding: 5px 15px;
    background-color: white;
}
/* .profile1 {
    color: steelblue;
    display: flex;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    margin: 10px;
    background-color: aliceblue;
    border-radius: 10px;
    width: 25%;

}

.info div{
    border-bottom:  1px solid;
    width: 90%;
    margin: 10px;
}

.info button {
    color: steelblue;
    border: none;
    margin: 5px;
    padding: 5px 10px;
    border-radius: 5px;
}

label {
    width: 30%;
    font-weight: bold;
    margin: 10px;
}

form input {
    border-radius: 5px;
    border: 1px solid steelblue;
    padding: 5px 10px;
}

form button {
    width: 45%;
    color: steelblue;
    border: 1px solid steelblue;
    border-radius: 5px;
    margin: 5px;
}

button:hover {
    color: aliceblue;
    background-color: steelblue;
} */

</style>