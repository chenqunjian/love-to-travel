<template>
  <div class="l-sdetail">
    <div class="l-sdetail__info">
      <div class="l-detail__route">
        <i class="l-detail__back l-detail__icon" @click="handleSiteBack"></i>
        <span class="l-detail__title">{{lineName}}路开往{{stationName}}</span>
        <i class="l-detail__star l-detail__icon"
          :class="{'is-star': isStar}"
          @click="handleRouteStar"></i>
      </div>
    </div>
    <ul class="l-sdetail__list">
      <li class="l-sdetail__item"
          :class="{'is-expand': currentRoute === index}"
          v-for="(route, index) in routes"
          :key="index">
        <div class="l-sdetail__wrap"
            @click="handleBusRouteClick(route, index)">
          <div class="l-sdetail__row">
            <i class="l-sdetail__bus"></i>
            <span class="l-sdetail__title">{{route.name}}路</span>
            <div class="l-sdetail__direction">
              <i class="l-sdetail__start"></i>{{route[direction[index]].start}} <i class="l-sdetail__line"></i><i class="l-sdetail__end"></i>{{route[direction[index]].end}}
            </div>
            <i class="l-sdetail__arrow--down"></i>
          </div>
          <div class="l-sdetail__desc">
            <span class="l-sdetail__time">首末班：{{route[direction[index]].time}}</span>
            <span class="l-sdetail__price">起步票价：1 元</span>
            <span class="l-sdetail__back" @click="handleSwitchLine(route, index)"></span>
          </div>
        </div>
        <div class="l-sdetail__routes">
          <div class="l-sdetail__inner">
            <ul class="l-sdetail__sites">
              <li class="l-sdetail__site"
                v-for="(station, i) in route[direction[index]].stations"
                :key="i"><i class="l-sdetail__status"
                  :class="{'is-bus': buses[index].lastStations.indexOf(`${i}`) > -1}"></i>{{i+1}} . {{station.stationName}}</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import store from 'store2'
import { getAllLines, getBusWaiting } from '../http/bus'

const LTT_STAR = 'lt_star'

// http://harttle.com/2016/04/24/client-height-width.html
// 获取窗口宽度 FireFox: document.body, Chrome/IE: document.documentElement
/* eslint-disable no-unused-vars */
const getWinWidth = function () {
  return window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
}

// 获取窗口高度
const getWinHeight = function () {
  return window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
}

