<template>
<view class="user">
  <view class="top">
    <view class="group" @click="toUserInfo">
      <view class="userinfo">
        <view class="pic">
          <image v-if="hasLogin&&userInfo.avatar" :src="userInfo.avatar" mode="aspectFill" width="120rpx" height="120rpx"></image>
          <image v-else src="/static/image/我的 (1).png" mode="aspectFill"></image>
        </view>
        <view class="text" v-if="hasLogin">
          <view class="nickname">{{userInfo.nickname||userInfo.username||userInfo.phone}}</view>
          <view class="year">
            {{formatDate(userInfo.createTime)}}我的
          </view>
        </view>
        <view class="text" v-else>
          <view class="nickname">点击登录</view>
        </view>
      </view>
      <view class="more">
        <text class="iconfont icon-a-10-you"></text>
      </view>
    </view>
    
    <view class="bg">                
      <image class="_image" v-if="hasLogin&&userInfo.avatar" :src="userInfo.avatar" width="100%" height="100%" mode="aspectFill"></image>
      <image class="_image" v-else src="/static/image/我的 (1).png" mode="aspectFill"></image>
    </view>
  </view>
  
  <view class="main">
    <view class="info">
      <view class="item"><text>{{totalObj.likeNum}}</text>获赞</view>
      <view class="item"><text>{{totalObj.artNum}}</text>发文</view>
    </view>
    
    <view class="list">
      <view class="group">          
        <view class="item" @click="myArticle">
          <view class="left"><text class="iconfont icon-a-24-bianji"></text><text class="text">我发布的</text></view>
          <view class="right"><text class="iconfont icon-a-10-you"></text></view>
        </view>
        <view class="item" @click="myLike">
          <view class="left"><text class="iconfont icon-a-106-xihuan"></text><text class="text">我的点赞</text></view>
          <view class="right"><text class="iconfont icon-a-10-you"></text></view>
        </view>
        <view class="item">
          <view class="left"><text class="iconfont icon-a-21-xiugai"></text><text class="text">评论过的</text></view>
          <view class="right"><text class="iconfont icon-a-10-you"></text></view>
        </view>
      </view>
      
      <view class="group">
        <view class="item">
          <view class="left"><text class="iconfont icon-a-32-wenjian"></text><text class="text">关于</text></view>
          <view class="right"><text class="iconfont icon-a-10-you"></text></view>
        </view>    
        <view class="item" @click="goFeedback">
          <view class="left"><text class="iconfont icon-a-5-xinxi"></text><text class="text">意见反馈</text></view>
          <view class="right"><text class="iconfont icon-a-10-you"></text></view>
        </view>  
      </view>
      
      <view class="group">
        <view class="item" @click="logout">
          <view class="left"><text class="iconfont icon-a-73-tuichu"></text><text class="text">退出登录</text></view>
          <view class="right"><text class="iconfont icon-a-10-you"></text></view>
        </view>          
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { request } from '@/utils/request'
import { formatDate } from '@/utils/util'

