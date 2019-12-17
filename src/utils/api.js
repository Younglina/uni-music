import request from './request.js'

export function getNewSongs(){
    return request('/personalized/newsong');
}

export function getSongIds(ids){
    return request(`/song/url?id=${ids}`);
}

export function getSongLyric(id){
    return request(`/lyric?id=${id}`);
}

