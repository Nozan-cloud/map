<template>
	<view>
		<scroll-view scroll-x="true" class="navscroll">
			<view class="item" :class="index==navindex?'active':''" v-for="(item,index) in navarr"
				@click="navclick(index)">{{ item }}</view>
		</scroll-view>

		<map style="width: 100%; height: 750vh;" :latitude="latitude" :longitude="longitude" :markers="covers">
		</map>
		<view class="goAdd">
			<view class="item">
				<uni-icons type="search" size="30" color="black" @click="toggleSearchPanel"></uni-icons>
				<text>搜索</text>
			</view>
			<view class="item">
				<image class="icon" src="/static/image/path.png"></image>
				<text>路线</text>
			</view>
		</view>
		<!-- 弹出框 -->
		<view v-if="searchPanelVisible" class="search-panel">
			<view class="search-panel-content">	<u-search shape="round" @confirm="onSearchConfirm"></u-search></view>
		
			
		</view>

	</view>

</template>

<script>
	export default {

		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 23.2056,
				longitude: 113.3547,
				covers: [{
					latitude: 23.1,
					longitude: 113.26,
					// iconPath: '../../../static/location.png'
				}, {
					latitude: 39.90,
					longitude: 116.39,
					// iconPath: '../../../static/location.png'
				}],
				navindex: 0,
				navarr: ['景点', '停车场', '卫生间'],
				searchPanelVisible: false, // 控制搜索框显示
			}
		},
		methods: {
			// 点击导航
			navclick(e) {
				this.navindex = e
				//Todo 
			},
			toggleSearchPanel() {
			      this.searchPanelVisible = !this.searchPanelVisible;
			    },
			    onSearchConfirm(value) {
			      // 搜索确认逻辑
			      console.log('搜索:', value);
			      this.searchPanelVisible = false;
			    },
		}
	}
</script>

<style lang="scss">
	@import '@/theme.scss';

	//scoped 局部的
	.navscroll {
		position: fixed;
		top: var(--windows-top);
		left: 0;
		z-index: 10;
		height: 80rpx;
		background: #f7f8fA;
		white-space: nowrap; //保持一行不换行

		.active {
			color: $app-theme-color;

			border-bottom: 5rpx solid $app-theme-color;
			/* 添加下划线 */
		}

		/deep/ ::-webkit-scrollbar {
			width: 4px !important;
			height: 1px !important;
			overflow: auto !important;
			background: transparent !important;
			-webkit-appearance: auto !important;
			display: block;
		}

		.item {
			display: inline-flex;
			font-size: 36rpx;
			line-height: 80rpx;
			padding: 0 30rpx;
		}

	}


	.goAdd {
		width: 75rpx;
		height: 200rpx;
		background: $uni-bg-color;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		align-items: center;
		border-radius: 15rpx;
		font-size: 60rpx;
		position: fixed; //位置固定
		right: 30rpx;
		top: 300rpx;
		box-shadow: 0 0 20rpx #888; //偏移 x y 模糊值

		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 24rpx;
		}

		.icon {
			width: 50rpx;
			height: 50rpx;
		}
	}
	.search-panel {
	  position: fixed;
	  z-index: 10;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  height: 50%;
	  background-color: rgba(255, 255, 255, 0.9); /* 半透明背景 */
	  border-radius: 30rpx;
	}
	.search-panel-content{
		margin: 10rpx 10rpx;
		
	}
	
</style>