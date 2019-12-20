<template>
  <view class="recommend">
    <swiper
      class="card-swiper"
      :indicator-dots="true"
      :circular="true"
      :autoplay="true"
      interval="5000"
      duration="500"
      @change="cardSwiper"
      indicator-color="#8799a3"
      indicator-active-color="#0081ff"
    >
      <swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
        <view class="swiper-item">
          <image :src="item.imageUrl" mode="aspectFill">
        </view>
      </swiper-item>
    </swiper>

    <view class="icons-view">
      <view class="icons-contain">
        <view class="icons-inner">
          <text class="iconfont">&#xe65b;</text>
        </view>
        <text class="iconfont-info">每日推荐</text>
      </view>
      <view class="icons-contain">
        <view class="icons-inner">
          <text class="iconfont">&#xe674;</text>
        </view>
        <text class="iconfont-info">歌单</text>
      </view>
      <view class="icons-contain">
        <view class="icons-inner">
          <text class="iconfont">&#xe6f7;</text>
        </view>
        <text class="iconfont-info">排行榜</text>
      </view>
    </view>

    <view class="padding-tb padding-left-sm solid-top text-lg">推荐歌单</view>
    <view class="grid col-3">
      <view v-for="(item) in songCards" :key="item.id" >
        <song-card :song="item"></song-card>
      </view>
    </view>

    <view class="padding-tb padding-left-sm solid-top text-lg">随便看看</view>
    <view v-if="videoList.length>0">
      <view
        class="cu-card case video-list"
        v-for="(item,idx) in videoList"
        :key="item.id"
        @click="getVideoRec(item.id,idx)"
      >
        <view class="cu-item shadow">
          <view class="image">
            <image :src="item.cover" mode="widthFix" v-show="idx!==currentIdx"></image>
            <video
              :src="item.videoRce"
              v-show="idx===currentIdx"
              :id="`video${idx}`"
              autoplay
              :controls="false"
              objectFit="widthFix"
            ></video>
            <view class="cu-bar bg-shadeBottom flex justify-between" v-show="idx!==currentIdx">
              <view class="wy-tag btm-left flex align-center">
                <text class="iconfont wy-icon">&#xe769;</text>
                <text>{{item.playCount}}</text>
              </view>
              <view class="wy-tag btm-right flex align-center">
                <text class="iconfont wy-icon">&#xe6f7;</text>
                <text>{{item.duration}}</text>
              </view>
            </view>
          </view>
          <view class="text-cut text-sm padding-sm">{{item.name}} - {{item.artistName}}</view>
        </view>
        <text class="iconfont control-play" v-show="idx!==currentIdx">&#xe625;</text>
      </view>
    </view>

  </view>
