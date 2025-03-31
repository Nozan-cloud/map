<template>
  <view class="container">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-mask">
      <view class="loading-content">
        <image src="/static/loading.gif" mode="aspectFit"></image>
        <text>数据加载中...</text>
      </view>
    </view>
    
    <!-- 首页导航栏 -->
    <view class="navbar">
      <view class="nav-item" v-for="(item, index) in navItems" :key="index" @click="navigateTo(item.jumpTo)">
        <view class="nav-icon-container">
          <image class="nav-icon" :src="item.img" mode="aspectFit"></image>
        </view>
        <text class="nav-text">{{item.title}}</text>
      </view>
    </view>

    <!-- 必玩景点轮播图 -->
    <view class="section feature-spots" v-if="featureSpots.length > 0">
      <view class="section-header">
        <text class="section-title">必玩景点</text>
        <view class="more" @click="toMore('scenic-spots')">
          <text>更多</text>
          <image class="more-icon" src="/static/right-arrow.png" mode="aspectFit"></image>
        </view>
      </view>

      <swiper class="swiper" 
              autoplay 
              circular 
              :indicator-dots="featureSpots.length > 1"
              :interval="3000"
              :duration="500">
        <swiper-item v-for="(item, index) in featureSpots" :key="index"
                    @click="redirectTo('scenic-spots',item.id)">
          <view class="spot-card">
            <image class="spot-image" :src="item.pictures[0].fileID" mode="aspectFill"></image>
            <view class="spot-overlay"></view>
            <view class="spot-content">
              <text class="spot-title">{{ item.title }}</text>
              <view class="location">
                <image class="location-icon" src="/static/location.png" mode="aspectFit"></image>
                <text class="location-text">{{ item.location || '位置信息未填写' }}</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 特色美食 -->
    <view class="section delicacies" v-if="delicacies.length > 0">
      <view class="section-header">
        <text class="section-title">特色美食</text>
        <view class="more" @click="toMore('foods')">
          <text>更多</text>
          <image class="more-icon" src="/static/right-arrow.png" mode="aspectFit"></image>
        </view>
      </view>
      <scroll-view class="food-scroll" scroll-x>
        <view class="food-grid">
          <view class="food-card" v-for="(item, index) in delicacies" :key="index" 
                @click="redirectTo('foods', item.id)">
            <image class="food-image" :src="item.pictures[0].fileID" mode="aspectFill"></image>
            <view class="food-overlay"></view>
            <text class="food-title">{{ item.title }}</text>
            <view class="food-price" v-if="item.priceRange">
              <text>{{ item.priceRange }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 文创 -->
    <view class="section cultural-creations" v-if="creations.length > 0">
      <view class="section-header">
        <text class="section-title">文创产品</text>
        <view class="more" @click="toMore('products')">
          <text>更多</text>
          <image class="more-icon" src="/static/right-arrow.png" mode="aspectFit"></image>
        </view>
      </view>
      <view class="creations-grid">
        <view class="creation-card" v-for="(item, index) in creations" :key="index" 
              @click="redirectTo('products',item.id)">
          <image class="creation-image" :src="item.pictures[0].fileID" mode="aspectFill"></image>
          <view class="creation-info">
            <text class="creation-title">{{ item.title }}</text>
            <text class="creation-desc" v-if="item.description">{{ item.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="!isLoading && featureSpots.length === 0 && delicacies.length === 0 && creations.length === 0" 
          class="empty-state">
      <image class="empty-image" src="/static/empty.png" mode="aspectFit"></image>
      <text class="empty-text">暂无数据，稍后再试</text>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request.js';

export default {
  data() {
    return {
      navItems: [
        {
          id: 1,
          img: "/static/nav-travel.png",
          title: "攻略游记",
          jumpTo: "/pages/uni-cloud-map/uni-cloud-map"
        },
        {
          id: 2,
          img: "/static/nav-guide.png",
          title: "图鉴",
          jumpTo: "/pages/tujian2/list"
        },
        {
          id: 3,
          img: "/static/nav-product.png",
          title: "文创产品",
          jumpTo: "/pages/wait/wait"
        },
        {
          id: 4,
          img: "/static/nav-more.png",
          title: "更多",
          jumpTo: "/pages/wait/wait"
        }
      ],
      featureSpots: [],
      delicacies: [],
      creations: [],
      isLoading: true
    };
  },
  methods: {
    navigateTo(jumpTo) {
      if (jumpTo === "/pages/uni-cloud-map/uni-cloud-map") {
        uni.switchTab({ url: jumpTo });
        return;
      }
      uni.navigateTo({ url: jumpTo });
    },
    redirectTo(type, id) {
      uni.navigateTo({
        url: `/pages/detail-pages/detail-pages?type=${type}&id=${id}`
      });
    },
    toMore(db) {
      uni.navigateTo({ url: '/pages/allArt/index?db=' + db });
    },
    async getDataFood() {
      try {
        const data = await request({ url: '/foods', method: 'GET', data: { limit: 6 } });
        this.delicacies = this.formatData(data);
      } catch (error) {
        console.error('获取美食数据失败:', error);
        uni.showToast({ title: '获取美食数据失败', icon: 'none' });
      }
    },
    async getDataSpot() {
      try {
        const data = await request({ url: '/scenic-spots', method: 'GET', data: { limit: 4 } });
        this.featureSpots = this.formatData(data);
      } catch (error) {
        console.error('获取景点数据失败:', error);
        uni.showToast({ title: '获取景点数据失败', icon: 'none' });
      }
    },
    async getDataPro() {
      try {
        const data = await request({ url: '/products', method: 'GET', data: { limit: 2 } });
        this.creations = this.formatData(data);
      } catch (error) {
        console.error('获取文创数据失败:', error);
        uni.showToast({ title: '获取文创数据失败', icon: 'none' });
      }
    },
    formatData(items) {
      return items.map(item => ({
        ...item,
        pictures: item.pictures ? item.pictures.map(url => ({ fileID: url })) : []
      }));
    }
  },
  async onLoad() {
    uni.showLoading({ title: '加载中...', mask: true });
    try {
      await Promise.all([this.getDataFood(), this.getDataSpot(), this.getDataPro()]);
    } catch (e) {
      console.error('初始化数据失败:', e);
    } finally {
      this.isLoading = false;
      uni.hideLoading();
    }
  }
};
</script>

<style lang="scss">
$primary-color: #13742F;
$secondary-color: #4CAF50;
$text-color: #333;
$light-text: #666;
$border-radius: 12rpx;
$box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
$transition: all 0.3s ease;

.container {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.nav-icon-container {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10rpx;
}

.nav-icon {
  width: 60rpx;
  height: 60rpx;
}

.nav-text {
  font-size: 24rpx;
  color: $text-color;
}

/* 通用区块样式 */
.section {
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: $border-radius;
  padding: 20rpx;
  box-shadow: $box-shadow;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-color;
  position: relative;
  padding-left: 20rpx;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 32rpx;
    background-color: $primary-color;
    border-radius: 4rpx;
  }
}

.more {
  display: flex;
  align-items: center;
  color: $light-text;
  font-size: 26rpx;
}

.more-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
}

/* 轮播图样式 */
.swiper {
  width: 100%;
  height: 400rpx;
  border-radius: $border-radius;
  overflow: hidden;
}

.spot-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: $border-radius;
  overflow: hidden;
}

.spot-image {
  width: 100%;
  height: 100%;
}

.spot-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.spot-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  color: #fff;
}

