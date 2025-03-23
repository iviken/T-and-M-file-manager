<script>
  import Header from './components/Header.vue'
  import Content from './components/Content.vue'

  export default {
    name: 'App',
    components: {
      Header, Content
    }
  }
</script>

<template>
  <div class="on-col">
    <Header class="w100 header-component" />
    <Content class="w100 h100 content-component" />
  </div>
</template>

<style lang="scss" scoped>
  @use './scss/app.scss' as *;
</style>

<style lang="scss">
  @use './scss/colors.scss' as *;
  @use './scss/fonts.scss' as *;
  @use './scss/uni.css' as *;
  @use './scss/reset.scss' as *;
</style>
