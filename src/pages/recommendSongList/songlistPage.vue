<template>
  <scroll-view scroll-y class="song-scrollview">
    <view class="grid col-3">
      <view v-for="(item, idx) in songList" :key="idx">
        <song-card :song="item"></song-card>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import SongCard from "../../components/songCard";
import { getSonglistByTag } from "../../utils/api";
export default {
  data() {
    return {
      songList: []
    };
  },
  props: {
    tag: {
      type: String,
      default: "推荐"
    }
  },
  components: {
    SongCard
  },
  methods: {
    songlistByTag() {
      let queryTag = this.tag;
      if (queryTag === "推荐") {
        queryTag = "全部";
      }
      getSonglistByTag(queryTag).then(res=>{
        const temp = res.playlists.map(item => {
            return {
            id: item.id,
            imageUrl: item.coverImgUrl,
            playCount: item.playCount,
            name: item.name
            };
        });
        this.songList = temp
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.song-scrollview {
  height: 100%;
}
</style>