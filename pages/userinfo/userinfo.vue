<template>
  <view class="userinfo-container">
    <view class="avatar-section">
      <view class="avatar-wrapper" @click="changeAvatar">
        <image class="avatar" :src="form.avatar" mode="aspectFill"></image>
        <text class="iconfont icon-a-21-xiugai"></text>
      </view>
    </view>
    
    <view class="form-section">
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="form.nickname" placeholder="请输入昵称" />
      </view>
      <view class="form-item">
        <text class="label">注册时间</text>
        <text class="static-text">{{ formatDate(userInfo.createTime) }}</text>
      </view>
    </view>

    <button class="save-btn" @click="saveUserInfo">保存修改</button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { formatDate } from '@/utils/util'

export default {
  data() {
    return {
      userInfo: {},
      form: {
        avatar: '/static/image/我的 (1).png',
        nickname: ''
      }
    }
  },
  onLoad() {
    this.loadUserInfo()
  },
  methods: {
    formatDate,
    
    // 加载用户信息
    async loadUserInfo() {
      try {
        const res = await request({
          url: '/user/me',
          method: 'GET'
        })
        if (res.code === 200) {
          this.userInfo = res.data
          this.form = {
            avatar: res.data.avatar || this.form.avatar,
            nickname: res.data.nickname || ''
          }
        }
      } catch (e) {
        console.error('获取用户信息失败', e)
        uni.showToast({ title: '信息加载失败', icon: 'none' })
      }
    },

    // 保存修改
    async saveUserInfo() {
      if (!this.form.nickname.trim()) {
        uni.showToast({ title: '昵称不能为空', icon: 'none' })
        return
      }
      
      try {
        const res = await request({
          url: '/user/update',
          method: 'POST',
          data: {
            nickname: this.form.nickname,
            avatar: this.form.avatar
          }
        })
        
        if (res.code === 200) {
          uni.showToast({ title: '修改成功' })
          setTimeout(() => uni.navigateBack(), 1500)
        }
      } catch (e) {
        console.error('保存失败', e)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },

    // 修改头像（示例）
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.form.avatar = res.tempFilePaths[0]
          // 此处应实现上传逻辑，需补充上传API
        }
      })
    }
  }
}
</script>

<style lang="scss">
.userinfo-container {
  padding: 30rpx;
  
  .avatar-section {
    display: flex;
    justify-content: center;
    margin: 60rpx 0;
    
    .avatar-wrapper {
      position: relative;
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      overflow: hidden;
      
      .avatar {
        width: 100%;
        height: 100%;
      }
      
      .iconfont {
        position: absolute;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        color: white;
        padding: 10rpx;
        border-radius: 50%;
      }
    }
  }

  .form-section {
    background: white;
    border-radius: 20rpx;
    padding: 0 30rpx;
    
    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100rpx;
      border-bottom: 1rpx solid #eee;
      
      .label {
        font-size: 32rpx;
        color: #333;
      }
      
      .input {
        flex: 1;
        text-align: right;
        padding: 0 20rpx;
      }
      
      .static-text {
        color: #888;
      }
    }
  }

  .save-btn {
    margin: 60rpx 30rpx;
    background: #13742F;
    color: white;
    border-radius: 50rpx;
  }
}
</style>