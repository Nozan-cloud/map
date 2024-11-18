<template>
	<view class="route-box">
		<!-- 左图中文右图 -->
		<view class="pic">
			<image v-if="item.pictures&&item.pictures[0]" :src="item.pictures[0]
			" mode="aspectFill"></image>
						<image v-else src="/static/logo.png" mode="aspectFill"></image>
		</view>
		<view class="text">
			<view class="title">{{item.title}}</view>
			<view class="info">
				<text>{{item.author}}</text>
				<text>
					<!-- 日期格式化 -->
					<uni-dateformat :date="item.posttime" format="yyyy-MM-dd "
						:threshold="[60000, 3600000]"></uni-dateformat>
				</text>
			</view>
		</view>
		<view class="icon">
			<image src="https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/icon/fly.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "route-box",
		props: {
			item: {
				type: Object,
				default () {
					return {
						title: "组件内默认的标题",
						author: "张三",


					}

				}
			}
		},
		data() {
			return {

			};
		},
		methods: {
			// Todetail() {
			// 	uni.navigateTo({
			// 		url: "/pages/uni-cloud-map/uni-cloud-map"//id
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.route-box {
		margin: 20rpx;
		height: 160rpx;
		display: flex; //显示在一行
		align-items: center;
		.pic {
			
			width: 230rpx;
			height: 160rpx;

			image {
				
				width:150rpx;
				height: 150rpx;
				border-radius: 15rpx;

			}
		}

		.icon{
			margin-right: 20rpx;
			width: 80rpx;
			height: 80rpx;
			background-color: #13742F;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 50rpx;
				height: 50rpx;
			
			}
		}
		.text {
			height: 100%;
		
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