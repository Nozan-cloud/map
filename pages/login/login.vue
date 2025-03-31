<template>
  <view class="login-container">
    <view class="login-form">
      <!-- 手机号输入框 -->
      <view class="form-item" :class="{'input-error': phoneError}">
        <input 
          type="number" 
          v-model="loginForm.phone" 
          placeholder="请输入手机号"
          maxlength="11"
          @focus="clearPhoneError"
          @blur="validatePhone"
        />
        <text class="error-message" v-if="phoneError">{{phoneError}}</text>
      </view>
      
      <!-- 验证码输入框 -->
      <view class="form-item code-item" :class="{'input-error': codeError}">
        <input 
          type="number" 
          v-model="loginForm.code" 
          placeholder="请输入验证码"
          maxlength="6"
          @focus="clearCodeError"
          @blur="validateCode"
        />
        <button 
          class="code-btn" 
          @click="sendCode" 
          :disabled="codeDisabled || phoneError"
          :class="{'disabled-btn': codeDisabled || phoneError}"
        >
          {{ codeBtnText }}
        </button>
        <text class="error-message" v-if="codeError">{{codeError}}</text>
      </view>
      
      <!-- 登录按钮 -->
      <button 
        class="login-btn" 
        @click="handleLogin" 
        :disabled="!formValid"
        :class="{'disabled-btn': !formValid}"
      >
        登录
      </button>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'

export default {
  data() {
    return {
      loginForm: {
        phone: '',
        code: ''
      },
      phoneError: '',
      codeError: '',
      codeDisabled: false,
      codeBtnText: '获取验证码',
      countdown: 60
    }
  },
  computed: {
    formValid() {
      return this.loginForm.phone && 
             this.loginForm.code && 
             !this.phoneError && 
             !this.codeError
    }
  },
  methods: {
    // 验证手机号
    validatePhone() {
      if (!this.loginForm.phone) {
        this.phoneError = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.phone)) {
        this.phoneError = '请输入正确的手机号'
        return false
      }
      this.phoneError = ''
      return true
    },
    
    // 清除手机号错误
    clearPhoneError() {
      this.phoneError = ''
    },
    
    // 验证验证码
    validateCode() {
      if (!this.loginForm.code) {
        this.codeError = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.codeError = '验证码为6位数字'
        return false
      }
      this.codeError = ''
      return true
    },
    
    // 清除验证码错误
    clearCodeError() {
      this.codeError = ''
    },
    
    // 发送验证码
    async sendCode() {
      if (!this.validatePhone()) return
      
      try {
        this.codeDisabled = true
        uni.showLoading({ title: '发送中...', mask: true })
        
        const params = new URLSearchParams()
        params.append('phone', this.loginForm.phone)
        
        const res = await uni.request({
          url: 'http://localhost:8081/user/code',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: params.toString()
        })
        
        uni.hideLoading()
        
        if (res[0].statusCode === 200) {
          uni.showToast({ 
            title: '验证码已发送', 
            icon: 'success',
            duration: 1500
          })
          this.startCountdown()
        } else {
          throw new Error(res.data?.message || '发送失败')
        }
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ 
          title: '发送失败: ' + (e.message || e.errMsg), 
          icon: 'none',
          duration: 2000
        })
        this.codeDisabled = false
      }
    },
    
    // 开始倒计时
    startCountdown() {
      this.codeDisabled = true
      this.codeBtnText = `${this.countdown}s后重新获取`
      
      const timer = setInterval(() => {
        this.countdown--
        this.codeBtnText = `${this.countdown}s后重新获取`
        
        if (this.countdown <= 0) {
          clearInterval(timer)
          this.codeDisabled = false
          this.codeBtnText = '获取验证码'
          this.countdown = 60
        }
      }, 1000)
    },
    
    // 处理登录
    async handleLogin() {
      if (!this.validatePhone() | !this.validateCode()) return
      
      try {
        uni.showLoading({ title: '登录中...', mask: true })
        
        const res = await request({
          url: '/user/login',
          method: 'POST',
          data: this.loginForm
        })
        
        uni.hideLoading()
        
        if (res.code === 200) {
          uni.setStorageSync('token', res.data.token)
          uni.showToast({ 
            title: '登录成功', 
            icon: 'success',
            duration: 1500
          })
          
          // 统一跳转到redirect页面
          const redirectUrl = uni.getStorageSync('redirectUrl') || '/pages/index/index'
          uni.removeStorageSync('redirectUrl')
          
          setTimeout(() => {
            uni.redirectTo({ url: redirectUrl })
          }, 1500)
        } else {
          throw new Error(res.message || '登录失败')
        }
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ 
          title: '登录失败: ' + e.message, 
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  padding: 30rpx;
}

.login-form {
  margin-top: 100rpx;
}

.form-item {
  margin-bottom: 40rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
  position: relative;
}

.code-item {
  display: flex;
  align-items: center;
}

input {
  font-size: 28rpx;
  height: 60rpx;
  width: 100%;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -30rpx;
  font-size: 24rpx;
  color: #ff4d4f;
}

.input-error input {
  color: #ff4d4f;
}

.code-btn {
  margin-left: 20rpx;
  font-size: 24rpx;
  background: #007AFF;
  color: #fff;
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
}

.code-btn.disabled-btn {
  background: #d9d9d9;
  color: #999;
}

.login-btn {
  margin-top: 80rpx;
  background: #007AFF;
  color: #fff;
  border-radius: 50rpx;
  padding: 20rpx;
  font-size: 32rpx;
}

.login-btn.disabled-btn {
  background: #d9d9d9;
  color: #999;
}
</style>