<template>
  <div class="l-site">
    <div class="l-site__search">
      <div class="l-search__form">
        <input v-model="keyword"
          class="l-search__input l-site__input"
          type="text">
        <i class="l-search__close" @click="handleClearKeyword"></i>
        <i class="l-site__star" style="display: none;" @click="handleRouteStar"></i>
        <button class="l-search__btn" @click="handleSearchKeyword">查询</button>
      </div>
      <div class="l-search__routes" v-if="searching">
        <div class="l-search__result" v-show="routes.length > 0">
          <i class="l-search__arrow"></i>
          <ul class="l-search__list">
            <li class="l-search__item"
              :class="{
                'l-search__item--first': index === 0,
                'l-search__item--last': index === routes.length-1
              }"
              v-for="(route, index) in routes"
              :key="index"
              @click="handleRouteClick(route, index)" v-html="route.hlStationName"></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="l-site__routes" v-show="!searching">
      <ul class="l-site__list">
        <li class="l-site__item"
          v-for="(star, index) in stars"
          :key="index"
           @click="handleSiteGo(star)">
          <i class="l-site__star--solid" @click.stop="handleSiteStar(star)"></i>
          <span class="l-site__title">{{`${star.name}（${star.lineName}路）`}}</span>
          <i class="l-site__go"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from 'store2'
import { getStationLikeMore } from '../http/bus'

const LTT_STAR = 'lt_star'

// 函数防抖
function debounce (func, wait, immediate) {
  var timeout
  var result

  var debounced = function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }

    return result
  }

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

export default {
  name: 'HelloWorld',
  data () {
    return {
      keyword: '',
      routes: [],
      stars: [],
      searching: false,
      site: {}
    }
  },

  watch: {
    keyword (val) {
      if (!val) {
        this.searching = false
        this.routes.splice(0)
      }
    }
  },

  methods: {
    handleRealtimeSearch () {
      if (!this.keyword) return
      getStationLikeMore({stationName: this.keyword}).then(res => {
        this.searching = true
        this.routes.splice(0)
        this.routes = res || []
        this.routes.map(route => {
          route.hlStationName = route.stationName
            .replace(this.keyword, '<span class="is-highlight">' + this.keyword + '</span>')
          return route
        })
      })
    },
    handleSearchKeyword () {
      if (!this.keyword) return
      let passLine = this.site.passLine
      passLine = passLine.replace(/路/g, '')
      this.$router.push({path: `/site/${passLine}/${this.keyword}`})
    },
    handleClearKeyword () {
      this.keyword = ''
    },
    handleRouteStar () {},
    handleRouteClick (route, index) {
      this.keyword = route.stationName
      this.site = route
      this.searching = false
    },
    handleSiteStar (star) {
      let stars = store.get(LTT_STAR)
      stars = JSON.parse(stars)
      stars = stars.filter(item => !(item.isUpDown === star.isUpDown && item.lineName === star.lineName))
      store.set(LTT_STAR, JSON.stringify(stars))
      this.stars = stars
    },
    handleSiteGo (star) {
      this.$router.push({path: `/route/${star.lineName}/${star.isUpDown}`})
    },
    getLocalStars () {
      const stars = store.get(LTT_STAR)
      this.stars = JSON.parse(stars) || []
    }
  },

  mounted () {
    on(document.querySelector('.l-search__input'), 'keyup', debounce(this.handleRealtimeSearch, 100, true))
  },

  created () {
    this.getLocalStars()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="postcss">
@import "../style/mixins.css";

@component-namespace l {

  @b site {

    @e search {
      padding: 1.5rem .9375rem 0;

      .l-search__input {
        padding-left: 2rem;
      }

      .l-search__item {

        .is-highlight {
          color: #E65B05;
        }
      }

      .l-site__input {
        color: #E55B05;
        padding-left: 2.0625!important;
        // padding-left: 3.25rem!important;
      }
    }
    @e star {
      position: absolute;
      left: .625rem;
      top: .59375rem;
      display: block;
      @mixin icon 1.1875rem 1.1875rem l_site_star;
    }

    @e routes {
      padding: 0 .9375rem;
    }

    @e list {}

    @e item {
      position: relative;
      padding-top: .625rem;
      padding-left: 2.8125rem;
      height: 2.75rem;
      line-height: 2.125rem;
      border-bottom: 1px solid #F2F2F2;
    }

    @e star {
      @m solid {
        position: absolute;
        left: 0;
        top: 1.09375rem;
        @mixin icon 1.1875rem 1.1875rem l_site_star_solid;
      }
    }

    @e go {
      position: absolute;
      right: 0rem;
      top: 1.1875rem;
      @mixin icon 1rem 1rem l_route_go;
    }
  }
}
</style>
