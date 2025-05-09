<script>
import FileComponent from './FileComponent.vue'

import { settings } from '../lib/settings.js'

export default {
  components:{
    FileComponent
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
    state:{     //  stateFiles
        type: Object,
        required: true
    },
    localState:{
        type: Object,
        required: true
    },
    inputSettings:{
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
    }
  },

  methods:{

    foldMark: function(mark_ID){

      this.marks[mark_ID].isFolded[this.viewMode] = !this.marks[mark_ID].isFolded[this.viewMode]
    },

    singleMarkMode: function(mark_ID){
      //
      this.marks[mark_ID].isFolded[this.viewMode] = true
      //
      this.singleDisplayMarkMode.isEnabled = !this.singleDisplayMarkMode.isEnabled
      this.singleDisplayMarkMode.mark_id = mark_ID
    },

    singleMarkModeFilter:function(dat){  //  marks
      //  Show one mark group only - mode
      if(!this.singleDisplayMarkMode.isEnabled){

        // if()
        return dat
      }else{

        return {[this.singleDisplayMarkMode.mark_id]: dat[this.singleDisplayMarkMode.mark_id]}      //        !!!
      }
    },

    filterMark:function(mark){

      let _mark = {text: false, imgs: false}

      //    Sorted files by type: images or others format and marking
      this.files.forEach(file => {

        if( this.settings.fileImgMask.includes(file.format) ){
          if(mark.id == file.markID){
            if(!file.isPinned){
              _mark.imgs = true
            }
          }
        }

        if( !this.settings.fileImgMask.includes(file.format) ){
          if(mark.id == file.markID){
            if(!file.isPinned){
              _mark.text = true
            }
          }
        }

      })
      
      return _mark[this.viewMode]
    },

    countUnpinBlockHeight:function(){

      this.unpinHeightBlock = document.querySelector('._component').clientHeight - document.querySelector('._left-field').clientHeight
    },

    foldPin:function(){

      this.inputSettings.pinFilesIsFolded[this.viewMode] = !this.inputSettings.pinFilesIsFolded[this.viewMode]
      //
      if( this.inputSettings.pinFilesIsFolded[this.viewMode] ){
        this.filesMethods.resetPinnedSelection(this.viewMode)
      }
    },
  },

  computed:{

    isThereAtLeastOneAttachedFile(){
      return this.files
        .filter( (file)=>this.viewMode == 'imgs' ? this.settings.fileImgMask.includes(file.format) : !this.settings.fileImgMask.includes(file.format) )
        .find( (file)=>file.isPinned == true )
    }
    // countUnpinBlockHeight1:function(){
    //   return document.querySelector('._component').clientHeight - document.querySelector('._left-field').clientHeight
    // },
  },

  data(){
    return{
      settings: settings,
      displayedMarks: {text:[], imgs:[]},
      singleDisplayMarkMode: {isEnabled: false, mark_id: ''},
      unpinHeightBlock: 600,
    }
  },

  beforeUpdate(){
    //
    // this.unpinHeightBlock = document.querySelector('._component').clientHeight - 50 - this.countFiles[this.viewMode].pin * this.settings.textFileBtnHeight_px - 200
    this.countUnpinBlockHeight()
  },

  beforeMount(){},
}
</script>

