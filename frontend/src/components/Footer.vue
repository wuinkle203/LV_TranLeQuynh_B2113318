<template>
    <div class="footer">
        <div class="socialIcons">
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-github"></i>
            <i class="fa-brands fa-instagram"></i>
            <i class="fa-brands fa-youtube"></i>
        </div>
        <div class="menu">
            <div>Trang Chủ</div>
            <div>Tin Tức</div>
            <div>Sách</div>
            <div>Về chúng tôi</div>
            <div>Góp Ý</div>

        </div>
        <div class="copyright">
            <span>Copyright <i class="fa-solid fa-copyright"></i> 2024</span>
        </div>
    </div>
</template>

<style scoped>
.footer {
    color: steelblue;
    background-color:#009688;
    /* border-top: 2px solid steelblue; */
    background-image: url('../PictureProject/building-table-wood-books-library-interior-design-693868-wallhere.com (1) - Copy.jpg');
    height: 26vh;
    opacity: 0.6;
}

.socialIcons{
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    
}

.menu {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}
.menu div {
    margin: 19px;
    font-weight: bold;
    text-transform: uppercase;
}
.copyright{
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}
.copyright span{
    margin-top: 19px;
    font-weight: bold;
    text-transform: uppercase;
}
.socialIcons i{
    margin: 19px;
    font-size: 40px;
}
</style>