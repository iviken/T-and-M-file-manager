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
    
    shrinkName:function(name, format){

      if(format == undefined) format = ''

      if( this.settings.maxNameLength >= (name.length + format.length) ){

        return name
      }else{

        let lastWord = name.indexOf(' ') > 0 ? name.split(' ')[name.split(' ').length - 1] : name.slice(-1 * this.settings.lengthOfLastWord)
        if(lastWord.length > this.settings.lengthOfLastWord)
          lastWord = lastWord.slice( -1 * this.settings.lengthOfLastWord )

        let index = this.settings.maxNameLength - lastWord.length - format.length
  
        return `${name.slice(0, index)}..${lastWord}`
      }
    },
  },

  data(){
    return{
      renamedValue: '',
      settings:{
        fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,
        maxNameLength: 27,
        lengthOfLastWord: 8,
        actualSeparator: '/',
      },
    }
  }
}
</script>

<template>

  <!-- text file -->

  <div v-if="( !filesMethods.isAPicture(file.format) ) && (viewMode != 'imgs')" :class="`${state.files[file.id]}-text`" class="text-file w100">

    <div v-if="state.files[file.id] != 'RENAME'" class="on-row">
      <span class="item-name t-file-name text-nowrap">{{ shrinkName(file.name, file.format) }}</span>
      <span class="format-default">
        <span :class="`format-${file.format}`" class="t-file-format text-nowrap">&nbsp;{{ file.format }}</span>
      </span>
    </div>

    <div v-if="state.files[file.id] == 'RENAME'" class="rename-text w100">
      <input type="text" placeholder="file name" v-model="renamedValue" :id="`${file.id}`" @keyup.enter="filesMethods.renameFiles( {state: 'input done', newName: renamedValue.replace(this.settings.fileNameRegexp, '').trim()} )" class="item-name rename-input-text t-file-renaming text-nowrap focus w100"></input>
    </div>

  </div>

  <!-- image file -->

  <div v-if="( filesMethods.isAPicture(file.format) ) && (viewMode == 'imgs')" :class="`${state.files[file.id]}-imgs`" class="img-box shadow on-center">
    
    <!-- <img src="../assets/gallery/file (3).png" :style="`height:${pixHeight}px;`" class="img"> -->
    <img :src="`file://C:${file.path}${settings.actualSeparator}${file.name}.${file.format}`" :style="`height:${pixHeight}px;`" :class="`opacity-${state.files[file.id]}-imgs`" class="img">

    <div v-if="state.files[file.id] == 'RENAME'" class="rename-img on-center h100 w100">
      <input type="text" placeholder="file name" v-model="renamedValue" :id="`${file.id}`" @keyup.enter="filesMethods.renameFiles( {state: 'input done', newName: renamedValue.replace(this.settings.fileNameRegexp, '').trim()} )" class="rename-input-imgs t-file-name t-file-renaming text-nowrap focus w100"></input>
    </div>

  </div>

</template>

<style scoped lang="scss">
  
  .text-file{
    padding-top: 3px;
    padding-bottom: 3px;
  }

  .text{
    // width: 1fr;
    flex: 1 1 100%;
  }
  .text span:nth-child(2){
    opacity: 0;
  }
  .text:hover span:nth-child(2){
    opacity: .6;
  }

  .item-name{
    padding-left: 20px;
  }

  .img-box{
    position: relative;
  }
  .opacity-RENAME-imgs{
    opacity: 12;
  }
  .img{
    transition: .10s;
    z-index: 0;
  }
  .img:hover{
    transform: scale(1.05);
    transition: .05s;
  }
  .shadow{
    box-shadow: var(--shadow-image-file);
  }

  .rename-input-imgs{
    opacity: .8;
    border: solid 0px;
    background: var(--transparent);
  }
  .rename-input-text{
    opacity: .8;
    border: solid 0px;
    background: var(--grad-renaming);
  }
  .rename-input-imgs:focus, .rename-input-text:focus{
    opacity: 1;
  }
  .rename-text{
    // background: var();
  }
  .rename-img{
    position: absolute;
    z-index: 1;
  }

  .SELECTED-text{
    background: var(--grad-selected);
  }
  .RENAME-imgs{
    border: 16px solid var(--grad-renaming);
    margin: 0px;
    // transition: .25s;
  }
  .SELECTED-imgs{
    border: 16px solid skyblue;
    border-image: var(--grad-selected-img-file);
    border-image-slice: 1;
    margin: 0px;
    // transition: .25s;
  }
  .undefined-imgs, .-imgs{
    margin: 16px;
    // transition: .25s;
  }

  .COPY-text, .CUT-text{
    background: var(--grad-select-copy-cut-text-file);
  }

  .COPY-imgs, .CUT-imgs{
    // background: var(--grad-select-copy-cut-img-file);
  }

  .focus:focus{
    outline: none;
  }
</style>