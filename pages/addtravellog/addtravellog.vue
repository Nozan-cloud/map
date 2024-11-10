<template>  
  <view class="container">  
    <input v-model="image" placeholder="图片链接" />  
    <input v-model="title" placeholder="标题" />  
    <input v-model="summary" placeholder="简介" />  
    <textarea v-model="content" placeholder="文章内容" />  
    <button @click="addItem">添加</button>  
    <text v-if="errorMessage" class="error">{{ errorMessage }}</text>  
  </view>  
</template>  

<script>  
export default {  
  data() {  
    return {  
      image: '',  
      title: '',  
      summary: '',  
      content: '',  
      errorMessage: '' // 用于存储错误信息  
    };  
  },  
  methods: {  
    addItem() {  
      // 清空错误信息  
      this.errorMessage = '';  

      // 输入有效性检查  
      if (!this.image || !this.title || !this.summary || !this.content) {  
        this.errorMessage = '请填写所有字段！';  
        return; // 如果有字段未填，则不继续添加  
      }  

      // 创建新项  
      const newItem = {  
        image: this.image,  
        title: this.title,  
        summary: this.summary,  
        content: this.content  
      };  

      // 从本地存储中获取当前项目，或初始化为空数组  
      const items = uni.getStorageSync('items') || [];  
      items.push(newItem); // 添加新项目  
      uni.setStorageSync('items', items); // 更新本地存储  

      // 自动跳转回 travellog 页面  
      uni.navigateTo({  
        url: '/pages/travellog/travellog' // 请根据实际页面路径更新  
      });  
    }  
  }  
}  
</script>  

<style>  
.container {  
  padding: 20px;  
}  
input, textarea {  
  width: 100%;  
  margin-bottom: 10px;  
  border: 1px solid #ccc;  
  padding: 10px;  
}  
button {  
  background-color: #007AFF;  
  color: white;  
  border: none;  
  padding: 10px;  
  width: 100%;  
}  
.error {  
  color: red;  
  margin-top: 10px;  
}  
</style>