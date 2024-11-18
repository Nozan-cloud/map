  <template>
      <view class="detail-page">
          <view class="title">{{ poi.title }}</view>
          <view class="address">地址：{{ poi.address }}</view>
          <view class="description">描述：{{ poi.description }}</view>
          <!-- 可以根据实际情况添加更多信息展示 -->
      </view>
  </template>

  <script>
  const db = uniCloud.database();
  export default {
      data() {
          return {
              poi: {}
          }
      },
      onLoad(options) {
          // 根据传入的 poiId 获取详细信息
          const poiId = options.poiId;
          this.getPoiDetail(poiId);
      },
      methods: {
          async getPoiDetail(poiId) {
              const poi = await db.collection('opendb - poi').doc(poiId).get();
              this.poi = poi.data;
          }
      }
  }
  </script>

  <style scoped>
.detail - page {
      padding: 20px;
  }
.title {
      font - size: 20px;
      font - weight: bold;
      margin - bottom: 10px;
  }
.address {
      margin - bottom: 10px;
  }
.description {
      color: #666;
  }
  </style>