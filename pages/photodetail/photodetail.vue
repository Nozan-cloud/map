<template>  
  <view class="detail-container">  
    <image :src="imageSrc" class="detail-img" mode="aspectFit"></image>  
    <text class="detail-name">{{ imageName }}</text>  
    <button @click="goBack" class="back-button">返回</button>  
  </view>  
</template>  

<script>  
export default {  
  data() {  
    return {  
      imageSrc: '',  
      imageName: ''  
    }  
  },  
  onLoad(options) {  
    this.imageSrc = options.src;  
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
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 子元素在水平方向上居中 */
  padding: 20px;
}

.detail-img {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 10px; /* 照片与文字之间的间距 */
}

.detail-name {
  margin-top: 0; /* 移除原有的上边距 */
  font-size: 24px;
  font-weight: bold;
}

.back-button {  
  margin-top: 20px;  
}  
</style>