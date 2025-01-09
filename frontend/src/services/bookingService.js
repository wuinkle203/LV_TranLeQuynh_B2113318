import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bookings/'; // Cập nhật API backend của bạn

export const createBooking = (bookingData) => {
  return axios.post(API_URL, bookingData);
};

export const getBookings = () => {
  return axios.get(API_URL);
};
