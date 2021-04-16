<template>
  <div class="dartboard">
    <div class="outer-border" @click="onOuterBorderClick"></div>
    <!-- Outer doubles -->
    <div class="outer-doubles">
      <div class="pie outer" @click="sendScore(pie, '2')" v-for="pie of pies" :key="`${pie}-double-outer`" :style="`width: ${223}px;height: ${223}px;left: ${223}px;transform-origin: 0 ${223}px;transform: rotate(${pieRotateValues[pie]}deg) skewX(-72deg);`">
        <span class="pie inner" :style="`width: ${223}px;height: ${223}px;border-radius: 0 ${223}px 0 0;transform-origin: 0 ${223}px;background: ${pie % 2 === 0 ? '#363' : '#a33'};`"></span>
      </div>
    </div>
    <!-- Outer pies -->
    <div class="outer-pies">
      <div class="pie outer" @click="sendScore(pie, '1')" v-for="pie of pies" :key="`${pie}-pie-outer`" :style="`width: ${208}px;height: ${208}px;left: ${208}px;transform-origin: 0 ${208}px;transform: rotate(${pieRotateValues[pie]}deg) skewX(-72deg);`">
        <span class="pie inner" :style="`width: ${208}px;height: ${208}px;border-radius: 0 ${208}px 0 0;transform-origin: 0 ${208}px;background: ${pie % 2 === 0 ? '#eec' : '#333'};`"></span>
      </div>
    </div>
    <!-- Inner triples -->
    <div class="inner-triples">
      <div class="pie outer" @click="sendScore(pie, '3')" v-for="pie of pies" :key="`${pie}-triple`" :style="`width: ${150}px;height: ${150}px;left: ${150}px;transform-origin: 0 ${150}px;transform: rotate(${pieRotateValues[pie]}deg) skewX(-72deg);`">
        <span class="pie inner" :style="`width: ${150}px;height: ${150}px;border-radius: 0 ${150}px 0 0;transform-origin: 0 ${150}px;background: ${pie % 2 === 0 ? '#363' : '#a33'};`"></span>
      </div>
    </div>
    <!-- Inner pies -->
    <div class="inner-pies">
      <div class="pie outer" @click="sendScore(pie, '1')" v-for="pie of pies" :key="`${pie}-inner`" :style="`width: ${135}px;height: ${135}px;left: ${135}px;transform-origin: 0 ${135}px;transform: rotate(${pieRotateValues[pie]}deg) skewX(-72deg);`">
        <span class="pie inner" :style="`width: ${135}px;height: ${135}px;border-radius: 0 ${135}px 0 0;transform-origin: 0 ${135}px;background: ${pie % 2 === 0 ? '#eec' : '#333'};`"></span>
      </div>
    </div>
    <div class="semi-bulls-eye" @click="sendScore(25, '1')"></div>
    <div class="bulls-eye" @click="sendScore(50, 1)"></div>
    <div class="number top" v-for="n of northNumbers" :key="n" :style="`transform: rotate(${numberRotateValues[n]}deg)`">{{n}}</div>
    <div class="number bottom" v-for="n of southNumbers" :key="n" :style="`transform: rotate(${numberRotateValues[n]}deg)`">{{n}}</div>
  </div>
</template>

