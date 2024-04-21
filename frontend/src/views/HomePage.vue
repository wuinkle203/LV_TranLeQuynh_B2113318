<!-- <template>
    <div class="home col-12">
        <div class="book-slide col-6">
            <div id="carouselExampleCaptions" class="carousel slide">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img src="D:\Computer Science\HK2-Nam3\PhatTrienUngDungWeb\QuanLySach\frontend\src\PictureProject\hoangtulai.png" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-md-block">
                        <h5>Harry Potter và Hoàng Tử Lai</h5>
                        <p>Harry Potter và Hoàng Tử Lai có mặt trên thị trường sách.</p>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img src="D:\Computer Science\HK2-Nam3\PhatTrienUngDungWeb\QuanLySach\frontend\src\PictureProject\demenphieuluuky.png" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-md-block">
                        <h5>Dế Mèn phiêu lưu ký</h5>
                        <p>Tác phầm văn học Việt Nam gắn liền với bao thế hệ.</p>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img src="D:\Computer Science\HK2-Nam3\PhatTrienUngDungWeb\QuanLySach\frontend\src\PictureProject\dacnhantam.png" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-md-block">
                        <h5>Đắc nhân tâm</h5>
                        <p>Cuốn sách dày nhất Việt Nam có bản quyền từ Dale Carnegie.</p>
                    </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        
        <div class="col-6 container">
            <span class="muonnhieu">SÁCH CÓ LƯỢT MƯỢN NHIỀU NHẤT</span>
            <div class="book">
            <div v-for="book in books" :key="book._id" class="hot">
                <div v-if="book.quantity < 100">
                    <div class="item">
                        <div :to="{ name: 'book-detail', params: { id: book._id } }"  class="img">
                            <img width="150px" height="200px" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" />
                        </div>
                        <div class="details">
                            <div class="name">{{ book.name }}</div>
                            <p class="author">{{ book.author }}</p>
                            <div class="price">{{ book.quantity }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span class="muonnhieu">SÁCH CÒN LẠI NHIỀU TRONG THƯ VIỆN</span>
        <div class="book">
            <div v-for="book in books" :key="book._id" class="hot">
                <div v-if="book.quantity >= 100">
                    <div class="item">
                        <div :to="{ name: 'book-detail', params: { id: book._id } }"  class="img">
                            <img width="150px" height="200px" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" />
                        </div>
                        <div class="details">
                            <div class="name">{{ book.name }}</div>
                            <p class="author">{{ book.author }}</p>
                            <div class="price">{{ book.quantity }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>


    </div>
</template>

<script>
import BookService from '../services/books.service';


export default {
    name: 'Home',
    data () {
        return {
            books: [],
        };
    },

    created() {
        this.retrieveBook()
    },
    methods: {
        async retrieveBook() {
            try {
                this.loading = true;
                this.books = await BookService.getAllBooks();
            } catch (error) {
                console.error(error);
                this.error = 'An error occurred while fetching products.';
            } finally {
                this.loading = false;
            }
        },
        }
}

</script>


<style scoped>
.home {
    width: 100%;
    display: flex;
}

.book-slide {
    width: 50%;
    height: 100%;
}

.info {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 3px solid steelblue;
    border-bottom: 3px solid steelblue;
}

.muonnhieu {
    font-size: 20px;
    font-weight: bold;
    color: steelblue;
    justify-content: center;
    display: flex;
}
.hot {
    display: flex;
    
}

.item {
    margin: 15px;
    
}

img {
    box-shadow: 0px 0px 10px 3px steelblue;
}

.book{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    margin-top: 20px;
    overflow-y: scroll;
    height: 45%;
    margin: 5px;
    background-color: aliceblue;
}

.name {
    height: 50px;
    color: steelblue;
    font-weight: bold;
}

.author {
    height: 20px;
    color: steelblue;
}

.content {
    display: flex;
    justify-content: center;
    align-items: center;
}

</style> -->

<template>
    <div class="homepage">
        <!-- <div class="navbar">
            <div class="logo">
                <h1>Q-BOOKS</h1>
            </div>
            <ul>
                <li class="book">
                    <router-link to="/books">Sách</router-link>
                </li>
                <li>
                    <router-link to="/borrow">Mượn Sách</router-link>
                </li>
                <li>
                    <router-link to="/login">Đăng Nhập</router-link>
                </li>
            </ul>

        </div> -->
        <div class="content">
            <h1>THƯ VIỆN SÁCH</h1>
            <p>Để bước vào thế giới sách của chúng tôi
            <br> Vui lòng đăng nhập </p>
            <div>
                <button>
                    <span></span>
                    <router-link to="/login">Đăng Nhập</router-link>
                </button>
                <button>
                    <span></span>
                    <router-link to="/register">Đăng Ký</router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    name: 'Home',
}

</script>

<style>
    .homepage{
        width: 100%;
        height: 100vh;
        background-image: url('../PictureProject/background.jpg');
        /* background-image: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)); */
        opacity: 0.6;
        position: relative;
        /* top: -90px; */
    }

    .logo {
        font-family: sans-serif;
        font-size: 60px;
        cursor: pointer;
        color: #009688;
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
        text-transform: uppercase;
        font-weight: bold;
    }

    
    .navbar ul li::after{
        content: '';
        height: 3px;
        width: 0;
        background: white;
        position: absolute;
        left: 0;
        bottom: -10px;
        transition: 0.5s;
    }

    .navbar ul li:hover::after{
        width: 100%;
    }

    .content {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        color: #fff;

    }

    .logo h1{
        font-size: 70px;
        color: #009688;
        font-weight: bold;
    }

    .content h1{
        font-size: 70px;
        margin-top: 80px;
    }

    .content p{
        margin: 20px auto;
        font-weight: 100;
        line-height: 25px;
        font-weight: bold;
    }

    button{
        width: 200px;
        padding: 10px 5px;
        text-align: center;
        margin: 20px 10px;
        border-radius: 25px;
        font-weight: bold;
        border: 2px solid #009688;
        background: transparent;
        color: white;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        
    }
    span{
        background: #009688;
        height: 100%;
        width: 0;
        border-radius: 25px;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: -1;
        transition: 0.5s;
    }

    button:hover span {
        width: 100%;
    }
    button:hover{
        border: none;
    }

    button a{
        text-decoration: none;
        color: #fff;
    }
</style>