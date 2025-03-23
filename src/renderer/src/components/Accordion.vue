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
    viewMode:{    //text or imgs
        type: String,
        required: true
    }
  },
  methods: {
    foldMark: function(mark_ID){
      this.marks[mark_ID].isFolded[this.viewMode] = !this.marks[mark_ID].isFolded[this.viewMode]
    },
    clickToFile: function(file_ID){
      this.state.setCmd( {cmd: 'clickToFile', fileID: file_ID} )
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
    },
    enter:function(){
      console.log('ENTER')
    },
    deleteFile:function(){
      console.log('DELETE FILE')
    },
    refreshFiles:function(){
      console.log('REFRESH FILE')
    },
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
    // pinThisFolder:function(){
    //   console.log('PIN FOLDER')
    // },
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

      //    Sorted by files type: images or others amd extract marks
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
      this.state.metadata = dat.meta
      this.state.onFocusFile.name = dat.name
      this.state.onFocusFile.format = dat.format
    },
    openFile:function(file){
      console.log('OPEN FILE')
    }
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
    }
  }
}
</script>

<template>

  <div 
    class="h100 focus" 
    tabindex="0" 
    @keyup.esc="unselectAllFiles()" 
    @keyup.enter="enter()" 
    @keyup.f2="renameFile()" 
    @keyup.f5="refreshFiles()"
    @keyup.delete="deleteFile()"
    @keyup.ctrl.c="copyFilesToBuffer()"
    @keyup.ctrl.v="pasteFilesFromBuffer()"
    @keyup.ctrl.x="cutFilesToBuffer()"
    @keyup.ctrl.d="pinThisFolder()"
  >

    <div class="on-row">
      <div class="left-field"></div>
      <div :class="`${viewMode}`">
       <div v-for="fileItem in files">
         <div v-if="fileItem.isPinned" @click="clickToFile(fileItem.id)" @mouseenter.ctrl="readMetadata(fileItem)" @dblclick="openFile(fileItem)">
           <FileComponent :file="fileItem" :viewMode="viewMode" :state="state" :pixHeight="200" />
           <!-- <FileComponent :file="fileItem" :viewMode="viewMode" :folderPath="'data.thisFolder.path'" :state="state" :pixHeight="200" /> -->
         </div>
       </div>
      </div>
    </div>
    
     <!-- <div v-for="markItem in marks"> -->
     <div v-for="markItem in showOneMarkMode(marks)">
    
       <div v-if="markItem.show">

        <div v-if="filterMark(markItem)" class="on-row" :id="`${markItem.id}`">
        <!-- <div v-if="displayedMarks[viewMode].includes(markItem.id)" class="on-row" :id="`${markItem.id}`"> -->
        
          <div :class="`${markItem.color}-back`" class="left-field" @click="foldMark(markItem.id)"></div>
        
          <div class="on-col">
        
            <div @click="foldMark(markItem.id)" @dblclick="hideOthersMarksAndFiles(markItem.id)">
              <span :class="`${markItem.color}-text`">
                {{ markItem.descr }}
              </span>
            </div>
          
            <div :class="`${viewMode}`">
             <div v-for="fileItem in files" v-if="markItem.isFolded[viewMode]">
               <div v-if="!fileItem.isPinned && (fileItem.markID == markItem.id)">
                 <div @click="clickToFile(fileItem.id)" @mouseenter.ctrl="readMetadata(fileItem)" @dblclick="openFile(fileItem)">
                   <FileComponent 
                     :file="fileItem" 
                     :state="state"
                     :viewMode="viewMode" 
                     :pixHeight="200"
                     />
                 </div>
               </div>
             </div>
            </div>
        
          </div>
        
        </div>

       </div>
    
     </div>

  </div>

</template>

<style scoped lang="scss">
  // @use '../scss/textFiles.scss' as *;
  .focus:focus{
    outline: none;
  }
  .left-field:hover{
    opacity: .6;
  }
  .left-field{
    width: 50px;
    opacity: .4;
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
  }
</style>