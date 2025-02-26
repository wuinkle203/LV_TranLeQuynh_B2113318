<template>
  <div class="karaoke-list">

        <!-- Bootstrap Carousel với ảnh quán karaoke còn phòng trống -->
        <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-pause="false">
      <div class="carousel-inner">
        <!-- Lặp qua các quán karaoke có nhiều phòng trống -->
        <div class="carousel-item" v-for="(karaoke, index) in karaokes" :key="karaoke._id" :class="{'active': index === 0}">
          <img :src="'http://localhost:8080/uploads/' + karaoke.hinh_anh_quan" class="d-block w-100" :alt="karaoke.ten_quan">
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ karaoke.ten_quan }}</h5>
            <p>{{ karaoke.so_phong_trong }} phòng trống</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div class="left-column">
      <!-- Hiển thị bản đồ -->
      <div id="map"></div>
      
      <div class="input-button">
      <!-- Nhập địa chỉ người dùng -->
      <div>
        <input type="text" v-model="userAddress" placeholder="Nhập địa chỉ của bạn" />
        <button @click="geocodeUserAddress">Tìm vị trí</button>
      </div>

      <!-- Thêm nút tìm quán gần đây -->
      <div>
        <button @click="findNearestKaraokes">Tìm quán gần đây</button>
      </div>
    </div>
  </div>

  </div>

  <!-- Danh sách quán karaoke có thông tin khoảng cách và phòng trống -->
  <div class="karaoke-items-container">
    <div v-for="karaoke in sortedKaraokes" :key="karaoke._id" class="karaoke-item">
      <h2>{{ karaoke.ten_quan }}</h2>
      <p><strong>Khoảng cách:</strong> {{ karaoke.distance ? karaoke.distance.toFixed(2) : 'Đang tính...' }} km</p>
      <p><strong>Địa chỉ:</strong> {{ karaoke.dia_chi }}</p>
      <p><strong>Số điện thoại:</strong> {{ karaoke.so_dien_thoai }}</p>
      <p><strong>Số phòng trống:</strong> {{ karaoke.so_phong_trong }}</p>
      <img :src="'http://localhost:8080/uploads/' + karaoke.hinh_anh_quan" alt="Karaoke Image" class="karaoke-image" />
      <button @click="locateKaraoke(karaoke)">Định vị quán karaoke</button>
       <!-- Nút xem phòng -->
      <button @click="goToRoomList(karaoke._id)">Xem phòng</button>
    </div>
  </div>
</template>




