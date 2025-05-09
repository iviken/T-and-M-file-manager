// const settings = {
//     fileImgMask: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'bmp', 'BMP', 'svg', 'SVG', 'ico', 'ICO', 'tiff', 'TIFF', 'webp', 'eps', 'EPS'],
//     fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,
// }

import { defaults, settings } from './settings.js'

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
        //  source
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

        this.setFilesState( 'RENAME', '' )

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
      //  Для предотвращения повторного нажатия Ctrl+V
      if( !this._allowCopyingOrMovingFiles ) return
      this._allowCopyingOrMovingFiles = false

      let destFolder = this.folders[this.localState.activeFolderIndex]

      // if(this.destFolderID == this.srcFolderID){} //

      for (const fileID in this.stateFiles.files) {
        //   console.log(this.stateFiles.files[fileID])
        
        this.folders.forEach(srcFolder => {
          
          if(srcFolder.id == this.srcFolderID){
            srcFolder.files.forEach(file => {
              
              if( file.id == fileID ){

                //  Updating metadata before copying
                file.meta = window.api.getFileMeta( srcFolder.path, `${file.name}.${file.format}` )

                //  COPY
                
                if( this.stateFiles.files[fileID] == 'COPY FILE' ){
                  //
                  // this._copyFile(srcFolder.path, destFolder.path, {name: file.name, format: file.format}, fileID)
                  window.api.copyFile( srcFolder.path, destFolder.path, {name: file.name, format: file.format} )
                    .then(
                      result_fileName=>{
                        // console.log('copied file: ')
                        // console.log(result_fileName)
                        if(result_fileName){
                            
                          //  copy dat and refresh file id

                          destFolder.files.push(
                            {
                              id: 'fileID_' + Math.floor(Math.random()*100000000000000),
                              name: result_fileName.name,
                              format: result_fileName.format, 
                              markID: defaults.unmarkedMarkID,  // reset
                              isPinned: false,                  // reset
                              path: srcFolder.path, 
                              meta: JSON.parse( JSON.stringify(file.meta) ), 
                            }
                          )

                          this.stateFiles.files[fileID] = ''
                        }
                      }
                    )
                }

                //  MOVE
                
                if( this.stateFiles.files[fileID] == 'MOVE FILE' )
                  this._moveFile(srcFolder.path, destFolder.path, {name: file.name, format: file.format}, fileID)
                  // this._moveFile(folder.path, destFolderPath, `${file.name}.${file.format}`, fileID)
                }
              })
            }
          })
        
      }
    },

    // _copyFile:function(pathSrc, pathDest, fileFullname, fileID){

    //   window.api.copyFile( pathSrc, pathDest, fileFullname )
    //     .then(
    //       result=>{
    //         console.log('copied file: ')
    //         console.log(result)

    //         if(result){
                
    //           //

    //           this.stateFiles.files[fileID] = ''

    //           // writeFileToDB

    //           //  Coping writed file in db

    //           //  To DO: add unique file id
              
    //           // let writedFile = null
              
    //           // this.folders.forEach(folder => {
                
    //           //   if( folder.path == result.pathSrc ){

    //           //     writedFile = folder.files.find( file => `${file.name}.${file.format}` == result.fileFullname )
    //           //   }
    //           // })

    //           // this.folders.forEach(folder => {
                
    //           //   if( folder.path == result.pathDest ){

    //           //     if(writedFile){

    //           //       folder.files.push( JSON.parse(JSON.stringify(writedFile)) )

    //           //       this.stateFiles.files[writedFile.id] = ''
    //           //     }
    //           //   }
    //           // })

    //         }
    //       }
    //     )
    // },

    _moveFile:function(pathSrc, pathDest, fileFullname){

      window.api.moveFileTo( pathSrc, pathDest, fileFullname )
        .then(
          result_fileFullname => {
            console.log('movied file: ')
            console.log(result_pathDest)

            if(result_fileFullname){

              //  Moving writed file in db

              let writedFile = null
              
              this.folders.forEach(srcFolder => {
                
                if( srcFolder.path == pathSrc )
                  writedFile = srcFolder.files.find( file => `${file.name}.${file.format}` == result_fileFullname )  //
              })
              //
              this.folders.forEach(destFolder => {
                
                if( destFolder.path == pathDest ){
                  
                  if(writedFile){
                    
                    writedFile.path = pathDest
                    
                    destFolder.files.push( JSON.parse( JSON.stringify(writedFile) ) )
    
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

    checkIsAtLeastOneSelectedFilePinned:function(){

        let filesPinned = 0

        for (const fileID in this.stateFiles.files) {

            if( this.stateFiles.files[fileID] == 'SELECTED' ){

                if( this.folders[this.localState.activeFolderIndex].files.find(file => (file.id == fileID)&&file.isPinned) )
                    filesPinned++
            }
        }

        return filesPinned
    },

    selectFilesBy:function(dat, folderIndex){

      // console.log(dat)

      function _funk(folders, stateFiles, params){   //  params: {partName, value, state}

        folders[folderIndex].files.forEach(file => {
        
            if( file[params.partName].toLowerCase().startsWith(params.value) )
              if( (stateFiles.files[file.id] != 'RENAME') || (stateFiles.files[file.id] != 'COPY FILE') || (stateFiles.files[file.id] != 'MOVE FILE') )
                stateFiles.files[file.id] = params.state
        })
      }

      dat.value = dat.value.trim().toLowerCase()

      if(dat.value.length == 0) return false
      if(dat.value.startsWith('/')) return false

      if(folderIndex == undefined) folderIndex = this.localState.activeFolderIndex

      //  reset
      if(dat.value.length > 1)
        if(dat.params == 'name')
          _funk( this.folders, this.stateFiles, {partName: 'name', value: dat.value.slice(0, -1), state: ''} )
        if(dat.params == 'format')
          _funk( this.folders, this.stateFiles, {partName: 'format', value: dat.value.slice(0, -1), state: ''} )
        
      //  search
      if(dat.params == 'name')
        _funk( this.folders, this.stateFiles, {partName: 'name', value: dat.value, state: 'SELECTED'} )
      if(dat.params == 'format')
        _funk( this.folders, this.stateFiles, {partName: 'format', value: dat.value, state: 'SELECTED'} )
    },

    isAPicture:function(format){

      if(typeof format == 'string')
        return settings.fileImgMask.includes(format)

      if(typeof format == 'object')
        return settings.fileImgMask.includes(format.format)
    },
}