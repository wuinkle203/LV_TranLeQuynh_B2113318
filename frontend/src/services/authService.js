import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users/';

// Đăng ký người dùng
export const registerUser = (userData) => {
  return axios.post(`${API_URL}register`, userData) // Gọi đúng endpoint
    .then(response => {
      return response.data; // Trả về kết quả từ backend
    })
    .catch(error => {
      throw error; // Xử lý lỗi
    });
};

// Đăng nhập người dùng
export const loginUser = (credentials) => {
  return axios.post(`${API_URL}login`, credentials) // Gọi đúng endpoint
    .then(response => {
      return response.data; // Trả về kết quả từ backend
    })
    .catch(error => {
      throw error; // Xử lý lỗi
    });
};
