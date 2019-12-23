<template>
  <view class="recommend-songlist">
    <scroll-view scroll-x class="tag-scrollview" :scroll-into-view="currentTag">
      <view
        v-for="(item,idx) in tagList"
        :key="item.id"
        :id="`tag${idx}`"
        :class="['padding-lr-lg padding-tb text-sm',tabIndex===idx?'active':'']"
        @click="handleTagClick(idx)"
      >{{ item.tagName }}</view>
    </scroll-view>
    <swiper
      class="screen-swiper padding-sm"
      :current="tabIndex"
      :circular="true"
      duration="500"
      @animationfinish="swiperChange"
    >
      <swiper-item
        v-for="(item, index) in tagList"
        :key="index"
        :item-id="item.tagName"
      >
        <song-page :tag="item.tagName" :ref="'page' + index"></song-page>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import SongPage from "./songlistPage";
import { getTgas } from "../../utils/api";
export default {
  data() {
    return {
      tagList: [
        {
          tagName: "推荐",
          id: "1220"
        }
      ],
      tabIndex: 0,
      currentTag: "tag0",
      notSwitch: false,
    };
  },
  components: {
    SongPage
  },
  async onReady() {
    await getTgas().then(res => {
        this.tagList = this.tagList.concat(
          res.tags.slice(0, 6).map(item => {
            return {
              tagName: item.name,
              id: item.id
            };
          })
        );
      });
    this.pageList = [];
    for (let i = 0; i < this.tagList.length; i++) {
      this.pageList.push(this.$refs["page" + i][0]);
    }
    this.switchTab(0);
  },    
  methods: {
    switchTab(index) {
      if (this.pageList[index].songList.length === 0) {
        this.pageList[index].songlistByTag();
      }
    },
    handleTagClick(idx, tag) {
      this.tabIndex = idx;
      this.currentTag = `tag${idx}`;
      this.switchTab(idx);
    },
    swiperChange(e) {
      this.tabIndex = e.detail.current;
      this.currentTag = `tag${e.detail.current}`
      this.switchTab(e.detail.current)
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