<template>
    <div class="room-list">
      <h1>Danh Sách Phòng Karaoke</h1>
      <ul>
        <li v-for="room in rooms" :key="room.id">{{ room.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RoomListView',
    data() {
      return {
        rooms: [
          { id: 1, name: 'Phòng 1' },
          { id: 2, name: 'Phòng 2' },
          { id: 3, name: 'Phòng 3' }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .room-list {
    padding: 20px;
  }
  
  h1 {
    color: #4CAF50;
  }
  </style>
  