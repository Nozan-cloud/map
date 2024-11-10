<template>  
  <view class="detail-container">  
    <image :src="imageUrl" class="detail-img" mode="aspectFit"></image>  
    <text class="detail-name">{{ imageName }}</text>  
    <button @click="goBack" class="back-button">返回</button>  
  </view>  
</template>  

<script>  
export default {  
  data() {  
    return {  
      imageUrl: '',  
      imageName: ''  
    }  
  },  
  onLoad(options) {  
    this.imageUrl = options.url;  
    this.imageName = options.name;  
  },  
  methods: {  
    goBack() {  
      uni.navigateBack();  
    }  
  }  
}  
</script>  

<style>  
.detail-container {  
  padding: 20px;  
  text-align: center;  
}  
.detail-img {  
  width: 100%;  
  height: auto;  
}  
.detail-name {  
  margin-top: 10px;  
  font-size: 18px;  
}  
.back-button {  
  margin-top: 20px;  
}  
</style>