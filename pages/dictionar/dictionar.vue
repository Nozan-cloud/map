<template>
  <view class="container">
    <view class="image-list">
      <view v-for="item in images" :key="item.id" class="image-item" @click="navigateToDetail(item)">
       <image:src="item.src" class="img" mode="aspectFill"></image>
        <text class="image-name">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { id: 1, name: '黄花风铃木', src: '/static/image/黄花风铃木.png' },
        { id: 2, name: '紫荆', src: '/static/image/紫荆.png' },
        { id: 3, name: '三角梅', src: '/static/image/三角梅.png' },
        // 更多图片...
      ]
    };
  },
  methods: {
    navigateToDetail(item) {
      uni.navigateTo({
        url: `/pages/photodetail/photodetail?name=${encodeURIComponent(item.name)}&url=${encodeURIComponent(item.url)}`
      });
    }
  }
};
</script>

<style>
.container {
  padding: 10px;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
}
.image-item {
  width: 30%;
  margin: 5px;
  text-align: center;
}
.img {
  width: 100%;
  height: auto;
}
.image-name {
  margin-top: 5px;
  font-size: 16px;
}
</style>