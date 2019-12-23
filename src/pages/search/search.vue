<template>
  <view>
    <view class="cu-form-group">
      <input placeholder="请输入" name="input"></input>
      <text class="iconfont text-orange">&#xeb86;</text>
    </view>
    <view class="cu-list menu">
      <view class="cu-item" v-for="(item,idx) in searchList" :key="item.searchWord">
        <view :style="{color:idx<=2?'red':'grey'}">{{idx+1}}</view>
        <view class="content">
            <view class="word">
                <text class="text-">{{item.searchWord}}</text>
                <image :src="item.iconUrl" aspectFill :class="item.iconType===5?'small-img':''"></image>
            </view>
        <view class="text-gray text-sm flex">
            <view>{{item.content}}</view>
        </view>
        </view>
        <view class="action">
          <view class="text-sm text-grey">{{ item.score }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getSearchot } from "../../utils/api";
export default {
  data() {
    return {
      searchList: []
    };
  },
  onLoad() {
    getSearchot().then(res => {
      this.searchList = res.data;
    });
  }
};
</script>

<style lang="scss" scoped>
.cu-list{
    .content {
        .word{
            display: flex;
            align-items: center;
        }
        .small-img{
            max-width: 30rpx;
        }
        image{
            max-width: 66rpx;
            height: 30rpx;
            margin-left: 10rpx;
        }
    }
}
</style>