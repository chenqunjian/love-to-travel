<template>
  <div class="l-rdetail">
    <div class="l-rdetail__info">
      <div class="l-detail__route">
        <i class="l-detail__back l-detail__icon" @click="handleRouteBack"></i>
        <span class="l-detail__title">{{lineName}}路开往{{line[direction].end}}</span>
        <i class="l-detail__star l-detail__icon"
          :class="{'is-star': isStar}"
          @click="storeStars"></i>
      </div>
      <div class="l-rdetail__direction">
        <span class="l-rdetail__start">{{line[direction].start}}</span>
        <i class="l-rdetail__transfer l-detail__icon" @click="handleRouteReverse"></i>
        <span class="l-rdetail__end">{{line[direction].end}}</span>
      </div>
      <div class="l-rdetail__detail">
        <span class="l-rdetail__time">首末班：{{line[direction].time}}</span><span class="l-rdetail__price">起步票价：1 元</span>
      </div>
    </div>
    <div class="l-rdetail__routes">
      <ul class="l-rdetail__list">
        <li class="l-rdetail__item"
          v-for="(station, index) in line[direction].stations"
          :key="index"><i class="l-rdetail__status" :class="{'is-bus': lastStations.indexOf(`${index}`) > -1}"></i>{{index+1}} . {{station.stationName}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import store from 'store2'
import { getAllLines, getBusWaiting } from '../http/bus'

const LTT_STAR = 'lt_star'

export default {
  name: 'RouteDetail',

  data () {
    return {
      route: {},
      params: {},
      line: {
        positive: {},
        opposite: {}
      },
      buses: [],
      isStar: false,
      lineName: '',
      isUpDown: '0',
      direction: 'positive', // 正向
      lastStations: [],
      isStations: []
    }
  },

  methods: {
    getLine (lineName) {
      this.axios.all([
        getAllLines({lineName}),
        getBusWaiting({lineName, isUpDown: this.isUpDown})
      ]).then(res => {
        let line = res[0]
        if (line[0].stations) {
          let positive = line[0]
          let opposite = line[1]
          let lineInfo1 = positive.lineInfo.split(';')
          let lineInfo2 = opposite.lineInfo.split(';')

          this.line = {
            positive: {
              points: positive.points,
              stations: positive.stations,
              isUpDown: positive.isUpDown,
              lineInfo: lineInfo1,
              start: positive.stations[0].stationName,
              end: positive.stations[positive.stations.length - 1].stationName,
              time: lineInfo1[1].slice(6),
              price: lineInfo1[3].slice(3)
            },
            opposite: {
              points: opposite.points,
              stations: opposite.stations,
              isUpDown: opposite.isUpDown,
              lineInfo: lineInfo2,
              start: opposite.stations[0].stationName,
              end: opposite.stations[opposite.stations.length - 1].stationName,
              time: lineInfo2[1].slice(6),
              price: lineInfo2[3].slice(3)
            }
          }
        }

        const buses = res[1].bus
        if (buses.length) {
          this.buses = buses
          buses.forEach(bus => {
            this.lastStations.push(bus.lastStation)
            this.isStations.push(bus.isStation)
          })
        }
      })
    },

    getBus () {
      getBusWaiting({lineName: this.lineName, isUpDown: this.isUpDown}).then(res => {
        let buses = res.bus
        if (buses.length) {
          this.buses = buses
          this.lastStations.splice(0)
          this.isStations.splice(0)
          buses.forEach(bus => {
            this.lastStations.push(bus.lastStation)
            this.isStations.push(bus.isStation)
          })
        }
      })
    },

    handleRouteReverse () {
      [this.line.start, this.line.end] = [this.line.end, this.line.start]
      this.isUpDown = this.isUpDown === '0' ? '1' : '0'
      this.direction = this.direction === 'positive' ? 'opposite' : 'positive'
      this.setStar()
      this.getBus()
    },

    handleRouteBack () {
      this.$router.push({path: '/route'})
    },

    storeStars () {
      let stars = store.get(LTT_STAR)
      let lineName = this.lineName
      let isUpDown = this.isUpDown
      let star = {
        lineName: lineName,
        isUpDown: isUpDown,
        name: this.line[this.direction].end
      }
      if (stars) {
        stars = JSON.parse(stars)
        if (this.isStar) { // 移除收藏
          stars = stars.filter(item => !(item.isUpDown === isUpDown && item.lineName === lineName))
        } else { // 添加收藏
          stars.push(star)
        }
        store.set(LTT_STAR, JSON.stringify(stars))
        this.isStar = !this.isStar
      } else {
        store.set(LTT_STAR, JSON.stringify([star]))
        this.isStar = true
      }
    },

    setStar () {
      let stars = store.get(LTT_STAR)
      if (stars) {
        stars = JSON.parse(stars)
        this.isStar = stars.some(item => item.isUpDown === this.isUpDown && item.lineName === this.lineName)
      }
    }
  },

  created () {
    this.route = this.$route
    const params = this.params = this.route.params
    this.isUpDown = params.isUpDown
    this.lineName = params.lineName
    this.direction = params.isUpDown === '0' ? 'positive' : 'opposite'
    this.getLine(params.lineName)
    this.setStar()
  }
}
</script>
<style lang="postcss">
@import "../style/mixins.css";

@component-namespace l {

  @b rdetail {

    @e info {
      position: fixed;
      z-index: 99;
      width: 100%;
      padding: 1.5rem .9375rem 0;
      background-color: white;
      box-shadow: 0 1px 4px 0 rgba(7,17,27,.2);
    }

    @e direction {
      position: relative;
      font-size: 1rem;
      padding: 1.25rem 0 .9375rem;
    }

    @e transfer {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 1.1875rem;
      background-image: url("../assets/images/l_rdetail_transfer.png");
    }

    @e end {
      float: right;
    }

    @e detail {
      padding-bottom: 1.25rem;
      font-size: .75rem;
      color: #525B60;
    }

    @e time {
      padding-right: 2.375rem;
    }

    @e routes {
      padding: 10.5625rem .9375rem 0;
    }

    @e list {
      position: relative;

      &:before {
        content: "";
        position: absolute;
        top: 1.25rem;
        bottom: 1.25rem;
        left: .75rem;
        width: .125rem;
        background-color: #CCE7F9;
      }
    }

    @e item {
      position: relative;
      height: 2.5rem;
      padding-left: 2.8125rem;
      line-height: 2.5rem;
      font-size: 1rem;
      color: #383E41;
    }

    @e status {
      position: absolute;
      top: 0.90625rem;
      left: .53125rem;
      display: block;
      size: .4375rem;
      background-color: #0285e0;
      border-radius: 50%;

      @when bus {
        left: 0;
        top: .5rem;
        @mixin icon 1.5rem 1.5rem l_rdetail_bus;
      }
    }
  }
}
</style>
