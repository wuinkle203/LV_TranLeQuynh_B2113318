<template>
    <div class="add-product-page">
        <div class="container">
            <h1 class="add-new">Thêm mới sách</h1>
            <div class="form">
                <form @submit.prevent="add" action="" enctype="multipart/form-data" method="post">
                    <div class="form-item">
                        
                        <input class="input" type="text" id="name"  v-model="formData.name" />
                        <label class="label" for="name">Tên Sách</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input" type="text" id="author"  v-model="formData.author" />
                        <label class="label" for="author">Tác Giả</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input" type="text" id="year"  v-model="formData.year" />
                        <label class="label" for="year">Năm Xuất Bản</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input inputimg" type="file" id="img" accept="image/jpg, image/png" @change="handleFileUpload" />
                        <label class="label" for="img">Ảnh</label><br />
                    </div>

                    <div class="form-item">
                        
                        <input class="input" id="price" type="text"  v-model="formData.price" />
                        <label class="label" for="price">Giá</label><br />
                    </div>
                    <div class="form-item">
                       
                        <input class="input" id="quantity" type="text" v-model="formData.quantity">
                        <label class="label" for="quantity">Số Lượng</label><br />
                    </div>
                    <div class="form-item">
                        <label class="label" for="summary">Tóm Tắt</label><br />
                        <!-- <input class="input" id="summary" type="" placeholder="Số lượng" v-model="formData.summary"> -->
                        <textarea name="" id="" cols="60" rows="8" v-model="formData.summary"></textarea>
                    </div>
                        <button type="submit" class="btn">Thêm</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import BookService from '../services/books.service';
export default {
    data() {
        return {
            formData: {
                name: "",
                author: "",
                year: "",
                image: null,
                price: "",
                quantity: "",
                summary: "",
            },
        };
    },

    computed: {
    },

    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0]; 
            this.formData.image = file;
        },

        async add() {
            try {

                // if (!this.formData.name || !this.formData.author || !this.formData.image || !this.formData.price || !this.formData.countInStock || !this.year) {
                //     toast.error('Vui lòng điền đầy đủ thông tin.', { autoClose: 3000 });
                //     return;
                // }

                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('author', this.formData.author);
                formData.append('year', this.formData.year);
                formData.append('image', this.formData.image); // Append the image file
                formData.append('price', this.formData.price);
                formData.append('quantity', this.formData.quantity);
                formData.append('summary', this.formData.summary)
                const response = await BookService.createBook(this.formData);
                console.log(response);
                toast.success('Thêm sách thành công!', {
                    autoClose: 1200,
                })

                setTimeout(() => {
                    this.$router.push({ name: 'book-management' });
                }, 800);
            } catch (error) {
                console.log(error);
                const errorMessage = error.response?.data?.error || 'Lỗi!';
                toast.error(errorMessage, { autoClose: 3000 });
            }
        },
    },
};
</script>

<style>
.btn {
    width: 100%;
    border: 1px solid #009688;
    border-radius: 15px;
    font-weight: bold;
    color: #009688;
}
.inputimg {
    margin-left: 40px;
    color: #009688;
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
    color: #009688;
    justify-content: center;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
}
</style>