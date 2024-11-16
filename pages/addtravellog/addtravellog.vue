<template>  
  <view class="container">  
    <view class="image-preview" v-if="image">  
      <image :src="image" mode="aspectFill"></image> <!-- 显示选择的图片 -->  
    </view>  
    
    <button class="upload-button" @click="chooseImage">选择图片</button>  

    <input v-model="title" placeholder="标题" />  
    <input v-model="summary" placeholder="简介" />  
    <textarea v-model="content" placeholder="文章内容" />  
    
    <button class="add-button" @click="addItem">添加</button>  
    
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
    chooseImage() {  
      uni.showActionSheet({  
        itemList: ['使用相机', '选择本地文件'],  
        success: (res) => {  
          if (res.tapIndex === 0) {  
            this.selectImageFromCamera();  
          } else if (res.tapIndex === 1) {  
            this.selectImageFromAlbum();  
          }  
        },  
        fail: (err) => {  
          console.error("选择方式失败:", err);  
          this.errorMessage = '无法选择图片，请重试'; // 有错误时更新错误信息  
        }  
      });  
    },  
    selectImageFromCamera() {  
      uni.chooseImage({  
        count: 1,  
        sourceType: ['camera'], // 只选择相机  
        success: (res) => {  
          const tempFilePath = res.tempFilePaths[0];  
          this.uploadImage(tempFilePath);  
        },  
        fail: (err) => {  
          console.error("选择相机图片失败:", err);  
          this.errorMessage = '无法选择图片，请重试'; // 有错误时更新错误信息  
        }  
      });  
    },  
    selectImageFromAlbum() {  
      uni.chooseImage({  
        count: 1,  
        sourceType: ['album'], // 选择本地相册  
        success: (res) => {  
          const tempFilePath = res.tempFilePaths[0];  
          this.uploadImage(tempFilePath);  
        },  
        fail: (err) => {  
          console.error("选择相册图片失败:", err);  
          this.errorMessage = '无法选择图片，请重试'; // 有错误时更新错误信息  
        }  
      });  
    },  
    uploadImage(filePath) {  
      uniCloud.uploadFile({  
        cloudPath: `Lvto/攻略游记/${this.image}.png`, // 文件保存路径  
        filePath: filePath,  
        success: (uploadResult) => {  
          this.image = uploadResult.fileID; // 获取文件ID（即文件路径）  
        },  
        fail: (err) => {  
          console.error("上传图片失败:", err);  
          this.errorMessage = '上传图片失败，请重试'; // 有错误时更新错误信息  
        }  
      });  
    },  
    addItem() {  
      this.errorMessage = '';  

      if (!this.image || !this.title || !this.summary || !this.content) {  
        this.errorMessage = '请填写所有字段！';  
        return;  
      }  

      const newItem = {  
        image: this.image,  
        title: this.title,  
        summary: this.summary,  
        content: this.content  
      };  

      const items = uni.getStorageSync('items') || [];  
      items.push(newItem);  
      uni.setStorageSync('items', items);  

      uni.navigateTo({  
        url: '/pages/travellog/travellog'  
      });  
    }  
  }  
}  
</script>  

<style>  
.container {  
  padding: 20px;  
}  

.image-preview {  
  width: 100%;  
  height: 200px; /* 设置固定高度 */  
  margin-bottom: 10px;  
  background-color: #f0f0f0; /* 背景颜色 */  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  

.image-preview image {  
  width: 100%;  
  height: 100%;  
  object-fit: cover; /* 使图片填充且保持比例 */  
}  

.upload-button, .add-button {  
  background-color: #28a745; /* 绿色背景 */  
  color: white;  
  border: none;  
  padding: 10px;  
  width: 100%;  
  margin-bottom: 10px; /* 下边距，让按钮之间有间隔 */  
}  

input, textarea {  
  width: 100%;  
  margin-bottom: 10px;  
  border: 1px solid #ccc;  
  padding: 10px;  
}  

.error {  
  color: red;  
  margin-top: 10px;  
}  
</style>