const settings = {
    replacedSymbolPath: ' > ',
    folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
    win32separator: '\\',
    excludedFolders: [
      'Recovery', 'System Volume Information', 'PerfLogs', 'Config.Msi', '$SysReset', '$Recycle.Bin', 'OneDriveTemp'
    ],
  }

const defaults = {
    // newFolder:{
    //   id: null,
    //   path: null,
    //   isOpened: true,
    //   isPinned: false,
    //   displayedOnBar: false,
    //   files: [],
    // },
    defaulMarkID: 'mark_unmarked',
  }

export const foldersMethods = {

    folders: null,
    localState: null,
    inputSettings: null,
    projectID: null,
    selectedFolderID: null,
    folderNavigationHistory: [],
    folderNavigationStateFlag: false,
    folderList: null,
    subfolderList: null,
    isDeleteSrcFolder: false,
    copyCutFolderID: null,
    copyCutFolderName: null,

    newFolderPushDB:function(path){
        let _id = 'folder_' + Math.floor(Math.random()*10000000)
        let _index = this.folders.length
        //
        this.folders.push(
            {
                id: _id,
                path: path,
                files: [],
                isOpened: false,
                // isOpened: true,
                isPinned: false,
                displayedOnBar: true,
            }
        )
        return {id: _id, index: _index}
    },

    refreshFolders(){
        //
        this.folderList =  window.api.getFolderNames( this.getParentFolderPath( this.folders[ this.localState.activeFolderIndex ].path ) )
        // this.folderList =  window.api.getFolderNames( this.folders[this.localState.activeFolderIndex].path.substring(0, this.folders[this.localState.activeFolderIndex].path.lastIndexOf('/') ) )
        //  exclude hidden (system) folders
        this.folderList = this.folderList.filter(i=>!settings.excludedFolders.includes(i))
        //
        this.subfolderList =  window.api.getFolderNames( this.folders[ this.localState.activeFolderIndex ].path )
        //
    },

    switchToFolder:function(dat){       //  {index}
        // console.log('switch to folder: ')
        // console.log(dat)
        // console.log(this.folders[dat.index].displayedOnBar)
        //  Change folder indexes
        //
        if(dat.state != 'open closed tab'){
            if( dat.index != this.localState.activeFolderIndex ){
                this.localState.previousFolderIndex = this.localState.activeFolderIndex
             }
        }
        //
        this.localState.activeFolderIndex = dat.index
        //
        this.folders.forEach(element=>{element.isOpened = false})
        this.folders[dat.index].isOpened = true
        this.folders[dat.index].displayedOnBar = true
        //  For 'ALL' tab
        // this.localState.showFilesFromAllFoldersOption = false
    },

    openClosedTab(){
        //
        if(this.folders.length > this.localState.previousFolderIndex){
            console.log('open closed')
            this.switchToFolder( {index: this.localState.previousFolderIndex, state: 'open closed tab'} )
        }
    },

    closeFolderTab:function(dat){
        if(this.folders.length > 1){
            //
            let numberOfOpenFoldersDisplayedOnTheBar = 0
            //  If the indexes math, count index of the fiture open folder after closing opened
            this.folders.forEach( (folder, indexOfTheFutureOpenFolderAfterClosingCurrentFolder) => {
                //
                if( folder.displayedOnBar ) numberOfOpenFoldersDisplayedOnTheBar++
                //
                if( indexOfTheFutureOpenFolderAfterClosingCurrentFolder != dat.index ){
                    //
                    if( folder.displayedOnBar ){
                        //
                        if(numberOfOpenFoldersDisplayedOnTheBar > 1){
                            //
                            if( this.localState.previousFolderIndex == this.localState.activeFolderIndex ){
                                //
                                this.localState.previousFolderIndex = indexOfTheFutureOpenFolderAfterClosingCurrentFolder
                            }
                        }
                    }
                }
            })
            //  Closing folder tab
            if( numberOfOpenFoldersDisplayedOnTheBar > 1 ){
                //  Set focus on first displayed on the bar folder
                this.folders[this.localState.activeFolderIndex].isOpened = false
                //
                this.folders[this.localState.activeFolderIndex].displayedOnBar = false
                // }
                if( this.folders[this.localState.previousFolderIndex].displayedOnBar ){
                    //
                    this.localState.activeFolderIndex = this.localState.previousFolderIndex
                    //
                    this.folders[ this.localState.activeFolderIndex ].isOpened = true

                }
            }
        }
    },

    newBrowserTab:function(){
        if( this.folders[this.localState.activeFolderIndex].path.split('/').length > 2 ){
            //
            let path = this.folders[this.localState.activeFolderIndex].path.substring(0, this.folders[this.localState.activeFolderIndex].path.lastIndexOf('/') )
            //
            // console.log('to path: ' + path)
            if( this.folders.find(folder=>folder.path == path) == undefined ){
                //
                let result = this.newFolderPushDB(path)
                //
                this.switchToFolder({id: result.id, index: result.index})
            }else{
                //
                this.folders.forEach((folder, index) => {
                    if( folder.path == path ){
                        this.switchToFolder( {id: folder.id, index: index} )
                    }
                })
            }
        }
    },

    pinFolder:function(){
        //
        this.folders.forEach(folder => {
            if(folder.id == this.selectedFolderID){
                folder.isPinned = !folder.isPinned
            }
        })
    },

    validateFolderAndFileName:function(name){
        if( (name.trim().length > 0) && (name.split(' ').length != name.length) ){
            return name.trim()
        }
    },

    renameSelectedFolder:function(dat){
        //  Check input new folder name on spaces
        if( this.validateFolderAndFileName(dat.newName) ){
            // console.log('RENAME FOLDER')
            //  Проверяем на совпадение нового имени с уже имеющимися
            if( this.folderList.every(folderName => folderName != dat.newName) ){
                //
                const oldPath = this.folders[ this.localState.activeFolderIndex ].path
                const newPath = `${this.getParentFolderPath(oldPath)}/${dat.newName}`
                const ID = this.folders[ this.localState.activeFolderIndex ].id
                //
                let result = window.api.renameFolder( {fullpath: this.folders[ this.localState.activeFolderIndex ].path, newName: dat.newName} )
                //  If successfull
                if( result ) {
                    //  For hide input element
                    // this.remanedFolderName = null
                    //  Rewrite in db current folder
                    this.folders.forEach(folder => {
                        if(folder.id == ID){
                        folder.path = newPath
                        folder.files.forEach(file => {
                            file.path = newPath
                        })
                        }
                    })
                    //  Rewrite in db others folders
                    this.folders.forEach(folder => {
                        //
                        let newSubpath = ''
                        //  If the found path is longer than current path
                        if( folder.path.split('/').length > oldPath.split('/').length ){
                            //  If parent directories are the same, change
                            if( folder.path.startsWith( oldPath ) ){
                                newSubpath = oldPath.substring(0, oldPath.lastIndexOf('/')) + '/' + dat.newName + folder.path.split( oldPath )[1]
                                //
                                folder.path = newSubpath
                                //
                                folder.files.forEach(file => {
                                    file.path = newSubpath
                                })
                                // console.log('other folders: ')
                                // console.log(folder)
                            }
                        }
                    })
                    //  Refresh folders
                    // this.refreshFolders()
                    return true
                }else{
                    return false
                }
            //   this.renamedValue = ''
            }
        }
    },

    getParentFolderPath:function(pathIn){
        //
        return pathIn.slice( 0, pathIn.lastIndexOf(this.getFolderName(pathIn)) - 1 )
    },

    getFolderName:function(pathIn){
        if(pathIn.includes('/'))
          return pathIn.split('/')[ pathIn.split('/').length - 1 ]
        if(pathIn.includes('\\'))
          return pathIn.split('\\')[ pathIn.split('\\').length - 1 ]
    },

    clearNonExistFoldersInDB:function(){    //  Индекс каталога сдаинется!
        //  Check fails path in db
        this.folders.forEach(folder => {
          if( !window.api.folderIsExist(folder.path) ){
            folder.isExist = false
          }else{
            folder.isExist = true
          }
        })
        //
        this._clearNonExistFolders()
    },
    
    _clearNonExistFolders:function(){
        //      Deleting
        let arrSize = this.folders.length
        for(let ch = 0; ch < arrSize; ch++){
          if( !this.folders[ch].isExist ){
            this.folders.splice(ch, 1)
            ch--
            arrSize--
          }
        }
    },

    deleteAllSubfoldersInDB:function( InPath ){
        //  Delete includes folders in db (count)
        this.folders.forEach(folder => {
          if( folder.path.startsWith(InPath) ){
            folder.isExist = false
          }else{
            folder.isExist = true
          }
        })
        //    
        this._clearNonExistFolders()
    },

    deleteFolder:function(){
        // console.log('DELETE FOLDER')
        //
        const oldPath = this.folders[ this.localState.activeFolderIndex ].path
        const upPath = oldPath.slice( 0, oldPath.lastIndexOf(this.getFolderName(oldPath)) - 1 )
        const prevFoldersIndex = this.localState.previousFolderIndex
        const deletedFoldersIndex = this.localState.activeFolderIndex
        //
        window.api.deleteFolder( oldPath ).then(
          (resolve)=>{
            //
            // if(resolve == undefined){
              //
              if( this.inputSettings[this.localState.actualSessionType].openPreviousFolderAfterClosingActiveOne ){
                //
                if( !prevFoldersIndex || (prevFoldersIndex == this.localState.activeFolderIndex) ){
                  //
                  this.clickToFolder( {path: upPath, folderID: ''} )
                }else{
                  //
                  this.localState.activeFolderIndex = this.localState.previousFolderIndex
                  //
                  this.clickToFolder( {path: this.folders[ this.localState.activeFolderIndex ].path, folderID: this.folders[ this.localState.activeFolderIndex ].id} )
                }
              }else{
                //
                if( this.localState.activeFolderIndex == oldPath ){
                //   console.log('up-path: ' + upPath)
                  this.clickToFolder( {path: upPath, folderID: ''} )
                }
              }
              //  Delete folder in db
              this.folders.splice( deletedFoldersIndex, 1 )
              //    Delete folder from folderList
              this.folderList.filter(e=>e != this.getFolderName(oldPath))       //  ?
              //  Delete includes folders in db (count)
              this.deleteAllSubfoldersInDB( oldPath )
              //
              console.log('refresh after deleting')
              this.refreshFolders()
            // }
          }
        )
    },

    clickToFolder:function(dat){        //   {folderID, path}
        // console.log('click to path in tree: ' + dat.path)
        //  For pins mechanics
        this.selectedFolderID = dat.folderID
        //  If selected folder (selected path) doesn't math current folder path (props)
        if( dat.path != this.path ){
          //
          let isThisFolderInCurrentSession = false
          let indexOfTheSelectedFolder = 0
          // 
          this.folders.forEach(folder => {
            //  Проверяем на наличии пути в сессии
            if( folder.path == dat.path ) {
              //  Этот путь зарегистрирован в сессии
              isThisFolderInCurrentSession = true
            }
            if( !isThisFolderInCurrentSession ){
              //  И его индекс
              indexOfTheSelectedFolder++
            }
          })
          //  Если выбранного пути нету в базе, создаем новую запись этого пути в сессии
          if( !isThisFolderInCurrentSession ){
            //
            this.folders.push( {
              id: `${this.projectID}__fold_${Math.floor(Math.random()*10000000)}`,
              path: dat.path,
              isOpened: true,
              isPinned: false,
              displayedOnBar: false,
              files: [],
            } )
            // console.log(this.folders)
            //
            this.localState.previousFolderIndex = this.localState.activeFolderIndex
            //  Переводим фокус на созданную папку для переключения вкладки в баре
            this.localState.activeFolderIndex = this.folders.length - 1
          }else{
            //  А если выбранный путь есть в базе
            this.localState.previousFolderIndex = this.localState.activeFolderIndex
            //
            this.localState.activeFolderIndex = indexOfTheSelectedFolder
            // console.log('indexOfTheSelectedFolder: ' + indexOfTheSelectedFolder)
          }
          //
          this.folders[ this.localState.previousFolderIndex ].displayedOnBar = false
          //  "Открываем" папку базы по актуальному индексу
          this.folders.forEach(element=>{element.isOpened = false})
          this.folders[ this.localState.activeFolderIndex ].isOpened = true
          this.folders[ this.localState.activeFolderIndex ].displayedOnBar = true
          //
          this.selectedFolderID = this.folders[ this.localState.activeFolderIndex ].id
          //  For navigation (previous folder)
          if( this.folderNavigationStateFlag ){
            if( this.localState.previousFolderIndex >= 0 ){
              if( this.folders[ this.localState.activeFolderIndex ].path != this.folders[ this.localState.previousFolderIndex ].path ){
                this.folderNavigationHistory.push( this.folders[ this.localState.activeFolderIndex ].path )
              }
            }else{
              this.folderNavigationHistory.push( this.folders[ this.localState.activeFolderIndex ].path )
            }
          }else{
            this.folderNavigationStateFlag = true
          }
          //
        //   this.refreshFolders()
        }
    },

    treeNavigate:function(dat){
        // console.log(dat)
        const currentPath = this.folders[ this.localState.activeFolderIndex ].path
        //
        switch (dat){
  
          case 'parent folder':
            this.clickToFolder( {path: this.getParentFolderPath( currentPath )} )
          break
  
          case 'first child folder':
            if(this.subfolderList.length > 0){
              this.clickToFolder( {path: `${currentPath}/${this.subfolderList[0]}`} )
            }
          break
  
          case 'adjacent folder: down':
            if( this.folderList.length > 0 ){
              let currentFolderName = this.getFolderName( currentPath )
              let nextIndex = this.folderList.indexOf(currentFolderName) + 1
              nextIndex = nextIndex < this.folderList.length ? nextIndex : 0
              let nextFolderName = this.folderList.at( nextIndex )
              this.clickToFolder( {path: `${this.getParentFolderPath( currentPath )}/${nextFolderName}`} )
            }
          break
  
          case 'adjacent folder: up':
            if( this.folderList.length > 0 ){
              let currentFolderName = this.getFolderName( currentPath )
              let nextIndex = this.folderList.indexOf(currentFolderName) - 1
              nextIndex = nextIndex >= 0 ? nextIndex : (this.folderList.length - 1)
              let nextFolderName = this.folderList.at( nextIndex )
              this.clickToFolder( {path: `${this.getParentFolderPath( currentPath )}/${nextFolderName}`} )
            }
          break
          
          case 'previous folder in history':
            // console.log('back')
            if( this.folderNavigationHistory.length > 0 ){
              //
              this.folderNavigationStateFlag = false
              this.clickToFolder( {path: this.folderNavigationHistory.pop()} )
            }
          break
        }
    },

    copyPastFolder:function(dat){        //  the folder isn't copied to the clipboard!
        // console.log('copyPast state:' + dat.state)
        //
        if(dat.state == 'copy folder'){
          this.isDeleteSrcFolder = false
          this.copyCutFolderID = this.folders[ this.localState.activeFolderIndex ].id
          //  For marking folders name
          this.copyCutFolderName = this.getFolderName( this.folders[ this.localState.activeFolderIndex ].path )
        }
        //
        if(dat.state == 'cut folder'){
          this.isDeleteSrcFolder = true
          this.copyCutFolderID = this.folders[ this.localState.activeFolderIndex ].id
          //  For marking folders name
          this.copyCutFolderName = this.getFolderName( this.folders[ this.localState.activeFolderIndex ].path )
        }
        //
        if( (dat.state == 'past folder') && this.copyCutFolderID ){
          //
          let folderSrcPath = null
          let folderDestPath = this.folders[ this.localState.activeFolderIndex ].path
          const folderDestParentPath = folderDestPath.slice( 0, folderDestPath.lastIndexOf(this.getFolderName(folderDestPath)) - 1 )
          this.folders.forEach(folder => {
            if(this.copyCutFolderID == folder.id)
              folderSrcPath = folder.path
          })
          //
          if( folderDestPath == folderSrcPath ){
            folderDestPath + '-copy'
            window.api.createFolder( folderDestParentPath, this.getFolderName(folderDestPath) )
          }
          //  Check paths to:  /fold_1   ! =>  /fold_1/fold_1_1
          if( !folderDestPath.includes(folderSrcPath)  ) {this.copyPastFolder( {state: 'starting copy', from: folderSrcPath, to: folderDestPath} )}
          //
          // this.refreshFolders()
        }
        //
        if( dat.state == 'starting copy' ){
          // console.log('src: ' + dat.from)
          // console.log('dest: ' + dat.to)
          window.api.copyFolder( dat.from, dat.to )   //  folderSrcPath, folderDestPath
            .then(
                (resolve)=>{
                // if(resolve == undefined){   //  if successful
                    // console.log('resolve')
                    //  Copy data db
                    let copiedFolderIndex = null
                    let srcFolderIndex = null
                    this.folders.forEach((folder, index) => {
                        //    Проверим появился ли этот (новый) путь в базе (the user opened this folder while copying)
                        if(folder.path == dat.to){
                            copiedFolderIndex = index
                        }
                        //    Refresh source folder index
                        if(folder.id == this.copyCutFolderID){
                            srcFolderIndex = index
                        }
                    })
                    // console.log('src: ' + srcFolderIndex + 'cp: ' + copiedFolderIndex)
                    //    If haven't find it
                    if(copiedFolderIndex == null) {
                        //
                        this.folders.push( JSON.parse( JSON.stringify(this.folders[srcFolderIndex]) ) )
                        copiedFolderIndex = this.folders.length
                        //
                        this.folders[copiedFolderIndex].id = `${this.projectID}__fold_${Math.floor(Math.random()*10000000)}`
                        this.folders[copiedFolderIndex].path = dat.to
                        this.folders[copiedFolderIndex].isOpened = false
                        this.folders[copiedFolderIndex].isPinned = false
                        this.folders[copiedFolderIndex].displayedOnBar = false
                    }else{
                        //    If find it
                        //      copying (files only)
                        this.folders[copiedFolderIndex].files = JSON.parse( JSON.stringify(this.folders[srcFolderIndex].files) )
                    }
                    //  Refresh files path
                    this.folders[copiedFolderIndex].files.forEach(file => {
                        file.path = dat.to
                    })
                    //  Refresh other folders path
                    this.folders.forEach(folder => {
                        if( folder.path.startsWith(dat.from) ){
                            folder.path = dat.to + folder.path.split(dat.from)[1]
                        }
                    })
                    console.log(this.folders[copiedFolderIndex])
                    //
                    if(this.isDeleteSrcFolder){
                        this.copyPastFolder( {state: 'delete src folder', path: dat.from} )
                    }else{
                        //
                        this.refreshFolders()
                    }
                    // console.log('reset')
                    this.copyCutFolderName = null
                // }
                }
            )
        }
        //
        if( (dat.state == 'delete src folder') && this.isDeleteSrcFolder ){
          //
          console.log('start delete src folder')
          //
          window.api.deleteFolder( dat.path )
          
          .then((resolve)=>{    //  and create new empty folder this his name
            if(resolve == undefined){
              return window.api.createFolder( dat.path )
            }
          })
          
          .then((resolve)=>{
            if(resolve == undefined){   //  If successful
              console.log('finaly')
              //  reset
              this.isDeleteSrcFolder = false
              //
              // this.folders.forEach((folder, index) => {
                // if( folder.id == this.copyCutFolderID ){
                  //  Открыть каталог-родитель, если пользователь находится на вырезаемом... (child folders)
                  if( this.folders[ this.localState.activeFolderIndex ].path.startsWith(dat.path) ){
                    //
                    this.clickToFolder( {path: dat.path.slice( 0, dat.path.lastIndexOf(this.getFolderName(dat.path)) - 1 )} )
                  }
                  //  Deleting
                  // this.folders.splice( index, 1 )
                  //
                  this.deleteAllSubfoldersInDB( dat.path )
                // }
              // })
              //  reset
              this.copyCutFolderID = null
              //  Delete from db
            }
          })
        }
    },

    clickToSpecialFolder:function(folderName){
        let specialFoldersPath = window.api.getPathSpecialFolder()
        specialFoldersPath = specialFoldersPath.replaceAll(settings.win32separator, '/').substring(2)
        // console.log(`${path}/${folderName}`)
        this.clickToFolder( {path: `${specialFoldersPath}/${folderName}`} )
    },

    createNewFolder:function(newFolderName){
        //
        if( this.validateFolderAndFileName(newFolderName) ){
            //
            newFolderName = newFolderName.trim()
            //
            if( !this.subfolderList.includes(newFolderName) ){
              //
              let res = false
              //
              res = window.api.createFolder( this.folders[ this.localState.activeFolderIndex ].path, newFolderName )
              //
              if(res == undefined){
                // this.isCreatredNewFolder = false
                //
                this.clickToFolder( {path: `${this.folders[ this.localState.activeFolderIndex ].path}/${newFolderName}`} )
                //
                this.refreshFolders()
                //
                return true
              }
            }
        }
    },

    abortCopyCutOperation:function(){
      this.copyCutFolderID = null
      this.isDeleteSrcFolder = false
      this.copyCutFolderName = null
    },
}