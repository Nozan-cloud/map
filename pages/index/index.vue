<template>
	<view class="container">
		<!-- 首页导航栏 -->
		<view class="navbar">
			<view class="nav-item" v-for="(item, index) in navItems" :key="index" @click="navigateTo(item.jumpTo)">
				<image class="nav-button" :src="item.img"></image>
				<text>{{item.title}}</text>
			</view>
		</view>

		<!-- 必玩景点轮播图 -->
		<view class="feature-spots">
			<view class="box">
				<text class="title">必玩景点</text>
				<view class="more" @click="toMore('scenicSpot')">
					<text>更多</text>
					<image src="https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/right.png"></image>
				</view>
			</view>

			<!-- 轮播图区域，需要使用uni-app的swiper组件 -->
			<swiper class="swiper" autoplay="true" circular="true" indicator-dots="true">
				<swiper-item class="swiper-item" v-for="(item, index) in featureSpots" :key="index"
					@click="redirectTo('scenicSpot',item._id)">
					<image class="spot-image" :src="item.pictures[0].fileID" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 特色美食 -->
		<view class="delicacies">
			<view class="box">
				<text class="title">特色美食</text>
				<view class="more" @click="toMore('foods')">
					<text>更多</text>
					<image src="https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/right.png"></image>
				</view>
			</view>
			<view class="delicacies-grid">
				<view class="delicacy-item" v-for="(item, index) in delicacies" :key="index" @click="redirectTo('foods',item._id)">
					<image class="delicacy-image" :src="item.pictures[0].fileID"></image>
				</view>
			</view>
		</view>

		<!-- 文创 -->
		<view class="cultural-creations">
			<view class="box">
				<text class="title">文创</text>
				<view class="more" @click="toMore('products')">
					<text>更多</text>
					<image src="https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/right.png"></image>
				</view>
			</view>
			<view class="creations-grid">
				<view class="creation-item" v-for="(item, index) in creations" :key="index" @click="redirectTo('products',item._id)">
					<image class="creation-image" :src="item.pictures[0].fileID"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navItems: [{
						id: 1,
						img: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/导航栏图标/攻略游记.png",
						title: "攻略游记",
						jumpTo: "/pages/uni-cloud-map/uni-cloud-map"
					},
					{
						id: 2,
						img: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/导航栏图标/图鉴.png",
						title: "图鉴",
						jumpTo: "/pages/tujian2/list"
					},
					{
						id: 3,
						img: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/导航栏图标/文创产品.png",
						title: "文创产品",
						jumpTo: "/pages/wait/wait"
					},
					{
						id: 4,
						img: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/导航栏图标/更多.jpg",
						title: "更多",
						jumpTo: "/pages/wait/wait"
					}
				],
				featureSpots: [],
				// 必玩景点的轮播图项目

				delicacies: [
					// 特色美食的项目
				],
				creations: [
					// 文创的项目
				]
			};
		},
		methods: {
			navigateTo(jumpTo) {
				// 跳转到地图
				if (jumpTo === "/pages/uni-cloud-map/uni-cloud-map") {
					uni.switchTab({
						url: jumpTo
					})
					return
				}
				// 跳转到其他
				uni.navigateTo({
					url: jumpTo
				})
			},
			redirectTo(type, id) {
				uni.navigateTo({
					url: `/pages/detailPages/detailPages?type=${type}&id=${id}`
				})
			},
			// 跳转到全部
			toMore(db) {
				uni.navigateTo({
					url: '/pages/allArt/index?db=' + db
				})
			},
			async getDataFood() {
				try {
					const {
						result
					} = await uniCloud.database().collection('foods').limit(6).get();
					this.delicacies = result.data; // 确保赋值的是data属性
				} catch (error) {
					console.error('获取美食数据失败:', error);
				}
			},
			async getDataSpot() {
				try {
					const {
						result
					} = await uniCloud.database().collection('scenicSpot').limit(4).get();
					console.log(result.data); // 打印获取到的数据
					this.featureSpots = result.data; // 确保赋值的是data属性
				} catch (error) {
					console.error('获取景点数据失败:', error);
				}
			},
			async getDataPro() {
				try {
					const {
						result
					} = await uniCloud.database().collection('products').limit(4).get();
					console.log(result.data); // 打印获取到的数据
					this.creations = result.data; // 确保赋值的是data属性
				} catch (error) {
					console.error('获取文创数据失败:', error);
				}
			}
		},
		async mounted() {
			await this.getDataFood();
			await this.getDataSpot();
			await this.getDataPro();
		}

	};
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;

		align-items: center;
	}

	.navbar {
		width: 100%;
		display: flex;
		justify-content: space-around;
		padding: 10px;
	}

	.nav-item {
		font-size: 24rpx;
		border-radius: 50%;

		display: flex;
		justify-content: center;
		flex-direction: column;
		align-content: center;
		align-items: center;
	}

	.nav-button {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.feature-spots,
	.delicacies,
	.cultural-creations {
		width: 95%;
		/* border: 1rpx red solid; */
		display: flex;
		flex-direction: column;



	}

	.box {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		margin: 10rpx 0;
	}

	.title {
		/* border: 1rpx red solid; */
		font-size: 18px;
		padding-left: 10rpx;
		color: #13742F;
	}

	.more {
		padding-right: 10rpx;
		/* border: 1rpx red solid; */
		font-size: 14px;
		color: #4F7165;
		cursor: pointer;
		/* 根据实际需要调整 */
		display: flex;
		/* 使用flex布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */

	}

	.more image {
		width: 45rpx;
		height: 45rpx;
	}

	.swiper {
		/* border: 1rpx red solid; */
		width: 100%;
		height: 500rpx;
		/* 根据实际需要调整 */
		display: flex;
		/* 使用flex布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */

	}

	.swiper-item {
		/* 根据实际需要调整 */
		display: flex;
		/* 使用flex布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.spot-image {
		/* border: 1rpx red solid; */
		/* margin: 0 40rpx ; */
		width: 60%;
		/* padding:  0 40rpx; */
		border-radius: 25rpx;
		height: 450rpx;

		box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.5), -4px 8px 16px rgba(0, 0, 0, 0.5);

	}

	.delicacy-image,
	.creation-image {
		border-radius: 25rpx;
		/* border: 1rpx red solid; */
		width: 100%;
		height: 200rpx;
		object-fit: cover;
	}

	.delicacies-grid,
	.creations-grid {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.delicacy-item,
	.creation-item {
		width: 30%;
		/* 根据实际需要调整 */


	}
</style>