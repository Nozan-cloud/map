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
				<!-- 使用uni-search-bar组件替换原来的u-search组件 -->
				<uni-search-bar @confirm="onSearchConfirmOne" @input="onSearchInput" @clear="onSearchClear"
					placeholder="请输入地点名称进行搜索" :show-action="true" :action-text="searching? '取消搜索' : '搜索'"
					:value="searchValue"></uni-search-bar>
			</view>
		</view>
		<!-- route框 -->
		<view v-if="routePanelVisible" class="search-panel" style="z-index: 20;">
			<view class="search-panel-content">
				<u-search shape="round" @confirm="onSearchConfirm"></u-search>
			</view>
			<view class="row" v-for="item in routeArr" @click="goDetail(item.title)" :key="item._id">
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
	import {
		uniSearchBar
	} from '@dcloudio/uni-ui';
	import x from '@/theme.scss'
	var timer;
	const uniMapCo = uniCloud.importObject('uni-map-co', {
		customUI: true
	});
	const db = uniCloud.database();
	const _ = db.command;
	const category = "1";

	export default {
		components: {
			uniSearchBar
		},

		data() {
			return {
				isEditMode: false, // false 表示非编辑模式，true 表示编辑模式
				searchPanelVisible: false,
				routePanelVisible: false,
				searchValue: '', // 用于存储搜索框输入的值
				searching: false, // 用于标记是否正在搜索状态
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
					if (pois && pois.data && Array.isArray(pois.data)) {
						// 清空地图上之前的标记点等内容，以便正确显示搜索结果
						this.$refs.map.clearAllPoints();
						// 将读取到的数据添加到快照中
						let resultSnapshot = [];
						pois.data.forEach(poi => {
							this.$refs.map.addPoint({
								category: poi.category,
								type: poi.type,
								title: poi.title,
								location: {
									latitude: poi.latitude,
									longitude: longitude
								},
								icon: this.getIconByType(poi.type)
							});
							resultSnapshot.push(poi);
						});
						await this.refresh();
						if (resultSnapshot.length > 0) {
							uni.showToast({
								title: '搜索成功',
								icon: 'success'
							});
						}
					} else {
						console.error('从数据库获取数据失败或数据格式不正确', pois);
						uni.showToast({
							title: '数据加载失败，请稍后再试',
							icon: 'none'
						});
					}
				} catch (err) {
					console.error(err);
					uni.showToast({
						title: '数据加载失败，请稍后再试',
						icon: 'none'
					});
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
					// console.log(res)
					const data = res.result.data[0].stops
					if (data && Array.isArray(data)) {
						const points = [];
						for (let item of data) {
							console.log(item.title)
							const loc = await db.collection('opendb-poi').where({
								title: item.title
							}).get();
							console.log(loc)
							const resloc = loc.data
							// console.log(resloc)
							points.push({
								longitude: resloc.coordinates[0],
								latitude: resloc.coordinates[1]
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
			goDetail(e) {
				this.routePanelVisible = !this.routePanelVisible
				this.routeTitle = e
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
				this.refresh();
			},
			async onSearchConfirmOne() {
				console.log("确认搜索:", this.searchValue);
				// 根据搜索值更新查询条件
				// this.where = {
				//     category: category
				// };
				// 根据搜索值更新查询条件，使用模糊查询
				this.where = {
					//category: category,
					title: this.searchValue // 使用精确匹配
				};
				// 设置为正在搜索状态
				this.searching = true;
				// 重新加载数据以显示搜索结果
				await this.searchLocations();
			},
			// 搜索
			onSearchConfirm(value) {
				console.log("搜索:", value);
				this.searchPanelVisible = false;
			},
			// 获取用户当前位置并在地图上定位显示
			async getUserLocation() {
				uni.showLoading({
					title: "定位中...",
					mask: true
				});
				try {
					const res = await uni.getLocation({
						type: 'gcj02',
						geolocationOptions: {
							enableHighAccuracy: true
						}
					});
			
					// 设置地图的中心点为当前位置
					this.latitude = res.latitude;
					this.longitude = res.longitude;
			
					// 刷新地图以显示新的位置
					await this.$refs.map.refresh({
						needIncludePoints: true
					});
			
					// 在地图上添加当前位置的标记
					this.addCurrentLocationMarker(res.latitude, res.longitude);
			
					uni.hideLoading();
				} catch (err) {
					console.error('获取位置失败', err);
					uni.hideLoading();
					uni.showToast({
						title: '定位失败，请检查设备设置，开启位置权限',
						icon: 'none'
					});
				}
			},
			// 在地图上添加当前位置的标记
			addCurrentLocationMarker(latitude, longitude) {
				this.$refs.map.addPoint({
					category: '你的位置',
					type: '定位标记',
					title: '当前位置',
					location: {
						latitude: latitude,
						longitude: longitude
					},
					icon: this.getIconByType('定位标记')
				});
			},
			// 根据标记类型获取对应的图标路径（假设已有此函数，根据实际情况调整）
			getIconByType(type) {
				let iconPath;
				switch (type) {
					case '景点':
						iconPath = "/static/image/marker.png";
						break;
					case '卫生间':
						iconPath = "/static/image/tolet.png";
						break;
					case '停车点':
						iconPath = "/static/image/park.png";
						break;
					case '定位标记':
						iconPath = "/static/image/marker.png";
						break;
					default:
						iconPath = "/static/image/marker.png";
				}
				return iconPath;
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
										title: '没有更多信息了哦',
										icon: 'none'
									});
								}
							} catch (err) {
								console.error(err);
								uni.showToast({
									title: '没有更多信息了哦',
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
			// 实时获取输入内容
			onSearchInput(event) {
				console.log('onSearchInput event:', event);
				if (event && event.detail && event.detail.value !== undefined) {
					this.searchValue = event.detail.value;
				} else {
					console.error('Event detail or value is undefined');
				}
			},
			// 清除输入内容
			onSearchClear() {
				this.searchValue = '';
				// 重置查询条件为初始状态
				this.where = {
					category: category
				};
				// 重新加载数据以显示初始状态下的所有地点
				this.initData();
				this.searchPanelVisible = false;
			}
		
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