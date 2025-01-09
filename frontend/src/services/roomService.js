import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rooms/'; // Cập nhật API backend của bạn

export const getRooms = () => {
  return axios.get(API_URL);
};

export const addRoom = (roomData) => {
  return axios.post(API_URL, roomData);
};
