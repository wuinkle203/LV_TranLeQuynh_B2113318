<template>
    <div class="favorites">
        <h1>Sách Yêu Thích</h1>
        <div v-if="books.length === 0">Bạn chưa yêu thích quyển sách nào.</div>
        <div class="container" v-else>
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
                        </tr>
                    </tbody>
                </table>
        </div>
    </div>
</template>

<script>
import UserService from "../services/users.service";
import BookService from "../services/books.service";
export default {
    data() {
        return {
            books: [],
        };
    },
    created() {
        this.retrieveFavorites();
    },
    methods: {
        async retrieveFavorites() {
            try {
                const user = localStorage.getItem("user");
                if (user) {
                    const userData = JSON.parse(user);
                    const favoriteBookIds = userData.favorite; // Assuming these are product IDs
                    const favoriteBooks = await Promise.all(
                        favoriteBookIds.map(async (bookId) => {
                            return await BookService.getBookById(bookId);
                        })
                    );
                    console.log(this.books);
                    this.books = favoriteBooks.filter(Boolean);
                }
            } catch (error) {
                console.error("Error retrieving favorites:", error);
            }
        },
    },
};
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

/* h1 {
    color: steelblue;
    display: flex;
    justify-content: center;
    align-items: center;
} */
/* .container {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    flex-direction: row;
    margin-top: 20px;
    overflow-y: scroll;
    max-height: 550px;
}

.favorite-item {
    max-height: 550px;
    margin: 10px;

}

img {
    box-shadow: 0px 0px 10px 3px steelblue;
}

.name {
    margin: 10px;
    width: 140px;
    height: 50px;
}

.author{
    margin: 10px;
    width: 140px;
}

.item{
    margin: 10px;
    width: 140px;
    text-decoration: none;
    color: steelblue; */
</style>