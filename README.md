# 感谢使用photo-choose

**这是一个简单的vue图片上传的组件，支持自定义是否上传视频。并且本地先处理好了图片的exif信息，避免上传之后出现图片方向不对的问题**

## 使用步骤
```js
	npm install photo-choose -S
	// main.js引入
	impot photoChoose from "photo-choose"
	Vue.use(photoChoose)
	
```
```js
	// 在需要的页面中使用
	<photo-choose :mediaType='Number' :initClass='[]'></photo-choose>
	mediaType：上传的媒体类型 默认1只支持图片，2支持视频+图片 3只支持视频
	initClass: 添加的类名用来写样式 默认是[]  注：如果mediaType是2，数组需要有两项，因为安卓手机图片视频分开两个按钮得写两个按钮样式。其它情况数组只取第一项当类名
	methods里面定义一个chooseEnd方法: 返回一个Object 其中包括file:选好的file文件  type:1图片 2视频   size:选择的file大小(单位m)
	
```