export default {
  data() {
    return {
      userInfo: {},
      hasLogin: false,
      totalObj: {
        artNum: 0,
        likeNum: 0
      }
    }
  },
  onShow() {
    this.checkLogin()
    if (this.hasLogin) {
      this.getUserInfo()
      this.getTotal()
    }
  },
  methods: {
    formatDate,
    
    // 检查登录状态
    checkLogin() {
      this.hasLogin = !!uni.getStorageSync('token')
    },
    
    // 获取用户信息
      async getUserInfo() {
        try {
          const res = await request({
            url: '/user/me',
            method: 'GET'
          })
          if (res.code === 200) {
            this.userInfo = res.data
            // 自动计算注册时长
            this.userInfo.createTime = this.userInfo.createTime || Date.now()
          }
        } catch (e) {
          console.error('获取用户信息失败', e)
        }
      },
    
    // 获取统计数据
    async getTotal() {
      try {
        const res = await request({
          url: '/user/stats',
          method: 'GET'
        })
        if (res.code === 200) {
          this.totalObj = res.data
        }
      } catch (e) {
        console.error('获取统计数据失败', e)
      }
    },
    
    // 退出登录
    logout() {
      if (!this.hasLogin) {
        uni.showToast({
          title: '未登录',
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '是否确认退出?',
        success: async (res) => {
          if (res.confirm) {
            try {
              await request({
                url: '/user/logout',
                method: 'POST'
              })
              uni.removeStorageSync('token')
              this.hasLogin = false
              this.userInfo = {}
              uni.showToast({
                title: '退出成功',
                icon: 'success'
              })
            } catch (e) {
              console.error('退出登录失败', e)
            }
          }
        }
      })
    },
    
    // 跳转到我的文章
    myArticle() {
      if (!this.hasLogin) {
        this.goLoginPage()
        return
      }
      uni.navigateTo({
        url: '/pages/quanzi-articles/list'
      })
    },
    
    // 跳转到点赞
    myLike() {
      if (!this.hasLogin) {
        this.goLoginPage()
        return
      }
      uni.navigateTo({
        url: '/pages/quanzi_like/list'
      })
    },
    
    // 意见反馈
    goFeedback() {
      if (!this.hasLogin) {
        this.goLoginPage()
        return
      }
      uni.navigateTo({
        url: '/pages/feedback/feedback'
      })
    },
    
    // 编辑个人资料
    toUserInfo() {
      if (this.hasLogin) {
        // 存储当前页面路径用于返回
        uni.setStorageSync('redirectUrl', `/${this.$mp.page.route}`)
        uni.navigateTo({
          url: '/pages/userinfo/userinfo'
        })
      } else {
        uni.navigateTo({
          url: `/pages/login/login?redirect=/${this.$mp.page.route}`
        })
      }
    },
    
    // 检查登录状态并跳转
    goLoginPage() {
      if (!this.hasLogin) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        uni.navigateTo({
          url: '/pages/login/login'
        })
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
/* 保持原有的样式不变 */
.user{
  .top{
    height: 300rpx;
    background: #bbb;
    padding:0 30rpx;
    padding-top:var(--status-bar-height);
    position: relative;
    display: flex;
    align-items: center;
    .group{
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      color:#fff;
      .userinfo{
        display: flex;
        width: 100%;        
        align-items: center;        
        .pic{
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
          overflow: hidden;
          border:2px solid #fff;
          image{
            width: 100%;
            height: 100%;
          }
        }
        .text{
          padding-left:20rpx;
          .nickname{
            font-size: 44rpx;
            font-weight: 600;
          }
          .year{
            font-size: 26rpx;
            opacity: 0.6;
            padding-top:5rpx;
          }
        }
      }
      .more{
        .iconfont{
          font-size: 40rpx;
        }
      }
    }
    .bg{
      position: absolute;
      top: 0;
      left:0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      ._image{
        width: 100%;
        height: 100%;
        filter: blur(10px);
        transform: scale(2);
        opacity: 0.8;
      }
    }
  }
  .main{
    width: 100%;
    min-height: 200rpx;
    background: #fff;
    border-radius: 30rpx;
    transform:translateY(-30rpx);
    padding:30rpx 0;
    .info{
      padding:10rpx 30rpx;
      display: flex;
      font-size: 30rpx;
      .item{
        padding-right: 20rpx;
        color:#888;
        text{
          font-weight: 600;
          color:#333;
        }
      }
    }
    .list{
      .group{
        padding:15rpx 30rpx;
        border-bottom:15rpx solid #f4f4f4;
        .item{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding:25rpx 0;
          font-size: 36rpx;
          color:#555;
          border-bottom:1rpx solid #f8f8f8;
          .left{
            display: flex;
            align-items: center;
            .iconfont{
              font-size: 38rpx;
              margin-right: 10rpx;
            }
          }
          .right{
            .iconfont{
              font-size: 26rpx;
            }
          }
        }
        .item:last-child{
          border: none;
        }
      }
      .group:last-child{
        border:none;
      }
    }
  }
}
</style>