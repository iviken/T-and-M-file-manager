<script>
import FileComponent from './FileComponent.vue'

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

  methods: {
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

        if( this.fileImgMask.includes(file.format) ){
          if(mark.id == file.markID){
            if(!file.isPinned){
              _mark.imgs = true
            }
          }
        }

        if( !this.fileImgMask.includes(file.format) ){
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
        .filter( (file)=>this.viewMode == 'imgs' ? this.fileImgMask.includes(file.format) : !this.fileImgMask.includes(file.format) )
        .find( (file)=>file.isPinned == true )
    }
    // countUnpinBlockHeight1:function(){
    //   return document.querySelector('._component').clientHeight - document.querySelector('._left-field').clientHeight
    // },
  },

  data(){
    return{
      displayedMarks: {text:[], imgs:[]},
      fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
      singleDisplayMarkMode: {isEnabled: false, mark_id: ''},
      countFiles: {text: {pin: 0, unpin: 0}, imgs: {pin: 0, unpin: 0}},
      unpinHeightBlock: 600,
    }
  },

  beforeUpdate(){
    //
    // this.refreshFiles()
    //
    // this.getCountFiles()
    //
    // this.unpinHeightBlock = document.querySelector('._component').clientHeight - 50 - this.countFiles[this.viewMode].pin * this.settings.textFileBtnHeight_px - 200
    this.countUnpinBlockHeight()
  },

  beforeMount(){},
}
</script>

<template>

  <div 
    class="h100 focus _component" 
    tabindex="0" 
    @keyup.esc="filesMethods.resetStateFiles()" 
    @keyup.f2="filesMethods.renameFiles( {state: 'start rename'} )" 
    @keyup.delete="filesMethods.deleteFiles()"
    @keyup.ctrl.c="!localState.showFilesFromAllFoldersOption && filesMethods.copyFiles()"
    @keyup.ctrl.x="!localState.showFilesFromAllFoldersOption && filesMethods.cutFiles()"
    @keyup.ctrl.v="!localState.showFilesFromAllFoldersOption && filesMethods.pasteFiles()"
    @keyup.ctrl.d="filesMethods.pinSelectedFiles()"
  >

    <div class="on-row">
      <div @click="foldPin()" class="left-field _left-field">
        <div v-if="isThereAtLeastOneAttachedFile" :class="{pinActive: inputSettings.pinFilesIsFolded[viewMode]}">Pin</div>
      </div>
      <div v-if="!inputSettings.pinFilesIsFolded[viewMode]">
        <div :class="`${viewMode}`">
          <div v-for="fileItem in files">
            <div v-if="fileItem.isPinned" @click="filesMethods.clickToFile(fileItem.id)" @mouseenter.ctrl="filesMethods.readMetadata(fileItem)" @dblclick="filesMethods.openFile(fileItem)">
              <FileComponent :file="fileItem" :viewMode="viewMode" :state="state" :pixHeight="inputSettings.imagesHeight" :filesMethods="filesMethods" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
     <div class="scrollY unpin-block" :style="`height: ${unpinHeightBlock}px;`">

      <div v-for="markItem in singleMarkModeFilter(marks)">
      
        <div v-if="markItem.show">
      
         <div v-if="filterMark(markItem)" class="on-row" :id="`${markItem.id}`">
         
           <div :class="`${markItem.color}-back`" class="left-field" @click="foldMark(markItem.id)"></div>
         
           <div class="on-col">
         
             <div @click="foldMark(markItem.id)" @dblclick="singleMarkMode(markItem.id)">
               <span :class="`${markItem.color}-text`">
                 {{ markItem.descr }}
               </span>
             </div>
           
             <div @keyup.ctrl.a="filesMethods.selectAllFilesInGroupMark(markItem.id, this.viewMode)" :class="`${viewMode}`" tabindex="0" class="focus">
              <div v-for="fileItem in files" v-if="markItem.isFolded[viewMode]">
                <div v-if="!fileItem.isPinned && (fileItem.markID == markItem.id)">
                  <div @click="filesMethods.clickToFile(fileItem.id)" @mouseenter.shift="filesMethods.readMetadata(fileItem)" @dblclick="filesMethods.openFile(fileItem)">
                    <FileComponent 
                      :file="fileItem" 
                      :state="state"
                      :viewMode="viewMode" 
                      :pixHeight="inputSettings.imagesHeight"
                      :filesMethods="filesMethods"
                      />
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
  .focus:focus{
    outline: none;
  }
  .left-field{
    width: 50px;
    opacity: .4;
  }
  .left-field:hover{
    opacity: .6;
  }

  .pinActive{
    color:aquamarine;   //
  }
  // .pin-block{
  //   height: fit-content;
  // }
  .unpin-block{
    // max-height: 65vh;
    // height: 50vh;
    // height: fit-content;
    // display: inline-block;
  }

  .item{
    padding-left: 20px;
  }
  .item:hover{
    color: var(--pure-white);
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
</style>