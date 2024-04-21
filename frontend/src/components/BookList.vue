<template>
    <div class="book-list-page">
        <div class="book-list">
            <div class="container">

                    <!-- <div class="item">
                        <div :to="{ name: 'book-detail', params: { id: book._id } }"  class="img">
                            <img width="150px" height="200px" :src="'http://localhost:3000/uploads/' + book.image" alt="Book Image" />
                        </div>
                        <div class="details">
                            <div class="name">{{ book.name }}</div>
                            <p class="author">{{ book.author }}</p>
                            <div class="price">{{ book.price }} VNĐ</div>
                            <button class="add-to-borrow" @click="toggleBook(book._id)">Mượn</button>
                            <router-link class="buy-now" :to="{ name: 'book-detail', params: { id: book._id } }">Xem thêm</router-link>
                        </div>
                    </div> -->
                    <table class="table">
                        <thead>
                            <tr>
                            <th>STT</th>
                            <th>Ảnh sách</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Giá thị trường</th>
                            <th>Tóm tắt</th>
                            <th>Mượn</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book,index) in books" :key="index">
                                    <th>{{ index + 1 }}</th>
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
                                        {{ book.price }} VNĐ
                                    </th>
                                    <th>
                                        <router-link class="buy-now" :to="{ name: 'book-detail', params: { id: book._id } }">Xem thêm</router-link>
                                    </th>
                                    <th>
                                        <button class="add-to-borrow" @click="toggleBook(book._id)">Mượn</button>
                                    </th>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>
    </div>
</template>

<script>
import UserService from '../services/users.service'
export default {
    props: {
        books: Array, 
    },

    data(){
        return {
            status: 0
        }
    },
    methods: {
        async toggleBook(Id) {
            // Toggle the favorite status
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);

                    // Find the index of the product in the cart
                    const index = userData.borrow.findIndex(item => item.bookId === Id);

                    if (index !== -1) {
                        // If the product is already in the cart, increase the quantity
                        userData.borrow[index].status = this.status;
                    } else {
                        // If the product is not in the cart, add it with the given quantity
                        userData.borrow.push({ bookId: Id, status: this.status});
                    }

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
                }else {
                    alert("Bạn cần phải đăng nhập!")
                    this.$router.push({name: 'login'})
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
};
</script>

<style>
    button{
        padding: 5px 15px;
        color: white;
        border: none;
        border-radius: 10px;
        background-color: #009688;
    }

    tr{
        align-items: center;
    }

</style>

<!-- <style>
.book-list-page{
    color: steelblue;
    flex-direction: row;
    align-items: center;
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


.name {
    height: 50px;
    font-weight: bold;
}

.img {
    margin: 10px;
    box-shadow: 0px 0px 10px 3px steelblue;
}

.details{

}

.add-to-borrow {
    color: steelblue;
    border: steelblue 1px solid;
    margin: 5px 5px 5px 0px;
    padding: 3px 6px ;
}
</style> -->