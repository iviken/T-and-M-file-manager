<script>
import AccordionFiles from './Accordion.vue';

export default {
  components:{
    AccordionFiles
  },
  props:{
    files:{
        type: Object,
        required: true
    },
    marks:{
        type: Object,
        required: true
    },
    state:{
        type: Object,
        required: true
    }
  }
}
</script>

<template>
  <div class="w100 h100 on-row component">
    <div>
      <AccordionFiles :files="files" :marks="marks" :viewMode="'text'" :state="state" class="text-files-component" />
    </div>
    <div>
      <AccordionFiles :files="files" :marks="marks" :viewMode="'imgs'" :state="state" class="image-files-component" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  $width-tasks-and-marks-field: 420px;
  $width-text-files-filed: 280px;

  .component{
    padding-top: var(--top-indent);
  }

  .text-files-component{
    width: $width-text-files-filed;
    background: var(--grad-text-files-and-tasks);
  }

  .image-files-component{
    width: 800px;
    max-width: calc(1920px - $width-tasks-and-marks-field - $width-text-files-filed - 400px);
  }
</style>