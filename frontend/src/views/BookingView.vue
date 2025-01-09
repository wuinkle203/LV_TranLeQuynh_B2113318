<template>
    <div class="booking">
      <h1>Đặt Phòng Karaoke</h1>
      <form @submit.prevent="submitBooking">
        <div>
          <label for="room">Chọn Phòng:</label>
          <select v-model="selectedRoom">
            <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
          </select>
        </div>
        <div>
          <label for="date">Ngày Đặt:</label>
          <input type="date" v-model="bookingDate" required />
        </div>
        <button type="submit">Đặt Phòng</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BookingView',
    data() {
      return {
        rooms: [
          { id: 1, name: 'Phòng 1' },
          { id: 2, name: 'Phòng 2' },
          { id: 3, name: 'Phòng 3' }
        ],
        selectedRoom: null,
        bookingDate: ''
      };
    },
    methods: {
      submitBooking() {
        if (this.selectedRoom && this.bookingDate) {
          alert(`Đặt phòng ${this.selectedRoom} vào ngày ${this.bookingDate}`);
        } else {
          alert('Vui lòng chọn phòng và ngày đặt');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .booking {
    padding: 20px;
  }
  
  h1 {
    color: #4CAF50;
  }
  </style>
  