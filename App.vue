<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "styles/main.scss";
	
	/* 统一字体 页面背景 */
	#app, uni-app, uni-page, uni-page-wrapper, html, page{
	  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
	  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
	  background-color: rgb(229, 231, 235);
	}
</style>
