<template>
  <scroll-view scroll-y class="songinfoAndList" v-if="fetchFinish">
    <view class="song-cardinfo padding">
      <view class="bg-img song-bgimg" :style="{ backgroundImage: `url(${songInfo.imageUrl})` }"></view>
      <view class="cu-chat">
        <text class="text-xl" @click="isShowInfo=true">{{ songInfo.name }} ></text>
        <view class="padding-tb">
          <view class="cu-avatar round" :style="{ backgroundImage: `url(${songInfo.avatarUrl})` }"></view>
          <text class="text-df padding-left-xs padding-right-sm">{{ songInfo.nickname }}</text>
          <text class="text-sm">{{ songInfo.createTime }}创建</text>
        </view>
        <text class="text-sm">{{ songInfo.desc }}</text>
      </view>

      <view class="song-actions flex justify-around padding-tb-sm">
        <view class="cu-chat">
          <text class="iconfont">&#xe63d;</text>
          <text class="text-sm">{{ songInfo.commentCount }}</text>
        </view>
        <view class="cu-chat">
          <text class="iconfont">&#xe60b;</text>
          <text class="text-sm">{{ songInfo.shareCount }}</text>
        </view>
        <view class="cu-chat">
          <text class="iconfont">&#xe628;</text>
          <text class="text-sm">{{ songInfo.trackCount }}</text>
        </view>
        <view class="cu-chat">
          <text class="iconfont">&#xe60c;</text>
          <text class="text-sm">{{ songInfo.subscribedCount }}</text>
        </view>
      </view>
    </view>

    <view class="cu-list menu">
      <view class="cu-item" v-for="(item,idx) in songList" :key="item.id" @click="toPlaying(idx)">
        <view>{{idx+1}}</view>
        <view class="content">
          <view>{{item.name}}</view>
          <view class="text-gray text-sm flex">
            <view>{{item.artistName}} - {{item.alName}}</view>
          </view>
        </view>
        <view class="action">
          <view>ggg</view>
        </view>
      </view>
    </view>

    <view class="cu-modal" :class="isShowInfo?'show':''">
      <view class="cu-dialog">
        <view class="cu-contain">
          <view class="cu-bar justify-end text-white">
            <view class="action" @click="isShowInfo=false">
              <text class="cuIcon-close"></text>
            </view>
          </view>
          <view class="bg-img song-img" :style="{ backgroundImage: `url(${songInfo.imageUrl})` }"></view>
          <view class="text-xl padding-top padding-bottom-lg song-name">{{ songInfo.name }}</view>

          <view class="song-sub text-sm padding">
            <view>
              <text v-for="item in songInfo.tags" :key="item" class='cu-tag round song-tag text-sm'>{{item}}</text>
            </view>
            <view class="padding-top">{{ songInfo.desc }}</view>
          </view>
          
          <view class="song-savebtn">
            <button class="cu-btn round" @click="saveImg">保存封面</button>
          </view>
        </view>
        <view class="bg-img cu-bg-img" :style="{ backgroundImage: `url(${songInfo.imageUrl})` }">
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  data() {
    return {
      songInfo: {},
      songList: [],
      fetchFinish: false,
      isShowInfo: false
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    ...mapMutations(['setCurrentTracks']),
    async getData() {
      this.fetchFinish = false;
      const songInfoData = await this.request("/playlist/detail?id=3068492515");
      const data = songInfoData.playlist;
      this.songInfo = {
        name: data.name,
        imageUrl: data.coverImgUrl,
        desc: data.description,
        playCount: data.playCount,
        trackCount: data.trackCount,
        subscribedCount: data.subscribedCount,
        shareCount: data.shareCount,
        commentCount: data.commentCount,
        avatarUrl: data.creator.avatarUrl,
        nickname: data.creator.nickname,
        createTime: new Date(data.createTime).toLocaleDateString(),
        tags: data.tags
      };
      this.songList = data.tracks.map(item => {
        return {
          id: item.id,
          name: item.name,
          artistName: item.ar[0].name,
          alName: item.al.name,
          cover: item.al.picUrl,
        };
      });
      this.setCurrentTracks(this.songList)
      this.fetchFinish = true;
    },
    saveImg(){
      uni.downloadFile({
          url: this.songInfo.imageUrl,
          success: (res) => {
              if (res.statusCode === 200) {
                  uni.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: ()=>{
                      uni.showToast()
                    }
                  })
              }
          }
      });
    },
    toPlaying(idx){
      uni.navigateTo({
        url: '/pages/playing/playing?nowIndex='+idx
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.songinfoAndList {
  .song-cardinfo {
    position: relative;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .song-bgimg {
    position: absolute;
    height: 100%;
    width: 100%;
    filter: blur(25px);
    top: 0;
    z-index: -1;
  }
  .songinfo-image {
    min-width: 220rpx;
    min-height: 220rpx;
    border-radius: 5px;
  }
  .song-actions {
    text {
      text-align: center;
    }
    .iconfont {
      font-size: 60rpx;
      text-align: center;
    }
  }
  .cu-list {
    background: rgba(255, 255, 255, 0.85);
    border-radius: 10px;
    .cu-item {
      background-color: transparent;
    }
  }
  .cu-modal {
    color: #FFF;
    .cu-dialog {
      width: 100%;
      height: 100%;
      border-radius: 0;
      .cu-contain{
        position: absolute;
        height: 100%;
        z-index: 200;
      }
      .cu-bg-img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        filter: blur(80px);
      }
    }
    .song-img {
      width: 300rpx;
      height: 300rpx;
      border-radius: 5px;
      margin: 0 auto;
    }
    .song-name{
      border-bottom: 1px solid gainsboro;
    }
    .song-sub{
      >view{
        text-align: left;
      }
      .song-tag{
        background-color: rgba(255, 255, 255, 0.3)
      }
    }
    .song-savebtn{
      position: absolute;
      width: 100%;
      bottom: 50rpx;
      button{
        background-color: transparent;
        border: 1px solid gainsboro;
        color: white;
        margin: auto;
      }
    }
  }
}
</style>