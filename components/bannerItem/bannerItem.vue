<template>
	<view>
		<view class="box">
			<view class="imgBox" :style="{ backgroundImage: `url(${data.img})` }">
			</view>
			<p>{{ data.title }}</p>
		</view>
	</view>
</template>

<script>
	export default {
		name:"bannerItem",
		data() {
			return {
				
			};
		},
		props: {
			data: Object
		},
	}
</script>

<style lang="scss">
	.box {
		width: 70px;
		float: left;
		margin-right: 15px ;
		.imgBox {
			width: 50px;
			height: 50px;
			// background-image: url('../../static/image/导航栏/攻略游记.png');
			background-repeat: no-repeat;
			background-size: cover;
			background-color: white;
			border-radius: 25px;
			box-shadow: 3px 3px 3px #222327;
			margin: 5px auto;
		}
		p {
			margin-bottom: 5px;
			color: white;
			text-align: center;
		}
	}
</style>