<template>
	<view class="part">
		<view class="title">
			<img src="../../static/image/导航.png" alt="" />
			<span>导航</span>
		</view>
		<view class="box">
			<view class="itemBox" v-for="item in bannerData" :key="item.id">
				<view @click="navigateTo(item.jumpTo)">
					<bannerItem :data="item"></bannerItem>
				</view>
			</view>
			<view class="space"></view>
		</view>
	</view>
</template>

<script>
	import bannerItem from '../../components/bannerItem/bannerItem.vue';
	export default {
		data() {
			return {
				bannerData: [
					{
						id: 1,
						img: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/导航栏图标/攻略游记.png",
						title: "攻略游记",
						jumpTo: "/pages/uni-cloud-map/uni-cloud-map"
					},
					{
						id: 2,
						img: "https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/导航栏图标/图鉴.png",
						title: "图鉴",
						jumpTo: "/pages/dictionar/dictionar"
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
						jumpTo:"/pages/wait/wait"
					}
				]
			};
		},
		components: {
			bannerItem
		},
		methods: {
			navigateTo(jumpTo) {
				// 跳转到地图
				if ( jumpTo === "/pages/uni-cloud-map/uni-cloud-map" ) {
					uni.switchTab({
						url: jumpTo
					})
					return
				}
				// 跳转到其他
				uni.navigateTo({
					url: jumpTo
				})
			}
		}
	}
</script>

<style lang="scss">
	// .part {
	// 	background-color: #e7f1ea;
	// 	padding-bottom: 20px;
	// 	// box-shadow: 0px 1px 3px #d1cfc9;
	// }
	.title {
		// margin-left: 8px;
		margin-top: 3px;
		padding: 3px 5px;
		width: 80px;
		background-color: #13742f;
		color: white;
		font-size: 20px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		border-bottom-right-radius: 3px;
		box-shadow: 3px 3px 3px #d1cfc9;
		img {
			width: 25px;
			margin-right: 5px;
		}
	}
	.box {
		margin:2px auto;
		background-color: #13742f;
		border-radius: 20px;
		border-top-left-radius: 0px;
		width: 360px;
		box-shadow: 3px 3px 3px #d1cfc9;
		.itemBox {
			width: 340px;
			margin: 0 auto;
		}
		.space {
			clear: left;
		}
	}
</style>
