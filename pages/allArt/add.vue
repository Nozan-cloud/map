<template>
	<view class="add">
		<form @submit="onSubmit">
			<!-- {{formValue.title}}
			{{formValue.text}}
			{{formValue.content}} 测试用-->
			<!-- v-model 双向绑定 -->
			<view class="item">
				<input v-model="formValue.title" type="text" name="title" placeholder="请输入标题"/>
			</view>
			
			<view class="item">
				<input v-model="formValue.text" type="text" name="author" placeholder="请输入作者"/>
			</view>
			
			<view class="item">
				<textarea v-model="formValue.content" type="content" name="content" placeholder="请输入详细内容"/>
			</view>
			<view class="item">
				<!-- 从文档复制过来粘贴 -->
				<uni-file-picker 
					v-model="pictures" 
					fileMediatype="image" 
					mode="grid" 
				
					
					
				/>
			</view>
			<view class="item">
				<button form-type="submit">重置</button>
				<button form-type="submit" type="primary" :disabled="isdisabled(formValue)">提交</button>
			</view>
			
		</form>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//表单一开始为空,fomevalue里面的为必填选项
				formValue:{
					title:"",
					text:"",
					content:""
				},
				pictures:[],//数组、双向绑定
				//非必填选项：图片
				//pictures:[]
			};
		},
		methods:{
		
			//判断表单是否有空,即按钮是否禁用
			isdisabled(obj){
				// for(let key in obj){//拿到他的key值title text content
				// //console.log(key);
				// 	if(!obj[key])return true;
				// }
				let bool = Object.keys(obj).some((key,value)=>{
					return obj[key]==''
				})
				return bool
				
			},
			
			onSubmit(e) {
			  let detail = e.detail.value; // detail是个对象
			  
			  // 假设你想要让用户选择是向'foods'还是'spot'集合添加数据
			  let collectionName = 'foods'; // 或者根据实际情况动态设置这个值
			  
			  uniCloud.callFunction({
			    name: "art_add_row",
			    data: {
			      detail, // 传一个对象
			      pictures: this.pictures, // 在data里面拿到需要this
			      collectionName // 传递集合名称
			    },
			  }).then(res => {
			    console.log(this.pictures);
			    uni.showToast({
			      title: "发布成功"
			    });
			    // 直接返回首页发布成功可能会看不到，加一个延迟
			    setTimeout(() => {
			      // 酱紫返回即刷新
			      uni.reLaunch({
			        url: "/pages/index/index"
			      });
			    }, 1500);
			  });
			}
		}
	}
</script>

<style lang="scss">
.add{
	padding: 30rpx;
	.item{
		padding-bottom: 20rpx;
		input,textarea{
			border: 1rpx solid #eee;
			height: 80rpx;
			padding: 0 20rpx;
		}
		textarea{
			height: 200rpx;
			width: 100%;
			box-sizing: border-box;
		}
		button{
			margin-bottom: 20rpx;
		}
	}
}
</style>
