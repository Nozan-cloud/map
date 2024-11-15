<template>
	<!-- 必玩景区小组件 -->
	<view>
		<view class="box" :style="{ backgroundImage: `url(${data.pictures[0]})` }">
			<view class="summary" >
				<p class="title">{{data.title }}</p>
				<view class="labelBox">
					<span class="label" v-for="item in data.label" :key = "item">
						{{ item }}
					</span>
				</view>
				<view class="position">
					<img src="../../static/image/位置图标.png" alt="" />
					<span class="detail"> 483号华南农业大学</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"scenicSpotItem",
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
	.box {
		width: 330px;
		height: 230px;
		// background-image:url('../../static/image/华农景点-农博馆.jpg');
		background-size: cover;
		background-repeat: no-repeat;
		border-radius: 15px;
		// border: 1px solid black;
		box-shadow: 3px 3px 3px #d1cfc9;
		position: relative;
		.summary {
			// padding-top: 130px;
			// padding-left: 10px;
			// width: 200px;
			padding: 5px 15px;
			border-radius: 10px;
			position: absolute;
			top: 130px;
			// left: 10px;
			background-color: rgba(0, 0, 0, 0.2);
			.title {
				color: white;
				font-size: 20px;
				font-weight: bold;
			}
			.labelBox {
				margin-top: 5px;
				.label {
					margin: 5px;
					background-color: rgba(255, 255, 255, 0.6);
					padding: 5px;
					border-radius: 10px;
				}
			}
			.position {
				margin-top: 10px;
				img {
					width: 20px;
					height: 20px;
				}
				.detail {
					color:white;
					font-size: 18px;
					font-weight: bold;
				}
			}
		}
	}
</style>