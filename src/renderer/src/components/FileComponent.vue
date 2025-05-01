<script>

export default {
  props:{
    file:{
        type: Object,
        required: true
    },
    state:{
        type: Object,
        required: true
    },
    filesMethods:{
        type: Object,
        required: true
    },
    viewMode:{    //text or imgs
        type: String,
        required: true
    },
    pixHeight:{   //  300 (px)
      type: Number,
      required: true
    }
  },

  methods:{
    
    shrinkName:function(name){

      if( this.settings.maxNameLength >= name.length){

        return name
      }else{

        let lastWord = name.indexOf(' ') > 0 ? name.split(' ')[name.split(' ').length - 1] : name.slice(-1 * this.settings.lengthOfLastWord)
        let index = this.settings.maxNameLength - lastWord.length - 2
  
        return `${name.slice(0, index)}...${lastWord}`
      }
    },
  },

  data(){
    return{
      renamedValue: '',
      settings:{
        fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
        fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,
        maxNameLength: 24,
        lengthOfLastWord: 6,
        actualSeparator: '/',
      },
    }
  }
}
</script>

<template>

        <div :class="`${state.files[file.id]}-${viewMode} ${viewMode}-file w100`">

          <div v-if="( !settings.fileImgMask.includes(file.format) ) && (viewMode != 'imgs')" class="text w100">

            <div v-if="state.files[file.id] != 'RENAME'" class="on-row">
              <span class="item-name t-file-name text-nowrap">{{ shrinkName(file.name) }}</span>
              <span :class="`${file.format}`" class="t-file-format text-nowrap">&nbsp;{{ file.format }}</span>
            </div>

            <div v-if="state.files[file.id] == 'RENAME'">
              <input type="text" v-model="renamedValue" :id="`${file.id}`" class="rename-text-input w100" @keyup.enter="filesMethods.renameFiles( {state: 'input done', newName: renamedValue.replace(this.settings.fileNameRegexp, '').trim()} )"></input>
            </div>

          </div>
          
          <div v-if="( settings.fileImgMask.includes(file.format) ) && (viewMode == 'imgs')" :style="`height:${pixHeight}px;`" class="img-box">
            
            <div v-if="state.files[file.id] != 'RENAME'">
              <!-- <img src="../assets/gallery/file (3).png" class="img"> -->
              <img :src="`file://C:${file.path}${settings.actualSeparator}${file.name}.${file.format}`" class="img">
            </div>

            <div v-if="state.files[file.id] == 'RENAME'" class="rename-img on-center h100 w100">
              <input type="text" v-model="renamedValue" :id="`${file.id}`" class="rename-imgs-input" @keyup.enter="filesMethods.renameFiles( {state: 'input done', newName: renamedValue.replace(this.settings.fileNameRegexp, '').trim()} )"></input>
            </div>

          </div>

        </div>

</template>

<style scoped lang="scss">
  
  .text-file{
    padding-top: 3px;
    padding-bottom: 3px;
  }

  .text span:nth-child(2){
    opacity: 0;
  }
  .text:hover span:nth-child(2){
    opacity: .6;
  }

  .item-name{
    padding-left: 20px;
    // color: var(--text);
  }
  .item-name:hover{
    color: var(--pure-white);
  }

  .img-box{
    padding: 20px;
  }
  .img{
    height: 100%;
    width: auto;
    box-shadow: var(--image-file-shadow);
    transition: .25s;
  }
  .img:hover{
    transform: scale(1.2);
    transition: .25s;
  }

  .rename-text-input{
    // background-color: antiquewhite;
    background: var(--grad-select-renaming-text-file-input);
    border: solid 0px black;
    color: var(--pure-white);
  }
  .rename-imgs-input{
    // background-color: antiquewhite;
    background: var(--grad-select-renaming-img-file-input);
    border: solid 0px;
    color: var(--pure-white);
  }
  .rename-img{
    background: var(--grad-select-renaming-img-file);
  }

  .SELECTED-text{
    // background-color: aquamarine;
    background: var(--grad-selected-text-file);
  }
  .SELECTED-imgs{
    background: var(--grad-selected-img-file);
  }

  .COPY-text, .CUT-text{
    // background-color: azure;
    background: var(--grad-select-copy-cut-text-file);
  }

  .COPY-imgs, .CUT-imgs{
    background: var(--grad-select-copy-cut-img-file);
  }
</style>