<script>
export default {
  onLaunch: function() {
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "colorui/main.css";
@import "colorui/icon.css";
@import url("./common/animate/animate");
@font-face {
  font-family: "iconfont";
  src: url("https://at.alicdn.com/t/font_883876_3rftf44rqht.ttf")
    format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

page {
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", STHeiti, "Microsoft YaHei", "Microsoft JhengHei", "Source Han Sans SC", "Noto Sans CJK SC", "Source Han Sans CN", "Noto Sans SC", "Source Han Sans TC", "Noto Sans CJK TC", "WenQuanYi Micro Hei", SimSun, sans-serif;
  // background: #222831;
  // color:#FFF;
}
.content {
  padding: 20rpx;
}
view,
scroll-view,
swiper,
button,
input,
textarea,
label,
navigator,
image {
  box-sizing: border-box;
}

image {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}

image.loading::before {
  content: "";
  background-color: #f5f5f5;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -2;
}

image.loading::after {
  content: "\e7f1";
  font-family: "cuIcon";
  position: absolute;
  top: 0;
  left: 0;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  right: 0;
  bottom: 0;
  z-index: -1;
  font-size: 32rpx;
  margin: auto;
  color: #ccc;
  -webkit-animation: cuIcon-spin 2s infinite linear;
  animation: cuIcon-spin 2s infinite linear;
  display: block;
}
</style>