<script>
import axios from 'axios';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default {
  emits: ["routeChanged"], // Khai báo sự kiện routeChanged
  name: 'KaraokeList',
  data() {
  return {
    karaokes: [],
    loading: true,
    error: null,
    map: null,
    userLocation: null,
    userMarker: null, // Marker vị trí người dùng
    karaokeMarkers: [], // Lưu các marker quán karaoke
    userAddress: '',
    apiKey: '5b3ce3597851110001cf6248ad1ee22e7a694b83b98ec2c8f3b6310a',
    geocodingApiKey: '34e03e1cf5784dfea4152d72e1054867',
  };
},

  computed: {
    // Sắp xếp quán karaoke theo khoảng cách gần nhất
    sortedKaraokes() {
        return [...this.karaokes].sort((a, b) => a.distance - b.distance);
      },
    },
  methods: {
    goToRoomList(karaokeId) {
      this.$router.push({ name: 'RoomList', params: { karaokeId } });
    },
    async findNearestKaraokes() {
      if (!this.userLocation) {
        alert('Vui lòng nhập địa chỉ hoặc bật định vị!');
        return;
      }

      // Cập nhật khoảng cách của tất cả quán karaoke
      await this.updateKaraokeDistances();

      // Lọc các quán karaoke có phòng trống và trong bán kính 10km
      const availableKaraokes = this.karaokes.filter(k => k.so_phong_trong > 0 && k.distance <= 20);


      // Sắp xếp theo khoảng cách gần nhất
      const nearestKaraokes = availableKaraokes.sort((a, b) => a.distance - b.distance);

      // Chỉ lấy 3 quán gần nhất
      this.karaokes = nearestKaraokes.slice(0, 3);

      // Xóa các marker cũ
      this.karaokeMarkers.forEach(marker => this.map.removeLayer(marker));
      this.karaokeMarkers = [];

      // Hiển thị lại 3 quán karaoke gần nhất trên bản đồ
      this.karaokes.forEach(karaoke => {
        const marker = L.marker([karaoke.latitude, karaoke.longitude])
          .addTo(this.map)
          .bindPopup(`<b>${karaoke.ten_quan}</b><br>${karaoke.dia_chi}<br>Phòng trống: ${karaoke.so_phong_trong}`)
          .openPopup();

        this.karaokeMarkers.push(marker);
      });
    },





    locateKaraoke(karaoke) {
      // Kiểm tra xem quán karaoke có tọa độ hay không
      if (karaoke.latitude && karaoke.longitude) {
        // Di chuyển bản đồ đến vị trí của quán karaoke
        this.map.setView([karaoke.latitude, karaoke.longitude], 13);

        // Thêm marker cho quán karaoke
        L.marker([karaoke.latitude, karaoke.longitude])
          .addTo(this.map)
          .bindPopup(`<b>${karaoke.ten_quan}</b><br>${karaoke.dia_chi}`)
          .openPopup();
      } else {
        alert('Vị trí quán karaoke không có sẵn.');
      }
    },

    async fetchKaraokes() {
      try {
        const response = await axios.get('http://localhost:8080/api/karaokes/all');
        this.karaokes = response.data;
      } catch (err) {
        this.error = 'Không thể tải dữ liệu quán karaoke';
      } finally {
        this.loading = false;
      }
    },

    initMap() {
      this.$nextTick(() => {
        this.map = L.map('map').setView([10.029939, 105.770993], 14);  // Đặt vị trí mặc định là ĐH Cần Thơ

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              this.userLocation = [position.coords.latitude, position.coords.longitude];

              // Thêm marker cho vị trí người dùng nếu chưa có
              if (!this.userMarker) {
                this.userMarker = L.marker(this.userLocation)
                  .addTo(this.map)
                  .bindPopup('Vị trí của bạn')
                  .openPopup();
              }

              this.map.setView(this.userLocation, 14);  // Zoom vào vị trí người dùng
              await this.updateKaraokeDistances();
            },
            (err) => console.error(err)
          );
        } else {
          // Nếu không bật định vị, đặt vị trí mặc định là ĐH Cần Thơ
          this.userLocation = [10.029939, 105.770993];
          this.map.setView(this.userLocation, 14);
          this.userMarker = L.marker(this.userLocation)
            .addTo(this.map)
            .bindPopup('Trường Đại Học Cần Thơ (Mặc định)')
            .openPopup();
        }
      });
    },



async geocodeUserAddress() {
  if (!this.userAddress) {
    alert('Vui lòng nhập địa chỉ!');
    return;
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(this.userAddress)}&key=${this.geocodingApiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.results.length > 0) {
      const location = data.results[0].geometry;
      this.userLocation = [location.lat, location.lng];

      // Xóa marker cũ của người dùng (nếu có)
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      // Thêm marker mới
      this.userMarker = L.marker(this.userLocation)
        .addTo(this.map)
        .bindPopup('Vị trí của bạn')
        .openPopup();

      this.map.setView(this.userLocation, 14); // Zoom vào địa chỉ mới
      await this.updateKaraokeDistances();
    }
  } catch (err) {
    console.error('Lỗi geocode:', err);
  }
},


    async geocodeKaraokeAddress(karaoke) {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(karaoke.dia_chi)}&key=${this.geocodingApiKey}`;
      try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.results.length > 0) {
          karaoke.latitude = data.results[0].geometry.lat;
          karaoke.longitude = data.results[0].geometry.lng;
        }
      } catch (err) {
        console.error('Lỗi geocode:', err);
      }
    },

    async updateKaraokeDistances() {
      if (!this.userLocation) return;

      for (let karaoke of this.karaokes) {
        if (!karaoke.latitude || !karaoke.longitude) {
          await this.geocodeKaraokeAddress(karaoke);
        }

        if (karaoke.latitude && karaoke.longitude) {
          karaoke.distance = this.haversineDistance(this.userLocation, [karaoke.latitude, karaoke.longitude]);
        }
      }
    },

    haversineDistance([lat1, lon1], [lat2, lon2]) {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371; // Đơn vị km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Trả về khoảng cách km
    },

    async calculateRoute(karaoke) {
      if (!this.userLocation) {
        alert('Vui lòng nhập địa chỉ hoặc bật định vị!');
        return;
      }

      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${this.apiKey}&start=${this.userLocation[1]},${this.userLocation[0]}&end=${karaoke.longitude},${karaoke.latitude}`;

      try {
        const response = await axios.get(url);
        const routeData = response.data.routes[0];
        const route = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        L.polyline(route, { color: 'blue' }).addTo(this.map).bindPopup('Đường đi tới quán karaoke');
      } catch (err) {
        console.error('Lỗi tính toán đường đi:', err);
      }
    },
  },

  mounted() {
    this.initMap();
    this.fetchKaraokes();
  },
};
</script>

