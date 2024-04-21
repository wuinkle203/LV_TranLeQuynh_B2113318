<!-- <template>
    <h1 class="danhsach">Danh Sách Người Dùng</h1>
    <div class="user-list-admin">
        <div class="container">
            <div v-for="user in users" :key="user._id">
                <div v-if="user.role === 'client'" class="user-item" @click="selectUser(user._id)">
                    <div class="item" >
                        <i class="fa-solid fa-user"></i>
                        {{ user.firstname }} {{ user.lastname }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="selectedUserId" class="user-details-popup">
            <div class="popup-content">
                <div>
                    <div class="info">Thông tin chi tiết</div>
                    <p>Tên: {{ getUserDetails(selectedUserId).firstname }} {{ getUserDetails(selectedUserId).lastname }} </p>
                    <p>Email: {{ getUserDetails(selectedUserId).email }}</p>
                    <p>Số Điện Thoại: {{ getUserDetails(selectedUserId).phone }}</p>
                    <p>Địa chỉ: {{ getUserDetails(selectedUserId).address }}</p>
                    <i class="fa-solid fa-trash" @click="deleteUser(selectedUserId, `${getUserDetails(selectedUserId).firstname} ${getUserDetails(selectedUserId).lastname}`)" ></i>
                </div>
                    Add more details as needed
                <button class="btn-popup" @click="closePopup"><i class="fa-solid fa-close"></i></button>
            </div>
        </div>
    </div>
</template> -->
<template>
    <h1 class="danhsach">Danh Sách Người Dùng</h1>
    <div class="user-list-admin">
        <div class="container">
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    Tài Khoản
                                </th>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Địa Chỉ
                                </th>
                                <th>
                                    Số Điện Thoại
                                </th>
                                <th>
                                    Xoá Tài Khoản
                                </th>
                            </tr>
                        </thead>
                        <tbody v-for="(user, index) in users" :key="index">
                            <tr v-if="user.role ==='client'">
                                <th>
                                    {{ user.username }}
                                </th>
                                <th>
                                    {{ user.email }}
                                </th>
                                <th>
                                    {{ user.address }}
                                </th>
                                <th>
                                    {{ user.phone }}
                                </th>
                                <th>
                                    <i class="fa-solid fa-trash" @click="deleteUser(selectedUserId, `${getUserDetails(selectedUserId).firstname} ${getUserDetails(selectedUserId).lastname}`)" ></i>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
        <!-- <div v-if="selectedUserId" class="user-details-popup">
            <div class="popup-content">
                <div>
                    <div class="info">Thông tin chi tiết</div>
                    <p>Tên: {{ getUserDetails(selectedUserId).firstname }} {{ getUserDetails(selectedUserId).lastname }} </p>
                    <p>Email: {{ getUserDetails(selectedUserId).email }}</p>
                    <p>Số Điện Thoại: {{ getUserDetails(selectedUserId).phone }}</p>
                    <p>Địa chỉ: {{ getUserDetails(selectedUserId).address }}</p>
                    <i class="fa-solid fa-trash" @click="deleteUser(selectedUserId, `${getUserDetails(selectedUserId).firstname} ${getUserDetails(selectedUserId).lastname}`)" ></i>
                </div>
                    Add more details as needed
                <button class="btn-popup" @click="closePopup"><i class="fa-solid fa-close"></i></button>
            </div>
        </div> -->
    </div>
</template>

<script>
import UserService from '../services/users.service';
export default {
    props: {
        users: Array,
    },

    data() {
        return {
            selectedUserId: null,
        };
    },
    methods: {
        selectUser(userId) {
            this.selectedUserId = userId;
        },
        closePopup() {
            this.selectedUserId = null;
        },
        getUserDetails(userId) {
            return this.users.find(user => user._id === userId) || {};
        },

        async deleteUser(userId, userTitle) {
            if (confirm(`Bạn có muốn xoá người dùng ${userTitle}?`)) {
                try {
                    const response = await UserService.deleteUser(userId)
                    this.users = this.users.filter((user) => user._id !== userId);
                    // this.updateUserCart(productId);
                } catch (error) {
                    console.log(error)
                }
                this.$router.go() 
            }
        },
    },
}
</script>
<style>
i{
    cursor: pointer;
}
h1{
    font-weight: bold;
    color: #009688;
    font-family: 'Courier New', Courier, monospace;
}

tr th{
    color: #009688;
}
</style>
<!-- 
<style>
.user-list-admin {
    display: grid;
    color: steelblue;
    margin-bottom: 10px;
}

.user-item {
    border: 2px solid steelblue;
    margin: 10px;
    padding: 5px 10px;
    border-radius: 5px;
}

.danhsach {
    /* font-size: 20px; */
    color: steelblue;
    font-weight: bold;
    padding: 5px;
    justify-content: center;
    align-items: center;
    display: flex;
    margin: 10px;
    border-bottom: 1px solid steelblue;
}

.container {
    margin: 0px;
    width: auto;
    /* display: flex; */
}


.item {
    /* border-bottom: 1px solid; */
    /* margin-bottom: 12px; */
}

.info {
    font-weight: bold;
    text-transform: uppercase;
}

.popup-content {
    display: flex;
}

p {
    margin-bottom: 5px;
}
.user-details-popup {
    display: flex;
    margin-bottom: 10px;
}

.btn-popup {
    border-radius: 5px;
    background-color: steelblue;
    margin-left: 10px;
}

.fa-trash {
    /* border: 1px solid steelblue; */
    color: black;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    background-color: steelblue;
}
</style> -->