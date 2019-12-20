<template>
  <view class="song-item" @click="toSongList(song.id)">
    <view class="song-item-contain">
      <view class="image" :style="{ backgroundImage: `url(${song.imageUrl})` }">
        <view class="wy-tag top-right">
          <text class="iconfont wy-icon">&#xe61b;</text>
          {{song.playCount | formatCount}}
        </view>
      </view>
      <text class="song-name">{{song.name}}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    song: {
      type: Object,
      default: null
    }
  },
  filters: {
    formatCount(v) {
      if (v / 10000 > 1) {
        return Math.floor(v / 10000) + "万";
      } else if (v / 100000000 > 1) {
        (v / 100000000).toFixed(1) + "亿";
      }
    }
  },
  methods:{
    toSongList(id){
      uni.navigateTo({
        url: '/pages/songInfoAndList/songInfoAndList?id='+id
      })
    }
  }
};
</script>

<style lang="scss">
.song-item {
  padding: 0 5rpx 16rpx;
  &-contain {
    .image {
      position: relative;
      border-radius: 5px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      width: 220rpx;
      height: 220rpx;
    }
    .song-name {
      font-size: 24rpx;
    }
  }
  .top-right {
    top: 6rpx;
    right: 6rpx;
  }
}
</style>