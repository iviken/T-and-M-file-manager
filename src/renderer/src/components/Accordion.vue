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
    countSelectedFiles(){
      this.state.numberOfSelectedFiles = 0
      for (const key in this.state.files) {
          if(this.state.files[key] == 'SELECTED') this.state.numberOfSelectedFiles++
      }
    },
    clickToFile: function(file_ID){
      //
      if(this.state.files[file_ID] == 'SELECTED') {
          this.state.files[file_ID] = ''
      } else {
        if( (this.state.files[file_ID] == '') || (this.state.files[file_ID] == undefined) ){
            this.state.files[file_ID] = 'SELECTED'
        }
      }
      //
      this.countSelectedFiles()
    },
    hideOthersMarksAndFiles: function(mark_ID){
      //
      this.marks[mark_ID].isFolded[this.viewMode] = true
      //
      this.singleDisplayMarkMode.isEnabled = !this.singleDisplayMarkMode.isEnabled
      this.singleDisplayMarkMode.mark_id = mark_ID
    },
    unselectAllFiles:function(){
      this.state.files = {}
      //
      this.countSelectedFiles()
    },
    deleteFiles:function(){
      // console.log('DELETE FILE')
      try{
        for (const fileID in this.state.files) {
          // console.log('e')
          if( this.state.files[fileID] == 'SELECTED' ){
            // console.log(this.state.files[fileID])
            this.files.forEach((file, index) => {
              if( file.id == fileID ){
                this.deleteFile( file )
                // console.log(this.files[index])
                // window.api.deleteFile( `${this.files[index].path}/${this.files[index].name}.${this.files[index].format}` )
                  // .then(
                  //   (resolve)=>{
                  //     if(resolve == undefined){
                  //       //
                  //       this.files.splice( index, 1 )
                  //       //
                  //       this.state.files[fileID] = ''
                  //     }
                  //   }
                  // )
              }
            })
          }
        }
      } catch{
        //
      } finally{
        //
        let arrSize = this.files.length
        for(let ch = 0; ch < arrSize; ch++){
          if( !this.files[ch].isDeleted ){
            this.files.splice(ch, 1)
            ch--
            arrSize--
          }
        }
      }
    },
    // refreshFiles:function(){
    //   // console.log('REFRESH FILES in: ' + this.state.pathsOfOpenedFolders)
    //   //
    //   // console.log( window.api.getFilenames(this.state.pathsOfOpenedFolders[0]) )
    // },
    renameFiles:function(dat){
      // console.log(dat)
      if( dat.state = 'start rename' ){
        for(let key in this.state.files){
          this.state.files[key] = 'RENAME'
        }
      }
      //
      if( dat.newName ){
        let ch = 0
        for (const fileID in this.state.files) {
          if( this.state.files[fileID] == 'RENAME' ){
            console.log(this.state.files[fileID])
            ch++
            this.files.forEach((file, index) => {
              if( file.id == fileID ){
                //  For one file
                if(ch == 1){
                  this.renameFile( this.files[index], `${dat.newName}` )
                }
                //  For many files
                if(ch > 1){
                  this.renameFile( this.files[index], `${dat.newName} ${ch}` )
                }
              }
            })
          }
        }
      }
    },
    copyFiles:function(){
      console.log('COPY FILES')
    },
    cutFiles:function(){
      console.log('CUT FILES')
    },
    pasteFiles:function(){
      console.log('PASTE FILES')
    },
    pinThisFiles:function(){
      this.files.forEach(file => {
        for(let key in this.state.files){
          if( (file.id == key) && (this.state.files[key] == 'SELECTED') ){
            file.isPinned = !file.isPinned
            this.state.files[key] = ''
          }
        }
      })
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
      //
      window.api.openFileInExternalApp( file.path, `${file.name}.${file.format}` )
    },
    selectAllFilesInGroupMark:function(mark_ID){
      //
      let filteredFiles = this.viewMode == 'imgs' ? 
        this.files.filter(file=>this.fileImgMask.includes(file.format)) : 
        this.files.filter(file=>!this.fileImgMask.includes(file.format))
      //
      filteredFiles.forEach(file => {
        if(file.markID == mark_ID){
          if(!file.isPinned){
            if(file) this.state.files[file.id] = 'SELECTED'
          }
        }
      })
      //
      this.countSelectedFiles()
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
              this.state.files[file.id] = ''
            }
            //  text
            if( (this.viewMode == 'text') && (!this.fileImgMask.includes(file.format)) ){
              this.state.files[file.id] = ''
            }
          }
        })
        //
        this.countSelectedFiles()
      }
    },
    renameFile(file, newName){
      window.api.renameFile( file.path ,`${file.name}.${file.format}` , `${newName}.${file.format}` )
        .then((resolve)=>{
          if(resolve == undefined){
            //
            file.name = newName
            //
            this.state.files[file.id] = ''
          }
        })
    },
    deleteFile( file ){
      let res = window.api.deleteFile( `${file.path}/${file.name}.${file.format}` )
      if(res == undefined){
        file.isDeleted = true
        //
        this.state.files[fileID] = ''
      }
        // .then((resolve)=>{
        //   if(resolve == undefined){
        //     //
        //     // this.files.splice( index, 1 )
        //     file.isDeleted = true
        //     //
        //     this.state.files[fileID] = ''
        //   }
        // })
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
    @keyup.f2="renameFiles( {state: 'start rename'} )" 
    @keyup.delete="deleteFiles()"
    @keyup.ctrl.c="copyFiles()"
    @keyup.ctrl.v="pasteFiles()"
    @keyup.ctrl.x="cutFiles()"
    @keyup.ctrl.d="pinThisFiles()"
  >

    <div class="on-row">
      <div @click="foldPin()" class="left-field _left-field">
        <div v-if="isThereAtLeastOneAttachedFile" :class="{pinActive: inputSettings.pinFilesIsFolded[viewMode]}">Pin</div>
      </div>
      <div v-if="!inputSettings.pinFilesIsFolded[viewMode]">
        <div :class="`${viewMode}`">
          <div v-for="fileItem in files">
            <div v-if="fileItem.isPinned" @click="clickToFile(fileItem.id)" @mouseenter.ctrl="readMetadata(fileItem)" @dblclick="openFile(fileItem)">
              <FileComponent :file="fileItem" :viewMode="viewMode" :state="state" :pixHeight="inputSettings.imagesHeight" @renameFiles="renameFiles" />
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
                      @renameFiles="renameFiles"
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