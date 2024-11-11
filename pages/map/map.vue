<template>
	<view>
		<!-- 顶部导航栏 -->
		<scroll-view scroll-x="true" class="navscroll">
			<view class="item" :class="index == navindex ? 'active' : ''" v-for="(item, index) in navarr" :key="index"
				@click="navclick(index)">
				{{ item }}
			</view>
		</scroll-view>

		<!-- 地图容器，设置 z-index 确保不会遮挡按钮 -->
		<view id="mapContainer" style="width: 100%; height: 90vh; z-index: 1; position: relative;"></view>

		<!-- 悬浮按钮栏，设置 z-index 确保在地图上方显示 -->
		<view class="goAdd" style="z-index: 10;">
			<view class="item">
				<uni-icons type="search" size="30" color="black" @click="toggleSearchPanel"></uni-icons>
				<text>搜索</text>
			</view>
			<view class="item">
				<image class="icon" src="/static/image/path.png"></image>
				<text>路线</text>
			</view>
			<view class="item">
				<uni-icons type="location" size="30" color="black" @click="getCurrentLocation"></uni-icons>
				<text>定位</text>
			</view>
		</view>

		<!-- 搜索弹出框，设置 z-index 确保在地图上方显示 -->
		<view v-if="searchPanelVisible" class="search-panel" style="z-index: 20;">
			<view class="search-panel-content">
				<u-search shape="round" @confirm="onSearchConfirm"></u-search>
			</view>
		</view>
	</view>
</template>

<script type="text/javascript" src="https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js"></script>
<script type="text/javascript"
	src="https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=4H5BZ-O2T3V-RJTPV-5UL7G-WZ6B7-3OFYG"></script>

<script>
	export default {
		data() {
			return {
				latitude: 23.2056,
				longitude: 113.3547,
				navindex: 0,
				navarr: ["景点", "停车场", "卫生间"],
				searchPanelVisible: false,
				geolocation: null,
				isLocating: false,
			};
		},
		mounted() {
			this.loadTencentMapAPI().then(() => {
				this.geolocation = new qq.maps.Geolocation(
					"4H5BZ-O2T3V-RJTPV-5UL7G-WZ6B7-3OFYG",
					"LvtuKey"
				);
				this.initMap(); // 初始化地图
				this.getCurrentLocation(); // 获取当前位置
			});
		},
		methods: {
			navclick(index) {
				this.navindex = index;
				console.log("导航项点击:", this.navarr[index]);
			},
			toggleSearchPanel() {
				this.searchPanelVisible = !this.searchPanelVisible;
			},
			onSearchConfirm(value) {
				console.log("搜索:", value);
				this.searchPanelVisible = false;
			},
			getCurrentLocation() {
				if (!this.isLocating && this.geolocation) {
					this.isLocating = true;
					this.geolocation.getLocation(this.showPosition, this.errorPosition);
				} else {
					console.error("定位加载失败？？？");
				}
			},
			showPosition(position) {
				console.log("定位成功");
				this.latitude = position.lat;
				this.longitude = position.lng;
				this.isLocating = false;

				// 更新地图中心和添加当前位置标记
				if (this.map) {
					this.map.setCenter(new TMap.LatLng(this.latitude, this.longitude));
					new TMap.MultiMarker({
						map: this.map,
						styles: {
							marker1: new TMap.MarkerStyle({
								width: 20,
								height: 30,
								anchor: {
									x: 10,
									y: 30
								},
							}),
						},
						geometries: [{
							id: "currentLocation",
							styleId: "marker1",
							position: new TMap.LatLng(this.latitude, this.longitude),
							properties: {
								title: "Current Location",
							},
						}, ],
					});
				}
			},
			errorPosition(e) {
				console.log("定位失败");
				this.isLocating = false;
			},
			loadTencentMapAPI() {
				return new Promise((resolve, reject) => {
					let loadedCount = 0;
					const apis = [
						"https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js",
						"https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=4H5BZ-O2T3V-RJTPV-5UL7G-WZ6B7-3OFYG",
					];
					apis.forEach((src) => {
						const script = document.createElement("script");
						script.src = src;
						script.onload = () => {
							loadedCount++;
							if (loadedCount === apis.length) {
								console.log("当前腾讯地图的api已经全部成功加载");
								resolve();
							}
						};
						script.onerror = (e) => {
							console.error(`加载失败 ${src}:`, e);
							reject(e);
						};
						document.head.appendChild(script);
					});
				});
			},
			initMap() {
				// 防止重复绘制地图
				if (this.map) return;

				this.startPosition = new TMap.LatLng(this.latitude, this.longitude);
				const mapOptions = {
					rotation: 20,
					pitch: 30,
					zoom: 12,
					center: this.startPosition,
				};
				try {
					this.map = new TMap.Map(document.getElementById("mapContainer"), mapOptions);

					// 添加地图点击事件
					this.map.on("click", (event) => {
						console.log("地图点击事件:", event);
					});
				} catch (error) {
					console.error("加载失败:", error);
				}
			},
		},
	};
</script>

<style lang="scss">
	@import "@/theme.scss";

	.navscroll {
		position: fixed;
		top: var(--windows-top);
		left: 0;
		z-index: 10;
		width: 87%;
		height: 80rpx;
		background: #f7f8fa;
		white-space: nowrap;

		.active {
			color: $app-theme-color;
			border-bottom: 5rpx solid $app-theme-color;
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
		height: 260rpx;
		background: $uni-bg-color;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		align-items: center;
		border-radius: 15rpx;
		font-size: 60rpx;
		position: fixed;
		right: 30rpx;
		top: 500rpx;
		box-shadow: 0 0 20rpx #888;

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
		z-index: 20;
		left: 0;
		right: 0;
		bottom: 0;
		height: 50%;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 30rpx;
	}

	.search-panel-content {
		margin: 10rpx 10rpx;
	}
</style>