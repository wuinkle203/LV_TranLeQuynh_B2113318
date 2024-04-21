<template>
    <div class="book-list-admin">
        <div class="search-bar">
            <input class="input" v-model="searchText" @keydown.enter="performSearch" placeholder="Tìm kiếm sản phẩm" />
            <button class="btn" @click="performSearch" type="submit">Tìm kiếm</button>
        </div>
        <div class="container">
            <div class="notify" v-if="filteredBooks.length === 0">Không tìm thấy sách</div>
            <!-- <div v-for="book in filteredBooks" :key="book._id">
                <div class="book-item col-sm-3">
                    <div class="img">
                        <img width="150px" height="200px" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" />
                    </div>
                    <div class="item">{{ book.name }} - {{ book.author }} - {{ book.quantity }}</div>
                    <div class="item-icons">
                        <i class="fa-solid fa-pen icon" @click="editBook(book._id)"></i>
                        <i class="fa-solid fa-trash icon" @click="deleteBook(book._id, book.name)"></i>
                    </div>
                </div>
            </div> -->
            <table class="table">
                <thead>
                    <tr>
                        <th>
                            STT
                        </th>
                        <th>
                            Ảnh Sách
                        </th>
                        <th>
                            Tên Sách
                        </th>
                        <th>
                            Tác Giả
                        </th>
                        <th>
                            Số Lượng
                        </th>
                        <th>Sửa Sách</th>
                        <th>Xoá Sách</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(book, index) in filteredBooks" :key="index">
                        <th>
                            {{ index + 1 }}
                        </th>
                        <th>
                            <img width="150px" height="200px" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" />
                        </th>
                        <th>
                            {{ book.name }}
                        </th>
                        <th>
                            {{ book.author }}
                        </th>
                        <th>
                            {{ book.quantity }}
                        </th>
                        <th><i class="fa-solid fa-pen icon" @click="editBook(book._id)"></i></th>
                        <th><i class="fa-solid fa-trash icon" @click="deleteBook(book._id, book.name)"></i></th>
                    </tr>
                    <tr>
                        <div class="add-book">
                            Thêm sách
                            <router-link :to="{ name: 'add-book' }">
                                <button class="btn-add">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </router-link>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import BookService from '../services/books.service';
import UserService from '../services/users.service';
export default {
    props: {
        books: Array
    },

    data() {
        return {
            searchText: '',
            filteredBooks: []
        };
    },

    watch: {
        books: {
            handler() {
                this.performSearch();
            },
            deep: true
        }
    },

    methods: {
        normalizeText(text) {
            return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        },

        performSearch() {
            const searchLower = this.normalizeText(this.searchText).toLowerCase();
            this.filteredBooks = this.books.filter(book => {
                const bookTitleLower = this.normalizeText(book.name).toLowerCase();
                return bookTitleLower.includes(searchLower);
            });
        },

        editBook(book) {
            this.$router.push({ name: "book-form", params: { id: book} });
        },

        async deleteBook(bookId, bookName) {
            const userConfirmation = await this.showConfirmationDialog(`Bạn muốn xoá sản phẩm ${bookName}?`);
            if (userConfirmation) {
                try {
                    const response = await BookService.deleteBook(bookId)
                    console.log(response)
                    this.books = this.books.filter((book) => book._id !== bookId);
                    this.updateUserBorrow(bookId);
                } catch (error) {
                    console.log(error)
                }
                this.$router.go() 
            }
        },


        async showConfirmationDialog(message) {
            return new Promise((resolve) => {
                // Use a modern dialog or modal library to display a confirmation message
                // For simplicity, you can use the browser's built-in confirm function for now
                const userConfirmation = window.confirm(message);
                resolve(userConfirmation);
            });
        },

        async updateUserBorrow(bookId) {
            const user = localStorage.getItem("user");

            if (user) {
                const userData = JSON.parse(user);

                // Remove the product from the user's cart in localStorage
                userData.borrow = userData.borrow.filter((item) => item.bookId !== bookId);
                localStorage.setItem("user", JSON.stringify(userData));

                // Update the user's cart on the server
                try {
                    await UserService.deleteBookBorrow(userData._id, userData.borrow);
                } catch (error) {
                    console.error('Error updating user cart on the server:', error);
                }  
            }
        },

        // toggleProductDetails(productId) {
        // // Toggle the display of product details for the clicked product
        //     this.$set(this.showDetails, productId, !this.showDetails[productId]);
        // },
    }
}
</script>

<style>
.search-bar{
    color: #009688;
    margin: 10px;
}

.input{
    border: #009688 1px solid;
    border-radius: 15px 0px 0px 15px;
    padding: 5px;
    width: 20%;
    /* margin-top: 5px; */
}

.btn{
    border-radius: 0px 15px 15px 0px;
    padding: 5px;
    margin-top: -4px;
    background-color: #009688;
    color: white;
}

.add-book{
    color: #009688;
    font-weight: bold;
    margin-right: 10px;
}
.btn-add{
    color: white;
    background-color: #009688;
    border: none;
    border-radius: 10px;
    margin-left: 10px;
}
/* .book-list-admin{
    color: steelblue;
    overflow: hidden;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
}

.input {
    border: 1px solid steelblue;
    border-radius: 10px;
    padding: 6px 12px;
}
.search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3px;
}

.btn {
    background-color: steelblue;
    border-radius: 10px;
    padding: 6px 10px;
    margin: 3px;
}

.container {
    display: flex;
    width: 70%;
    flex-wrap: nowrap;
    flex-direction: row;
    margin-top: 20px;
    overflow-y: scroll;
    max-height: 550px;
}


img {
    box-shadow: 0px 0px 10px 3px steelblue;
}

.item {
    width: 350%;
    height: 70px;
    display: flex;
}

.icon {
    margin-right: 10px;
    border: 1px solid steelblue;
    background-color:aliceblue;
    padding: 3px;
    border-radius: 5px;
    width: 150%;
    align-items: center;
    display: flex;
    justify-content: center;
}

.icon:hover{
    color: aliceblue;
    background-color: steelblue;
}

.book-item {
    max-width: 150px;
    margin: 15px;

}

.item-icons{
    width: 350%;
    display: flex;
}

.add-book {
    font-weight: bold;
    margin-right: 5px;
}
.btn-add{
    color: steelblue;
    border: steelblue;
    margin-bottom: 5px;
    margin-top: 5px;
} */
</style>