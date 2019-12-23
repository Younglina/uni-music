import request from './request.js'

//推荐新音乐
export function getBanner() {
    return request('/banner');
}

//推荐新音乐
export function getNewSongs() {
    return request('/personalized/newsong');
}

//推荐歌单
export function getRecommentSonglist() {
    return request('/personalized?limit=6');
}

//mv
export function getAlltypeMv() {
    return request('/mv/all?limit=10');
}

//根据传入的id获取歌曲url
export function getSongIds(ids) {
    return request(`/song/url?id=${ids}`);
}

export function getDetail(id) {
    return request("/playlist/detail?id=" + id)
}

//歌词
export function getSongLyric(id) {
    return request(`/lyric?id=${id}`);
}

//热门歌单分类
export function getTgas() {
    return request(`/playlist/hot`)
}

//通过分类获取歌单
export function getSonglistByTag(tag) {
    return request(`/top/playlist?limit=30&order=hot&cat=${tag}`)
}

//通过热搜列表
export function getSearchot() {
    return request(`/search/hot/detail`)
}

