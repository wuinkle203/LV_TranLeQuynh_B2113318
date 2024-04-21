import createApiClient from './api.user.service'

//UserService định nghĩa các phương thức tương tác với dữ liệu phía API server
class UserService {
    constructor(baseUrl = "http://localhost:3000/api/users"){
        this.apiClient = createApiClient(baseUrl)
    }

    async createUser(userData) {
        try {
            const response = await this.apiClient.post('/', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const response = await this.apiClient.get('/');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    
    async getUserById(userId) {
        try {
            const response = await this.apiClient.get(`/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            const response = await this.apiClient.put(`/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateFavorite(userId, favorite) {
        try {
            const response = await this.apiClient.put(`/${userId}`, { favorite });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateBorrow(userId, borrow) {
        try {
            const response = await this.apiClient.put(`/${userId}`, { borrow });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // async changeStatus(userId, status){
    //     try{
    //         const reponse = await this.apiClient.put(`/${userId}`, )
    //     }
    // }   
    
    async deleteBookBorrow(userId, borrow) {
        try {
            const response = await this.apiClient.put(`/${userId}`, { borrow });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    
    async deleteUser(userId) {
        try {
            const response = await this.apiClient.delete(`/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    

    // async updateBookQuantity(userId, borrow) {
    //     try {
    //         const response = await this.apiClient.put(`/${userId}`, { bookId: bookId, 
    //             quantity: quantity,
    //         });

    //         // Update local storage if the server request is successful
    //         const user = localStorage.getItem("user");
    //         if (user) {
    //             const userData = JSON.parse(user);
    //             const borrowItem = userData.borrow.find((item) => item.bookId === bookId);
    //             if (borrowItem) {
    //                 borrowItem.quantity = quantity;
    //                 localStorage.setItem("user", JSON.stringify(userData));
    //             }
    //         }

    //         return response.data;
    //     } catch (error) {
    //         console.error("Lỗi cập nhật:", error);
    //         throw error;
    //     }
    // }
    async updateBorrowStatus(userId, bookId, status) {
        try {
            const response = await this.apiClient.put(`/${userId}`, { bookId: bookId, 
                status : status,
            });

            // Update local storage if the server request is successful
            const user = localStorage.getItem("user");
            if (user) {
                const userData = JSON.parse(user);
                const borrowItem = userData.borrow.find((item) => item.bookId === bookId);
                if (borrowItem) {
                    borrowItem.status = status;
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            }

            return response.data;
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            throw error;
        }
    }
}

export default new UserService();