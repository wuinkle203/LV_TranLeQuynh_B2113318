<template>
  <div>
    <div class="container">
      <h1>Mượn Sách</h1>
      <div class="reader" v-for="(reader, readerIndex) in readers" :key="readerIndex">
        <h4 v-if="reader.role ==='client'">Tài Khoản: {{ reader.username }}</h4>
        <table class="table" v-if="reader.role ==='client'">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh Sách</th>
              <th>Tên Sách</th>
              <!-- <th>Số lượng</th> -->
              <th>Ngày Mượn</th>
              <th>Cập Nhật Ngày Mượn</th>
              <th>Ngày Trả</th>
              <th>Cập Nhật Ngày Trả</th>
              <th>Trạng Thái</th>
              <th>Kiểm Duyệt</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(borrowedBook, bookIndex) in reader.borrow"
              :key="bookIndex"
            >
              <th>{{ bookIndex + 1 }}</th>
              <td>
                <img
                  :src="getBookImage(borrowedBook.bookId)"
                  alt="Book image"
                  width="100"
                />
              </td>
              <td>{{ getBookTitle(borrowedBook.bookId) }}</td>
              <!-- <td>{{ borrowedBook.quantity }}</td> -->
              <td>
                {{ borrowedBook.borrowDate }}
                
              </td>
              <th>
                <div><input type="date" v-model="borrowDate"></div>
                <button class="btn" @click="changeDateBorrow(reader, borrowedBook)">Cập Nhật</button>
              </th>
              
              <td>
                {{ borrowedBook.givebackDate }}
                
              </td>
              <th>
                <div><input type="date" v-model="givebackDate"></div>
                <button class="btn" @click="changeDateGiveBack(reader, borrowedBook)">Cập Nhật</button>
                
              </th>
              <td class="text-primary">                        
                  <div v-if="borrowedBook.status === 0">Đang chờ duyệt</div>
                  <div v-if="borrowedBook.status === 1">Đã duyệt</div>
                  <div v-if="borrowedBook.status === 2">Đã trả</div></td>
              <td>
                <button
                  @click="changeStatus(reader, borrowedBook, 1)"
                  class="btn"
                >
                  Duyệt 
                </button>
                <button
                  @click="changeStatus(reader, borrowedBook, 2)"
                  class="btn"
                >
                  Đã trả
                </button>
                <!-- <button
                  @click="getDate()"
                  class="btn btn-warning"
                >
                  Xoá
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import AppHeader from "@/components/admin/AppHeader.vue";
import BookService from "../services/books.service";
import ReaderService from "../services/users.service";

export default {
  data() {
    return {
      books: [],
      readers: [],
      borrowDate:'',
      givebackDate:'',
    };
  },

  mounted() {
    this.retrieveBooks();
    this.retrieveReaders();
  },

  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAllBooks();
      } catch (error) {
        console.log(error);
      }
    },
    async retrieveReaders() {
      try {
        this.readers = await ReaderService.getAllUsers();
      } catch (error) {
        console.log(error);
      }
    },
    // async changeStatus(reader, borrowedBook, status) {
    //   try {
    //     const response = await ReaderService.updateBorrowStatus(
    //       reader._id,
    //       borrowedBook.bookId,
    //       status
    //     );
        // Refresh data after changing status
      // await this.retrieveReaders();
      //         await this.retrieveBooks();
      //       } catch (error) {
      //         console.log(error);
      //       }
      //     },

          async changeStatus(reader, borrowedBook, status) {
            try {
                    // const borrowItem = reader.borrow.find((item) => item.bookId === borrowedBook._id);
                        // Update the quantity on the server
                        // Update the local storage
                      borrowedBook.status = status;
                      // console.log(borrowedBook.status)
                      await ReaderService.updateBorrow(reader._id , reader.borrow);
                      localStorage.setItem("user", JSON.stringify(reader))
            } catch (error) {
                console.error("Error updating quantity on the server:", error);
            }
        },

        async changeDateBorrow(reader, borrowedBook) {
          try {
            borrowedBook.borrowDate = this.borrowDate;
            await ReaderService.updateBorrow(reader._id , reader.borrow);
            localStorage.setItem("user", JSON.stringify(reader))
            } catch (error) {
                console.error("Error updating quantity on the server:", error);
            }
        },

        async changeDateGiveBack(reader, borrowedBook) {
          try {
            borrowedBook.givebackDate = this.givebackDate;
            await ReaderService.updateBorrow(reader._id , reader.borrow);
            localStorage.setItem("user", JSON.stringify(reader))
            } catch (error) {
                console.error("Error updating quantity on the server:", error);
            }
        },

        // async deleteBook(reader, borrowedBook) {
        //         try {
        //             console.log(reader.borrow)
        //             reader.borrow = reader.borrow.filter((item) => item.bookId !== borrowedBook._id);
        //             localStorage.setItem("user", JSON.stringify(reader))
        //             // localStorage.setItem("user", JSON.stringify(reader))
        //             // console.log(this.bookBorrow)
        //             // this.books = this.books.filter((book) => book._id !== bookId);
        //             // this.bookBorrow = this.bookBorrow.filter((book) => book._id !== borrowedBook._id);
        //             // localStorage.setItem("user", JSON.stringify(reader))
        //             await ReaderService.updateBorrow(reader._id , reader.borrow);
        //             // localStorage.setItem("user", JSON.stringify(reader))

        //         } catch (error) {
        //             console.error(error);
        //         }
        //         this.$router.go()
        // }, 

        // async deleteBook(bookId, bookTitle) {
        //     if (confirm(`Do you want to remove this book ${bookTitle}`)) {
        //         try {
        //             const user = localStorage.getItem("user");
        //             if (user) {
        //                 const userData = JSON.parse(user);
        //                 userData.borrow = userData.borrow.filter((item) => item.bookId !== bookId);
        //                 localStorage.setItem("user", JSON.stringify(userData));

        //                 this.books = this.books.filter((book) => book._id !== bookId);
        //                 await usersService.deleteBookBorrow(userData._id, userData.borrow);
        //             }
        //         } catch (error) {
        //             console.error(error);
        //         }
        //         this.$router.go()
        //     } else {
        //         return false; 
        //     }
        // },



    getBookTitle(bookId) {
      const book = this.books.find((book) => book._id === bookId);
      return book ? book.name : "Unknown";
    },
    getBookImage(bookId) {
      const book = this.books.find((book) => book._id === bookId);
      return book ? "http://localhost:3000/uploads/" + book.image : ""; // Assuming `imageUrl` is the field that stores the image URL in your book object
    },
  },

};
</script>


<style scoped>
h1{
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}
h4{
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
  color: #009688;
}
.page {
  text-align: left;
}
table{
  font-weight: bold;
}

.reader {
  margin-bottom: 30px;
}
.btn{
  border: #009688 1px solid;
  margin-top: 5px;
  margin-right: 5px;
  color: #009688;
  font-weight: bold;
}
.btn:hover{
  background-color:  #009688;
  color: white;
}
</style>
