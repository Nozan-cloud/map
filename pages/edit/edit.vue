<template>
	<view class="edit">
		<view class="title">
			<input type="text" v-model="artObj.title" placeholder="请输入完整标题" placeholder-class="placeholderClass" />
		</view>
		<view class="content">
			<editor class="myEdit" placeholder="写点什么吧~" show-img-size show-img-toolbar show-img-resize
				@ready="onEditReady" @focus="onFocus" @statuschange="onStatuschange"></editor>
		</view>
		<view class="buttonGroup">
			<u-button type="primary" @click="onsubmit" text="确认发表" :disabled="!artObj.title.length"></u-button>
		</view>
		<view class="tools" v-if="toolShow">
			<view class="item" @click="clickHead"><text class="iconfont icon-zitibiaoti"
					:class="headShow?'active':''"></text></view>
			<view class="item" @click="clickBold"><text class="iconfont icon-zitijiacu"
					:class="boldShow?'active':''"></text></view>
			<view class="item" @click="clickItalic"><text class="iconfont icon-zitixieti"
					:class="italicShow?'active':''"></text></view>
			<view class="item" @click="clickDivider"><text class="iconfont icon-fengexian"></text></view>
			<view class="item" @click="clickInsertImage"><text class="iconfont icon-charutupian"></text></view>
			<view class="item" @click="editOk"><text class="iconfont icon-duigou_kuai"></text></view>
		</view>
	</view>
</template>

<script>
	import {
		getImgSrc,
		getProvince
	} from "@/utils/tools.js"
	const db = uniCloud.database() //获取数据库实例
	export default {
		data() {
			return {
				toolShow: false,
				headShow: false,
				boldShow: false,
				italicShow: false,
				artObj: {
					title: "",
					content: "",
					description: "", //摘要
					pictures: "",
					province: ""
				}
			};
		},
		onLoad() {
			getProvince().then(res => {
				//console.log(res)//打印结果//可能是成功后的值也可能是失败后抛出
				this.artObj.province = res
			})
		},
		methods: {

			//确认发表
			onsubmit() {
				this.editorCtx.getContents({
					success: res => {
						//console.log(res)
						//this.artObj.title=res.title
						this.artObj.content = res.html;
						this.artObj.description = res.text.slice(0, 80)
						this.artObj.pictures = getImgSrc(res.html, 3)
						uni.showLoading({
							title: "发布中"
						})
						this.addData()
					}
				})
			},
			addData() {
				db.collection("quanzi-articles").add({
					...this.artObj
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: "发布成功"
					})
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/index/index"
						})
					}, 800)
				})
			},

			//初始化,获取富文本的上下文
			onEditReady() {
				uni.createSelectorQuery().in(this).select('.myEdit').fields({
					size: true,
					context: true
				}, res => {
					this.editorCtx = res.context
				}).exec()
			},

			//添加图像
			clickInsertImage() {
				uni.chooseImage({
					success: async res => { //async,await异步同步化
						uni.showLoading({
							title: "上传中，请稍后",
							mask: true //阻止乱点
						})
						for (let item of res.tempFiles) {

							let res = await uniCloud.uploadFile({ //await相当于等它异步成功后返回一个值
								filePath: item.path,
								cloudPath: item.name,

							}).then(res => {
								// console.log("https://env-00jxhjkqc13p.normal.cloudstatic.cn"+String(res.fileID).slice(24))  
								
								// console.log(res.fileID)
								this.editorCtx.insertImage({
									
									src: res.fileID//真不容易啊这个地方  
									
								})
								 
							})
						}
						uni.hideLoading()
					}
				})
			},

			//console.log("https"+JSON.stringify(res.fileID).slice(6,))
			checkStatus(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},


			// 当样式发生改变的时候
			onStatuschange(e) {
				let detail = e.detail
				this.checkStatus("header", detail, "headShow");
				this.checkStatus("bold", detail, "boldShow");
				this.checkStatus("italic", detail, "italicShow");
			},


			//点击工具条的确认
			editOk() {
				this.toolShow = false;
			},
			//加粗
			clickBold() {
				this.boldShow = !this.boldShow
				this.editorCtx.format("bold")
			},

			//设置倾斜
			clickItalic() {
				this.italicShow = !this.italicShow;
				this.editorCtx.format("italic")
			},

			//添加大标题
			clickHead() {
				this.headShow = !this.headShow
				this.editorCtx.format("header", this.headShow ? 'H2' : false)
			},

			//添加分割线
			clickDivider() {
				this.editorCtx.insertDivider();
			},
			//获取焦点
			onFocus() {
				this.toolShow = true
			}


		}
	}
</script>

<style lang="scss">
	/deep/ .ql-blank::before {
		//写一个穿透
		font-style: normal;
		color: #e0e0e0;
	}

	.edit {
		padding: 30rpx;

		.title {
			input {
				font-size: 46rpx;
				height: 120rpx;
				margin-bottom: 30rpx;
				border-bottom: 1px solid #e4e4e4;
			}

			.placeholderClass {
				color: #e0e0e0;
			}

		}

		.content {
			.myEdit {
				height: calc(100vh - 500rpx); //全屏的高度减去500rpx
				margin-bottom: 30rpx;
			}

		}

		.tools {
			width: 100%;
			height: 80rpx;
			background: #fff;
			border-top: 1rpx solid #f4f4f4;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.iconfont {
				font-size: 36rpx;
				color: #888;

				&.active {
					//如果类名有active就把它变成另外一款颜色
					color: #13742F;
				}
			}
		}

	}
</style>