</template>
<script>
import SongCard from '../../components/songCard'
import { getRecommentSonglist, getAlltypeMv, getBanner } from "../../utils/api";
export default {
  data() {
    return {
      cardCur: 0,
      icons: [
        {
          icon: "&#xe65b",
          info: "每日推荐"
        },
        {
          icon: "&#xe674",
          info: "歌单"
        },
        {
          icon: "&#xe6f7",
          info: "排行榜"
        }
      ],
      swiperList: [
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/E9NihLJVETSPL8ZZxlEuUQ==/109951164541816124.jpg",
        //   id: "10905804"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/S6X6JetexJawtk5Oo-weHw==/109951164542223793.jpg",
        //   id: "10905772"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/ui1Yv7azWHbF5JhxLp1WIA==/109951164541425768.jpg",
        //   id: "0"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/kf5F9_mEkSJNA46MyK84ug==/109951164541433601.jpg",
        //   id: "84005274"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/0SO6J_XKU0eHlsSGHxFFtQ==/109951164541450532.jpg",
        //   id: "83826010"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/MxNXMnQiLI9E6iFM5lgb7g==/109951164542200776.jpg",
        //   id: "1386259535"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/NQP_bnKzlslZmnranSJuQQ==/109951164541452440.jpg",
        //   id: "1408587372"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/kssvcOARkiOo_T5WCGTq1g==/109951164541465067.jpg",
        //   id: "1408738743"
        // },
        // {
        //   imageUrl:
        //     "http://p1.music.126.net/iVrxuD2jTLe4OREFqDoZAQ==/109951164541460356.jpg",
        //   id: "1408776050"
        // }
      ],
      songCards: [
        // {
        //   id: 3112654749,
        //   name: "岁月万花筒 | 歌声中重温即将逝去的10年代",
        //   copywriter: "编辑推荐：过去的10年代，哪首歌是你的最爱呢~",
        //   imageUrl:
        //     "https://p1.music.126.net/V9D5mC-EgLxzV-k-jugmyA==/109951164541181281.jpg",
        //   playCount: "413467"
        // },
        // {
        //   id: 3097856403,
        //   name: "欧美｜漫溯在霓虹街 掩于夜幕下的温柔",
        //   copywriter:
        //     "编辑推荐：在一个晴好的日子遇见你，发现你是一切美好的总和~",
        //   imageUrl:
        //     "https://p1.music.126.net/koEqZgg8dTVWuUccrZoVxQ==/109951164519954466.jpg",
        //   playCount: "140282"
        // },
        // {
        //   id: 979321026,
        //   name: "好听到单曲循环",
        //   copywriter: "热门推荐",
        //   imageUrl:
        //     "https://p1.music.126.net/1gNcBmzdIaQtU00Dvp_TvQ==/109951163912081772.jpg",
        //   playCount: "103902160"
        // },
        // {
        //   id: 3068492515,
        //   name: "2019就快结束了，你的愿望实现了没",
        //   copywriter: "热门推荐",
        //   imageUrl:
        //     "https://p1.music.126.net/P347rpSGpaP4DoKbZ6Gyiw==/109951164499552611.jpg",
        //   playCount: "2242331"
        // },
        // {
        //   id: 3027102694,
        //   name: "欧美励志//只有奋笔疾书，才能逆风前行",
        //   copywriter: "热门推荐",
        //   imageUrl:
        //     "https://p1.music.126.net/1Nx7mLel4YoVjEYpPhqBYw==/109951164503487070.jpg",
        //   playCount: "899911"
        // },
        // {
        //   id: 1984054025,
        //   name: "赖冠霖的手机歌单",
        //   copywriter: "热门推荐",
        //   imageUrl:
        //     "https://p1.music.126.net/wiJhSfiYEqfR2BPZvHrY8w==/19060034067946412.jpg",
        //   playCount: "860830"
        // }
      ],
      videoList: [],
      currentIdx: -1
    };
  },
  components:{
    SongCard
  },
  onLoad: function() {
    getBanner().then(res=>{
      this.swiperList = res.banners.map(item=>{
        return {
          imageUrl: item.imageUrl,
          id:item.targetId
        }
      })
    })
    getRecommentSonglist().then(res=>{
      this.songCards = res.result.map(item=>{
        return{
          id: item.id,
          imageUrl: item.picUrl,
          playCount: item.playCount,
          name: item.name
        }
      })
    })
    getAlltypeMv().then(res => {
      this.videoList = res.data.map(item => {
        return {
          cover: item.cover,
          playCount: item.playCount,
          name: item.name,
          artistName: item.artistName,
          id: item.id,
          duration: item.duration,
          videoRce: null
        };
      });
    });
  },
  methods: {
    cardSwiper(e) {
      this.cardCur = e.detail.current;
    },
    //获取视频地址 和 控制视频播放
    async getVideoRec(id, idx) {
      const videos = this.videoList[idx];
      if (!videos.videoRce) {
        await this.request("/mv/url?id=" + id).then(res => {
          this.videoList[idx].videoRce = res.data.url;
        });
      }
      if (!this.currentIdx) {
        // 没有播放时播放视频
        this.currentIdx = idx
        let videoContext = wx.createVideoContext("video" + idx);
        videoContext.play();
      } else {
        let videoContextPrev = wx.createVideoContext("video" + this.currentIdx);
        videoContextPrev.stop();
        this.currentIdx = idx
      }
    }
  }
};
</script>

<style lang="scss">
.recommend {
  height: 100%;
}
.btm-left {
  bottom: 6rpx;
  left: 6rpx;
}
.btm-right {
  bottom: 6rpx;
  right: 6rpx;
}
.icons-view {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  .icons-contain,
  .icons-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .icons-inner {
    width: 100rpx;
    height: 100rpx;
    .iconfont {
      background-color: #f67280;
      color: #ffffff;
      font-size: 40rpx;
      padding: 16rpx;
      border-radius: 50%;
    }
  }
  .iconfont-info {
    font-size: 14px;
    margin-top: 10rpx;
  }
}

.video-list {
  position: relative;
  .control-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 68rpx;
    color: rgba(244, 244, 244, 0.6);
  }
  .text-cut{
    color:#000;
  }
  video{
    width: 100%;
  }
}
</style>
