const settings = {
    fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
    fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,
}

export const filesMethods = {
    localState: null,
    stateFiles: null,
    files: null,  //
    folders: null,

    destFolderID: null,
    srcFolderID: null,
    _allowCopyingOrMovingFiles: false,

    init:function(dat){

        //  reset
        this.destFolderID = null
        this.srcFolderID = null
        this._allowCopyingOrMovingFiles = false

        // console.log(this.localState)
        this.folders = dat.folders
        // console.log(this.folders)
    },

    validateFileName:function(name){
      
      if ( !name ) return false
      
      let _name = name.trim()
      _name = _name.replace(settings.fileNameRegexp, '')
      
      if( (_name.length == 0) && (_name.split(' ').length == _name.length) ) return false
      
      return _name
    },

    pinSelectedFiles:function(){

        this.folders[this.localState.activeFolderIndex].files.forEach(file => {
            for(let fileID in this.stateFiles.files){

                if( (file.id == fileID) && (this.stateFiles.files[fileID] == 'SELECTED') ){

                    file.isPinned = !file.isPinned
                    this.stateFiles.files[fileID] = ''
                }
            }
        })

        this.countSelectedFiles()
    },

    countSelectedFiles:function(params){

        this.stateFiles.numberOfSelectedFiles = 0

        for (const fileID in this.stateFiles.files) {

            if( this.stateFiles.files[fileID] == 'SELECTED' ){

                if( this.folders[this.localState.activeFolderIndex].files.find(file => file.id == fileID) || (params == 'all') )

                    this.stateFiles.numberOfSelectedFiles++
            }

            if(this.stateFiles.files[fileID] == '')
              delete this.stateFiles.files[fileID]
        }
    },

    clickToFile:function(file_ID){
        //
        if(this.stateFiles.files[file_ID] == 'SELECTED') {
            this.stateFiles.files[file_ID] = ''
        } else {
          if( (this.stateFiles.files[file_ID] == '') || (this.stateFiles.files[file_ID] == undefined) ){
              this.stateFiles.files[file_ID] = 'SELECTED'
          }
        }
        
        this.countSelectedFiles()
    },

    deselectAllFiles:function(){

        this.stateFiles.files = {}
        
        this.stateFiles.numberOfSelectedFiles = 0
        // this.countSelectedFiles()
    },

    resetStateAllFiles:function(){

      this.deselectAllFiles()
    },

    resetStateFiles:function(){

        this.setFilesState( 'SELECTED', '' )

        this.setFilesState( 'COPY FILE', '' )

        this.setFilesState( 'MOVE FILE', '' )
        
        this.countSelectedFiles()

        this.abortCopyCutOperation()
    },

    abortCopyCutOperation:function(){

      this.destFolderID = null
      this.srcFolderID = null
      this._allowCopyingOrMovingFiles = false
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
        
        window.api.openFileInExternalApp( file.path, `${file.name}.${file.format}` )
    },

    renameFile:function(file, newName){

        window.api.renameFile( file.path ,`${file.name}.${file.format}` , `${newName}.${file.format}` )
          .then(
            result=>{

              if(result){

                file.name = newName
                
                this.stateFiles.files[file.id] = ''
              }else{

              }
            }
          )
    },

    renameFiles:function(dat){
        // console.log(dat)
        //
        if( dat.state == 'start rename' ){
            for(let fileID in this.stateFiles.files){
                if( this.stateFiles.files[fileID] == 'SELECTED' )
                    if( this.folders[this.localState.activeFolderIndex].files.find(file => file.id == fileID) )
                        this.stateFiles.files[fileID] = 'RENAME'
            }
        }
        //
        if( dat.state == 'input done' ){

          let newName = this.validateFileName(dat.newName)
          
          if( !newName ) return
            
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
    },

    setFilesState:function(STATEfrom, STATEto){

      this.folders[this.localState.activeFolderIndex].files.forEach(file => {
          
        if( this.stateFiles.files.hasOwnProperty(file.id) )
          if (this.stateFiles.files[file.id] == STATEfrom )
            this.stateFiles.files[file.id] = STATEto
      })
    },

    copyFiles:function(){

      this.srcFolderID = this.folders[this.localState.activeFolderIndex].id

      this._allowCopyingOrMovingFiles = true

      this.setFilesState( 'SELECTED', 'COPY FILE' )

      console.log('COPY FILE')
    },

    cutFiles:function(){
      
      this.srcFolderID = this.folders[this.localState.activeFolderIndex].id

      this._allowCopyingOrMovingFiles = true
      
      this.setFilesState( 'SELECTED', 'MOVE FILE' )
      
      //
      
      console.log('MOVE FILE')
    },
    
    pasteFiles:function(){
      //  Для предотсвращения повторного нажатия Ctrl+V
      if( !this._allowCopyingOrMovingFiles ) return
      this._allowCopyingOrMovingFiles = false

      this.destFolderID = this.folders[this.localState.activeFolderIndex].id

      let destFolderPath = this.folders[this.localState.activeFolderIndex].path

      if(this.destFolderID == this.srcFolderID){} //

      for (const fileID in this.stateFiles.files) {
        //   console.log(this.stateFiles.files[fileID])
        
        this.folders.forEach(folder => {
          
          if(folder.id == this.srcFolderID){
            folder.files.forEach(file => {
              
              if( file.id == fileID ){
                
                if( this.stateFiles.files[fileID] == 'COPY FILE' )
                  this._copyFile(folder.path, destFolderPath ,`${file.name}.${file.format}`, fileID)
                
                if( this.stateFiles.files[fileID] == 'MOVE FILE' )
                  this._moveFile(folder.path, destFolderPath ,`${file.name}.${file.format}`, fileID)
                }
              })
            }
          })
        
      }

      // this.destFolderID = null

      console.log('PASTE FILES')
    },

    _copyFile:function(pathSrc, pathDest, fileFullname, fileID){

      window.api.copyFile( pathSrc, pathDest, fileFullname )
        .then(
          result=>{
            console.log('copied file: ')
            console.log(result)

            if(result){
                
                this.stateFiles.files[fileID] = ''

                //  Coping writed file in db
                
                // let writedFile = null
                
                // this.folders.forEach(folder => {
                  
                //   if( folder.path == result.pathSrc ){

                //     writedFile = folder.files.find( file => `${file.name}.${file.format}` == result.fileFullname )
                //   }
                // })

                // this.folders.forEach(folder => {
                  
                //   if( folder.path == result.pathDest ){

                //     if(writedFile){

                //       folder.files.push( JSON.parse(JSON.stringify(writedFile)) )

                //       this.stateFiles.files[writedFile.id] = ''
                //     }
                //   }
                // })

            }
          }
        )
    },

    _moveFile:function(pathSrc, pathDest, fileFullname){

      window.api.moveFileTo( pathSrc, pathDest, fileFullname )
        .then(
          result=>{
            console.log('movied file: ')
            console.log(result_pathDest)

            if(result_fileFullname){

              //  Moving writed file in db

              let writedFile = null
              
              this.folders.forEach(folder => {
                
                if( folder.path == pathSrc )
                  writedFile = folder.files.find( file => `${file.name}.${file.format}` == result_fileFullname )  //
              })
              //
              this.folders.forEach(folder => {
                
                if( folder.path == pathDest ){
                  
                  if(writedFile){
                    
                    writedFile.path = pathDest
                    
                    folder.files.push( JSON.parse( JSON.stringify(writedFile) ) )
    
                    this.stateFiles.files[writedFile.id] = ''
                  }
                }
              })
            }
          }
        )
    },

    deleteFile:function(file){

        window.api.deleteFile( file.path, `${file.name}.${file.format}` )
            .then(
                fileFullname=>{
                    console.log('deleted file: ' + fileFullname)

                    if(fileFullname){
                        
                        this.stateFiles.files[file.id] = ''
                        
                        this.eraseFileFromDB(fileFullname)
                    }
                }
            )
    },

    deleteFiles:function(){

          for (const fileID in this.stateFiles.files) {

            if( this.stateFiles.files[fileID] == 'SELECTED' ){
              // console.log(this.state.files[fileID])
              this.folders[this.localState.activeFolderIndex].files.forEach((file) => {

                if( file.id == fileID )

                  this.deleteFile( file )
              })
            }
          }
    },

    eraseFileFromDB:function(fileFullname){

      let index = this.folders[this.localState.activeFolderIndex].files.findIndex( file => fileFullname == `${file.name}.${file.format}` )

      if(index >= 0)
        this.folders[this.localState.activeFolderIndex].files.splice( index, 1 )
    },

    writeFileToDB:function(fileFullname){},

    deleteMark:function(markID){

      if(markID != this.stateFiles.defaults.unmarkedMarkID){
          this.folders.forEach(folder => {
              folder.files.forEach(file => {
                  if(file.markID == markID){file.markID = this.stateFiles.defaults.unmarkedMarkID}
              })
          })
      }
    },

    getFolderBy:function(cnst, param){
      
      if( this.folders.length == 0 )
        return false

      if( cnst == 'id' )
        return this.folders.find(folder => folder.id == param)

      if( cnst == 'path' )
        return this.folders.find(folder => folder.path == param)
    },

    getFileBy:function(cnst, param){

      if( folder.files.length == 0 )
        return false

      function _funk(element, index, array){

        if( cnst == 'fullname' )
          return element.files.find( file => `${file.name}.${file.format}` == param )

        if( cnst == 'path' )
          return element.files.find( file => file.path == param )

        if( cnst == 'id' )
          return element.files.find( file => file.id == param )
      }

      return this.folders.find(_funk)      
    },
}