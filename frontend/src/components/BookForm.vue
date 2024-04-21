<template>
    <div class="add-product-page">
        <div class="container">
            <h1 class="add-new">Cập Nhật Sách</h1>
            <div class="form">
                <form @submit.prevent="updateBook()">
                    <div class="form-item">
                       
                        <input class="input" type="text" id="name" placeholder="Tên sách" v-model="formData.name" />
                        <label class="label" for="name">Tên Sách</label><br />
                    </div>

                    <div class="form-item">
                       
                        <input class="input" type="text" id="author" placeholder="Tác Giả" v-model="formData.author" />
                        <label class="label" for="author">Tác Giả</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input" type="text" id="year" placeholder="Năm xuất bản" v-model="formData.year" />
                        <label class="label" for="year">Năm Xuất Bản</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input inputimg" type="file" id="img" accept="image/jpg, image/png" @change="handleFileUpload" />
                        <label class="label" for="img">Ảnh</label><br />
                        <div v-if="formData.image">
                            {{ getFileName(formData.image) }}
                            <div v-if="imageChanged">{{ info }}</div>
                        </div>
                    </div>

                    <div class="form-item">
                        
                        <input class="input" id="price" type="text" placeholder="Giá" v-model="formData.price" />
                        <label class="label" for="price">Giá</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input" id="quantity" type="text" placeholder="Số Lượng" v-model="formData.quantity" />
                        <label class="label" for="countinstock">Số Lượng</label><br />
                    </div>
                    <div class="form-item">
                        <label class="label" for="summary">Tóm Tắt</label><br />
                        <!-- <input class="input" id="summary" type="" placeholder="Số lượng" v-model="formData.summary"> -->
                        <textarea name="" id="" cols="60" rows="7" v-model="formData.summary"></textarea>
                    </div>
                    <button type="submit" class="btn">Cập Nhật</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import BookService from '../services/books.service';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    data() {
        return {
            info: "Ảnh đã được cập nhật",
            imageChanged: false,
            formData: {
                name: "",
                author: "",
                year: "",
                image: "",
                price: "",
                quantity: "",
                summary: ""
            },
        };
    },
    mounted() {
        this.retrieve(this.$route.params.id);
    },

    methods: {
        async retrieve(bookId) {
                try {
                    const book = await BookService.getBookById(bookId);
                    if (book) {
                        this.formData.name = book.name;
                        this.formData.author = book.author;
                        this.formData.year = book.year;
                        this.formData.image = book.image;
                        this.formData.price = book.price;
                        this.formData.quantity = book.quantity;
                        this.formData.summary = book.summary;
                    } else {
                        console.log("Không tìm thấy sách");
                    }

                    console.log(book)
                } catch (error) {
                    console.log(error);
                }
        },

        getFileName(file) {
        // Extract and return only the file name
            return file instanceof File ? file.name : file;
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            this.formData.image = file;
            this.imageChanged = true;
        },


        async updateBook() {
            try {
                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('author', this.formData.author);
                formData.append('year', this.formData.year);
                formData.append('image', this.formData.image); // Append the image file
                formData.append('price', this.formData.price);
                formData.append('quantity', this.formData.quantity);
                formData.append('summary', this.formData.summary)
                const response = await BookService.updateBook(this.$route.params.id, this.formData);
                console.log(response);
                alert("Cập nhật sách thành công");
                this.$router.push({ name: "book-management" });
            } catch (error) {
                console.log(error);
            }   
        },
    },
};   
</script>

<style>
h1 {
    display: flex;
    color: #009688;
    justify-content: center;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
}
.inputimg {
    margin-left: 40px;
}
.container {
    border: 2px solid #009688;
    justify-content: center;
    align-items: center;
    display: grid;
    /* background-color: aqua; */
    backdrop-filter: blur(15px);
    width: 700px;
    height: 720px;
    border-radius: 15px;
}

form {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
}
.btn {
    width: 100%;
    border: 1px solid #009688;
    border-radius: 15px;
    font-weight: bold;
    color: #009688;
}

.form-item{
    position: relative;
    margin: 20px 0;
    width: 610px;
    border-bottom: 2px solid #009688;
}

.form-item label {
    position: absolute;
    top: 0px;
    left: 5px;
    transform: translateY(-50%);
    color: #009688;
    transition: 0.5s;
    pointer-events: none;
}

input:focus ~ label,
input:focus ~ :valid{
    top: -10px;
}

.form-item input {
    width: 100%;
    height: 30px;
    background: transparent;
    border: none;
    outline: none;
    padding: 0 35px 0 5px;
}
h1 {
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
}
</style>