<template>  
  <view class="container">  
    <view class="box" v-for="(item, index) in items" :key="index" @click="goToDetail(item)">  
      <image :src="item.image" class="box-image" />  
      <text class="box-title">{{ item.title }}</text>  
      <text class="box-summary">{{ item.summary }}</text>  
      <button @click="deleteItem(index)">删除</button>  
    </view>  
    <button class="add-button" @click="goToAdd">新增</button>  
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
.box-image {  
  width: 100%;  
  height: 200px;  
}  
.box-title {  
  font-size: 20px;  
  margin: 10px;  
}  
.box-summary {  
  color: #666;  
  margin: 0 10px 10px;  
}  
.add-button {  
  width: 100%;  
  height: 50px;  
  background-color: #007AFF;  
  color: #fff;  
  border: none;  
  border-radius: 5px;  
  text-align: center;  
  line-height: 50px;  
}  
</style>