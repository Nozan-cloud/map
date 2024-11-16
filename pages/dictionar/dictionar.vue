<template>  
  <view class="container">  
    <view class="image-list">  
      <view v-for="item in images" :key="item.id" class="image-item" @click="navigateToDetail(item)">  
        <image :src="item.path" class="img" mode="aspectFill"></image>  
        <text class="image-name">{{ item.name }}</text>  
      </view>  
    </view>  
    
    <view class="add-button" @click="navigateToAdd">  
      <image src="/static/image/圈子.png" class="add-icon"></image> <!-- 添加图标 -->  
    </view>  
  </view>  
</template>  

<script>  
export default {  
  data() {  
    return {  
      images: [] // 存储从云端获取的图片数据  
    };  
  },  
  onLoad() {  
    this.fetchImages(); // 页面加载时获取图片数据  
  },  
  methods: {  
    async fetchImages() {  
      try {  
        const res = await uniCloud.callFunction({  
          name: 'getImages', // 云函数名称  
        });  
        
        if (res.result.code === 0) {  
          this.images = res.result.data; // 设置数据  
        } else {  
          console.error('获取图片数据失败:', res.result.message);  
        }  
      } catch (error) {  
        console.error('云函数调用错误:', error);  
      }  
    },  
    navigateToDetail(item) {  
      uni.navigateTo({  
        url: `/pages/photodetail/photodetail?name=${encodeURIComponent(item.name)}&src=${encodeURIComponent(item.path)}`  
      });  
    },  
    navigateToAdd() {  
      uni.navigateTo({  
        url: '/pages/uploadpic/uploadpic' // 跳转到上传页面  
      });  
    }  
  }  
};  
</script>  

<style>  
.container {  
  padding: 50px;  
  background-color: #f9f9f9;  
}  
.image-list {  
  display: flex;  
  flex-wrap: wrap;  
  justify-content: space-between;  
}  
.image-item {  
  width: 40%;  
  margin: 10px;  
  text-align: center;  
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);  
}  
.img {  
  width: 100px;  
  height: 100px;  
  object-fit: cover;  
}  
.image-name {  
  margin-top: 10px;  
  font-size: 18px;  
  color: #333;  
  font-weight: bold;  
}  
.add-button {  
  position: fixed;  
  right: 20px;  
  bottom: 20px;  
  width: 60px;  
  height: 60px;  
  border-radius: 30px;  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);  
}  
.add-icon {  
  width: 40px;  
  height: 40px;  
}  
</style>