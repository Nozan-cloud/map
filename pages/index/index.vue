<template>
	<view>
		<!-- 导航栏 -->
		<view class="banner" style="margin-top: 10px;">
			<homeBanner></homeBanner>
		</view>
		<!-- 必玩景区 -->
		<view class="scenicSpot">
			<scenicSpot></scenicSpot>
		</view>
		<!-- 特色美食 -->
		<view class="foods">
			<foods></foods>
		</view>
		<!-- 文创产品 -->
		<view class="products">
			<products :baseImgUrl="baseImgUrl"></products>
		</view>
	</view>
</template>

<script>
import scenicSpot from '../scenicSpot/index.vue' 
import foods from '../foods/index.vue'
import products from '../Product/Product.vue'
import homeBanner from '../homeBanner/homeBanner.vue'
	export default {
		data() {
			return {
				// 下载图片基地址
				baseImgUrl:'https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创',
			};
		},
		components:{
			scenicSpot, // 必玩景区
			foods, // 特色美食
			products, //文创产品
			homeBanner //导航栏
		}
	}
</script>

<style lang="scss">
	.scenicSpot, .foods, .products, .banner{
		width: 350px;
		margin: 30px auto;
	}
</style>
