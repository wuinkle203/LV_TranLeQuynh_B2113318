<template>
    <div class="page">
        <div class="booklist-area">
            <BookListAdmin :books="books"></BookListAdmin>
        </div>
    </div>
</template>

<script>
import BookService from '../services/books.service';
import BookListAdmin from '../components/BookListAdmin.vue';
export default {
    components: { BookListAdmin },

    data() {
        return{
            books: []
        }
    },

    created() {
        this.retrieveBook(); // Load products when the component is created
    },

    methods: {
        async retrieveBook(){
            try {
                this.books = await BookService.getAllBooks();
                console.log('Products retrieved:', this.books);
            } catch (error) {
                console.error('Error retrieving products:', error);
            }
        },
    },

    // computed: {
    //     filteredProducts() {
    //         return this.products;
    //     },
    // },
}
</script>
