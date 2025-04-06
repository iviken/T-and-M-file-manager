<script>
export default {
  props:{
    inputSettings:{
        type: Object,
        required: true
    },
    dataSettings:{
        type: Object,
        required: true
    },
    folders:{
        type: Object,
        required: true
    },
    localState:{
        type: Object,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    projectID:{
        type: String,
        required: true
    },
  },
  methods: {
    refreshBD:function(){
      //  Check fails path in db
      this.folders.forEach(folder => {
        if( !window.api.folderIsExist(folder.path) ){
          folder.isExist = false
        }else{
          folder.isExist = true
        }
      })
      //
      let arrSize = this.folders.length
      for(let ch = 0; ch < arrSize; ch++){
        if( !this.folders[ch].isExist ){
          this.folders.splice(ch, 1)
          ch--
          arrSize--
        }
      }
    },
    refreshFolders(){
      //
      this.folderList =  window.api.getFolderNames( this.folders[this.localState.activeFolderIndex].path.substring(0, this.folders[this.localState.activeFolderIndex].path.lastIndexOf('/') ) )
      //  exclude hidden (system) folders
      this.folderList = this.folderList.filter(i=>!this.settings.excludedFolders.includes(i))
      //
      this.subfolderList =  window.api.getFolderNames( this.folders[ this.localState.activeFolderIndex ].path )
      //
      // this.refreshBD()
    },
    deleteFolder:function(){
      console.log('DELETE FOLDER')
      //
      const oldPath = this.folders[ this.localState.activeFolderIndex ].path
      const upPath = oldPath.slice( 0, oldPath.lastIndexOf(this.getFolderName(oldPath)) - 1 )
      const prevFoldersIndex = this.localState.previousFolderIndex
      const deletedFoldersIndex = this.localState.activeFolderIndex
      //
      window.api.deleteFolder( oldPath ).then(
        (resolve)=>{
          //
          if(resolve == undefined){
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
                console.log('up-path: ' + upPath)
                this.clickToFolder( {path: upPath, folderID: ''} )
              }
            }
            //  Delete folder in db
            this.folders.splice( deletedFoldersIndex, 1 )
            //  Delete includes folders in db (count)
            this.deleteAllSubfoldersInDB( oldPath )
            // this.folders.forEach(folder => {
            //   if( folder.path.startsWith(oldPath) ){
            //     folder.isExist = false
            //   }else{
            //     folder.isExist = true
            //   }
            // })
            // //    Deleting
            // let arrSize = this.folders.length
            // for(let ch = 0; ch < arrSize; ch++){
            //   if( !this.folders[ch].isExist ){
            //     this.folders.splice(ch, 1)
            //     ch--
            //     arrSize--
            //   }
            // }
            //
            console.log('refresh after deleting')
            this.refreshFolders()
          }
        }
      )
    },
    // deleteFolder:function(){
    //   console.log('DELETE FOLDER')
    //   //
    //   let res = false
    //   const oldPath = this.folders[ this.localState.activeFolderIndex ].path
    //   const upPath = oldPath.slice( 0, oldPath.lastIndexOf(this.getFolderName(oldPath)) - 1 )
    //   const prevFoldersIndex = this.localState.previousFolderIndex
    //   const deletedFoldersIndex = this.localState.activeFolderIndex
    //   //
    //   res = window.api.deleteFolder( oldPath )
    //   //
    //   if(res == undefined){
    //     //
    //     if( this.inputSettings[this.localState.actualSessionType].openPreviousFolderAfterClosingActiveOne ){
    //       //
    //       if( !prevFoldersIndex || (prevFoldersIndex == this.localState.activeFolderIndex) ){
    //         //
    //         this.clickToFolder( {path: upPath, folderID: ''} )
    //       }else{
    //         //
    //         this.localState.activeFolderIndex = this.localState.previousFolderIndex
    //         //
    //         this.clickToFolder( {path: this.folders[ this.localState.activeFolderIndex ].path, folderID: this.folders[ this.localState.activeFolderIndex ].id} )
    //       }
    //     }else{
    //       //
    //       // console.log('up-path: ' + this.getFolderName(oldPath))
    //       // console.log('up-path: ' + (oldPath.lastIndexOf(this.getFolderName(oldPath)) - 1) )
    //       console.log('up-path: ' + upPath)
    //       this.clickToFolder( {path: upPath, folderID: ''} )
    //     }
    //     //  Delete folder in db
    //     this.folders.splice( deletedFoldersIndex, 1 )
    //     //
    //     console.log('refresh after deleting')
    //     this.refreshFolders()
    //   }
    // },
    renameSelectedFolder:function(dat){
      //
      if(dat.state == 'input-start'){
        this.remanedFolderName = this.getFolderName( this.folders[ this.localState.activeFolderIndex ].path )
      }
      //
      if(dat.state == 'abort'){
        this.remanedFolderName = null
      }
      //
      if(dat.state == 'input-done'){
        //  Check input new folder name on spaces
        if( (this.renamedValue.trim().length > 0) && (this.renamedValue.split(' ').length != this.renamedValue.length) ){
          //
          this.renamedValue = this.renamedValue.trim()
          // console.log('RENAME FOLDER')
          //  Проверяем на совпадение нового имени с уже имеющимися
          if( dat.folderList.every(folderName => folderName != this.renamedValue) ){
            //
            // let res = false
            const oldPath = this.folders[ this.localState.activeFolderIndex ].path
            const newPath = `${this.getParentFolderPath(oldPath)}/${this.renamedValue}`
            const ID = this.folders[ this.localState.activeFolderIndex ].id
            //
            // console.log('precess renaiming...')
            // res = new Promise( (resolve, reject)=>{
            let result = window.api.renameFolder( {fullpath: this.folders[ this.localState.activeFolderIndex ].path, newName: this.renamedValue} )
                // resolve(result)
            //   }
            // )
            // res.then((value)=>{
            // console.log('done')
            //  If successfull
            if( result ) {
              //  For hide input element
              this.remanedFolderName = null
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
                    newSubpath = oldPath.substring(0, oldPath.lastIndexOf('/')) + '/' + this.renamedValue + folder.path.split( oldPath )[1]
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
              this.refreshFolders()
            }
            // })
            //
            this.renamedValue = ''
          }
        }
      }
    },
    markActiveFolder:function(name){
      return name == this.path.split('/')[ this.path.split('/').length - 1 ]
    },
    markOpenedFolder:function(dat){},
    createNewFolder:function(dat){
      console.log('CREATE FOLDER')
      //
      if(dat.state == 'input-start'){
        //
        this.isCreatredNewFolder = true
      }
      if(dat.state == 'input-done'){
        //
        if( (this.newFolderName.trim().length > 0) && (this.newFolderName.split(' ').length != this.newFolderName.length) ){
          //
          this.newFolderName = this.newFolderName.trim()
          //
          if( !this.subfolderList.includes(this.newFolderName) ){
            //
            let res = false
            //
            res = window.api.createFolder( this.folders[ this.localState.activeFolderIndex ].path, this.newFolderName )
            //
            if(res == undefined){
              this.isCreatredNewFolder = false
              //
              this.clickToFolder( {path: `${this.folders[ this.localState.activeFolderIndex ].path}/${this.newFolderName}`} )
              //
              this.refreshFolders()
            }
          }
        }
      }
    },
    getFolderName:function(pathIn){
      if(pathIn.includes('/'))
        return pathIn.split('/')[ pathIn.split('/').length - 1 ]
      if(pathIn.includes('\\'))
        return pathIn.split('\\')[ pathIn.split('\\').length - 1 ]
    },
    clickToFolder:function(dat){        //   {folderID, path}
      console.log('click to path in tree: ' + dat.path)
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
            isOpened: this.defaults.newFolder.isOpened,
            isPinned: this.defaults.newFolder.isPinned,
            displayedOnBar: this.defaults.newFolder.displayedOnBar,
            files: [],
          } )
          // console.log(this.folders)
          //
          // this.localState.previousFolderIndex = this.localState.activeFolderIndex
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
        this.refreshFolders()
      }
    },
    pinFolder:function(){
      //
      if( this.inputSettings[ this.localState.actualSessionType ].showPinFolders ){
        //
        this.folders.forEach(folder => {
          if(folder.id == this.selectedFolderID){
            folder.isPinned = !folder.isPinned
          }
        })
      }
    },
    foldPin:function(){
      this.dataSettings.pinFoldersIsFolded = !this.dataSettings.pinFoldersIsFolded
    },
    foldSessionFolders:function(){
      this.dataSettings.foldersIsFolded = !this.dataSettings.foldersIsFolded
    },
    clickToAddressBarPart:function(dat){
      // console.log('click to address: ' + dat.path)
      //
      this.clickToFolder(dat)
    },
    sessionFolderDisplayFilter:function(folder){
      // console.log(folder)
      return folder.files.length > 0 ? !folder.files.every( file => file.markID == this.defaults.defaulMarkID ) : false
      
      // return folder.files.length > 0 ? 
      //   folder.files.every( file => ((file.markID != this.defaults.defaulMarkID) || file.isPinned) ) : 
      //   false
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
        // let result = null
        let folderDestPath = this.folders[ this.localState.activeFolderIndex ].path
        // const cutFolderPath = this.folders[ this.localState.activeFolderIndex ].path
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
            if(resolve == undefined){   //  if successful
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
            }
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
    pressEsc(){
      //
      this.copyCutFolderID = null
      this.isDeleteSrcFolder = false
      this.copyCutFolderName = null
      //
      this.renameSelectedFolder( {state: 'abort'} )
    },
    deleteAllSubfoldersInDB( InPath ){
      //  Delete includes folders in db (count)
      this.folders.forEach(folder => {
        if( folder.path.startsWith(InPath) ){
          folder.isExist = false
        }else{
          folder.isExist = true
        }
      })
      //    Deleting
      let arrSize = this.folders.length
      for(let ch = 0; ch < arrSize; ch++){
        if( !this.folders[ch].isExist ){
          this.folders.splice(ch, 1)
          ch--
          arrSize--
        }
      }
    },
    treeNavigate(dat){
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
    getParentFolderPath(dat){
      //
      return dat.slice( 0, dat.lastIndexOf(this.getFolderName(dat)) - 1 )
    },
    clickToSpecialFolder(folderName){
      let path = window.api.getPathSpecialFolder(folderName)
      path = path.replaceAll(this.settings.win32separator, '/').substring(2)
      // console.log(`${path}/${folderName}`)
      this.clickToFolder( {path: `${path}/${folderName}`} )
    },
  },
  beforeMount(){
    this.selectedFolderID = this.folders[ this.localState.activeFolderIndex ].id
    //
    this.folderNavigationHistory.push( this.folders[ this.localState.activeFolderIndex ].path )
    //
    this.refreshBD()
    //
    this.refreshFolders()
  },
  beforeUpdate(){
    //
    if( this.localState.activeFolderIndex != this.localState.previousFolderIndex ) this.refreshFolders()
    // if(this.lastFolderIndex != this.localState.activeFolderIndex){
    //   this.refreshFolders()
    //   //
    //   this.lastFolderIndex = this.localState.activeFolderIndex
    // }
  },
  data(){
    return{
      settings:{
        replacedSymbolPath: ' > ',
        folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
        win32separator: '\\',
        excludedFolders: [
          'Recovery', 'System Volume Information', 'PerfLogs', 'Config.Msi', '$SysReset', '$Recycle.Bin', 'OneDriveTemp'
        ],
      },
      defaults:{
        newFolder:{
          id: null,
          path: null,
          isOpened: true,
          isPinned: false,
          displayedOnBar: false,
          files: [],
        },
        defaulMarkID: 'mark_unmarked',
      },
      selectedFolderID: null,
      folderList: null,
      subfolderList: null,
      remanedFolderName: null,
      renamedValue: '',
      isCreatredNewFolder: false,
      newFolderName: '',
      copyCutFolderID: null,
      copyCutFolderName: null,
      isDeleteSrcFolder: false,
      folderNavigationHistory: [],
      folderNavigationStateFlag: false,
      // lastFolderIndex: null,
    }
  },
  computed:{
    getPathForAddressBar(){
      if( this.path.indexOf('/') >= 0 ) return this.path.split('/')
      if( this.path.indexOf('\\') >= 0 ) return this.path.split('\\')
    },
  }
}
</script>

