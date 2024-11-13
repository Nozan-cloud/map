<template>
	<view>
		<!-- 必玩景区 -->
		<view class="scenicSpot">
			<scenicSpot></scenicSpot>
		</view>
		<!-- 特色美食 -->
		<view class="foods">
			<foods></foods>
		</view>
	</view>
</template>

<script>
import scenicSpot from '../scenicSpot/index.vue' 
import foods from '../foods/index.vue'
	export default {
		data() {
			return {
				
			};
		},
		components:{
			scenicSpot, // 必玩景区
			foods // 特色美食
		}
	}
</script>

<style lang="scss">
	.scenicSpot , .foods{
		width: 350px;
		margin: 20px auto;
	}
</style>
