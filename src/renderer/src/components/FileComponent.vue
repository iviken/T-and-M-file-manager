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
  data(){
    return{
      renamedValue: '',
      settings:{
        fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
        fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,
      },
    }
  }
}
</script>

<template>

        <div :class="`${state.files[file.id]}`">

          <div v-if="( !settings.fileImgMask.includes(file.format) ) && (viewMode != 'imgs')" class="text">

            <div v-if="state.files[file.id] != 'RENAME'">
              <span class="item-name">{{ file.name }}</span>
              <span :class="`${file.format}`">&nbsp;{{ file.format }}</span>
            </div>

            <div v-if="state.files[file.id] == 'RENAME'">
              <input type="text" v-model="renamedValue" :id="`${file.id}`" class="rename w100" @keyup.enter="filesMethods.renameFiles( {state: 'input done', newName: renamedValueю.replace(this.settings.fileNameRegexp, '').trim()} )"></input>
            </div>

          </div>
          
          <div v-if="( settings.fileImgMask.includes(file.format) ) && (viewMode == 'imgs')" :style="`height:${pixHeight}px;`" class="img-box">
            
            <div v-if="state.files[file.id] != 'RENAME'">
              <!-- <img src="../assets/gallery/file (3).png" class="img"> -->
              <img :src="`file://C:${file.path}/${file.name}.${file.format}`" class="img">
            </div>

            <div v-if="state.files[file.id] == 'RENAME'" class="h100 w100 rename-block-img on-center">
              <input type="text" v-model="renamedValue" :id="`${file.id}`" class="rename" @keyup.enter="filesMethods.renameFiles( {state: 'input done', newName: renamedValueю.replace(this.settings.fileNameRegexp, '').trim()} )"></input>
            </div>

          </div>

        </div>

</template>

<style scoped lang="scss">
  // @use '../scss/textFiles.scss' as *;
  .text span:nth-child(2){
    opacity: 0;
  }
  .text:hover span:nth-child(2){
    opacity: .6;
  }

  .item-name{
    padding-left: 20px;
    color: var(--text);
  }
  .item-name:hover{
    color: var(--pure-white);
  }

  .img-box{
    // position: relative;
    padding: 20px;
  }
  .img{
    height: 100%;
    width: auto;
  }

  .rename{
    background-color: antiquewhite;
    color: var(--text);
  }
  .rename-block-img{
    
  }

  .SELECTED{
    background-color: aquamarine;
  }
</style>