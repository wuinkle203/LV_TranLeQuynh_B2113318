<template>
    <div class="book-detail">
        <div class="book-info">
            <div class="book-img">
                <img width="250px" height="300px" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" class="img" />
                <div class="add-to-borrow">
                    <!-- <div class="quantity">
                        <div>
                            <input class="input" v-model="quantity" type="number" min="1" />
                            <button class="btnt" @click="incrementQuantity">+</button>
                        </div>
                    </div> -->
                    <button class="btn" @click="toggleBorrow">Mượn</button>
                    <button class="btn" @click="toggleFavorite"><i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i></button>
                </div>
            </div>
            <div class="details">
                <p class="name">{{ book.name }}</p>
                <!-- <p>{{ book.author }}</p>
                <div class="price">Giá: {{ book.price }} VĐN</div>
                <div class="year">Năm Xuất Bản: {{ book.year }}</div> -->
                <div class="summary">
                    {{ book.summary }}
                </div>
            </div>
        </div>
        <div class="similar-book">
            <h1>Sách Khác</h1>
            <div class="container">
                <div v-for="similarBook in filteredSimilarBooks" :key="similarBook._id" class="favorite-item">
                    <!-- Display product details here -->
                    <router-link :to="{ name: 'book-detail', params: { id: similarBook._id } }" class="item">
                        <img width="150px" height="200px" class="img-similar" :src="'http://localhost:3000/uploads/' + similarBook.image" alt="Book Image" />
                        <!-- <h2 v-if="similarProduct.category === 'Album'">Album {{ similarProduct.title }}</h2>
                        <h2 v-else>EP {{ similarProduct.title }}</h2> -->
                    </router-link>
                    <!-- Add more details as needed -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BookService from '../services/books.service';
import UserService from '../services/users.service'

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { Carousel, Slide } from 'vue-carousel';

export default {
    components: {
        Carousel,
        Slide,
    },
    data() {
        return {
            book: '',
            isFavorite: false,
            isBorrow: false,
            quantity: 1,
            similarBooks: [],
            status: 0,
        };
    },

    watch: {
        '$route.params.id'(newId) {
            this.retrieveBook(newId);
            this.$router.go()
        },
    },
    beforeRouteUpdate(to, from, next) {
        this.retrieveBook(to.params.id);
        next();
    },

    created() {
        this.retrieveBook();
        this.retrieveBookAll();
    },

    computed: {
        filteredSimilarBooks() {
            // Filter similarProducts based on the currentCategory
            return this.similarBooks.filter(book => this.book.borrow === this.book.borrow && book._id !== this.book._id);
        },
    },
    methods: {
        async retrieveBook() {
            try {
                const bookId = this.$route.params.id;
                this.book = await BookService.getBookById(bookId)
                console.log(this.book)
                this.checkFavoriteStatus()

            } catch (error) {
                console.log(error)
            }
        },

        async retrieveBookAll() {
            try {
                this.similarBooks = await BookService.getAllBooks()
                console.log(this.similarBooks)
            } catch (error) {
                console.log(error)
            }
        },

        checkFavoriteStatus() {
            // Check if the current product is in the user's favorites
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);
                    this.isFavorite = userData.favorite.includes(this.book._id);
                }
            } catch (error) {
                console.log(error)
            }
        },

        async toggleFavorite() {
            // Toggle the favorite status
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);

                    // If the product is already in favorites, remove it; otherwise, add it
                    const index = userData.favorite.indexOf(this.book._id);
                    if (index !== -1) {
                        userData.favorite.splice(index, 1);
                    } else {
                        userData.favorite.push(this.book._id);
                    }

                    // Update the user's favorites
                    // You need an appropriate API endpoint to handle this update
                    await UserService.updateFavorite(userData._id, userData.favorite);

                    // Update the local storage
                    localStorage.setItem('user', JSON.stringify(userData));
                    // Update the component's isFavorite state
                    this.isFavorite = !this.isFavorite;
                } else {
                    alert("Bạn cần phải đăng nhập!")
                    this.$router.push({ name: 'login' })
                }
                if (this.isFavorite === true) {
                    toast.success('Sách đã được thêm vào yêu thích', {
                        autoClose: 800
                    })
                }
            } catch (error) {
                console.log(error);
            }
        },

        gotoProduct() {
            this.$router.go()
        },

        async toggleBorrow() {
            // Toggle the favorite status
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);

                    // Find the index of the product in the cart
                    const index = userData.borrow.findIndex(item => item.bookId === this.book._id);

                    if (index !== -1) {
                        // If the product is already in the cart, increase the quantity
                        userData.borrow[index].status = this.status;
                        userData.borrow[index].borrowDate = null
                        userData.borrow[index].givebackDate = null
                        // userData.borrow[index].status = this.status;
                    } else {
                        // If the product is not in the cart, add it with the given quantity
                        userData.borrow.push({ bookId: this.book._id, status : this.status, borrowDate: null, givebackDate: null});
                    }
                    console.log(this.status)
                    // Update the user's cart
                    // You need an appropriate API endpoint to handle this update
                    await UserService.updateBorrow(userData._id, userData.borrow);

                    // Update the local storage
                    localStorage.setItem('user', JSON.stringify(userData));

                    // Display a confirmation message
                    // toast.success('Product added to cart', {
                    //     autoClose: 500
                    // });
                    setTimeout(() => {
                        this.$router.go();
                    }, 0);
                } else {
                    alert("Bạn cần phải đăng nhập!")
                    this.$router.push({ name: 'login' })
                }
            } catch (error) {
                console.log(error);
            }
        },


        // incrementQuantity() {
            // const user = localStorage.getItem('user');
            // const userData = JSON.parse(user);
            // if(this.quantity < BookService.getBookById(userData._id).quantity)
                // this.quantity += 1;
        // },
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity -= 1;
            }
        },

        async incrementQuantity() {
            try {
                const bookId = this.$route.params.id;
                this.book = await BookService.getBookById(bookId)
                if (this.quantity < this.book.quantity)
                    this.quantity += 1

            } catch (error) {
                console.log(error)
            }
        },
    }
};
</script>

