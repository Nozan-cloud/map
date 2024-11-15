<template>
	<view class="Box">
		<view class="foodsBox" :style="{ backgroundImage: `url(${data.pictures[0]})` }">
			<!-- 蒙层 -->
			<view class="cover">
				<!-- 标题 -->
				<view class="title">
					{{ data.title }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"foodItem",
		data() {
			return {
				
			};
		},
		
		props: {
			data: Object
		}
	}
</script>

<style lang="scss">
	.Box {
		width: 342px;
		margin: auto;
	}
	.foodsBox {
		width: 100px;
		height: 100px;
		margin-right: 14px;
		border-radius: 8px;
		// background-image: url("../../static/image/华农酸奶.jpg");
		background-size: cover;
		background-repeat: no-repeat;
		float: left;
		margin-top: 6px;
		box-shadow: 3px 3px 3px #d1cfc9;
		.cover {
			width: 100px;
			height: 100px;
			border-radius: 8px;
			background-color: rgba(0, 0, 0, 0.2);
			.title {
				color: white;
				width: 100px;
				padding-top: 70px ;
				margin: 0 auto;
				text-align: center;
			}
		}
	}
	.foodsBox:nth-child(3n)  {
		margin-right: 0px;
	}
</style>