<style scoped>
/* Bố cục tổng thể: chia màn hình thành hai phần (map và carousel) */
.karaoke-list {
  display: flex;
  flex-wrap: wrap; /* Cho phép các phần tử con nằm trên nhiều dòng */
  gap: 10px; /* Khoảng cách giữa các quán karaoke */
  justify-content: space-between; /* Căn chỉnh các phần tử cách đều nhau */
}

/* Bản đồ nằm bên trái */
#map {
  width: 100%; /* 48% chiều rộng để đủ không gian cho carousel */
  height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* Container cho các phần tử input và button */
.input-button {
  display: flex;
  flex-direction: column; /* Sắp xếp các phần tử theo chiều dọc */
  align-items: center; /* Căn giữa tất cả các phần tử */
  gap: 5px; /* Khoảng cách giữa các phần tử */
  margin-bottom: 20px; /* Khoảng cách dưới cho container */
  margin-top: 10px;
}

/* Các phần tử con bên trong (input và button) */
.input-button div {
  display: flex;
  justify-content: center; /* Căn giữa các phần tử trong div */
  align-items: center; /* Căn giữa các phần tử theo chiều dọc */
  gap: 10px; /* Khoảng cách giữa ô nhập và nút */
}

/* Ô nhập địa chỉ */
.input-button input[type="text"] {
  padding: 10px;
  font-size: 1rem;
  border-radius: 15px;
  border: 1px solid #ccc;
  width: 570px; 
  box-sizing: border-box; /* Bao gồm padding vào tổng chiều rộng */
  transition: border-color 0.3s ease; /* Hiệu ứng chuyển màu viền */
}

/* Khi ô nhập được focus */
.input-button input[type="text"]:focus {
  border-color: #007bff; /* Thay đổi màu viền khi focus */
  outline: none; /* Xóa bỏ viền khi focus */
}

/* Nút tìm vị trí */
.input-button button {
  padding: 10px 20px;
  background-color: #435D76;
  color: white;
  font-size: 1rem;
  border: none;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu nền */
}

/* Khi hover lên nút */
.input-button button:hover {
  background-color: rgba(114, 153, 193, 0.8); /* Thay đổi màu nền khi hover */
}

/* Nút tìm quán gần đây */
.input-button button + button {
  background-color: rgba(114, 153, 193, 0.8); /* Màu nền cho nút tìm quán gần đây */
}

/* Khi hover lên nút tìm quán gần đây */
.input-button button + button:hover {
  background-color: rgba(114, 153, 193, 0.8); /* Thay đổi màu nền khi hover */
}



/* Carousel nằm bên phải */
#carouselExampleInterval {
  width: 50%; /* 48% chiều rộng để đủ không gian cho map */
  height: 500px;
}

/* Đảm bảo ảnh carousel không bị giãn */
.carousel-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Đảm bảo giao diện đẹp cho nút điều khiển carousel */
.carousel-control-prev, .carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  padding: 0px;
  font-size: 1.5rem;
}

/* Danh sách quán karaoke */
.karaoke-items-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Mỗi hàng có 4 quán */
  gap: 20px;
  margin-top: 20px;
  border: solid 2px #435D76;
  border-radius: 15px;
  padding: 15px;
}

/* Các phần tử con trong danh sách quán karaoke */
.karaoke-item {
  flex: 1 1 48%; /* Phần tử sẽ chiếm 48% chiều rộng và tự động điều chỉnh kích thước */
  /* background: linear-gradient(135deg, #435D76, #D4D4D5); Background gradient */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* height: 350px; Đảm bảo các ô quán có chiều cao đồng đều */
}

/* Khi hover lên một quán karaoke */
.karaoke-item:hover {
  transform: translateY(-5px); /* Đẩy quán lên nhẹ */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Tăng độ bóng */
}

/* Tên quán karaoke */
.karaoke-item h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* Các đoạn văn bản thông tin quán karaoke */
.karaoke-item p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
}

/* Thông tin địa chỉ, số điện thoại, số phòng trống */
.karaoke-item strong {
  color: #007bff; /* Màu xanh cho các từ khoá */
}

/* Hình ảnh quán karaoke */
.karaoke-item .karaoke-image {
  width: 100%;
  height: 200px; /* Đảm bảo các hình ảnh có chiều cao bằng nhau */
  /* object-fit: cover; Cắt hình ảnh sao cho phù hợp */
  border-radius: 8px;
  margin-top: 10px;
  transition: transform 0.3s ease;
}

