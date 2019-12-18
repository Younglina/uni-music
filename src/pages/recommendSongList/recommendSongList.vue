<template>
  <view>
    <scroll-view scroll-x>
        <text v-for="item in tagList" :key="item.id" :id="`tag${item.id}`">{{ item.name }}</text>
    </scroll-view>
    <swiper class="screen-swiper" :circular="true" duration="500">
      <swiper-item v-for="(item,index) in 10" :key="index">
        <view>{{ item }}</view>
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
          tagList: []
      }
  },
  components: {
    SongCard
  },
  async onLoad() {
    await this.tgas();
    this.songlistByTag("hot");
  },
  methods: {
    tgas() {
      getTgas().then(res=>{
          this.tagList = res.tags.slice(0,6).map(item=>{
              return {
                  name: item.name,
                  id: item.id
              }
          });
      });
    },
    songlistByTag(tag) {
      getSonglistByTag(tag);
    }
  }
};
</script>

<style lang="scss" scoped>