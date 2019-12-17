<template>
  <view>
    <view id="app" class="wrapper">
      <view class="player">
        <view class="player__top">
          <view class="player-cover" v-show="showCover" @click="showCover=false">
            <view>
              <view
                v-for="(track, index) in tracks"
                v-if="index === currentTrackIndex"
                :key="track.name"
                :class="['animated faster player-cover__item',transitionName]"
                :style="{ backgroundImage: `url(${track.cover})` }"
              ></view>
            </view>
          </view>

          <view class="player-cover" v-show="!showCover" @click="showCover=true">
            <scroll-view scroll-y class="player-scrollview" :scroll-into-view="currentLyr">
              <view
                v-for="(item, idx) in lyricArys"
                :key="idx"
                :id="`lyr${item[0]}`"
                :class="item[0]<=currentTimeNum && lyricArys[idx+1][0]>currentTimeNum ?'active':''"
              >{{ item[1] }}</view>
            </scroll-view>
          </view>

          <view class="player-controls">
            <view
              class="player-controls__item -favorite"
              :class="{ active : currentTrack.favorited }"
              @click="favorite"
            >
              <text class="iconfont">&#xe7ef;</text>
            </view>
            <a :href="currentTrack.url" target="_blank" class="player-controls__item">
              <text class="iconfont">&#xe61f;</text>
            </a>
            <view class="player-controls__item" @click="prevTrack">
              <text class="iconfont">&#xe64c;</text>
            </view>
            <view class="player-controls__item" @click="nextTrack">
              <text class="iconfont">&#xe64f;</text>
            </view>
            <view class="player-controls__item -xl js-play" @click="play">
              <text v-if="isTimerPlaying" class="iconfont">&#xe69e;</text>
              <text v-else class="iconfont">&#xe634;</text>
            </view>
          </view>
        </view>
        <view id="progress" class="progress">
          <view class="progress__top">
            <view v-if="currentTrack" class="album-info">
              <view class="album-info__name">{{ currentTrack.artistName }}</view>
              <view class="album-info__track">{{ currentTrack.name }}</view>
            </view>
            <view class="progress__duration">{{ duration }}</view>
          </view>
          <view class="progress__bar" @click="clickProgress">
            <view class="progress__current" :style="{ width : barWidth }"></view>
          </view>
          <view class="progress__time">{{ currentTime }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { getNewSongs, getSongIds, getSongLyric } from "../../utils/api";
import { mapState } from "vuex";
const innerAudioContext = uni.createInnerAudioContext();
export default {
  data() {
    return {
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: true,
      tracks: [],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null,
      lyricArys: [],
      showCover: true,
      currentLyr: "lyr0",
      currentTimeNum: 0,
      beginScrolleTo:4,
    };
  },
  computed: mapState(["currentTracks"]),
  async onLoad(option) {
    const vm = this;
    const songIds = [];
    const tempTracks = this.currentTracks;
    tempTracks.map(item => {
      songIds.push(item.id);
    });
    getSongIds(songIds.join(",")).then(res => {
      const songId = {};
      res.data.map((item, idx) => {
        songId[item.id] = item.url;
      });
      tempTracks.map(item => {
        item.source = songId[item.id];
      });
      this.currentTrack = tempTracks[option.nowIndex];
      this.getLyr();
      this.currentTrackIndex = option.nowIndex;
      innerAudioContext.src = this.currentTrack.source;
      innerAudioContext.autoplay = true;
      innerAudioContext.onTimeUpdate(() => {
        this.generateTime();
      });
      innerAudioContext.onSeeked(() => {
        this.generateTime();
      });
      innerAudioContext.onStop(() => {
        this.nextTrack();
        this.isTimerPlaying = true;
      });
    });
    this.tracks = tempTracks;
  },
  methods: {
    getLyr() {
      getSongLyric(this.currentTrack.id).then(res => {
        const lyric = res.lrc.lyric;
        const lyricAry = lyric.split("\n");
        let temp = [];
        const lyricArys = lyricAry.map(item => {
          item = item.split("]");
          if (item[1]) {
            temp = item[0].match(/\d{2}/g);
            item[0] = temp[0] * 60 + Number(temp[1]);
          }
          return item;
        });
        this.lyricArys = lyricArys.filter(item => item[1]);
      });
    },
    play() {
      if (innerAudioContext.paused) {
        innerAudioContext.play();
        this.isTimerPlaying = true;
      } else {
        innerAudioContext.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      const width =
        (100 / innerAudioContext.duration) * innerAudioContext.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(innerAudioContext.duration / 60);
      let dursec = Math.floor(innerAudioContext.duration - durmin * 60);
      let curmin = Math.floor(innerAudioContext.currentTime / 60);
      let cursec = Math.floor(innerAudioContext.currentTime - curmin * 60);
      this.currentTimeNum = curmin * 60 + cursec;
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
      if(this.currentTimeNum>=this.lyricArys[this.beginScrolleTo][0]){
        this.currentLyr = "lyr" + this.lyricArys[this.beginScrolleTo-4][0];
        this.beginScrolleTo = +this.beginScrolleTo + 1;
      }
    },
    updateBar(x) {
      uni
        .createSelectorQuery()
        .select("#progress")
        .boundingClientRect()
        .exec(res => {
          const progress = res[0];
          const maxduration = innerAudioContext.duration;
          const position = x - progress.left;
          let percentage = (100 * position) / progress.width;
          if (percentage > 100) {
            percentage = 100;
          }
          if (percentage < 0) {
            percentage = 0;
          }
          this.barWidth = percentage + "%";
          this.circleLeft = percentage + "%";
          innerAudioContext.seek((maxduration * percentage) / 100);
          innerAudioContext.play();
          this.isTimerPlaying = true;
        });
    },
    clickProgress(e) {
      this.isTimerPlaying = false;
      innerAudioContext.pause();
      this.updateBar(e.detail.x);
    },
    prevTrack() {
      this.transitionName = "zoomInDown";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "zoomInUp";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      // innerAudioContext.currentTime = 0;
      innerAudioContext.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          innerAudioContext.play();
        } else {
          innerAudioContext.pause();
        }
      }, 300);
      this.getLyr();
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  }
};
</script>
<style lang="scss">
body {
  // background: #e1e7ec;
  background: #dfe7ef;
  font-family: "Bitter", serif;
}

