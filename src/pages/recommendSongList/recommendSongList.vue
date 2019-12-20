<template>
  <view class="recommend-songlist">
    <scroll-view scroll-x class="tag-scrollview">
      <view
        v-for="(item,idx) in tagList"
        :key="item.id"
        :id="`tag${item.id}`"
        :class="['padding-lr-lg padding-tb text-sm',currentIdx===idx?'active':'']"
      >{{ item.name }}</view>
    </scroll-view>
    <swiper
      class="screen-swiper padding-sm"
      :circular="true"
      duration="500"
      @animationfinish="swiperChange"
      @transition="onswiperscroll"
      :disable-touch="isDisable"
    >
      <swiper-item v-for="item in tagList" :key="item.name" :item-id="item.name">
        <scroll-view
          v-if="songListTag[currentIdx].song.length>0"
          scroll-y
          class="song-scrollview"
          :key="item.name"
        >
          <view class="grid col-3">
            <view v-for="songlist in songListTag[currentIdx].song" :key="songlist.id">
              <song-card :song="songlist"></song-card>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import SongCard from "../../components/songCard";
import { getTgas, getSonglistByTag } from "../../utils/api";
export default {
  data() {
    return {
      tagList: [
        {
          name: "推荐",
          id: "1220"
        }
      ],
      songListTag: [],
      currentIdx: 0,
      isDisable:false,
    };
  },
  components: {
    SongCard
  },
  async onLoad() {
    await this.tgas();
    this.songlistByTag(0, "推荐");
  },
  methods: {
    tgas() {
      getTgas().then(res => {
        this.tagList = this.tagList.concat(
          res.tags.slice(0, 6).map(item => {
            return {
              name: item.name,
              id: item.id
            };
          })
        );
      });
    },
    songlistByTag(id, tag) {
      if (!this.songListTag[id]) {
        let queryTag = tag;
        if (tag === "推荐") {
          queryTag = "全部";
        }
        getSonglistByTag(queryTag).then(res => {
          const temp = res.playlists.map(item => {
            return {
              id: item.id,
              imageUrl: item.coverImgUrl,
              playCount: item.playCount,
              name: item.name
            };
          });
          this.songListTag.push({
            song: temp
          });
        });
      }
    },
    onswiperscroll(e){
      if(this.currentIdx===0 && e.detail.dx<=0){
        this.isDisable=true
      }else{
        this.isDisable=false
      }
    },
    swiperChange(e) {
      console.log(this.currentIdx)
      this.currentIdx = e.detail.current;
      this.songlistByTag(e.detail.current, e.detail.currentItemId);
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend-songlist,
.screen-swiper,
.song-scrollview {
  height: 100%;
}
.recommend-songlist {
  overflow: hidden;
  .tag-scrollview {
    white-space: nowrap;
    border-bottom: 1px solid gainsboro;
    view {
      display: inline-block;
    }
    .active {
      color: #ee4540;
      border-bottom: 2px solid currentColor;
    }
  }
}
</style>