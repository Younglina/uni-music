import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        currentTracks:[]
    },
    mutations: {
        setCurrentTracks(state, data){
            state.currentTracks = data
        }
    }
})

export default store