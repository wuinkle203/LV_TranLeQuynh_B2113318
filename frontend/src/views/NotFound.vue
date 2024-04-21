
import HomePage from './HomePage.vue';
<template>
    <div class="container">
        <div class="notfound">
            Opps, Trang Bạn Đang Tìm Không Tồn Tại!!!
        </div>
        <div class="backs">
            <router-link to="/" class="back">Quay Lại Trang Chủ</router-link>
        </div>
    </div>
</template>

<style>
.container {
    font-weight: bold;
    color: steelblue;
    text-decoration: none;
    /* font-size: 50px; */
}
.notfound {
    justify-content: center;
    align-items: center;
    display: flex;
    font-size: 60px;
}

.back {
    justify-content: center;
    align-items: center;
    text-decoration: none;
    background-color: aliceblue;
    width: 100%;
    display: flex;
    border-radius: 10px;
    margin: 5px;
    padding: 10px 15px;
    color: steelblue;
    font-size: 30px;
}
</style>