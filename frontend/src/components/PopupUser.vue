<template>
    <div class="user-popover" v-show="showPopover" @click.stop>
        <div class="popover-content">
            <router-link to="/profile" class="profile">TRANG CÁ NHÂN</router-link>
            <div @click="logout" class="logout"><i class="fa-solid fa-right-from-bracket"></i> ĐĂNG XUẤT</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        showPopover: Boolean,
        currentUser: Object,
    },

    watch: {
        showPopover(newValue) {
            if (newValue) {
                //Thêm sự kiện click khi hiện user
                document.addEventListener('click', this.closePopover);
            } else {
                //Xoá sự kiện click khi ẩn 
                document.removeEventListener('click', this.closePopover);
            }
        },
    },

    methods: {
        logout() {
            this.$emit('logout');
        },
    },
};
</script>

<style scoped>
/* Add your styling for the popover */
.user-popover {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    /* Position it below the user icon */
    right: 0px;
    width: 200px;
    /* top: 113px; */
    background-color: #fff;
    border: 1px solid #096488;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    cursor: default;
    opacity: 0.8;
}

.popover-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: start;
}

.popover-content > :nth-child(n){
    /* border-bottom: 1px solid steelblue !important; */
    margin-bottom: 5px;
    background: transparent;
    padding: 8px;
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    color: #096488;
    border: none;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    cursor: pointer;

}

</style>
