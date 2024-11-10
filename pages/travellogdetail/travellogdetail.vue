<template>  
  <view class="container">  
    <image :src="image" class="detail-image" />  
    <text class="detail-title">{{ title }}</text>  
    <text class="detail-content">{{ content }}</text>  
  </view>  
</template>  

<script>  
export default {  
  data() {  
    return {  
      title: '',  
      content: '',  
      image: ''  
    };  
  },  
  onLoad(options) {  
    this.title = options.title;  
    this.content = options.content;  
    this.image = options.image;  
  }  
}  
</script>  

<style>  
.container {  
  padding: 10px;  
}  
.detail-image {  
  width: 100%;  
  height: 300px;  
}  
.detail-title {  
  font-size: 24px;  
  margin: 10px 0;  
}  
.detail-content {  
  color: #333;  
}  
</style>