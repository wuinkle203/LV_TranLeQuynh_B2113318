<template>
    <div id="carouselExample" class="carousel slide" data-ride="carousel" data-interval="3000">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="https://via.placeholder.com/800x400?text=Image+1" class="d-block w-100" alt="Image 1">
        </div>
        <div class="carousel-item">
          <img src="https://via.placeholder.com/800x400?text=Image+2" class="d-block w-100" alt="Image 2">
        </div>
        <div class="carousel-item">
          <img src="https://via.placeholder.com/800x400?text=Image+3" class="d-block w-100" alt="Image 3">
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExample" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExample" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </template>
  
  <script>
  export default {
    name: "ImageCarousel"
  };
  </script>
  
  <style scoped>
  .carousel-inner {
    width: 100%;
    height: 0px; /* Bạn có thể điều chỉnh chiều cao của carousel */
  }
  
  .carousel-item img {
    object-fit: cover;
    height: 100%;
  }
  </style>
  