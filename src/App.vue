<template>
  <div id="app" class="l-app">
    <div class="l-app__header">
      <div class="l-hero">
        <img src="./assets/images/l_hero_bus.png">
      </div>
      <div class="l-nav">
        <ul class="l-nav__list">
          <router-link tag="li" :to="{path: '/route'}" class="l-nav__item"><i class="l-nav__icon l-nav__route" v-if="$route.path === '/'"></i>路线查询</router-link>
          <router-link tag="li" :to="{path: '/site'}" class="l-nav__item"><i class="l-nav__icon l-nav__site" v-if="$route.path === '/site'"></i>站点查询</router-link>
        </ul>
      </div>
    </div>
    <div class="l-app__content">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="postcss">
@import "./style/index.css";

@reset-global mobile;
html, body {
  height: 100%;
}
@component-namespace l {

  @b app {
    height: 100%;
    display: flex;
    flex-direction: column;

    @e header {
      flex: 0 0 11.5rem;
      background: url("./assets/images/l_app_banner.jpg") no-repeat;
    }

    @e content {
      flex: 1;
      overflow-y: auto;
    }
  }

  @b hero {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8.75rem;

    img {
      height: 3.5rem;
    }
  }

  @b nav {

    @e list {
      display: flex;
    }

    @e item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2.75rem;
      flex: 1;
      color: #333;
      border-top-left-radius: .875rem;
      border-top-right-radius: .875rem;


      @when active {
        color: #E97126;
        background-color: white;
      }
    }

    @e icon {
      display: inline-block;
      width: 1.25rem;
      height: 1.125rem;
      margin-right: .25rem;
      background-size: contain;
      background-repeat: no-repeat;
    }

    @e route {
      background-image: url("./assets/images/l_nav_route.png");
    }

    @e site {
      background-image: url("./assets/images/l_nav_site.png");
    }
  }
}
</style>
