<template>
	<view class="newsbox" @click="Todetail()">
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
</template>

<script>
	export default {
		name: "newsbox",
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
			Todetail() {
				uni.navigateTo({
					url: "/pages/detail/detail"
				})
			}
		}
	}
</script>

<style lang="scss">
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
				border-radius: 25rpx;
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