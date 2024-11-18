<template>
	<view class="page">
		<!-- 顶部导航栏 -->
		<scroll-view scroll-x="true" class="navscroll">
			<view class="item" :class="index == navindex? 'active' : ''" v-for="(item, index) in navarr" :key="index"
				@click="navclick(index)">
				{{ item }}
			</view>
		</scroll-view>

		<unicloud-map ref="map" :debug="false" loadtime="auto" collection="opendb-poi" :where="where" :width="750"
			:height="heightCom" :latitude="latitude" :longitude="longitude" :scale="15" :poi-maximum="100"
			:default-icon="defaultIcon" :custom-icons="customIcons" :enable-scroll="true" :enable-zoom="true"
			:show-compass="true" @poitap="poitap"></unicloud-map>


		<!-- 新增：查看地点详情信息的弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="popup-content">
				<image :src="selectedPoi.image" mode="aspectFill" class="popup-image" @click="openImagePopup"></image>
				<view class="popup-info">
					<text class="popup-title">{{ selectedPoi.title }}</text>
					<text class="popup-address">详细地址：{{ selectedPoi.address }}</text>
					<text class="popup-other-info">其他信息：{{ selectedPoi.otherInfo || '暂无其他信息' }}</text>
				</view>
				<button @click="closePopup">关闭</button>
			</view>
		</uni-popup>


		<!-- 悬浮按钮栏，设置 z-index 确保在地图上方显示 -->
		<view class="buttonGroup" style="z-index: 10;">
			<view class="item">
				<uni-icons type="search" size="30" color="black" @click="toggleSearchPanel"></uni-icons>
				<text>搜索</text>
			</view>
			<view class="item">
				<image class="icon" ref="routePanel" src="/static/image/path.png" @click="showRoutePane()"></image>
				<text>路线</text>
			</view>
			<view class="item">
				<uni-icons type="location" size="30" color="black" @click="getUserLocation"></uni-icons>
				<text>定位</text>
			</view>
		</view>

		<!-- 	<view v-if="!isEditMode" class="goAdd" @click="goAdd()" style="z-index: 10;">
			<uni-icons type="plusempty" size="30" color="white"></uni-icons>
		</view>
		<view v-if="isEditMode" class="closeAdd" @click="goAdd()" style="z-index: 10;">
			<uni-icons type="close" size="30" color="black"></uni-icons>
			<uni-icons type="checkbox" size="30" color="black" @click="checkMarker()"></uni-icons>
		</view> -->
		<!-- 搜索弹出框，设置 z-index 确保在地图上方显示 -->
		<view v-if="searchPanelVisible" class="search-panel" style="z-index: 20;">
			<view class="search-panel-content">
				<u-search shape="round" @confirm="onSearchConfirm"></u-search>
			</view>
		</view>
		<!-- route框 -->
		<view v-if="routePanelVisible" class="search-panel" style="z-index: 20;">
			<view class="search-panel-content">
				<u-search shape="round" @confirm="onSearchConfirm"></u-search>
			</view>
			<view class="row" v-for="item in routeArr" @click="goDetail(item._id)" :key="item._id">
				<route-box :item="item"></route-box>
			</view>
		</view>
		<!-- 新增：图片放大弹窗 -->
		<uni-popup ref="imagePopup" type="center">
			<image :src="selectedPoi.image" mode="widthFix" class="enlarged-image" @click="closeImagePopup"></image>
		</uni-popup>
	</view>

	


</template>

