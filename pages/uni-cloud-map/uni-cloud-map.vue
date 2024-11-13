<template>
	<view class="page">

		<unicloud-map ref="map" :debug="false" loadtime="auto" collection="opendb-poi" :where="where" :width="750"
			:height="heightCom" :latitude="latitude" :longitude="longitude" :scale="15" :poi-maximum="100"
			:default-icon="defaultIcon" :custom-icons="customIcons" :enable-scroll="true" :enable-zoom="true"
			:show-compass="true" @poitap="poitap"></unicloud-map>

		<button @click="drawLine">绘制线条</button>
	</view>
</template>

<script>
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
				latitude: 23.201646,
				longitude: 113.393793,
				where: {
					category: category
				}, // 查询条件，不支持字符串JQL形式，必须是对象形式
				defaultIcon: "/static/image/marker.png", // 默认图标
				// 自定义图标
				customIcons: [{
						type: "景点",
						icon: "/static/image/marker.png"
					},
					{
						type: "你的位置",
						icon: "/static/image/marker.png"
					}
				],
				polylineData: [] // 存储线条数据
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
			 // 初始化景点并绘制线条
			    async initScenes() {
			      try {
			        // 假设您已经通过unicloud-db组件获取了数据
			        const scenes = this.$refs.udb.data; // 获取查询到的景点数据
			
			        // 将景点坐标转换为unicloud-map需要的格式
			        const points = scenes.map(scene => ({
			          longitude: scene.location.coordinates[0],
			          latitude: scene.location.coordinates[1]
			        }));
			
			        // 设置polyline数据
			        this.polylineData = [{
			          points: points,
			          color: "#FF0000DD", // 线条颜色
			          width: 3, // 线条宽度
			        }];
			
			        // 刷新地图以显示线条
			        this.$refs.map.refresh();
			      } catch (err) {
			        console.error(err);
			      }
			    },
			// 只显示景点
			show1() {
				this.where = {
					category: category,
					type: "景点"
				};
			},
			// 只显示你的位置
			show2() {
				this.where = {
					category: category,
					type: "你的位置"
				};
			},
			// 显示景点+你的位置
			show3() {
				this.where = {
					category: category,
					type: _.in(["景点", "你的位置"])
				};
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
			// 导航弹窗
			showActionSheet(poi) {
				let itemList = ["导航到这里"];
				uni.showActionSheet({
					title: poi.title,
					itemList: itemList,
					success: (res) => {
						let item = itemList[res.tapIndex];
						if (item === "导航到这里") {
							uni.openLocation({
								type: 'gcj02',
								latitude: poi.location.coordinates[1],
								longitude: poi.location.coordinates[0],
								name: poi.title,
								address: poi.address
							});
						}
					}
				});
			}
		},
		computed: {
			heightCom() {
				let systemInfo = uni.getSystemInfoSync();
				return `${systemInfo.windowHeight}px`;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		.btn-box {
			margin: 10px;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;

			.btn {
				flex: 1;
				margin: 0 5px;
			}

			&.first {
				margin: 10px 10px 0 10px;
			}
		}
	}
</style>