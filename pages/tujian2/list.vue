<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList" field="name,pictures,visitSpot,recommendedTime,text">
			  <view class="image-container-list">
			    <!-- 图片列表 -->
			    <view v-for="(item, index) in data" :key="index" class="image-container" @click="handleItemClick(item._id)">
			      <image v-if="item.pictures && item.pictures.length > 0" :src="item.pictures[0]" mode="aspectFill" class="image-style" />
			      <text class="text">{{item.name}}</text>
			    </view>
			  </view>
      <uni-load-more :status="loading ? 'loading' : (hasMore ? 'more' : 'noMore')"></uni-load-more>
    </unicloud-db>
    <!-- <uni-fab ref="fab" horizontal="right" vertical="bottom" :pop-menu="false" @fabClick="fabClick" /> -->
  </view>
</template>


 
<script>
  const db = uniCloud.database()
  export default {
    data() {
      return {
        collectionList: "tujian2",
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        }
      }
    },
    onPullDownRefresh() {
      this.$refs.udb.loadData({
        clear: true
      }, () => {
        uni.stopPullDownRefresh()
      })
    },
    onReachBottom() {
      this.$refs.udb.loadMore()
    },
    methods: {
      handleItemClick(id) {
        uni.navigateTo({
          url: './detail?id=' + id
        })
      },
      fabClick() {
        // 打开新增页面
        uni.navigateTo({
          url: './add',
          events: {
            // 监听新增数据成功后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>  
.container {
  padding: 5px; /* 移除内边距 */
}

.image-container{
	margin-left: 5px;
		margin-right: 5px;
  position: relative; /* 可选，根据需要保留 */
  width: 30%; /* 容器宽度为100%，使得图片可以水平排列 */
  margin-bottom: 10px; /* 添加一些底部外边距，以便分隔行 */
  aspect-ratio: 4 / 4; /* 设置宽高比为4:4，相当于1:1的正方形 */
  overflow: hidden; /* 隐藏溢出的部分 */
  border-radius: 15px; /* 圆角效果 */
}

.image-container-list {
  display: flex; /* 使用flex布局 */
  flex-wrap: wrap; /* 允许容器内的元素换行 */
   justify-content: flex-start;
    gap: 3px;
}

.image-style {
  width: 100%; /* 图片宽度为100% */
  height: 100%; /* 图片高度为100% */
  object-fit: cover; /* 确保图片按比例缩放 */
  border-radius: 15px; /* 圆角效果 */
}

.text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0px;
  border-radius: 5px;
  width: 100%;
  text-align: center;
}
</style>  