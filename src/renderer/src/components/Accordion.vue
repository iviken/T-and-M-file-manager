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
    state:{
        type: Object,
        required: true
    },
    inputSettings:{
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
      //
      // document.querySelector('#'+mark_ID).style.height = '80pt'
    },
    clickToFile: function(file_ID){
      //
      this.state.setCmd( {cmd: 'select file', fileID: file_ID} )
      //
      this.state.setCmd( {cmd: 'count the number of selected files'} )
    },
    hideOthersMarksAndFiles: function(mark_ID){
      //
      this.marks[mark_ID].isFolded[this.viewMode] = true
      //
      // this.displayedMarks[this.viewMode] = JSON.stringify(this.displayedMarks[this.viewMode]) == JSON.stringify([mark_ID]) ? this.unVoidMarks[this.viewMode].slice() : [mark_ID]
      this.singleDisplayMarkMode.isEnabled = !this.singleDisplayMarkMode.isEnabled
      this.singleDisplayMarkMode.mark_id = mark_ID
    },
    unselectAllFiles:function(){
      this.state.setCmd( {cmd: 'unselectAllFiles'} )
      //
      this.state.setCmd( {cmd: 'count the number of selected files'} )
    },
    enter:function(){
      console.log('ENTER')
    },
    deleteFile:function(){
      console.log('DELETE FILE')
    },
    // refreshFiles:function(){
    //   // console.log('REFRESH FILES in: ' + this.state.pathsOfOpenedFolders)
    //   //
    //   // console.log( window.api.getFilenames(this.state.pathsOfOpenedFolders[0]) )
    // },
    renameFile:function(){
      this.state.setCmd( {cmd: 'startRenameSelectedFiles'} )
    },
    copyFilesToBuffer:function(){
      console.log('COPY FILES')
    },
    cutFilesToBuffer:function(){
      console.log('CUT FILES')
    },
    pasteFilesFromBuffer:function(){
      console.log('PASTE FILES')
    },
    pinThisFiles:function(){
      this.state.setCmd( {cmd: 'pinFiles', allFiles: this.files} )
      // console.log('PIN FOLDER')
    },
    showOneMarkMode:function(dat){  //  marks
      // console.log("FILTER")
      // this.displayedMarks.text = []
      // this.displayedMarks.imgs = []

      // //    Sorted by files type: images or others amd extract marks
      // this.files.forEach(element => {
      //   if( this.fileImgMask.includes(element.format) ){this.displayedMarks.imgs.push(element.markID)}
      //   if( !this.fileImgMask.includes(element.format) ){this.displayedMarks.text.push(element.markID)}
      // })

      //  Show one mark group only - mode
      if(!this.singleDisplayMarkMode.isEnabled){
        return dat
      }else{
        // console.log(dat[this.singleDisplayMarkMode.mark_id])
        return {[this.singleDisplayMarkMode.mark_id]: dat[this.singleDisplayMarkMode.mark_id]}      //        !!!
      }
    },
    filterMark:function(mark){
      let _mark = {text: false, imgs: false}

      //    Sorted by files type: images or others and extract marks
      this.files.forEach(element => {

        if( this.fileImgMask.includes(element.format) ){
          if(mark.id == element.markID){
            if(!element.isPinned){
              _mark.imgs = true
            }
          }
        }

        if( !this.fileImgMask.includes(element.format) ){
          if(mark.id == element.markID){
            if(!element.isPinned){
              _mark.text = true
            }
          }
        }

      })

      //
      return _mark[this.viewMode]
    },
    readMetadata:function(dat){
      this.state.onFocusFile.metadata = dat.meta
      this.state.onFocusFile.name = dat.name
      this.state.onFocusFile.format = dat.format
    },
    openFile:function(file){
      console.log('OPEN FILE')
    },
    selectAllFilesInGroupMark:function(mark_ID){
      //
      this.state.setCmd( 
        {
          cmd: 'select files in group-mark', 
          markID: mark_ID, 
          files: this.viewMode == 'imgs' ? 
            this.files.filter(file=>this.fileImgMask.includes(file.format)) : 
            this.files.filter(file=>!this.fileImgMask.includes(file.format))
        } 
      )
      //
      this.state.setCmd( {cmd: 'count the number of selected files'} )
    },
    countUnpinBlockHeight:function(){
      this.unpinHeightBlock = document.querySelector('._component').clientHeight - document.querySelector('._left-field').clientHeight
    },
    foldPin:function(){
      this.inputSettings.pinFilesIsFolded[this.viewMode] = !this.inputSettings.pinFilesIsFolded[this.viewMode]
      //
      if( this.inputSettings.pinFilesIsFolded[this.viewMode] ){
        //  Reset pinned files selection
        this.files.forEach(file => {
          //
          if( file.isPinned ){
            //  imgs
            if( (this.viewMode == 'imgs') && (this.fileImgMask.includes(file.format)) ){
              this.state.setCmd( {cmd: 'unselect file', fileID: file.id} )
            }
            //  text
            if( (this.viewMode == 'text') && (!this.fileImgMask.includes(file.format)) ){
              this.state.setCmd( {cmd: 'unselect file', fileID: file.id} )
            }
          }
        })
        //
        this.state.setCmd( {cmd: 'count the number of selected files'} )
      }
    },
    // getCountFiles:function(){
    //   this.countFiles = {text: {pin: 0, unpin: 0}, imgs: {pin: 0, unpin: 0}}

    //   this.files.forEach(element => {

    //     if( this.fileImgMask.includes(element.format) ){
    //         if(!element.isPinned){
    //           this.countFiles.imgs.unpin ++
    //         }else{
    //           this.countFiles.imgs.pin ++
    //         }
    //     }
    //     if( !this.fileImgMask.includes(element.format) ){
    //         if(!element.isPinned){
    //           this.countFiles.text.unpin ++
    //         }else{
    //           this.countFiles.text.pin ++
    //         }
    //     }

    //   })
    // },
    // watch(){

    //     deep: true,
    //     immediate: true
    // }
  },
  data(){
    return{
      displayedMarks: {text:[], imgs:[]},
      fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
      singleDisplayMarkMode: {isEnabled: false, mark_id: ''},
      countFiles: {text: {pin: 0, unpin: 0}, imgs: {pin: 0, unpin: 0}},
      // settings:{
      //   textFileBtnHeight_px: 5,
      // },
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
  beforeMount(){
    //
    // this.countUnpinBlockHeight()
  },
}
</script>

<template>

  <div 
    class="h100 focus _component" 
    tabindex="0" 
    @keyup.esc="unselectAllFiles()" 
    @keyup.enter="enter()" 
    @keyup.f2="renameFile()" 
    @keyup.delete="deleteFile()"
    @keyup.ctrl.c="copyFilesToBuffer()"
    @keyup.ctrl.v="pasteFilesFromBuffer()"
    @keyup.ctrl.x="cutFilesToBuffer()"
    @keyup.ctrl.d="pinThisFiles()"
  >

    <div class="on-row">
      <div @click="foldPin()" class="left-field _left-field">
        <div :class="{pinActive: inputSettings.pinFilesIsFolded[viewMode]}">Pin</div>
      </div>
      <div v-if="!inputSettings.pinFilesIsFolded[viewMode]">
        <div :class="`${viewMode}`">
          <div v-for="fileItem in files">
            <div v-if="fileItem.isPinned" @click="clickToFile(fileItem.id)" @mouseenter.ctrl="readMetadata(fileItem)" @dblclick="openFile(fileItem)">
              <FileComponent :file="fileItem" :viewMode="viewMode" :state="state" :pixHeight="inputSettings.imagesHeight" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
     <div class="scrollY unpin-block" :style="`height: ${unpinHeightBlock}px;`">

      <div v-for="markItem in showOneMarkMode(marks)">
      
        <div v-if="markItem.show">
      
         <div v-if="filterMark(markItem)" class="on-row" :id="`${markItem.id}`">
         
           <div :class="`${markItem.color}-back`" class="left-field" @click="foldMark(markItem.id)"></div>
         
           <div class="on-col">
         
             <div @click="foldMark(markItem.id)" @dblclick="hideOthersMarksAndFiles(markItem.id)">
               <span :class="`${markItem.color}-text`">
                 {{ markItem.descr }}
               </span>
             </div>
           
             <div @keyup.ctrl.a="selectAllFilesInGroupMark(markItem.id)" :class="`${viewMode}`" tabindex="0" class="focus">
              <div v-for="fileItem in files" v-if="markItem.isFolded[viewMode]">
                <div v-if="!fileItem.isPinned && (fileItem.markID == markItem.id)">
                  <div @click="clickToFile(fileItem.id)" @mouseenter.shift="readMetadata(fileItem)" @dblclick="openFile(fileItem)">
                    <FileComponent 
                      :file="fileItem" 
                      :state="state"
                      :viewMode="viewMode" 
                      :pixHeight="inputSettings.imagesHeight"
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