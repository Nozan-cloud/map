<template>  
  <view class="container">  
    <image :src="image" class="detail-image" />  
    <text class="detail-title">{{ title }}</text>  
	<br>
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
/* .container {  
  padding: 10px;  
}  */
.container { /* 假设这是包含图片和标题的父容器 */
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  padding: 10px;  
}

.detail-image {  
  width: 100%;  
  height: 300px;  
  object-fit: cover;
}  

.detail-title {
  font-size: 24px;
  margin: 4px 0; /* 上下外边距为10px */
  /* align-items: center; * 这行是多余的，因为.detail-title是一个块级元素，不需要align-items */
  /* text-align: center; * 这行其实可以在.container上设置一次，这样所有文本子元素都会居中 */
}
.detail-content {  
  color: #333;  
}  
</style>