<style>

.book-info{
    display: flex;
}

.details{
    margin-left: 10px;
    /* display: grid;
    justify-content: center;
    align-items: center; */
}
h1{
    margin-top: 20px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    color: #009688;
    border-bottom: 2px solid #009688;
}

.name, .summary{
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
}

.add-to-borrow{
    color: #009688;
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.name {
    color: #009688;
    font-size: 40px;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
}
/* i {
    width: 50%;
    display: flex;
    text-align: center;
    border: 1px solid #009688;
    padding: 10px;
    cursor: pointer;
} */

.btn{
    margin-top: 5px;
    color: white;
    background-color: #009688;
    border-radius: 0px;
    width: 50%;
    border: white 2px solid;
    /* margin-right: 40px; */
}
.book-img{
    margin-top: 5px;
}

.img-similar{
    margin: 10px;
}
</style>
<!-- 
<style>
.book-info {
    margin: 5px;
}

.book-detail {
    display: flex;
    justify-content: space-around;
    align-items: center;

}

.details {
    color: steelblue;

}
.add-to-borrow{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}


.btnc{
    border: 1px solid steelblue;
    padding: 5px 15px;

}

.input {
    border: 1px solid steelblue;
    padding: 5px;
    width: 100px;
}

.favorite {
    display: flex;
    justify-content: center;
    margin: 5px;
}

h2 {
    display: flex;
    justify-content: center;
    font-weight: bold;
}
 h5 {
    display: flex;
    justify-content: center;
 }

.price {
    display: flex;
    justify-content: center;
}

.year {
    display: flex;
    justify-content: center;
}

.btnt {
    border: 1px solid steelblue;
    padding: 5px 13px;
}

.btn {
    color: steelblue;
    border: steelblue 1px solid;
    display: flex;
    justify-content: center;
    margin-left: 5px;
}

.btn:hover {
    color: white;
    background-color: steelblue;
}

.container{
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    flex-direction: row;
    margin-top: 20px;
    overflow-y: scroll;
    max-height: 550px;
}

.favorite-item {
    margin: 10px;
    box-shadow: 0px 0px 10px 3px steelblue;
    color: steelblue;
}

h2 {
    color: steelblue;
}

.img {
    box-shadow: 0px 0px 10px 3px steelblue;
}
</style> -->