export default {
  data () {
    return {
      lastRoute: -1,
      currentRoute: -1,
      defaultHeight: 2.1875,
      maxExpandHeight: 2.1875,
      innerExpandHeight: 2.1875,
      params: {},
      stationName: '',
      lineName: '',
      isUpDown: '0',
      route: {},
      routes: [],
      direction: [],
      buses: [],
      isStar: false
    }
  },

  methods: {
    handleRouteStar () {
      let stars = store.get(LTT_STAR)
      let direction = this.direction[this.currentRoute]
      let data = this.routes[this.currentRoute][direction]
      let star = {
        lineName: this.lineName,
        isUpDown: data.isUpDown,
        name: this.stationName
      }
      if (stars) {
        stars = JSON.parse(stars)
        if (data.isStar) { // 移除收藏
          stars = stars.filter(item => !(item.name === this.stationName && item.lineName === this.lineName))
        } else {
          stars.push(star)
        }
        store.set(LTT_STAR, JSON.stringify(stars))
        this.isStar = !this.isStar
      } else {
        store.set(LTT_STAR, JSON.stringify([star]))
        this.isStar = true
      }
    },

    setStar (lineName) {
      let stars = store.get(LTT_STAR)
      if (stars) {
        stars = JSON.parse(stars)
        return stars.some(item => item.name === this.stationName && item.lineName === lineName)
      }
      return false
    },

    handleSwitchLine (route, index) {
      let direction = this.direction[index] === 'positive' ? 'opposite' : 'positive'
      this.direction.splice(index, 1, direction)
      getBusWaiting({lineName: this.lineName, isUpDown: route[direction].isUpDown}).then(res => {
        let buses = res.bus
        if (buses.length) {
          let lastStations = []
          let isStations = []
          buses.forEach(bus => {
            lastStations.push(bus.lastStation)
            isStations.push(bus.isStation)
          })
          this.buses.splice(index, 1, {
            bus: buses,
            lastStations: lastStations,
            isStations: isStations
          })
        }
      })
    },

    handleBusRouteClick (route, index) {
      this.lineName = route.name

      const targetItems = document.querySelectorAll('.l-sdetail__item')
      const targetRoutes = targetItems[index].querySelector('.l-sdetail__inner')

      if (index === this.currentRoute) {
        // targetItems[index].style.height = this.defaultHeight + 'rem'
        // targetRoutes.style.height = this.defaultHeight + 'rem'
        // this.currentRoute = this.lastRoute = -1
        return
      }

      this.lastRoute = this.currentRoute
      this.currentRoute = index
      this.isStar = this.setStar(this.routes[index].name) // 是否收藏当前站点

      if (this.lastRoute > -1) {
        const lastTargetItem = targetItems[this.lastRoute]
        const lastTargetRoutes = lastTargetItem.querySelector('.l-sdetail__inner')
        lastTargetItem.style.height = this.defaultHeight + 'rem'
        lastTargetRoutes.style.height = this.defaultHeight + 'rem'
      }

      targetItems[index].style.height = this.maxExpandHeight + 'rem'
      targetRoutes.style.height = this.innerExpandHeight + 'rem'
    },

    setExpandHeight (length) {
      const winHeigth = getWinHeight() // 窗口高度
      const headerDOMRect = document.querySelector('.l-app__header').getBoundingClientRect()
      const infoDOMRect = document.querySelector('.l-sdetail__info').getBoundingClientRect()
      const itemDOMRect = document.querySelector('.l-sdetail__item').getBoundingClientRect()
      const wrapDOMRect = document.querySelector('.l-sdetail__wrap').getBoundingClientRect()
      const maxListHeight = winHeigth - headerDOMRect.height - infoDOMRect.height
      this.maxExpandHeight = (maxListHeight - itemDOMRect.height * length) / 16
      this.innerExpandHeight = (maxListHeight - itemDOMRect.height * length - wrapDOMRect.height) / 16
    },

    handleSiteBack () {
      this.$router.push({path: '/site'})
    },

    async getAllRoutes (routes) {
      let arrLine = []
      let arrBus = []
      routes = routes.split(',')
      this.lineName = routes[0]
      routes.forEach(item => {
        arrLine.push(getAllLines({lineName: item}))
        arrBus.push(getBusWaiting({lineName: item, isUpDown: '0'}))
        this.direction.push('positive')
      })
      const lines = await this.axios.all(arrLine)
      const buses = await this.axios.all(arrBus)
      lines.forEach((item, i) => {
        let positive = item[0]
        let opposite = item[1]
        let lineInfo1 = positive.lineInfo.split(';')
        let lineInfo2 = opposite.lineInfo.split(';')

        this.routes.push({
          name: routes[i],
          positive: {
            points: positive.points,
            stations: positive.stations,
            isUpDown: positive.isUpDown,
            lineInfo: lineInfo1,
            start: positive.stations[0].stationName,
            end: positive.stations[positive.stations.length - 1].stationName,
            time: lineInfo1[1].slice(6),
            price: lineInfo1[3].slice(3),
            isStar: this.setStar(routes[i])
          },
          opposite: {
            points: opposite.points,
            stations: opposite.stations,
            isUpDown: opposite.isUpDown,
            lineInfo: lineInfo2,
            start: opposite.stations[0].stationName,
            end: opposite.stations[opposite.stations.length - 1].stationName,
            time: lineInfo2[1].slice(6),
            price: lineInfo2[3].slice(3),
            isStar: this.setStar(routes[i])
          }
        })
      })
      buses.forEach((item, i) => {
        let lastStations = []
        let isStations = []
        item.bus.forEach(bus => {
          lastStations.push(bus.lastStation)
          isStations.push(bus.isStation)
        })
        this.buses.push({
          bus: item.bus,
          lastStations: lastStations,
          isStations: isStations
        })
      })
      this.$nextTick(_ => {
        this.setExpandHeight(routes.length - 1)
        this.handleBusRouteClick(this.routes[0], 0)
      })
    }
  },

  created () {
    const route = this.$route
    this.route = route
    this.params = route.params
    this.stationName = route.params.stationName
    let passLine = route.params.passLine

    this.isStar = this.setStar(passLine.split(',')[0])
    this.getAllRoutes(passLine)
  }
}
</script>
<style lang="postcss">
@import "../style/mixins.css";

