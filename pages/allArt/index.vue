<template>
  <view class="content">
    <view class="row" v-for="item in listArr"  :key="item._id">
     <view class="newsbox" @click="Todetail(item._id)">
     	<!-- 左图右文 -->
     	<view class="pic">
     		<!-- 可设置样式 -->
     		<image v-if="item.pictures&&item.pictures[0]" :src="item.pictures[0].fileID" mode="aspectFill"></image>
     		<!-- 默认图片 -->
     		<image v-else src="/static/logo.png" mode="aspectFill"></image>
     	</view>
     	<view class="text">
     		<view class="title">{{item.title}}</view>
     		<view class="info">
     			<text>{{item.description}}</text>
     			
     		</view>
     	</view>
     </view>
    </view>
  

  </view>
</template>

<script>
export default {
  data() {
    return {
      db: '',
      listArr: []
    };
  },
  onLoad(options) {
    this.db = options.db;
	// console.log(this.db)
    this.getData();
  },
  //触底方法
  onReachBottom() {
    this.getData();
  },
  onPullDownRefresh() {
    this.listArr = []; //清空处理，否则数据会重复
    this.getData();
  },
  methods: {
  // 跳转到详情页
  Todetail(id) {
    uni.navigateTo({
      url: `/pages/detail-pages/detail-pages?type=${this.db}&id=${id}`
    });
  },
    //获取数据库的列表
    getData() {
      uniCloud.callFunction({
        name: "art_get_all",
        data: {
          collectionName: this.db,
          skip: this.listArr.length
        }
      }).then(res => {
        let oldList = this.listArr;
        let newList = [...oldList, ...res.result.data];
        this.listArr = newList;
        // console.log(newList);
        uni.stopPullDownRefresh();
      }).catch(err => {
        console.error('Failed to fetch data:', err);
      });
    }
  }
}
</script>

<style lang="scss">
.content {
  padding: 30rpx;

  .row {
    margin-bottom: 20rpx;
    border-bottom: 1px dotted #efefef;
    border-radius: 25rpx;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); /* 添加阴影效果 */
  }
}
.goAdd {
  width: 100rpx;
  height: 100rpx;
  background: #13742F;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 60rpx;
  position: fixed; //位置固定
  right: 60rpx;
  bottom: 100rpx;
  box-shadow: 0 0 20rpx rgb(19, 116, 47); //偏移 x y 模糊值
}
.newsbox {
		height: 450rpx;
		display: flex;
		flex-direction:column;
		

		.pic {
			width: 100%;
			height: 400rpx;
			
			

			image {
				width: 100%;
				height: 100%;
				
			}
		}

		.text {
			//border: 1px solid #333;
			flex: 1; //占满一格子
			padding-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				font-size: 38rpx;
				color: #333;
				//两行多则显示省略号
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.info {
				font-size: 26rpx;
				color: #999;

				text {
					padding-right: 30rpx;
				}
			}
		}
	}
</style>