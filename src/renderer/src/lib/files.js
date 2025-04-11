const settings = {
    fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
    fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,
}

export const filesMethods = {
    localState: null,
    stateFiles: null,
    files: null,
    folders: null,

    init:function(dat){
        this.folders = dat.folders
    },

    pinSelectedFiles:function(){
        this.folders[this.localState.activeFolderIndex].files.forEach(file => {
            for(let key in this.stateFiles.files){
                if( (file.id == key) && (this.stateFiles.files[key] == 'SELECTED') ){
                    file.isPinned = !file.isPinned
                    this.stateFiles.files[key] = ''
                }
            }
        })
    },

    countSelectedFiles:function(){
        this.stateFiles.numberOfSelectedFiles = 0
        for (const key in this.stateFiles.files) {
            if(this.stateFiles.files[key] == 'SELECTED') this.stateFiles.numberOfSelectedFiles++
        }
    },

    clickToFile: function(file_ID){
        //
        if(this.stateFiles.files[file_ID] == 'SELECTED') {
            this.stateFiles.files[file_ID] = ''
        } else {
          if( (this.stateFiles.files[file_ID] == '') || (this.stateFiles.files[file_ID] == undefined) ){
              this.stateFiles.files[file_ID] = 'SELECTED'
          }
        }
        //
        this.countSelectedFiles()
    },

    unselectAllFiles:function(){
        this.stateFiles.files = {}
        //
        this.countSelectedFiles()
    },

    selectAllFilesInGroupMark:function(mark_ID, viewMode){
        //
        let filteredFiles = viewMode == 'imgs' ? 
        this.folders[this.localState.activeFolderIndex].files.filter(file=>settings.fileImgMask.includes(file.format)) : 
        this.folders[this.localState.activeFolderIndex].files.filter(file=>!settings.fileImgMask.includes(file.format))
        //
        filteredFiles.forEach(file => {
          if(file.markID == mark_ID){
            if(!file.isPinned){
              if(file) this.stateFiles.files[file.id] = 'SELECTED'
            }
          }
        })
        //
        this.countSelectedFiles()
    },

    resetPinnedSelection(viewMode){
      //  Reset pinned files selection
      this.folders[this.localState.activeFolderIndex].files.forEach(file => {
        //
        if( file.isPinned ){
          //  imgs
          if( (viewMode == 'imgs') && (settings.fileImgMask.includes(file.format)) ){
            this.stateFiles.files[file.id] = ''
          }
          //  text
          if( (viewMode == 'text') && (!settings.fileImgMask.includes(file.format)) ){
            this.stateFiles.files[file.id] = ''
          }
        }
      })
      //
      this.countSelectedFiles()
    },

    readMetadata:function(dat){
      this.stateFiles.onFocusFile.metadata = dat.meta
      this.stateFiles.onFocusFile.name = dat.name
      this.stateFiles.onFocusFile.format = dat.format
    },

    openFile:function(file){
        console.log('OPEN FILE )')
        //
        window.api.openFileInExternalApp( file.path, `${file.name}.${file.format}` )
    },

    renameFile(file, newName){
        window.api.renameFile( file.path ,`${file.name}.${file.format}` , `${newName}.${file.format}` )
          .then((resolve)=>{
            if(resolve == undefined){
              //
              file.name = newName
              //
              this.stateFiles.files[file.id] = ''
            }
        })
    },

    renameFiles:function(dat){
        // console.log(dat)
        //
        if( dat.state == 'start rename' ){
            for(let key in this.stateFiles.files){
                if(this.stateFiles.files[key] == 'SELECTED'){
                    this.stateFiles.files[key] = 'RENAME'
                }
            }
        }
        //
        if( dat.state == 'input done' ){

          let newName = dat.newName.replace(settings.fileNameRegexp, '').trim()
          //
          if( newName.length > 0 ){
            //
            let ch = 0
            for (const fileID in this.stateFiles.files) {
              if( this.stateFiles.files[fileID] == 'RENAME' ){
              //   console.log(this.stateFiles.files[fileID])
                ch++
                this.folders[this.localState.activeFolderIndex].files.forEach((file, index) => {
                  if( file.id == fileID ){
                    //  For one file
                    if(ch == 1){
                      this.renameFile( this.folders[this.localState.activeFolderIndex].files[index], newName )
                    }
                    //  For many files
                    if(ch > 1){
                      this.renameFile( this.folders[this.localState.activeFolderIndex].files[index], `${newName} ${ch}` )
                    }
                  }
                })
              }
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

    deleteFile(file){
        window.api.deleteFile( `${file.path}/${file.name}.${file.format}` )
            .then(resolve=>{
                console.log('resolve')
                console.log(resolve)
                    if(resolve == undefined){
                      file.isDeleted = true
                      //
                      this.stateFiles.files[file.id] = ''
                      //
                      this.clearDB()
                    }
                },
                reject=>{
                  console.log('error: ' + reject)
                }
            )
    },

    deleteFiles:function(){
        // console.log('DELETE FILE')
        // try{
          for (const fileID in this.stateFiles.files) {
            // console.log('e')
            if( this.stateFiles.files[fileID] == 'SELECTED' ){
              // console.log(this.state.files[fileID])
              this.folders[this.localState.activeFolderIndex].files.forEach((file) => {
                if( file.id == fileID ){
                  this.deleteFile( file )
                }
              })
            }
          }
        // }catch{
        //   console.log('error')
        //   //
        // }finally{
        //   //
        //   this.clearDB()
        // }
    },

    pasteFiles:function(){
        console.log('PASTE FILES')
    },

    clearDB:function(){
        let arrSize = this.folders[this.localState.activeFolderIndex].files.length

        for(let ch = 0; ch < arrSize; ch++){
            if( !this.folders[this.localState.activeFolderIndex].files[ch].isDeleted ){
                this.folders[this.localState.activeFolderIndex].files.splice(ch, 1)
                ch--
                arrSize--
            }
        }
        
        console.log('clear')
        console.log(this.folders[this.localState.activeFolderIndex].files)
    },

    deleteMark:function(markID){
      if(markID != this.stateFiles.defaults.unmarkedMarkID){
          this.folders.forEach(folder => {
              folder.files.forEach(file => {
                  if(file.markID == markID){file.markID = this.stateFiles.defaults.unmarkedMarkID}
              })
          })
          // delete this.marks[markID]
      }
  },
}