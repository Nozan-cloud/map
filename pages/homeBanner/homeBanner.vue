<template>
	<view class="part">
		<view class="title">
			<img src="../../static/image/导航.png" alt="" />
			<span>导航</span>
		</view>
		<view class="box">
			<view class="itemBox" v-for="item in bannerData" :key="item.id">
				<bannerItem :data="item"></bannerItem>
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
						img: "../../static/image/导航栏/攻略游记.png",
						title: "攻略游记"
					},
					{
						id: 2,
						img: "../../static/image/导航栏/图鉴.png",
						title: "图鉴"
					},
					{
						id: 3,
						img: "../../static/image/导航栏/文创产品.png",
						title: "文创产品"
					},
					{
						id: 4,
						img: "../../static/image/导航栏/更多.jpg",
						title: "更多"
					}
				]
			};
		},
		components: {
			bannerItem
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
