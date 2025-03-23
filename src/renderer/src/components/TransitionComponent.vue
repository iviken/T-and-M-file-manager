<script>

export default{
  props:{
    route:{
      type: Object,
      required: true
    }
  },
  mounted(){
    // console.log(this.route)
  }
}

</script>

<template>
  <Transition name="fade" mode="out-in">
    <div :key="route.name">
       <slot></slot>
    </div>
  </Transition>
</template>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
