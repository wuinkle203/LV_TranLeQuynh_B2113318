import createApiClient from "./api.user.service"

class AuthService {
    constructor(baseUrl = "/api/users") {
        this.apiClient = createApiClient(baseUrl)
    }


    async login(credentials){
        try {
            const response = await this.apiClient.post('/login', credentials);
            const { token, user } = response.data;


            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        } catch (error) {
            throw error;
        }
    };

    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    getUser(){
        
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };
}

export default new AuthService();