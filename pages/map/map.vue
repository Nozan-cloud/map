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
		<view id="mapContainer" style="width: 100%; height: 90vh; z-index: 1; position: relative; top: 50rpx;"></view>

		<!-- 悬浮按钮栏，设置 z-index 确保在地图上方显示 -->
		<view class="buttonGroup" style="z-index: 10;">
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

		<view v-if="!isEditMode" class="goAdd" @click="goAdd()" style="z-index: 10;">
			<uni-icons type="plusempty" size="30" color="white"></uni-icons>
		</view>
		<view v-if="isEditMode" class="closeAdd" @click="goAdd()" style="z-index: 10;">
			<uni-icons type="close" size="30" color="black"></uni-icons>
			<uni-icons type="checkbox" size="30" color="black" @click="checkMarker()"></uni-icons>
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
	const db = uniCloud.database() //获取数据库实例
	export default {
		data() {
			return {
				isEditMode: false, // false 表示非编辑模式，true 表示编辑模式
				latitude: 23.2056,
				longitude: 113.3547,
				navindex: 0,
				navarr: ["景点", "停车场", "卫生间"],
				searchPanelVisible: false,
				geolocation: null,
				isLocating: false,
				// markers: [], // 存储标记点的数组
				markerObj: {
					location: {
						latitude: 0,
						longitude: 0
					},
					title: "",
					visible: true,
					category: "",
					type: "",
					icon: "",
					rotate: 0,
					level: 0,
				
				},
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
			//点击新增标记点
			goAdd() {
				this.isEditMode = !this.isEditMode; // 切换编辑模式状态
				if (this.isEditMode) {
					console.log("进入编辑模式");
					// 添加地图点击事件
					this.map.on("click", (event) => {
						// console.log("地图点击事件:", event);
						this.addMarker(event);

					});
				} else {
					console.log("退出编辑模式");
				}
			},
			checkMarker() {
				// 上传标记点数据到云端
				this.addData();
				// this.uploadMarkersToCloud();
			},
			// 上传标记点数据到云端
			uploadMarkersToCloud() {
				// 将 markers 数组转换为 JSON 字符串
				const markersData = JSON.stringify(this.markers);

				// 调用云函数上传数据
				wx.cloud.callFunction({
					name: 'uploadMarkers', // 云函数名称
					data: {
						markers: markersData,
					},
					success: function(res) {
						console.log('上传成功:', res);
						// 处理上传成功的逻辑
					},
					fail: function(err) {
						console.error('上传失败:', err);
						// 处理上传失败的逻辑
					}
				});
			},
			// 添加标记点
			addMarker(event) {
				// 从 event 对象的 latLng 属性中获取经纬度
				const lat = event.latLng.lat;
				const lng = event.latLng.lng;
				this.markerObj.location.latitude = lat;
				this.markerObj.location.longitude = lng;
				this.markerObj.title = "新标记点";
				console.log(this.markerObj)
				new TMap.MultiMarker({
					map: this.map,
					styles: { // 定义标记点的样式
						smarker: new TMap.MarkerStyle({
							width: 20,
							height: 30,
							anchor: {
								x: 10,
								y: 30
							},
						}),
					},
					geometries: [{ // 定义要添加的标记点
						styleId: "smarker",
						position: new TMap.LatLng(lat, lng),
						// properties: {
						// 	title: "Current Location",
						// },
					}, ],
				});

				// 将标记点的经纬度添加到 markers 数组
				// this.markers.push({ lat, lng });
			},
			// 上传数据到数据库
			addData() {
			  const db = uniCloud.database();
			  const location = {
			    type: 'Point',
			    coordinates: [this.markerObj.location.longitude, this.markerObj.location.latitude]
			  };
			  
			  const dataToInsert = {
			    ...this.markerObj,
			    location: location
			  };
			  
			  db.collection("map-data").add(dataToInsert)
			    .then(res => {
			      console.log(dataToInsert);
			      uni.hideLoading();
			      uni.showToast({
			        title: "添加成功"
			      });
			      setTimeout(() => {
			        uni.reLaunch({
			          url: "/pages/map/map"
			        });
			      }, 800);
			    })
			    .catch(err => {
			      console.error('添加标记点失败', err);
			      uni.showToast({
			        title: "添加失败",
			        icon: "none"
			      });
			    });
			},
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
						styles: { // 定义标记点的样式
							marker1: new TMap.MarkerStyle({
								width: 20,
								height: 30,
								anchor: {
									x: 10,
									y: 30
								},
							}),
						},
						geometries: [{ // 定义要添加的标记点
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
		width: 100%;
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

	.buttonGroup {
		width: 75rpx;
		height: 280rpx;
		background: $uni-bg-color;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		align-items: center;
		border-radius: 15rpx;
		font-size: 60rpx;
		position: fixed;
		right: 30rpx;
		top: 600rpx;
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
		bottom: 120rpx;
		box-shadow: 0 0 20rpx rgb(19, 116, 47); //偏移 x y 模糊值
	}

	.closeAdd {
		width: 75rpx;
		height: 150rpx;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		border-radius: 15rpx;
		font-size: 60rpx;
		position: fixed; //位置固定
		right: 60rpx;
		bottom: 120rpx;
		box-shadow: 0 0 20rpx #888; //偏移 x y 模糊值
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