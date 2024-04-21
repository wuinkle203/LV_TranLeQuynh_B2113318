<template>
    <div class="book">
        <Searching @search="performSearch"/>
        <div v-if="error">{{ error }}</div>
        <div v-if="loading"><i class="fa-solid fa-spinner fa-spin-pulse"></i></div>
        <p v-else-if="books == ''">Chưa có sách nào được thêm vào thư viện!</p>
        <p v-else-if="filteredBooks.length === 0">Không tìm thấy sách phù hợp!</p>
        <div class="book-area">
            <book-list :books="filteredBooks"/>
        </div>
    </div>
</template>

<script>
import BookList from '../components/BookList.vue';
import Searching from '../components/Searching.vue';
import BookService from "../services/books.service";

export default {
    components: { Searching, BookList },
    data() {
        return {
            books: [], // The complete list of products
            searchText: '', // The search input text
            loading: false,
            error: null,
        };
    },
    created() {
        this.retrieveBook(); // Fetch data when the component is created
    },
    methods: {
        performSearch(searchText) {
            this.searchText = searchText;
        },

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

        normalizeText(text) {
            return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        },
    },
    computed: {
        filteredBooks() {
            const searchLower = this.normalizeText(this.searchText).toLowerCase();
            return this.books.filter(book => {
                const bookTitleLower = this.normalizeText(book.name).toLowerCase();
                return bookTitleLower.includes(searchLower);
            });
        },
    },
};
</script>

<style>

</style>