<script>
	import x from '@/theme.scss'
	var timer;
	const uniMapCo = uniCloud.importObject('uni-map-co', {
		customUI: true
	});
	const db = uniCloud.database();
	const _ = db.command;
	const category = "static-001";

	export default {

		data() {
			return {
				isEditMode: false, // false 表示非编辑模式，true 表示编辑模式
				searchPanelVisible: false,
				routePanelVisible: false,
				latitude: 23.201646,
				longitude: 113.393793,
				navindex: 0,
				routeTitle: "文艺路线",
				routeArr: [],
				navarr: ["景点", "停车点", "卫生间"],
				selectedPoi: {}, // 新增：用于存储选中的POI信息
				where: {
					category: category //定义了查询条件，用于在云数据库中检索数据
				}, // 查询条件，不支持字符串JQL形式，必须是对象形式
				defaultIcon: "/static/image/marker.png", // 默认图标
				// 自定义图标
				customIcons: [{
						type: "景点",
						icon: "/static/image/marker.png"
					},
					{
						type: "卫生间",
						icon: "/static/image/tolet.png"
					},
					{
						type: "停车点",
						icon: "/static/image/park.png"
					},
					{
						type: "你的位置",
						icon: "/static/image/marker.png"
					},
				],
				polyline: { // 初始化polyline数组

				}
			}
		},
		onLoad() {

		},
		methods: {
			// 初始化测试数据
			async initData() {
				uni.showLoading({
					title: "加载中...",
					mask: true
				});
				try {
					// 从数据库读取数据
					const pois = await db.collection('opendb-poi').where(this.where).get();
					// 将读取到的数据添加到地图上
					pois.data.forEach(poi => {
						this.$refs.map.addPoint({
							category: poi.category,
							type: poi.type,
							title: poi.title,
							location: {
								latitude: poi.latitude,
								longitude: poi.longitude
							},
							icon: this.getIconByType(poi.type)
						});
					});
					await this.refresh();
				} catch (err) {
					console.error(err);
				} finally {
					uni.hideLoading();
				}
			},
			async getRouteData() {
				try {
					const res = await db.collection('travellog').get();
					console.log(res);
					this.routeArr = res.result.data;
					console.log(this.routeArr);
				} catch (error) {
					console.error('Failed to get data:', error);
				}
			},
			// 画线
			async loadPolygonData() {
				try {
					// 获取路线数据
					const res = await db.collection('travellog').where({
						title: this.routeTitle
					}).get();
					console.log(res)
					const data = res.result.data[0].stops
					if (data && Array.isArray(data)) {
						const points = [];
						for (let item of data) {
							console.log(item.title)
							const resloc = await db.collection('opendb-poi').where({
								title: item.title
							}).get();
							console.log(resloc)
							points.push({
								longitude: resloc.coordinates[0],
								latitude: reloc.coordinates[1]
							});
						}
						let polyline = [{
							points,
							color: "#19b411", //#6eb6ff
							width: 6,
							dottedLine: false,
							arrowLine: true,
							borderWidth: 1,
							borderColor: "#000000",
						}]
						this.setPolyline(polyline)
					} else {
						console.log('No data or data is not in the expected format');
					}
				} catch (error) {
					console.error('Error loading polygon data:', error);
				}
			},

			// 设置路线
			setPolyline(polyline) {
				this.polyline = polyline;
				this.$refs.map.setPolyline(polyline);
			},
			showRoutePane() {
				this.routePanelVisible = !this.routePanelVisible;
				this.getRouteData();
			},
			drawLine() {
				this.loadPolygonData();
			},
			// 点击导航栏事件，只显示……
			navclick(index) {
				this.navindex = index;
				console.log("导航项点击:", this.navarr[index]);
				this.where = {
					category: category,
					type: this.navarr[index]
				};
			},
			// 搜索
			onSearchConfirm(value) {
				console.log("搜索:", value);
				this.searchPanelVisible = false;
			},
			async getUserLocation() {
				const that = this;
				uni.getLocation({
					// type: 'gcj02',
					success: (res) => {
						const latitude = res.latitude;
						const longitude = res.longitude;
						// 使用$nextTick确保组件已渲染
						that.$nextTick(() => {
							that.setMapCenter({
								latitude,
								longitude
							});
						});
					},
					fail: (err) => {
						console.error('获取位置失败', err);
					}
				});
			},
			// 导航弹窗
			showActionSheet(poi) {
				let itemList = ["导航到这里", "查看详情"];
				uni.showActionSheet({
					title: poi.title,
					itemList: itemList,
					success: async (res) => {
						let item = itemList[res.tapIndex];
						if (item === "导航到这里") {
							uni.openLocation({
								type: 'gcj02',
								latitude: poi.location.coordinates[1],
								longitude: poi.location.coordinates[0],
								name: poi.title,
								address: poi.address
							});
						} else if (item === "查看详情") {
							try {
								const {
									result
								} = await uniCloud.callFunction({
									name: 'getDetailInfoById',
									data: {
										poiId: poi._id
									} // 传入 opendb-poi 表的 _id
								});

								if (result.code === 0) {
									this.selectedPoi = {
										...poi,
										address: result.data.address,
										image: result.data.image,
										otherInfo: result.data.otherInfo
									};
									this.$refs.popup.open(); // 打开弹窗
								} else {
									console.error(result.msg);
									uni.showToast({
										title: '查询详情失败',
										icon: 'none'
									});
								}
							} catch (err) {
								console.error(err);
								uni.showToast({
									title: '查询详情失败',
									icon: 'none'
								});
							}
						}
					}
				});
			},
			// 关闭详情弹窗
			closePopup() {
				this.$refs.popup.close();
			},
			// 打开图片放大弹窗
			openImagePopup() {
				this.$refs.imagePopup.open();
			},
			// 关闭图片放大弹窗
			closeImagePopup() {
				this.$refs.imagePopup.close();
			},

			setMapCenter({
				latitude,
				longitude
			}) {
				this.latitude = latitude;
				this.longitude = longitude;
				if (this.$refs.map && typeof this.$refs.map.centerAndZoom === 'function') {
					this.$refs.map.centerAndZoom({
						latitude,
						longitude
					}, 16);
				} else {
					console.error('centerAndZoom is not a function');
				}
			},
			// 刷新地图
			async refresh() {
				await this.$refs.map.refresh({
					needIncludePoints: true
				});
			},
			// 监听 - 点击POI事件
			poitap(e) {
				let {
					poi
				} = e;
				this.showActionSheet(poi);
			},
			//点击新增标记点
			goAdd() {
				this.isEditMode = !this.isEditMode; // 切换编辑模式状态
				if (this.isEditMode) {
					console.log("进入编辑模式");
					// 添加地图点击事件
					this.$refs.map.on("click", (event) => {

						console.log("地图点击事件:", event);
						// this.addMarker(event);

					});
				} else {
					uni.reLaunch({
						url: "/pages/map/map"
					})
					console.log("退出编辑模式");
				}
			},
			// 弹出搜索框
			toggleSearchPanel() {
				this.searchPanelVisible = !this.searchPanelVisible;
			},
			onSearchConfirm(value) {
				console.log("搜索:", value);
				this.searchPanelVisible = false;
			},
		},
		computed: {
			heightCom() {
				let systemInfo = uni.getSystemInfoSync();
				return `${systemInfo.windowHeight+50}px`;
			}
		}

	}
