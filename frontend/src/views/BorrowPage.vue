<template>
            <h1>Mượn Sách</h1>
    <div class="borrow">
        <div class="check-in">
            <div v-if="books.length === 0">Không có sách.</div>
            <div class="container">
                <!-- <div v-for="book in books" :key="book._id" class="cart-item">
                    <div class="item">
                        <div class="check-book">
                            <input class="checkbox" type="checkbox" name="" id="" v-model="book.selected"/>
                        </div>
                        <img width="150px" height="200px" class="img" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" />
                        <div class="info">
                            {{ book.name }}
                        </div>
                        <div v-if="book.status === 0">Đang chờ duyệt</div>
                        <div v-if="book.status === 1">Đã duyệt</div>
                        <div v-if="book.status === 2">Đã trả</div>
                    </div>
                    <i class="fa-solid fa-trash" @click="deleteBook(book._id, book.name)"></i>
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
                                Trạng Thái
                            </th>
                            <th>
                                Xoá
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, index) in books" :key="index">
                            <th>
                                {{ index + 1 }}
                            </th>
                            <th>
                                <img width="150px" height="200px" class="img" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" />
                            </th>
                            <th>{{ book.name }}</th>
                            <th>{{ book.author }}</th>
                            <th><div v-if="book.status === 0">Đang chờ duyệt</div>
                            <div v-if="book.status === 1">Đã duyệt</div>
                        <div v-if="book.status === 2">Đã trả</div></th>
                        <th><i class="fa-solid fa-trash" @click="deleteBook(book._id, book.name)"></i></th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import usersService from '../services/users.service';
import booksService from '../services/books.service';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    data() {
        return {
            books: [],
            isCheckAll: false,
            users: [],
        };
    },
    
    created() {
        this.retrieveBorrow();
        // this.retrieveUsers()
    },

    computed: {
        selectedBooks() {
            return this.books.filter((book) => book.selected);
        },
    },

    methods: {
        // checkOut() {
        //     const user = localStorage.getItem("user");
        //     const userData = JSON.parse(user);
        //     if ( userData.borrow.length === 0) {
        //         toast.error("Không có quyển sách nào để mượn", {autoClose: 600},)
        //     }
        //     else {
        //         toast.success("Đang chờ duyệt !!!", {autoClose: 600,})

        //         setTimeout(()=> {
        //             this.$router.push({name:'home'})
        //         }, 600);}
        // },
        async retrieveBorrow() {
            try {
                const user = localStorage.getItem("user");
                if (user) {
                    const userData = JSON.parse(user);
                    const borrowBooks = await this.fetchBorrowBooks(userData.borrow);
                    this.books = borrowBooks.filter(Boolean);
                    // console.log(this.books)
                }
            } catch (error) {
                console.error("Error retrieving Borrow:", error);
            }
        },
        async fetchBorrowBooks(borrow) {
            // console.log(borrow)
            return await Promise.all(
                borrow.map(async (item) => {
                    const book = await booksService.getBookById(item.bookId);
                    // console.log(book)
                    if (book) {
                        book.status = item.status;
                    }
                    // console.log(item.status)
                    return book;
                })
            );
        },

        async deleteBook(bookId, bookTitle) {
            if (confirm(`Do you want to remove this book ${bookTitle}`)) {
                try {
                    const user = localStorage.getItem("user");
                    if (user) {
                        const userData = JSON.parse(user);
                        userData.borrow = userData.borrow.filter((item) => item.bookId !== bookId);
                        localStorage.setItem("user", JSON.stringify(userData));

                        this.books = this.books.filter((book) => book._id !== bookId);
                        await usersService.deleteBookBorrow(userData._id, userData.borrow);
                    }
                } catch (error) {
                    console.error(error);
                }
                this.$router.go()
            } else {
                return false; 
            }
        }, 
        checkAllBooks() {
            this.books.forEach((book) => {
                book.selected = this.isCheckAll;
            });
        },
    },
}
</script>

<style>
 h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Courier New', Courier, monospace;
    color: #009688;
    font-weight: bold;
}
/*
img {
    box-shadow: 0px 0px 10px 3px steelblue;
}

.container{
    display: flex;
}

.item {
    margin: 5px;
} */
</style>