<style scoped>
  .inner-pies {
    width: 270px;
    height: 270px;
    border: 2px solid #ddd;
    border-radius: 270px;
    overflow: hidden;
    position: absolute;
    left: 163px;
    top: 163px;
    background: #eec;
    box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
  }
  .inner-triples {
    width: 300px;
    height: 300px;
    border: 2px solid #ddd;
    border-radius: 300px;
    overflow: hidden;
    position: absolute;
    left: 148px;
    top: 148px;
    background: #363;
    box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
  }
  .outer-doubles {
    width: 446px;
    height: 446px;
    border-radius: 450px;
    overflow: hidden;
    border: 2px solid #ddd;
    position: absolute;
    left: 75px;
    top: 75px;
    background: #363;
    box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
  }
  .outer-pies {
    width: 416px;
    height: 416px;
    border: 2px solid #ddd;
    border-radius: 420px;
    overflow: hidden;
    position: absolute;
    left: 90px;
    top: 90px;
    background: #eec;
    box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
  }
  .pie {
    top: 0px;
    position: absolute;
    cursor:pointer;
    overflow:hidden;
    box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
  }
  .pie:active {
    box-shadow: inset 0 2px 15px rgb(0 0 0 / 80%);
  }
  .pie.inner {
    left: 0px;
    display: block;
    transform: skewX(72deg);
    pointer-events: auto;
  }
  .pie.outer {
    pointer-events: none;
  }
  .semi-bulls-eye {
    width: 48px;
    height: 48px;
    border: 2px solid #ddd;
    border-radius: 48px;
    position: absolute;
    left: 274px;
    top: 274px;
    background: #363;
    box-shadow: 0 0 5px rgb(0 0 0 / 80%);
    cursor: pointer;
  }
  .bulls-eye {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 20px;
    position: absolute;
    left: 288px;
    top: 288px;
    background: #a33;
    box-shadow: 0 0 5px rgb(0 0 0 / 80%);
    cursor: pointer;
  }
  .pie:hover,
  .bulls-eye:hover,
  .semi-bulls-eye:hover {
    background: white !important;
  }
  .outer-border {
    width: 582px;
    height: 582px;
    border-radius: 580px;
    pointer-events: none;
    left: 9px;
    top: 9px;
    border: 2px solid #ddd;
    position: absolute;
  }
  .number {
    width: 60px;
    height: 50px;
    color: #ddd;
    left: 270px;
    position: absolute;
    font-size: 35px;
    text-align: center;
    text-shadow: -1px 0 1px #eee, 1px 0 1px #000;
  }
  .number.top {
    bottom: auto;
    top: 3px;
    transform-origin: 30px 297px;
  }
  .number.bottom {
    bottom: 1px;
    top: auto;
    transform-origin: 30px -246px;
  }
  .dartboard {
    overflow: hidden;
    width: 600px;
    height: 600px;
    background: #333;
    border-radius: 600px;
    position: relative;
    margin: 0 auto;
    box-shadow: 0 0 10px rgb(0 0 0 / 80%);
  }
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

type Multiplier = '1' | '2' | '3';

@Component
export default class DartBoard extends Vue {
  pies = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  northNumbers = [1,4,5,6,9,11,12,13,14,18,20];
  southNumbers = [8,16,7,19,3,17,2,15,10];
  numberRotateValues: Record<number, number> = {
    1: 18,
    2: -36,
    3: 0,
    4: 54,
    5: -18,
    6: 90,
    7: 36,
    8: 72,
    9: -54,
    10: -72,
    11: -90,
    12: -36,
    13: 72,
    14: -72,
    15: -54,
    16: 54,
    17: -18,
    18: 36,
    19: 18,
    20: 0
  }
  pieToNumberMap: Record<number, number> = {
    1: 20, 
    2: 1,
    3: 18,
    4: 4,
    5: 13,
    6: 6,
    7: 10,
    8: 15,
    9: 2, 
    10: 17,
    11: 3,
    12: 19,
    13: 7,
    14: 16,
    15: 8,
    16: 11,
    17: 14,
    18: 9,
    19: 12,
    20: 5,
    25: 25,
    50: 50
  }
  startValue = -99;
  degreePitch = 18;
  pieRotateValues: Record<number, number> = {};

  onOuterBorderClick() {
    console.log('test');
  }

  sendScore(pieNumber: number, multiplier: Multiplier) {
    this.$emit('clicked-score', { multiplier, field: this.pieToNumberMap[pieNumber]})
  }

  created() {
    for (const pie of this.pies) {
      this.pieRotateValues[pie] = this.startValue + (pie * this.degreePitch);
    }
  }
}
</script>
