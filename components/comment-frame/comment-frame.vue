<template>
	<view>
		<view class="commentFrame">
			<uni-easyinput ref="uipt" suffixIcon="paperplane" v-model="replyContent"
				:placeholder="placeholder">
			</uni-easyinput>
		</view>
	</view>
</template>

<script>
	import {getProvince} from "@/utils/tools.js"	
	export default {
		name:" comment-frame",
		props:{
			commentObj:{
				type:Object,
				default:()=>{
					return {
						
					}
				}
			},
			placeholder:{
				type:String,
				default:"评论点什么吧~"
			}
		},
		data() {
			return {
				replyContent:""				
			};
		}
	}
</script>

<style lang="scss">
.commentFrame {
		width: 100%;
		background: #fff;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
	}
</style>