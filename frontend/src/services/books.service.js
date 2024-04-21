import createApiClient from "./api.service"

class BookService {
    constructor (baseUrl = "http://localhost:3000/api/books"){
        this.apiClient = createApiClient(baseUrl)
    }
    async createBook(bookData) {
        try {
            const response = await this.apiClient.post('/', bookData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAllBooks() {
        try {
            const response = await this.apiClient.get('/');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getBookById(bookId) {
        try {
            const response = await this.apiClient.get(`/${bookId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateBook(bookId, bookData) {
        try {
            const response = await this.apiClient.put(`/${bookId}`, bookData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteBook(bookId) {
        try {
            const response = await this.apiClient.delete(`/${bookId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await this.apiClient.delete('/');
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async updateBookQuantity(bookId, quantity) {
        try {
            const response = await axios.put(`/${bookId}`, {
                quantity: quantity,
            });

            // Update local storage if the server request is successful
            const user = localStorage.getItem("user");
            if (user) {
                const userData = JSON.parse(user);
                const borrowItem = userData.borrow.find((item) => item.bookId === bookId);
                if (borrowItem) {
                    borrowItem.quantity = quantity;
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            }

            return response.data;
        } catch (error) {
            console.error("Error updating product quantity:", error);
            throw error;
        }
    }

    async updateBookStatus(bookId, status) {
        try {
            const response = await axios.put(`/${bookId}`, {
                status: status,
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
            console.error("Error updating product quantity:", error);
            throw error;
        }
    }
}

export default new BookService();