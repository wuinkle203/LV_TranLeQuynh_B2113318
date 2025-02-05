<template>
  <div class="karaoke-list">
    <h1>Danh sách quán karaoke gần bạn</h1>
    <div v-if="loading" class="loading">Đang tải quán karaoke...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Hiển thị bản đồ -->
    <div id="map" style="height: 500px;"></div>

    <!-- Nhập địa chỉ người dùng -->
    <div>
      <input type="text" v-model="userAddress" placeholder="Nhập địa chỉ của bạn" />
      <button @click="geocodeUserAddress">Tìm vị trí</button>
    </div>

    <!-- Thêm nút tìm quán gần đây -->
    <div>
      <button @click="findNearestKaraokes">Tìm quán gần đây</button>
    </div>

    <div v-for="karaoke in sortedKaraokes" :key="karaoke._id" class="karaoke-item">
      <h2>{{ karaoke.ten_quan }}</h2>
      <p><strong>Khoảng cách:</strong> {{ karaoke.distance ? karaoke.distance.toFixed(2) : 'Đang tính...' }} km</p>
      <p><strong>Địa chỉ:</strong> {{ karaoke.dia_chi }}</p>
      <p><strong>Số điện thoại:</strong> {{ karaoke.so_dien_thoai }}</p>
      <p><strong>Số phòng trống:</strong> {{ karaoke.so_phong_trong }}</p> <!-- Thêm dòng này -->
      <img :src="'http://localhost:8080/uploads/' + karaoke.hinh_anh_quan" alt="Karaoke Image" class="karaoke-image" />
      <button @click="locateKaraoke(karaoke)">Định vị quán karaoke</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default {
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

    async findNearestKaraokes() {
  if (!this.userLocation) {
    alert('Vui lòng nhập địa chỉ hoặc bật định vị!');
    return;
  }

  // Cập nhật khoảng cách của tất cả quán karaoke
  await this.updateKaraokeDistances();

  // Lọc ra quán karaoke có ít nhất một phòng trống
  const availableKaraokes = this.karaokes.filter(k => k.so_phong_trong > 0);

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
    this.map = L.map('map').setView([10.0312, 105.7415], 14);  // Tăng mức zoom lên 14

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.userLocation = [position.coords.latitude, position.coords.longitude];

          // Thêm marker cho vị trí người dùng nếu chưa có
          if (!this.userMarker) {
            this.userMarker = L.marker(this.userLocation, { icon: L.icon({ iconUrl: 'https://example.com/user-icon.png', iconSize: [32, 32] }) })
              .addTo(this.map)
              .bindPopup('Vị trí của bạn')
              .openPopup();
          }

          this.map.setView(this.userLocation, 14);  // Zoom vào vị trí người dùng
          await this.updateKaraokeDistances();
        },
        (err) => console.error(err)
      );
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
.karaoke-list {
  /* max-width: 800px; */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #333;
}

.loading, .error {
  font-size: 18px;
  font-weight: bold;
  color: red;
  margin: 10px 0;
}

#map {
  width: 100%;
  height: 500px;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  width: 70%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.karaoke-item {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.karaoke-item h2 {
  color: #333;
  margin-bottom: 5px;
}

.karaoke-item p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

.karaoke-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 10px;
}

</style>
