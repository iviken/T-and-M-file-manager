<script>

export default {
  components:{
  },
  props:{
    file:{
        type: Object,
        required: true
    },
    state:{
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
  methods: {
    renameFile:function(dat){
      if(dat.state == 'file-rename:input-done'){
        if(this.renamedValue.length > 0){
          console.log("RENAME FILE at <FILE component>")
          this.state.setCmd( {cmd: 'endRenameSelectedFiles', name: this.renamedValue} )
          this.state.files[dat.id] = ''
        }
      }
    }
  },
  data(){
    return{
      fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
      renamedValue: ''
    }
  }
}
</script>

<template>

        <div :class="`${state.files[file.id]}`">

          <div v-if="( !fileImgMask.includes(file.format) ) && (viewMode != 'imgs')" class="text">

            <div v-if="state.files[file.id] != 'RENAME'">
              <span class="item-name">{{ file.name }}</span>
              <span :class="`${file.format}`">&nbsp;{{ file.format }}</span>
            </div>

            <div v-if="state.files[file.id] == 'RENAME'">
              <input type="text" v-model="renamedValue" :id="`${file.id}`" class="item-name rename w100" @keyup.enter="renameFile({state: 'file-rename:input-done', id: file.id})"></input>
            </div>

          </div>
          
          <div v-if="( fileImgMask.includes(file.format) ) && (viewMode == 'imgs')" class="img">
            <!-- <img src="../assets/gallery/file (1).png" > -->
            <img :src="`${file.path}/${file.name}.${file.format}`" :style="`height:${pixHeight}px;`">
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

  .img{
    // position: relative;
    padding: 20px;
  }

  .rename{
    background-color: antiquewhite;
  }
  .SELECTED{
    background-color: aquamarine;
  }
</style>