.spot-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.location {
  display: flex;
  align-items: center;
}

.location-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
}

.location-text {
  font-size: 24rpx;
  opacity: 0.9;
}

/* 美食横向滚动 */
.food-scroll {
  white-space: nowrap;
  width: 100%;
}

.food-grid {
  display: inline-flex;
}

.food-card {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  margin-right: 20rpx;
  border-radius: $border-radius;
  overflow: hidden;
  display: inline-block;
  &:last-child {
    margin-right: 0;
  }
}

.food-image {
  width: 100%;
  height: 100%;
}

.food-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.food-title {
  position: absolute;
  bottom: 60rpx;
  left: 0;
  right: 0;
  padding: 0 20rpx;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-price {
  position: absolute;
  bottom: 20rpx;
  left: 20rpx;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: $primary-color;
}

/* 文创产品网格 */
.creations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.creation-card {
  background-color: #fff;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: $transition;
  &:active {
    transform: scale(0.98);
  }
}

.creation-image {
  width: 100%;
  height: 200rpx;
}

.creation-info {
  padding: 20rpx;
}

.creation-title {
  font-size: 28rpx;
  font-weight: bold;
  color: $text-color;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.creation-desc {
  font-size: 24rpx;
  color: $light-text;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 加载状态 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-content image {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.loading-content text {
  color: $light-text;
  font-size: 28rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  opacity: 0.5;
  margin-bottom: 30rpx;
}

.empty-text {
  color: $light-text;
  font-size: 28rpx;
}
</style>