<template>
  <div class="l-route">
    <div class="l-route__search">
      <div class="l-search__form">
        <input v-model="keyword" class="l-search__input" type="text">
        <i class="l-search__close" @click="handleClearKeyword"></i>
        <button class="l-search__btn" @click="handleSearchKeyword">查询</button>
      </div>
      <div class="l-search__routes">
        <div class="l-search__result" v-show="searching">
          <i class="l-search__arrow"></i>
          <ul class="l-search__list" v-if="routes.length > 0">
            <li class="l-search__item"
              :class="{
                'l-search__item--first': index === 0,
                'l-search__item--last': index === routes.length-1,
                'is-active': index === currentRoute
              }"
              v-for="(route, index) in routes"
              :key="index"
              @click="handleRouteClick(route, index)">{{route.name}}<i class="l-search__go" @click="handleRouteForward(route, index)"></i></li>
          </ul>
          <div class="l-search__not" v-else><p>查询不到路线相关信息</p></div>
        </div>
      </div>
    </div>
    <div class="l-route__history">
      <div class="l-route__title">搜索历史</div>
      <ul class="l-route__buses" v-if="buses.length > 0">
        <li class="l-route__bus"
          :class="{'is-active': index === currentBus && keyword}"
          v-for="(bus, index) in buses"
          :key="bus"
          @click="handleBusClick(bus, index)">{{bus}}路</li>
      </ul>
      <div class="l-route_not" v-else><p>暂无搜索历史</p></div>
    </div>
  </div>
</template>

<script>
import store from 'store2'
import { getAllLines } from '../http/bus'

const LTT_BUS = 'lt_history'

export default {
  name: 'Route',

  data () {
    return {
      keyword: '',
      lastKeyword: '',
      currentRoute: -1,
      buses: [],
      currentBus: -1,
      routes: [],
      searching: false,
      hasRoute: false
    }
  },

  watch: {
    keyword (val) {
      if (!val) {
        this.searching = false
      }
    }
  },

  methods: {
    handleSearchKeyword () {
      if (!this.keyword) return
      if (this.keyword === this.lastKeyword) return
      this.routes.splice(0)
      getAllLines({lineName: this.keyword}).then(res => {
        this.searching = true
        this.lastKeyword = this.keyword

        if (!res[0].stations) { // 路线不存在
          this.hasRoute = false
        } else {
          this.hasRoute = true
          const data = res
          data.forEach(item => {
            const stations = item.stations
            this.routes.push({
              name: `${this.keyword}路开往${stations[stations.length - 1].stationName}`,
              isUpDown: item.isUpDown
            })
          })
          this.storeSearchKeyword()
        }
      })
    },

    storeSearchKeyword () {
      let buses = store.get(LTT_BUS)
      if (buses) {
        buses = JSON.parse(buses)
        let pos = buses.indexOf(this.keyword)
        if (pos > -1) { // 如果已经搜索过
          buses.splice(pos, 1)
        }
        buses.unshift(this.keyword)
        store.set(LTT_BUS, JSON.stringify(buses))
      } else {
        store.set(LTT_BUS, JSON.stringify([this.keyword]))
      }
      this.getLocalBuses()
    },

    handleClearKeyword () {
      this.keyword = ''
    },

    handleRouteClick (route, index) {
      this.currentRoute = index
    },

    handleRouteForward (route, index) {
      this.$router.push({path: `/route/${this.keyword}/${route.isUpDown}`})
    },

    getLocalBuses () {
      const buses = store.get(LTT_BUS)
      this.buses = JSON.parse(buses) || []
    },

    handleBusClick (bus, index) {
      this.currentBus = index
      this.keyword = bus
    }
  },

  created () {
    this.getLocalBuses()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="postcss">
@component-namespace l {

  @b route {

    @e search {
      padding: 1.5rem .9375rem 0;
      border-bottom: .3125rem solid #e5e5e5;
    }

    @e history {
      padding: 0 .9375rem;
    }

    @e title {
      padding-top: 1.375rem;
      padding-bottom: .9375rem;
      color: #A1A1A1;
    }

    @e buses {
      @utils-clearfix;
      margin-right: -.5625rem;
    }

    @e bus {
      float: left;
      width: 4.875rem;
      height: 1.875rem;
      line-height: 1.875rem;
      margin-right: .5625rem;
      margin-bottom: .5625rem;
      color: #333;
      text-align: center;
      border: 1px solid #aaa;
      border-radius: .9375rem;
      cursor: pointer;

      @when active {
        background-color: #F1F1F1;
      }
    }

    @e not {
      p {
        color: #333;
      }
    }
  }
}
</style>
