import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import request from './utils/request.js'
import store from './store'

Vue.component('cu-custom',cuCustom)
Vue.config.productionTip = false
Vue.prototype.request = request
Vue.prototype.$store = store;

App.mpType = 'app'
uni.getSystemInfo({
  success: function(e) {
    Vue.prototype.StatusBar = e.statusBarHeight;
    let custom = wx.getMenuButtonBoundingClientRect();
    Vue.prototype.Custom = custom;
    Vue.prototype.CustomBar =
      custom.bottom + custom.top - e.statusBarHeight;
  }
});
const app = new Vue({
  ...App,
  store
})
app.$mount()