<template>
    <div 
      class="component focus h100 on-col" 
      tabindex="0" 
      @keyup.f2="renameSelectedFolder( {state: 'input-start'} )" 
      @keyup.esc="pressEsc()" 
      @keyup.ctrl.d="pinFolder()"
      @keyup.f5="refreshFolders()"
      @keyup.shift.ctrl.n="createNewFolder( {state: 'input-start'} )"
      @keyup.ctrl.n="createNewFolder( {state: 'input-start'} )"
      @keyup.ctrl.c="copyPastFolder( {state: 'copy folder'} )"
      @keyup.ctrl.v="copyPastFolder( {state: 'past folder'} )"
      @keyup.ctrl.x="copyPastFolder( {state: 'cut folder'} )"
      @keyup.up="treeNavigate('adjacent folder: up')"
      @keyup.down="treeNavigate('adjacent folder: down')"
      @keyup.right="treeNavigate('first child folder')"
      @keyup.left="treeNavigate('parent folder')"
      @keyup.backspace="treeNavigate('previous folder in history')"
    >

        <div v-if="inputSettings[ localState.actualSessionType ].showSessionFolders" class="folders block on-row">
          <div @click="foldSessionFolders()" class="left-field">
            <div :class="{foldersActive: dataSettings.foldersIsFolded}">Folders</div>
          </div>
          <div v-if="dataSettings.foldersIsFolded" class="on-col">
            <div v-for="folder in folders" class="item">
              <div v-if="sessionFolderDisplayFilter(folder)" @click="clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}">
                <span>{{ getFolderName( folder.path ) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showPinFolders" class="pin-block block on-row focus" tabindex="0" >
          <div @click="foldPin()" class="pin-logo left-field">
            <div :class="{pinActive: dataSettings.pinFoldersIsFolded}">Pin</div>
          </div>
          <div v-if="!dataSettings.pinFoldersIsFolded" class="on-col">
            <div v-for="folder in folders" class="item">
              <div v-if="folder.isPinned">
                <div @click="clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}">
                  <span>{{ getFolderName( folder.path ) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="address-bar on-row">
          <div v-for="(part, index) of getPathForAddressBar" class="on-row">
            <div @click="clickToAddressBarPart( {path: path.split('/').slice(0, index + 1).join('/')} )" class="address-part">
              {{ part }}
            </div>
            <div>
              {{ settings.replacedSymbolPath }}
            </div>
          </div>
        </div>

        <div class="tree on-col focus scrollY" tabindex="0">

          <div class="on-col block">
            <div v-for="item in folderList">
              <div v-if="remanedFolderName != item" @dblclick="renameSelectedFolder( {state: 'input-start'} )" @click="clickToFolder( {name: item, path: `${path.substring(0, path.lastIndexOf('/'))}/${item}`} )" :class="{active: markActiveFolder(item), opened: markOpenedFolder(item), 'item-copy-cut': item == copyCutFolderName}" class="on-row item w100">
                <div>
                  <span class="text-nowrap">{{ item }}</span>
                </div>
                <div class="w100"></div>
                <div @click="createNewFolder( {state: 'input-start'} )"  class="add">New</div>
                <div @click="pinFolder()" class="pin">Pin</div>
                <div @click="deleteFolder()" class="delete">x</div>
              </div>
              <div v-else>
                <input type="text" :v-model="renamedValue" @input="event => renamedValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`${item}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done', folderList: folderList})"></input>
              </div>
            </div>
          </div>
          
          <div class="on-col block">
            <div v-for="item in subfolderList">
              <div class="on-row item w100">
                <div>|-</div>
                <div v-if="remanedFolderName != item" @click="clickToFolder( {name: item, path: `${path}/${item}`} )">
                  <span>{{ item }}</span>
                </div>
                <div v-else>
                  <input type="text" :v-model="renamedValue" @input="event => renamedValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`sub_${item}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done', folderList: subfolderList})"></input>
                </div>
              </div>
            </div>
          </div>
          
          <div class="new-folder w100">
            <input type="text" v-if="isCreatredNewFolder" :v-model="newFolderName" @input="event => newFolderName = event.target.value.replace(settings.folderNameRegexp, '')" id="newFolderInput" class="rename" @keyup.esc="isCreatredNewFolder = false" @keyup.enter="createNewFolder({state: 'input-done', folderList: subfolderList})"></input>
          </div>

        </div>

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showSpecialFoldersBtns" class="special-folders on-col block">
          <div class="on-row item">
            <div></div>
            <div @click="clickToSpecialFolder( 'Documents' )">my docs</div>
          </div>
          <div class="on-row item">
            <div></div>
            <div @click="clickToSpecialFolder( 'Downloads' )">downloads</div>
          </div>
        </div>

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showCloudsStorageBtns" class="clouds on-col">
          <div class="on-row item">
            <div></div>
            <div>one drive</div>
          </div>
          <div class="on-row item">
            <div></div>
            <div>google drive</div>
          </div>
        </div>
      
    </div>
</template>

<style scoped lang="scss">
  // @use '../scss/tree.scss' as *;
  .pinActive, .foldersActive{
    color:aquamarine;   //
  }
  .left-field{
    width: 50px;
    opacity: .4;
  }
  .item{
    color: var(--text);
  }
  .item:hover{
    color: var(--pure-white);
  }
  .item-copy-cut{
    background-color: bisque;
  }
  .delete, .pin, .add{
    visibility: hidden;
  }
  
  .address-bar{
    color: var(--text);
  }
  .address-part:hover{
    color: var(--pure-white);
  }
  
  .tree{
    height: 50vh;
  }
  
  .block{
    margin-top: 20px;
  }
  
  .active{
    background-color: aquamarine;
  }
  .active:hover>.delete, .active:hover>.pin, .active:hover>.add{
    visibility: visible;
  }
  .opened{
    color: antiquewhite;
  }
  
  .component{
    padding-top: var(--top-indent);
  }

  .rename{
    background-color: antiquewhite;
  }

  .focus:focus{
    outline: none;
  }
</style>