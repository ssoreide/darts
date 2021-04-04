<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
            <h1>Current Player: {{$store.getters.currentPlayer}}</h1>
            <v-simple-table>
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">
                        Player
                    </th>
                    <th class="text-center">
                        Points
                    </th>
                    <th class="text-center">
                        Status
                    </th>
                    <th class="text-center">
                        Last throw 1
                    </th>
                    <th class="text-center">
                        Last throw 2
                    </th>
                    <th class="text-center">
                        Last throw 3
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="player in $store.getters.playerstats"
                    :key="player.name"
                    v-bind:style="{ color: activeColor(player) }"
                    >
                    <td>{{ player.player }}</td>
                    <td>{{ player.score }}</td>
                    <td>{{ player.status }}</td>
                    <td v-for="theThrow in player.lastThrows" :key="theThrow.timestamp">{{ theThrow.field }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>

      </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field type="number" v-model="field"></v-text-field>
                            <v-btn color="green" @click="insertThrow">Send</v-btn>
                            <v-btn color="red" @click="undoThrow">Undo last throw</v-btn>
                        </v-col>
                        <v-col>
                            <v-radio-group v-model="multiplier">
                            <v-radio key="1" label="Single" value="1"></v-radio>
                            <v-radio key="2" label="Double" value="2"></v-radio>
                            <v-radio key="3" label="Triple" value="3"></v-radio>
                        </v-radio-group>
                        </v-col>
                        <v-col cols="3">
                            <v-row>
                                <v-col>
                                    <v-btn @click="insertThrowDirect('0')" class="pr-0 pl-0" block>0</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-btn @click="insertThrowDirect('25')" class="pr-0 pl-0" block>25</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-btn @click="insertThrowDirect('50')" class="pr-0 pl-0" block>50</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        
                    </v-row>
                </v-container>
            </v-form>
        </v-col>
    </v-row>
    <v-row v-if="true">
        <v-col>
            <v-row v-for="r in [1,2,3,4]" v-bind:key="r">
                <v-col v-for="c in [1,2,3,4,5]" v-bind:key="c">
                    <v-btn @click="insertThrowDirect(c+(r-1)*5)" class="pr-0 pl-0" block>{{c+(r-1)*5}}</v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { PlayerStat } from '../../../../server/src/interfaces'

import store from '../store';

@Component
export default class ActiveGame extends Vue {
    private field = "";
    private multiplier = "1";
   
    activeColor(p : PlayerStat) {
        if (p.score == 0) return "green";
        if (p.status == "bust") return "red";
        if (p.player == store.state.currentPlayer) return "blue";
    }

    mounted() {
        // this.initSpeech().catch(ex => {
        //     console.log("ex",ex);
        // })
    }

    async undoThrow() {
        store.dispatch('undoThrow'); 
    }

    insertThrow() {
        let f = parseInt(this.field);
        let m = parseInt(this.multiplier);
        store.dispatch('insertThrow', { field: f, multiplier: m }); 
        this.field = '';
        this.multiplier = '1';
    }

    insertThrowDirect(value: string) {
        let f = parseInt(value);
        let m = parseInt(this.multiplier);
        store.dispatch('insertThrow', { field: f, multiplier: m }); 
        this.field = '';
        this.multiplier = '1';
    }

    async initSpeech() {
        const vosk = (window as any).Vosk;
        console.dir("Vosk:" , vosk);
        
        const model = await vosk.createModel('https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz');
        console.log("model:", model);

        const recognizer = new model.KaldiRecognizer();
        console.log("recognizer:", recognizer);
        recognizer.on("result", (message:any) => {
            console.log(`Result: ${message.result}`);
        });
        recognizer.on("partialresult", (message:any) => {
            console.log(`Partial result: ${message.result}`);
        });
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                channelCount: 1,
                sampleRate: 16000
            },
        });

        const audioContext = new AudioContext();
        const recognizerNode = audioContext.createScriptProcessor(4096, 1, 1)
        recognizerNode.onaudioprocess = (event) => {
            try {
                recognizer.acceptWaveform(event.inputBuffer)
            } catch (error) {
                console.error('acceptWaveform failed', error)
            }
        }
        const source = audioContext.createMediaStreamSource(mediaStream);
        console.log("source: ", source);
        source.connect(recognizerNode);
    }
}
</script>
