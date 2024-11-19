<template>  
  <view class="container">  
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" :collection="collectionList" field="name,pictures,visitSpot,recommendedTime,text" :where="queryWhere" :getone="true" :manual="true">  
      <view v-if="error">{{error.message}}</view>  
      <view v-else-if="loading">  
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>  
      </view>  
      <view v-else-if="data">   
        <view>  
          <text></text>  
          <text v-if="data.pictures && data.pictures.length > 0">  
            <image :src="data.pictures[0]" mode="aspectFill" class="image-style" />  
          </text>  
          <text v-else>没有图片可显示</text> <!-- 如果没有图片，显示提示 -->  
        </view>
		<view class="info-container">
		    <view class="title-container">
		      <view class="title-container">
		        <text><hr style="border:1 dashed #987cb9" width="100%" color=#987cb9 SIZE=1></text>
		      </view>
			</view>
		    <view class="info-container">
		      <view class="info-box1">
				  <text>{{data.name}}</text>
		      </view>
		      <view class="info-box2">
		        <text class="pink-kai">观赏时间\n</text>
		        <text>{{data.recommendedTime}}</text>
				<br>
				<text class="pink-kai">观赏地点\n</text>
				<text>{{data.visitSpot}}</text>
		      </view>
		    </view>
		    <view class="description-container">
		      <text>{{data.text}}</text>
		    </view>
		</view>
	</view>	
    </unicloud-db>    
  </view>  
</template>

<script>
  // 由schema2code生成，包含校验规则和enum静态数据
  import { enumConverter } from '../../js_sdk/validator/tujian2.js'
  const db = uniCloud.database()

  export default {
    data() {
      return {
        queryWhere: '',
        collectionList: "tujian2",
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        },
        options: {
          // 将scheme enum 属性静态数据中的value转成text
          ...enumConverter
        }
      }
    },
    onLoad(e) {
      this._id = e.id
    },
    onReady() {
      if (this._id) {
        this.queryWhere = '_id=="' + this._id + '"'
      }
    },
    methods: {
      handleUpdate() {
        // 打开修改页面
        uni.navigateTo({
          url: './edit?id=' + this._id,
          events: {
            // 监听修改页面成功修改数据后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      },
      handleDelete() {
        this.$refs.udb.remove(this._id, {
          success: (res) => {
            // 删除数据成功后跳转到list页面
            uni.navigateTo({
              url: './list'
            })
          }
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
	background-image: url('/static/image/3.jpg'); /* 指定背景图片的路径 */
	background-size: cover; /* 背景图片覆盖整个元素 */
	background-position: 50% 50%;
	  overflow-y: auto; /* 当内容超出容器高度时，显示滚动条 */
  }
.img {
  position: relative; /* 设置相对定位 */
  width: 100%; /* 容器宽度占满100% */
  overflow: hidden; /* 防止图片溢出 */
}
.image-style {
  top: 0; /* 顶部对齐 */
  left: 0; /* 左侧对齐 */
  width: 100%; /* 宽度放大到两倍 */
  border-radius: 10px; /* 设置圆角大小 */

  transform-origin: center; /* 设置缩放中心点为图片中心 */
}


  
  /* 在app.wxss或者页面的.wxss文件中添加以下样式 */
  .info-container {
    display: flex; /* 使用flex布局 */
    flex-wrap: wrap; /* 允许项目换行 */
    width: 100%; /* 容器宽度占满100% */
  }
  
  .title-container {
    width: 100%; /* 标题容器宽度占满 */
  }
  
  .info-container{
    flex: 1; /* 每个信息盒子都平均分配剩余空间 */
    margin: 10px; /* 间隙 */
    text-align: center; /* 文本居中对齐 */
	}
	@font-face {
	font-family: 'daoli'; /* 自定义字体名称 */
	src: url('/static/fonts/AlimamaDaoLiTi.ttf') format('truetype'); /* 字体文件路径和格式 */
	}
  .info-box1{
	font-family: 'daoli', 'KaiTi', sans-serif; /* 首先使用自定义字体，然后是楷体，最后是回退字体 */
	ont-family: 'daoli', sans-serif; /* 首先使用自定义字体，然后是回退字体 */
	font-size: 2.5em;
	flex: 0 0 30%; /* box1 固定宽度为30% */
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	text-align: center;
	padding: 10px;
	writing-mode: vertical-lr; /* 从上往下垂直排列文本 */
    text-orientation: mixed; /* 保持正常的文本方向在数字和字母中 */
	white-space: pre-wrap; /* 保持空白符和换行符，同时允许在单词内部进行换行 */
  }
  .info-box2{
	background-image: url('/static/image/1.jpg');
	background-size: 30%; /* 这将背景图片的大小设置为容器大小的20% */
	background-repeat: no-repeat;
	flex: 0 0 60%; /* box2 固定宽度为60% */
	font-family: 'KaiTi', sans-serif; /* 设置字体为楷书，如果没有 KaiTi 则回退到 sans-serif */
	font-size: 1.3em;
	font-weight: bold; /* 设置文字为粗体 */
	color: pink; /* 设置文字颜色为粉红色 */
  }
     .pink-kai {
          color: green; /* 设置文字颜色为粉红色 */
          font-family: 'KaiTi', 'SimSun', sans-serif; /* 设置字体为楷书，如果没有 KaiTi 则回退到 SimSun */
      }
  .description-container {
    width: 100%; /* 描述容器宽度占满 */
    margin-top: 10px; /* 与上方信息盒子之间有间隙 */
	font-family: 'KaiTi', sans-serif; /* 设置字体为楷书，如果没有 KaiTi 则回退到 sans-serif */
	font-size: 1.3em;
	margin-right: 10%;
  }

</style>
