<template>
		<view class="swiperBox">
			<img class="cover" :src="data.pictures[0].fileID" alt="" />
			<!-- 蒙层 -->
			<!-- <view class="cover"> -->
				<!-- 标题 -->
				<view class="title">
					{{ data.title }}
				</view>
			<!-- </view> -->
		</view>
</template>

<script>
	export default {
		name:"swiperSonItem",
		data() {
			return {
				
			};
		},
		props: {
			data: Object
		},
		updated() {
			console.log(data)
		}
	}
</script>

<style lang="scss">
	// .Box {
	// 	width: 342px;
	// 	margin: auto;
	// }
	.swiperBox {
		width: 100px;
		height: 100px;
		margin-right: 15px;
		border-radius: 8px;
		background-size: cover;
		background-repeat: no-repeat;
		float: left;
		margin-top: 6px;
		box-shadow: 3px 3px 3px #d1cfc9;
		position: relative;
		.cover {
			width: 100px;
			height: 100px;
			border-radius: 8px;
			background-color: rgba(0, 0, 0, 0.2);
		}
		.title {
			color: white;
			width: 100px;
			padding-top: 70px ;
			margin: 0 auto;
			text-align: center;
			position: absolute;
			bottom: 2px;
			font-weight: bold;
		}
	}
	.swiperBox:nth-child(3n)  {
		margin-right: 0px;
	}
</style>