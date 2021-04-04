import Vuex from 'vuex';
import Vue from 'vue';
import * as settings from './settings'
import { PlayerStat } from '../../../server/src/interfaces'
import axios from 'axios';

const apiAxios = axios.create();

Vue.use(Vuex);

const state = {
    currentPlayer: "nobody yet",
    playerstats: [] as PlayerStat[],
    gameid: "XXXX"
};

export type State = typeof state;

function send(message: any) {
    Vue.prototype.$socket.send(message);
}

const store = new Vuex.Store({
    state,
    mutations: {
      SOCKET_ONOPEN(state, event)  {
        Vue.prototype.$socket = event.currentTarget;
        send('{ "message": "test2"}');
        console.log("SOCKET_ONOPEN");
      },
      SOCKET_ONCLOSE(state, event)  {
        console.log("SOCKET_ONCLOSE");
      },
      SOCKET_ONERROR(state, event)  {
        console.log("SOCKET_ONERROR");
        console.error(state, event);
      },
      async SOCKET_ONMESSAGE(state, message) {
        console.log("SOCKET_ONMESSAGE");
        console.log(message);

        let messageObj = JSON.parse(message.data);

        if(messageObj.updated) { // Todo: check if it's our game
            state.currentPlayer = messageObj.gameData.currentPlayer;   
            state.playerstats = messageObj.gameData.playerstat 
        }

      },
      SOCKET_RECONNECT(state, count) {
        console.log("SOCKET_RECONNECT");
        console.info(state, count);
      },
      SOCKET_RECONNECT_ERROR(state) {
        console.log("SOCKET_RECONNECT_ERROR");
      },
      setGameData(state, robj) {
        state.playerstats = robj.playerstat;
        state.currentPlayer = robj.currentPlayer;
      }
    },
    getters: {
        currentPlayer: state => state.currentPlayer,
        playerstats: state => state.playerstats,
        gameid: state => state.gameid
    },
    actions: {
        createGame: async (context, players) => {
            if (players.length !== 0) {
                apiAxios.post(settings.urlprefix+"/createGame", {
                    players : players
                }).then(result => {
                    store.dispatch('setGame', result.data.gameid); 
                });
            }            
        },
        setGame: async (context, gameId: string) => {
            context.state.gameid = gameId;
            send(JSON.stringify({subscribeToGame: gameId}));
            await store.dispatch('updateGameData'); 
        },
        joinLatestGame: async (context) => {
            let response = await apiAxios.get(settings.urlprefix+"/getLatestGame");
            const gameid = response.data.gameid;
            await store.dispatch('setGame', gameid); 
        },
        insertThrow: async (context, { field, multiplier }) => {
            const throwBody = 
            { 
                gameid: context.state.gameid,
                field, 
                multiplier 
            };
            await apiAxios.post(settings.urlprefix+"/insertThrow", throwBody).then(result => {
                console.log("Throw inserted");
            });
        },
        undoThrow: async (context) => {
            const throwBody = { gameid: context.state.gameid };
            await apiAxios.post(settings.urlprefix+"/undoThrow", throwBody).then(result => {
                console.log("Throw deleted!");
            });
        },
        updateGameData: async (context) => {
            let r = await fetch(settings.urlprefix+"/getGameData?gameid="+context.state.gameid);
            let robj = await r.json();
            context.commit('setGameData', robj);
        }

    }
}); 

export default store;
