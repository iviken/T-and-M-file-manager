<script>
  import Header from './components/Header.vue'
  import { RouterView } from 'vue-router'

  export default {
    name: 'App',
    components: {
      Header, RouterView
    }
  }
</script>

<template>

  <div class="on-col">

    <Header class="w100 header-component" />

    <div class="w100 content-component">
      <RouterView />
    </div>

  </div>
  
</template>

<style lang="scss" scoped>

  .header-component{
    height: var(--header-heigth);
  }

  .content-component{
    box-shadow: var(--shadow);
  }
  
</style>

<style lang="scss">
  @use './scss/colors.scss' as *;
  @use './scss/fonts.scss' as *;
  @use './scss/uni.css' as *;
  @use './scss/reset.scss' as *;

  :root{
    --header-heigth: 100px;
    --content-indent: 80px;
    --pin-indent-bottom: 50px;
  }
</style>