<template>

  <div 
    class="h100 focus _component accordion" 
    tabindex="0" 
    @keyup.esc="filesMethods.resetStateFiles()" 
    @keyup.f2="filesMethods.renameFiles( {state: 'start rename'} )" 
    @keyup.delete="filesMethods.deleteFiles()"
    @keyup.ctrl.c="!localState.showFilesFromAllFoldersOption && filesMethods.copyFiles()"
    @keyup.ctrl.x="!localState.showFilesFromAllFoldersOption && filesMethods.cutFiles()"
    @keyup.ctrl.v="!localState.showFilesFromAllFoldersOption && filesMethods.pasteFiles()"
    @keyup.ctrl.d="filesMethods.pinSelectedFiles()"
  >

    <!-- pin block -->

    <div class="on-row w100">

      <div @click="foldPin()" class="left-field _left-field on-row">
        <div class="w100"></div>
        <div v-if="isThereAtLeastOneAttachedFile" :class="{pinActive: inputSettings.pinFilesIsFolded[viewMode]}">
          <img src="../assets/pin.svg" alt="" class="pix-btn pin">
        </div>
      </div>

      <!-- pinned files list -->

      <div v-if="!inputSettings.pinFilesIsFolded[viewMode]" class="w100">
        <div :class="`${viewMode}`" class="w100">
          <div v-for="fileItem in files" class="file">
            <div v-if="fileItem.isPinned" @click="filesMethods.clickToFile(fileItem.id)" @mouseenter.space="filesMethods.readMetadata(fileItem)" @dblclick="filesMethods.openFile(fileItem)" class="">
              <FileComponent :file="fileItem" :viewMode="viewMode" :state="state" :pixHeight="inputSettings.imagesHeight" :filesMethods="filesMethods" class="file-component" />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- unpin block -->
    
    <div class="scrollY unpin-block" :style="`height: ${unpinHeightBlock}px;`">

      <div v-for="markItem in singleMarkModeFilter(marks)" class="unpin-sub-block">
      
        <div v-if="markItem.show">
      
          <div v-if="filterMark(markItem)" class="on-row w100" :id="`${markItem.id}`">

            <!-- left field (colored) -->
          
            <div class="left-field left-field-gradient" @click="foldMark(markItem.id)">
              <div :class="`${markItem.color}-back`" class="h100 w100"></div>
            </div>
          
            <div class="right-field on-col w100">
              
              <!-- mark name -->
          
              <div @click="foldMark(markItem.id)" @dblclick="singleMarkMode(markItem.id)">
                <span :class="`${markItem.color}-text uppercase t-files-mark mark-name`">
                  {{ markItem.descr }}
                </span>
              </div>

              <!-- unpinned files list -->
            
              <div @keyup.ctrl.a="filesMethods.selectAllFilesInGroupMark(markItem.id, this.viewMode)" :class="`${viewMode}`" tabindex="0" class="files-block focus w100">

                <div v-if="markItem.isFolded[viewMode]" v-for="fileItem in files" class="file">

                  <div v-if="!fileItem.isPinned && (fileItem.markID == markItem.id)" class="">
                    <div @click="filesMethods.clickToFile(fileItem.id)" @mouseenter.space="filesMethods.readMetadata(fileItem)" @dblclick="filesMethods.openFile(fileItem)" class="">
                      <FileComponent :file="fileItem" :state="state" :viewMode="viewMode" :pixHeight="inputSettings.imagesHeight" :filesMethods="filesMethods" class="file-component" />
                    </div>
                  </div>

                </div>

              </div>
          
            </div>
          
          </div>
      
        </div>
      
      </div>

      <div class="empty-block"></div>

    </div>

  </div>

</template>

<style scoped lang="scss">
  // @use '../scss/textFiles.scss' as *;
  .pix-btn{
    opacity: .6;
    width: 14px;
    height: 14px;
  }
  .pin{
    width: 10px;
  }

  .accordion{
    padding-top: var(--content-indent);
  }

  .focus:focus{
    outline: none;
  }

  .left-field{
    width: 50px;
    min-width: 50px;
  }
  .left-field:hover{
  }
  .left-field-gradient{
    opacity: .06;
    -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    mask-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    filter: blur(5px);
    transition: .25s;
  }
  .left-field-gradient:hover{
    opacity: .10;
    transition: .25s;
  }
  .right-field{
    padding-top: 16px;
  }

  .pinActive{
    // color:aquamarine;   //
    opacity: .6;
  }
  // .pin-block{
  //   height: fit-content;
  // }
  .unpin-block{
    margin-top: 15px;
    // max-height: 65vh;
    // height: 50vh;
    // height: fit-content;
    // display: inline-block;
  }
  .unpin-sub-block{
    // margin-top: 16px;
  }

  .item{
    padding-left: 20px;
  }
  .item:hover{
    color: var(--pure-white);
  }

  .mark-name{
    opacity: .7;
  }
  .mark-name:hover{
    opacity: 1;
  }
  .files-block{
    margin-bottom: 10px;
  }
  .file{
    // padding-top: 3px;
    // padding-bottom: 3px;
  }

  .text{
    display: flex;
    flex-direction: column;
  }
  .imgs{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .empty-block{
    height: 200px;
  }

  .file-component{
    // overflow: hidden;
  }
</style>