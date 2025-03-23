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
  },
  methods: {
  },
  data(){
    return{
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
  // @use '../scss/textFiles.scss' as *;
  $right-indent: 260px;
  $width-tasks-and-marks-field: 620px;
  $width-text-files-filed: 280px;

  .component{
    padding-top: var(--top-indent);
  }

  .text-files-component{
    width: $width-text-files-filed;
    background: var(--grad-text-files-and-tasks);
  }

  .image-files-component{
    max-width: calc(1920px - $width-tasks-and-marks-field - $width-text-files-filed);
    padding-right: $right-indent;
  }
</style>