@component-namespace l {

  @b sdetail {

    @e info {
      padding: 1.5rem .9375rem 0;
    }

    @e item {
      height: 2.1875rem;
      overflow: hidden;
      border-bottom: 1px solid #F2F2F2;
      transition: all .6s;

      @when expand {

        .l-sdetail__wrap {
          position: fixed;
          z-index: 99;
          background-color: #fff;
          width: 100%;
        }

        .l-sdetail__routes {
          padding-top: 3.75rem;
        }

        .l-sdetail__direction {
          visibility: visible;
        }

        .l-sdetail__title {
          color: #e65b05;
        }

        .l-sdetail__bus {
          background-image: url("../assets/images/l_sdetail_bus_active.png");
        }

        .l-sdetail__arrow--down {
          background-image: url("../assets/images/l_sdetail_arrow_up.png");
        }
      }
    }

    @e wrap {
      width: 100%;
      font-size: .75rem;
      padding: 0 .9375rem;
      box-shadow: 0 1px 4px 0 rgba(7,17,27,.2);
    }

    @e row {
      display: flex;
      height: 2.1875rem;
      align-items: center;
      color: #333;
    }

    @e bus {
      @mixin icon .625rem .75rem l_sdetail_bus;
      flex: 0 0 1.875rem;
      background-position: .5rem;
    }

    @e title {
      flex: 0 0 4.3125rem;
    }

    @e direction {
      display: flex;
      flex: 1;
      align-items: center;
      visibility: hidden;
    }

    @e start {
      @mixin icon .75rem .75rem l_sdetail_start;
      margin-right: .25rem;
    }

    @e line {
      @mixin icon 2.625rem .09375rem l_sdetail_line;
      margin: 0 0.375rem 0 0.4375rem;
    }

    @e end {
      @mixin icon .75rem .75rem l_sdetail_end;
      margin-right: .25rem;
    }

    @e arrow {

      @m down {
        @mixin icon 1.1875rem .6875rem l_sdetail_arrow_down;
        flex: 0 0 1.1875rem;
      }
    }

    @e desc {
      height: 1.5625rem;
      line-height: 1.5625rem;
      color: #525B60;
    }

    @e time {
      padding-left: .5rem;
      padding-right: 2.375rem;
    }

    @e back {
      float: right;
      margin-right: 2.1875rem;
      @mixin icon 1.25rem 1.125rem l_sdetail_back;
    }

    @e inner {
      padding: 0 1.4375rem;
      overflow-y: scroll;
      transition: height .6s;
    }

    @e sites {
      position: relative;

      &:before {
        content: "";
        position: absolute;
        top: 1.5rem;
        bottom: 1.5rem;
        left: .75rem;
        width: .125rem;
        background-color: #CCE7F9;
      }
    }

    @e site {
      position: relative;
      height: 3rem;
      line-height: 3rem;
      padding-left: 2.8125rem;
      font-size: 1rem;
      color: #383E41;
    }

    @e status {
      position: absolute;
      top: 1.15625rem;
      left: .53125rem;
      display: block;
      size: .4375rem;
      background-color: #0285e0;
      border-radius: 50%;

      @when bus {
        left: 0;
        top: .75rem;
        @mixin icon 1.5rem 1.5rem l_rdetail_bus;
      }
    }
  }
}
</style>
