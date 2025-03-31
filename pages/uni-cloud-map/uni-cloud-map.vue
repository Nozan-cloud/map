<template>
  <view class="page">
    <!-- 地图容器 -->
    <map 
      id="map" 
      :latitude="latitude" 
      :longitude="longitude" 
      :scale="scale" 
      :markers="markers"
      :polyline="polyline"
      show-location
      show-compass
      enable-scroll
      enable-zoom
      @markertap="onMarkerTap"
      style="width: 100%; height: 100%;"
    ></map>

    <!-- 地点详情弹窗 -->
    <uni-popup ref="popup" type="center">
      <view class="popup-content">
        <image 
          v-if="selectedPoi.image" 
          :src="selectedPoi.image" 
          mode="aspectFill" 
          class="popup-image"
          @click="openImagePopup"
        ></image>
        <view class="popup-info">
          <text class="popup-title">{{ selectedPoi.title }}</text>
          <text class="popup-address">地址：{{ selectedPoi.address || '暂无地址信息' }}</text>
          <text class="popup-other-info">{{ selectedPoi.otherInfo || '暂无其他信息' }}</text>
        </view>
        <button class="popup-button" @click="closePopup">关闭</button>
      </view>
    </uni-popup>

    <!-- 图片放大弹窗 -->
    <uni-popup ref="imagePopup" type="center">
      <image 
        v-if="selectedPoi.image" 
        :src="selectedPoi.image" 
        mode="widthFix" 
        class="enlarged-image"
        @click="closeImagePopup"
      ></image>
    </uni-popup>

    <!-- 底部操作栏 -->
    <view class="bottom-toolbar">
      <view class="toolbar-item" @click="toggleSearchPanel">
        <uni-icons type="search" size="24" color="#333"></uni-icons>
        <text>搜索</text>
      </view>
      <view class="toolbar-item" @click="showRoutePanel">
        <uni-icons type="map" size="24" color="#333"></uni-icons>
        <text>路线</text>
      </view>
      <view class="toolbar-item" @click="getUserLocation">
        <uni-icons type="location" size="24" color="#333"></uni-icons>
        <text>定位</text>
      </view>
    </view>

    <!-- 搜索面板 -->
    <view v-if="searchPanelVisible" class="search-panel">
      <view class="search-header">
        <uni-search-bar 
          placeholder="请输入地点名称" 
          v-model="searchValue"
          @confirm="onSearchConfirm"
          @cancel="onSearchCancel"
          @clear="onSearchClear"
        ></uni-search-bar>
      </view>
      <scroll-view class="search-results" scroll-y>
        <view 
          v-for="(item, index) in searchResults" 
          :key="index" 
          class="search-item"
          @click="goToLocation(item)"
        >
          <text class="search-item-title">{{ item.title }}</text>
          <text class="search-item-address">{{ item.address }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 路线面板 -->
    <view v-if="routePanelVisible" class="route-panel">
      <view class="route-header">
        <text class="route-title">推荐路线</text>
        <uni-icons type="close" size="24" @click="routePanelVisible = false"></uni-icons>
      </view>
      <scroll-view class="route-list" scroll-y>
        <view 
          v-for="(route, index) in routeList" 
          :key="index" 
          class="route-item"
          @click="showRoute(route)"
        >
          <text class="route-item-title">{{ route.name }}</text>
          <text class="route-item-desc">{{ route.description }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
// import uniIcons from '@/components/uni-icons/uni-icons.vue'
// import uniPopup from '@/components/uni-popup/uni-popup.vue'
// import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'

// 后端API基础地址 - 根据实际部署地址修改
const API_BASE_URL = 'http://127.0.0.1:8081/';

export default {
  // components: {
  //   uniIcons,
  //   uniPopup,
  //   uniSearchBar
  // },
  data() {
    return {
      // 地图相关
      latitude: 39.90469, // 默认北京中心坐标
      longitude: 116.40717,
      scale: 15,
      markers: [],
      polyline: [],
      
      // 搜索相关
      searchPanelVisible: false,
      searchValue: '',
      searchResults: [],
      
      // 路线相关
      routePanelVisible: false,
      routeList: [],
      selectedRoute: null,
      
      // 地点详情
      selectedPoi: {},
      
      // 图标配置
      icons: {
        default: '/static/marker.png',
        scenic: '/static/scenic.png',
        toilet: '/static/toilet.png',
        parking: '/static/parking.png',
        user: '/static/user-location.png'
      }
    }
  },
  onLoad() {
    this.initMapData();
    this.loadRoutes();
  },
  methods: {
    // 初始化地图数据
    async initMapData() {
      try {
        const res = await uni.request({
          url: `${API_BASE_URL}/poi`,
          method: 'GET'
        });
        
        if (res[1].statusCode === 200) {
          this.markers = res[1].data.map(poi => ({
            id: poi.id,
            latitude: poi.location.coordinates[1],
            longitude: poi.location.coordinates[0],
            title: poi.title,
            iconPath: this.getIconPath(poi.type),
            width: 30,
            height: 30,
            callout: {
              content: poi.title,
              color: '#333',
              fontSize: 14,
              borderRadius: 5,
              bgColor: '#fff',
              padding: 5,
              display: 'ALWAYS'
            },
            customCallout: {
              anchorY: 0,
              anchorX: 0,
              display: 'ALWAYS'
            }
          }));
        }
      } catch (err) {
        console.error('初始化地图数据失败:', err);
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    },
    
    // 获取用户当前位置
    async getUserLocation() {
      uni.showLoading({
        title: '定位中...',
        mask: true
      });
      
      try {
        const res = await uni.getLocation({
          type: 'gcj02',
          geocode: true
        });
        
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.scale = 16;
        
        // 添加用户位置标记
        this.markers.push({
          id: 'user-location',
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: this.icons.user,
          width: 30,
          height: 30,
          title: '我的位置'
        });
        
        uni.hideLoading();
      } catch (err) {
        console.error('获取位置失败:', err);
        uni.hideLoading();
        uni.showToast({
          title: '定位失败，请检查权限设置',
          icon: 'none'
        });
      }
    },
    
    // 根据类型获取图标路径
    getIconPath(type) {
      switch(type) {
        case '景点':
          return this.icons.scenic;
        case '卫生间':
          return this.icons.toilet;
        case '停车场':
          return this.icons.parking;
        default:
          return this.icons.default;
      }
    },
    
    // 标记点点击事件
    onMarkerTap(e) {
      const markerId = e.markerId;
      const marker = this.markers.find(m => m.id === markerId);
      
      if (marker) {
        this.showPoiDetail(marker);
      }
    },
    
    // 显示地点详情
    async showPoiDetail(marker) {
      try {
        const res = await uni.request({
          url: `${API_BASE_URL}/poi/${marker.id}`,
          method: 'GET'
        });
        
        if (res[1].statusCode === 200) {
          this.selectedPoi = res[1].data;
          this.$refs.popup.open();
        }
      } catch (err) {
        console.error('获取地点详情失败:', err);
        uni.showToast({
          title: '获取信息失败',
          icon: 'none'
        });
      }
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
    
    // 切换搜索面板
    toggleSearchPanel() {
      this.searchPanelVisible = !this.searchPanelVisible;
      if (this.searchPanelVisible) {
        this.routePanelVisible = false;
      }
    },
    
    // 搜索确认
    async onSearchConfirm() {
      if (!this.searchValue.trim()) return;
      
      uni.showLoading({
        title: '搜索中...',
        mask: true
      });
      
      try {
        const res = await uni.request({
          url: `${API_BASE_URL}/poi/search`,
          method: 'GET',
          data: {
            keyword: this.searchValue
          }
        });
        
        if (res[1].statusCode === 200) {
          this.searchResults = res[1].data;
        }
      } catch (err) {
        console.error('搜索失败:', err);
        uni.showToast({
          title: '搜索失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 搜索取消
    onSearchCancel() {
      this.searchPanelVisible = false;
      this.searchValue = '';
      this.searchResults = [];
    },
    
    // 搜索清除
    onSearchClear() {
      this.searchResults = [];
    },
    
    // 跳转到指定位置
    goToLocation(item) {
      this.latitude = item.location.coordinates[1];
      this.longitude = item.location.coordinates[0];
      this.scale = 16;
      this.searchPanelVisible = false;
    },
    
    // 显示路线面板
    showRoutePanel() {
      this.routePanelVisible = !this.routePanelVisible;
      if (this.routePanelVisible) {
        this.searchPanelVisible = false;
      }
    },
    
    // 加载路线数据
    async loadRoutes() {
      try {
        const res = await uni.request({
          url: `${API_BASE_URL}/routes`,
          method: 'GET'
        });
        
        if (res[1].statusCode === 200) {
          this.routeList = res[1].data;
        }
      } catch (err) {
        console.error('加载路线失败:', err);
      }
    },
    
    // 显示路线
    async showRoute(route) {
      try {
        const res = await uni.request({
          url: `${API_BASE_URL}/routes/${route.id}`,
          method: 'GET'
        });
        
        if (res[1].statusCode === 200) {
          const routeData = res[1].data;
          
          // 更新地图中心点
          if (routeData.points && routeData.points.length > 0) {
            const firstPoint = routeData.points[0];
            this.latitude = firstPoint.latitude;
            this.longitude = firstPoint.longitude;
            this.scale = 14;
          }
          
          // 绘制路线
          this.polyline = [{
            points: routeData.points.map(p => ({
              latitude: p.latitude,
              longitude: p.longitude
            })),
            color: '#1890FF',
            width: 6,
            dottedLine: false,
            arrowLine: true
          }];
          
          // 显示路线上的点
          this.markers = routeData.points.map((p, index) => ({
            id: `route-point-${index}`,
            latitude: p.latitude,
            longitude: p.longitude,
            title: p.title || `途经点 ${index + 1}`,
            iconPath: this.getIconPath(p.type || '景点'),
            width: 24,
            height: 24
          }));
          
          this.routePanelVisible = false;
        }
      } catch (err) {
        console.error('显示路线失败:', err);
        uni.showToast({
          title: '加载路线失败',
          icon: 'none'
        });
      }
    }
  }
}
</script>
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
	// const category = "1";

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
				defaultIcon: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/marker.png", // 默认图标
				// 自定义图标
				customIcons: [{
						type: "景点",
						icon: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/marker.png"
					},
					{
						type: "卫生间",
						icon: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/tolet.png"
					},
					{
						type: "停车点",
						icon: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/park.png"
					},
					{
						type: "你的位置",
						icon: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/marker.png"
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
					const pois = await db.collection('opendb-poi').get();
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
						// console.error('从数据库获取数据失败或数据格式不正确', pois);
						// uni.showToast({
						// 	title: '数据加载失败，请稍后再试',
						// 	icon: 'none'
						// });
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
					// console.log(res);
					this.routeArr = res.result.data;
					// console.log(this.routeArr);
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
										// console.log(item.title)
										const loc = await db.collection('opendb-poi').where({
											title: item.title
										}).get();
										const resloc = loc.result.data[0].location
										console.log(resloc)
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
				this.drawLine()
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
					// category:this.navindex,
					type: this.navarr[this.navindex]
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
						iconPath = "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/marker.png";
						break;
					case '卫生间':
						iconPath = "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/tolet.png";
						break;
					case '停车点':
						iconPath = "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/park.png";
						break;
					case '定位标记':
						iconPath = "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/marker.png";
						break;
					default:
						iconPath = "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/marker.png";
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
				// this.where = {
				// 	category: category
				// };
				// 重新加载数据以显示初始状态下的所有地点
				this.initData();
				this.searchPanelVisible = false;
			}

		},
		computed: {
			heightCom() {
				let systemInfo = uni.getSystemInfoSync();
				return `${systemInfo.windowHeight}px`;
			}
		},
		mounted() {
		  this.initData();
		}

	}
</script>

<style lang="scss">
.page {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 地图容器 */
#map {
  width: 100%;
  height: 100%;
}

/* 底部工具栏 */
.bottom-toolbar {
  position: fixed;
  bottom: 120rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-radius: 50rpx;
  padding: 20rpx 0;
  margin: 0 30rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  .toolbar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    text {
      font-size: 24rpx;
      color: #333;
      margin-top: 10rpx;
    }
  }
}

/* 搜索面板 */
.search-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60vh;
  background-color: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  box-shadow: 0 -5rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 20;
  
  .search-header {
    padding: 20rpx;
    border-bottom: 1rpx solid #eee;
  }
  
  .search-results {
    height: calc(60vh - 100rpx);
    padding: 0 20rpx;
    
    .search-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      .search-item-title {
        font-size: 32rpx;
        color: #333;
        display: block;
      }
      
      .search-item-address {
        font-size: 26rpx;
        color: #999;
        display: block;
        margin-top: 10rpx;
      }
    }
  }
}

/* 路线面板 */
.route-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background-color: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  box-shadow: 0 -5rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 20;
  
  .route-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1rpx solid #eee;
    
    .route-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .route-list {
    height: calc(50vh - 100rpx);
    padding: 0 20rpx;
    
    .route-item {
      padding: 25rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      .route-item-title {
        font-size: 30rpx;
        color: #333;
        display: block;
      }
      
      .route-item-desc {
        font-size: 26rpx;
        color: #999;
        display: block;
        margin-top: 10rpx;
      }
    }
  }
}

/* 详情弹窗 */
.popup-content {
  width: 80vw;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  
  .popup-image {
    width: 100%;
    height: 200rpx;
    display: block;
  }
  
  .popup-info {
    padding: 30rpx;
    
    .popup-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 20rpx;
    }
    
    .popup-address, .popup-other-info {
      font-size: 28rpx;
      color: #666;
      display: block;
      margin-bottom: 15rpx;
      line-height: 1.5;
    }
  }
  
  .popup-button {
    margin: 20rpx;
    background-color: #1890FF;
    color: #fff;
  }
}

/* 图片放大弹窗 */
.enlarged-image {
  width: 90vw;
  max-height: 80vh;
}
</style>
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
		top: 250rpx;
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