</script>

<style lang="scss" scoped>
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

	.popup-content {
		padding: 20px;
		background-color: #fff;
		border-radius: 10px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		max-width: 80%;
		/* 限制最大宽度，适应小屏幕设备 */
		max-height: 80vh;
		/* 限制最大高度，适应小屏幕设备 */
		overflow-y: auto;
		/* 如果内容超过弹窗高度，则出现滚动条 */

		.popup-image {
			width: 100%;
			max-height: 200px;
			object-fit: cover;
			margin-bottom: 10px;
		}

		.popup-info {
			width: 100%;
			box-sizing: border-box;
			padding: 0 10px;
			flex-grow: 1;
			/* 占据剩余空间 */
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			overflow-y: auto;
			/* 允许内容滚动 */
		}

		.enlarged-image {
			width: 90%;
			/* 图片宽度占弹窗的90% */
			max-width: 100%;
			/* 确保图片不会超出屏幕宽度 */
			max-height: 90vh;
			/* 最大高度不超过屏幕高度的90% */
			object-fit: contain;
			/* 保持图片比例，同时填充可用空间 */
			cursor: pointer;
			/* 鼠标指针变为手指形状，提示可点击 */
		}

		.popup-title,
		.popup-address,
		.popup-other-info {
			width: 100%;
			font-size: 14px;
			color: #666;
			margin-bottom: 10px;
			word-break: break-all;
			/* 长单词或URL自动换行 */
		}
	}
</style>