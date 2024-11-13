<template>
	<view>
		<map style="width: 100%; height: 90vh;" :show-location='true' ref="map" id="map" :latitude="latitude"
			:longitude="longitude" :markers="markers" :scale="scale" @markertap="markertap" @callouttap='callouttap'>
			<cover-view class="cover-view" :style=''>
				<cover-view @click="refresh">
					<cover-image class="cover-image" src="/static/home/shuaxin.png"></cover-image>
					<cover-view>刷新</cover-view>
				</cover-view>
				<cover-view style="margin-top: 20rpx;" @click="onControltap">
					<cover-image class="cover-image" src="/static/home/dingwei.png"></cover-image>
					<cover-view>定位</cover-view>
				</cover-view>

			</cover-view>
		</map>
		
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				latitude: 23.2056,
				longitude: 113.3547,
				scale: 15, //缩放级别
				markers:[]
			}
		},
		onReady() {
 
		},
		computed: {},
		onLoad() {
  this.fetchMarkers();
		},
		onShow() {
			this.getLocation()
		},
		methods: {
			fetchMarkers() {
			      const db = uniCloud.database();
			      db.collection('map-data')
			        .get()
			        .then(res => {
						
			          if (res.result.data && res.result.data.length > 0) {
			            this.markers = res.result.data.map(item => ({
							
			              id: item._id, // 使用数据库中的ID作为唯一标识符
			              latitude: item.location.coordinates[1], // 纬度
			              longitude: item.location.coordinates[0], // 经度
			              iconPath:  '/static/image/marker.png', // 图标路径
			              rotate: 0, // 旋转度数
			              width: 40, // 宽度
			              height: 40, // 高度
			              callout: {
			                content: item.calloutContent, // 气泡内容
			                color: '#ffffff', // 文字颜色
			                fontSize: 15, // 文本大小
			                borderRadius: 15, // 边框圆角
			                padding: '10',
			                bgColor: '#406390', // 背景颜色
			                display: 'ALWAYS', // 常显
			              },
			            }));
			          console.log(this.markers)
					  }
			        })
			        .catch(err => {
			          console.error('查询标记点数据失败', err);
			        });
			    },
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						this.latitude = res.latitude
						this.longitude = res.longitude
					}
				});
			},
			refresh() {
				this.getLocation()
				console.log('刷新');
				//后期这里可加入调用请求接口的方法，用来实现刷新
			},
			//定位
			onControltap() {
				this.getLocation()
				uni.createMapContext("map", this).moveToLocation({ //moveToLocation将地图中心移动到当前定位点，需要配合map组件的show-location使用
					latitude: this.latitude,
					longitude: this.longitude,
				});
				console.log('定位');
			},
			//地图点击事件
			markertap(e) {
				console.log("你点击了标记点", e)
				uni.showModal({
					title: '提示',
					content: '地图点击事件，标记点'
				})
			},
			//地图点击事件
			callouttap(e) {
				console.log('你点击了气泡标签', e)
				uni.showModal({
					title: '提示',
					content: '地图点击事件，气泡标签'
				})
			}
 
		}
	}
</script>
 
<style scoped lang="scss">
	.map-container {
		margin-top: -40rpx;
		position: relative;
		overflow: hidden;
		border-radius: 50rpx 50rpx 0 0;
		height: 90vh;
 
		.cover-view {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			/* width: 80rpx;
			height: 160rpx; */
			padding: 42rpx 22rpx;
			color: #4F575F;
			font-weight: 400;
			background-color: #fff;
			background-size: 120rpx 120rpx;
			background-position: center center;
			position: absolute;
			top: 150rpx;
			right: 32rpx;
			border-radius: 15rpx;
 
 
		}
 
		.cover-image {
			display: inline-block;
			width: 50rpx;
			height: 50rpx;
 
		}
	}
</style>