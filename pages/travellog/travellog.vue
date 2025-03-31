<template>  
  <view class="container">  
    <view class="box" v-for="(item, index) in items" :key="index" @click="goToDetail(item)">  
      <view class="content">  
        <image :src="item.image" class="box-image" />  
        <view class="text-container">  
          <text class="box-title">{{ item.title }}</text>  
		  <br>
          <text class="box-summary">{{ item.summary }}</text>  
        </view>  
      </view>  
      <button class="delete-button" @click.stop="deleteItem(index)">删除</button>  
    </view>  
    <image class="add-button" @click="goToAdd" src="/static/image/圈子.png" />  
  </view>  
</template>  

<script>  
export default {  
  data() {  
    return {  
      items: [] // 用于存储Box数据  
    };  
  },  
  onLoad() {  
    // 这里可以从 storage 或 API 获取数据  
    this.loadItems();  
  },  
  methods: {  
    loadItems() {  
      const savedItems = uni.getStorageSync('items') || [];  
      this.items = savedItems;  
    },  
	goToDetail(item) {  
		uni.navigateTo({  
		url: `/pages/travellogdetail/travellogdetail?title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.content)}&image=${encodeURIComponent(item.image)}`  
	});  
	},   
    goToAdd() {  
      uni.navigateTo({  
        url: '/pages/addtravellog/addtravellog'  
      });  
    },  
    deleteItem(index) {  
      this.items.splice(index, 1); // 从数组中删除指定索引的项  
      uni.setStorageSync('items', this.items); // 更新本地存储  
    }  
  }  
}  
</script>  

<style>  
.container {  
  padding: 10px;  
}  

.box {  
  margin-bottom: 15px;  
  border: 1px solid #ccc;  
  border-radius: 5px;  
  overflow: hidden;  
}  

.content {  
  display: flex;  
  align-items: flex-start;  
}  

.box-image {  
  width: 150px;  /* 设置图片宽度 */  
  height: 100px; /* 设置图片高度 */  
  margin-right: 10px; /* 右边距 */  
}  

.text-container {  
  flex: 1; /* 占据剩余空间 */  
}  

.box-title {  
  font-size: 22px;  /* 增大标题字体大小 */  
  font-weight: bold; /* 加粗标题 */  
  margin: 0;  
}  

.box-summary {  
  color: #666;  
  margin-top: 5px; /* 标题和简介之间的间距 */  
}  

.delete-button {  
  margin-top: 0px; /* 按钮上方的间距 */  
}  

.add-button {  
  position: fixed;  
  right: 20px;  
  bottom: 20px;  
  width: 60px;  
  height: 60px;  
  border-radius: 30px;  
  background-color: transparent;  
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);  
}  
</style>