* {
  box-sizing: border-box;
}

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}

.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  // background: url(../img/bg.png) no-repeat center;
  background-size: cover;
  @media screen and (max-width: 700px), (max-height: 500px) {
    flex-wrap: wrap;
    flex-direction: column;
  }
}

.player {
  background: #eef3f7;
  width: 410px;
  min-height: 480px;
  // box-shadow: 0px 55px 75px -10px rgba(76, 70, 124, 0.5);
  // box-shadow: 0px 55px 105px 10px rgba(76, 70, 124, 0.35);
  box-shadow: 0px 15px 35px -5px rgba(50, 88, 130, 0.32);
  border-radius: 15px;
  padding: 30px;
  @media screen and (max-width: 576px), (max-height: 500px) {
    width: 95%;
    padding: 20px;
    margin-top: 75px;
    min-height: initial;
    padding-bottom: 30px;
    max-width: 400px;
  }
  &__top {
    display: flex;
    align-items: flex-start;
    position: relative;
    z-index: 4;
    @media screen and (max-width: 576px), (max-height: 500px) {
      flex-wrap: wrap;
    }
  }

  &-cover {
    width: 300px;
    height: 300px;
    margin-left: -70px;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    border-radius: 15px;
    // transform: perspective(512px) translate3d(0, 0, 0);
    // transition: all .4s cubic-bezier(.125, .625, .125, .875);
    z-index: 1;

    @media screen and (max-width: 576px), (max-height: 500px) {
      margin-top: -70px;
      margin-bottom: 25px;
      width: 290px;
      height: 250px;
      margin-left: auto;
      margin-right: auto;
    }

    &__item {
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      width: 100%;
      height: 100%;
      border-radius: 15px;
      position: absolute;
      left: 0;
      top: 0;

      &:before {
        content: "";
        background: inherit;
        width: 100%;
        height: 100%;
        box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
        display: block;
        z-index: 1;
        position: absolute;
        top: 30px;
        transform: scale(0.9);
        filter: blur(10px);
        opacity: 0.9;
        border-radius: 15px;
      }

      &:after {
        content: "";
        background: inherit;
        width: 100%;
        height: 100%;
        box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
        display: block;
        z-index: 2;
        position: absolute;
        border-radius: 15px;
      }
    }

    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 15px;
      box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
      user-select: none;
      pointer-events: none;
    }
  }

  &-scrollview {
    height: 300px;
    color: #71829e;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
    line-height: 1.8;
    text-align: center;
    .active {
      color: #f67280;
    }
    @media screen and (max-width: 576px), (max-height: 500px) {
      height: 250px;
    }
  }

  &-controls {
    flex: 1;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 576px), (max-height: 500px) {
      flex-direction: row;
      padding-left: 0;
      width: 100%;
      flex: unset;
    }

    &__item {
      display: inline-flex;
      padding: 5px;
      margin-bottom: 10px;
      color: #acb8cc;
      cursor: pointer;
      width: 50px;
      height: 50px;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s ease-in-out;
      > text {
        font-size: 30px;
      }

      @media screen and (max-width: 576px), (max-height: 500px) {
        padding: 5px;
        margin-right: 10px;
        color: #acb8cc;
        cursor: pointer;
        width: 40px;
        height: 40px;
        margin-bottom: 0;
        > text {
          font-size: 26px;
        }
      }

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #fff;
        transform: scale(0.5);
        opacity: 0;
        box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
        transition: all 0.3s ease-in-out;
        transition: all 0.4s cubic-bezier(0.35, 0.57, 0.13, 0.88);
      }

      @media screen and (min-width: 500px) {
        &:hover {
          color: #532ab9;

          &::before {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      }

      @media screen and (max-width: 576px), (max-height: 500px) {
        &:active {
          color: #532ab9;

          &::before {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      }

      .icon {
        position: relative;
        z-index: 2;
      }

      &.-xl {
        margin-bottom: 0;
        // filter: drop-shadow(0 2px 8px rgba(172, 184, 204, 0.3));
        // filter: drop-shadow(0 9px 6px rgba(172, 184, 204, 0.35));
        filter: drop-shadow(0 11px 6px rgba(172, 184, 204, 0.45));
        color: #fff;
        width: auto;
        height: auto;
        display: inline-flex;
        > text {
          font-size: 95px;
        }
        @media screen and (max-width: 576px), (max-height: 500px) {
          margin-left: auto;
          > text {
            font-size: 75px;
          }
          margin-right: 0;
        }
        &:before {
          display: none;
        }
      }

      &.-favorite {
        &.active {
          color: red;
        }
      }
    }
  }
}
.progress {
  width: 100%;
  margin-top: -15px;
  user-select: none;
  &__top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__duration {
    color: #71829e;
    font-weight: 700;
    font-size: 20px;
    opacity: 0.5;
  }
  &__time {
    margin-top: 2px;
    color: #71829e;
    font-weight: 700;
    font-size: 16px;
    opacity: 0.7;
  }
}
.progress__bar {
  height: 6px;
  width: 100%;
  cursor: pointer;
  background-color: #d0d8e6;
  display: inline-block;
  border-radius: 10px;
}
.progress__current {
  height: inherit;
  width: 0%;
  background-color: #a3b3ce;
  border-radius: 10px;
}

.album-info {
  color: #71829e;
  flex: 1;
  padding-right: 60px;
  user-select: none;

  @media screen and (max-width: 576px), (max-height: 500px) {
    padding-right: 30px;
  }

  &__name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
    line-height: 1.3em;
    @media screen and (max-width: 576px), (max-height: 500px) {
      font-size: 18px;
      margin-bottom: 9px;
    }
  }
  &__track {
    font-weight: 400;
    font-size: 20px;
    opacity: 0.7;
    line-height: 1.3em;
    min-height: 52px;
    @media screen and (max-width: 576px), (max-height: 500px) {
      font-size: 18px;
      min-height: 50px;
    }
  }
}
</style>