/* Khi hover hình ảnh */
.karaoke-item .karaoke-image:hover {
  transform: scale(1.05); /* Phóng to hình ảnh khi hover */
}

/* Nút "Định vị quán karaoke" */
.karaoke-item button {
  background-color: #435D76; /* Màu xanh lá cho nút */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

/* Khi hover nút */
.karaoke-item button:hover {
  background-color: rgba(114, 153, 193, 0.8); /* Màu tối hơn khi hover */
}

/* Đảm bảo ảnh carousel vừa vặn */
.carousel-inner img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

/* Caption của carousel */
.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5); /* Nền tối cho caption */
  border-radius: 15px;
  padding: 10px;
}

/* Tên quán và số phòng trống trong caption */
.carousel-caption h5 {
  font-size: 1.25rem;
  color: white;
  font-weight: bold;
}

.carousel-caption p {
  font-size: 1rem;
  color: white;
}


/* Màu nền khi hover nút điều khiển */
.carousel-control-prev:hover, .carousel-control-next:hover {
  background-color: rgba(0, 0, 0, 0.7);
}


/* Responsive cho điện thoại */
@media (max-width: 768px) {
  /* Bố cục tổng thể */
  .karaoke-list {
    flex-direction: column; /* Chuyển từ hai cột thành một cột */
    gap: 20px;
  }

  /* Bản đồ */
  #map {
    width: 100%; /* Đảm bảo bản đồ chiếm toàn bộ chiều rộng màn hình */
    height: 300px; /* Điều chỉnh chiều cao bản đồ */
  }

  /* Carousel */
  #carouselExampleInterval {
    width: 100%; /* Carousel chiếm toàn bộ chiều rộng */
    height: 300px; /* Điều chỉnh chiều cao của carousel */
  }

  /* Input và Button */
  .input-button input[type="text"] {
    width: 100%; /* Đảm bảo input chiếm toàn bộ chiều rộng */
    font-size: 0.9rem; /* Điều chỉnh kích thước font chữ */
  }

  .input-button button {
    width: 100%; /* Đảm bảo các nút chiếm toàn bộ chiều rộng */
    font-size: 1rem;
  }

  /* Danh sách quán karaoke */
  .karaoke-items-container {
    margin: 220px 5px 5px;
    grid-template-columns: 1fr 1fr; /* Mỗi hàng có 2 quán karaoke */
  }

  .karaoke-item {
    flex: 1 1 100%; /* Mỗi quán chiếm toàn bộ chiều rộng */
    padding: 15px; /* Điều chỉnh padding cho nhỏ gọn */
  }

  /* Ảnh quán karaoke */
  .karaoke-item .karaoke-image {
    height: 150px; /* Điều chỉnh chiều cao ảnh cho phù hợp */
  }

  /* Carousel caption */
  .carousel-caption h5, .carousel-caption p {
    font-size: 1rem; /* Giảm kích thước font chữ */
  }

  /* Điều chỉnh kích thước nút điều khiển carousel */
  .carousel-control-prev, .carousel-control-next {
    padding: 5px;
  }

  /* Tên quán karaoke */
  .karaoke-item h2 {
    font-size: 1.2rem; /* Điều chỉnh kích thước font chữ */
  }
}

/* Responsive cho màn hình nhỏ hơn điện thoại (max-width: 480px) */
@media (max-width: 480px) {
  /* Tăng khoảng cách giữa các quán karaoke */
  .karaoke-items-container {
    grid-template-columns: 1fr; /* Mỗi hàng chỉ có 1 quán karaoke */
    padding: 10px; /* Điều chỉnh padding */
  }

  .karaoke-item {
    padding: 10px; /* Điều chỉnh padding */
    font-size: 0.9rem; /* Điều chỉnh font chữ nhỏ hơn */
  }

  /* Ảnh quán karaoke */
  .karaoke-item .karaoke-image {
    height: 120px; /* Điều chỉnh chiều cao ảnh cho phù hợp */
  }

  /* Các nút trong danh sách quán karaoke */
  .karaoke-item button {
    font-size: 0.9rem; /* Điều chỉnh kích thước nút */
  }

  /* Điều chỉnh kích thước input và button */
  .input-button input[type="text"], .input-button button {
    width: 100%; /* Chiếm toàn bộ chiều rộng */
    font-size: 0.9rem; /* Điều chỉnh kích thước font chữ */
  }

  .input-button button {
    margin-top: 10px; /* Khoảng cách giữa các nút */
  }
}




</style>
