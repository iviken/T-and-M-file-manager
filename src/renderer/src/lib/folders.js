// const settings = {
//     replacedSymbolPath: ' > ',
//     folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
//     win32separator: '\\',
//     actualSeparator: '/',
//     excludedFolders: ['Recovery', 'System Volume Information', 'PerfLogs', 'Config.Msi', '$SysReset', '$Recycle.Bin', 'OneDriveTemp'],
//     excludedFiles: ['desktop.ini'],
//     maxTabs: 10,    //  maxFoldersOnBar
//     forcedFolderUpdate: false,
//     lengthOfTheLastPartOfTheFolderName: 6,
// }

// const defaults = {
//     defaulMarkID: 'mark_unmarked',
// }

import { defaults, settings } from './settings.js'

const paths = {

  errors:function(mode, val){

    return mode == 'safe' ? val : false
    //
    // if( mode == 'root name' ){
    //   if( val == '/' ) return 'root'
    // }
  },
  
  getParentFolderPath:function(path, params){

    if( path == '/' ) return this.errors(params, '/')
    
    return path.slice( 0, path.lastIndexOf(this.getFolderName(path)) - 1 )
  },
  
  getFolderName:function(path, params){

    if( path == '/' ) return this.errors(params, '/')

    if(path.includes('/'))
      return path.split('/')[ path.split('/').length - 1 ]
    if(path.includes('\\'))
      return path.split('\\')[ path.split('\\').length - 1 ]
  },
  
  nextFirstChild:function(path, folderNamesList, params){

    if( folderNamesList.length == 0 ) return this.errors(params, path)
    return path += settings.actualSeparator + folderNamesList[0]
  },
  
  getAdjacent:function(cnst, path, folderNamesList, params){   //  cnst = 'up'/'down'   cnst, _path, this.foldersList, 'safe

    if( folderNamesList.length == 0 ) return this.errors(params, path)
    
    let _folderName = this.getFolderName(path)
    let _index = folderNamesList.indexOf( _folderName )

    if( _index == -1 ) return this.errors(params, path)

    if(cnst == 'up') _index--
    if(cnst == 'down') _index++

    if( _index >= folderNamesList.length ) _index = 0
    if( _index < 0 ) _index = folderNamesList.length - 1
    return `${this.getParentFolderPath(path)}${settings.actualSeparator}${folderNamesList[_index]}`
  },

  AisNestedInB:function(path1, path2){   //  doc/garb 'nested in' doc   Путь1 является ребенком пути2 (в т.ч. ближайшим)
    
    if( path2 == '/' )
      return true

    if( path2 == path1 )
      return false

    return path1.startsWith(path2)
  },
  
  isImmediateChild:function(path){    //  будущий путь является БЛИЖАЙШИМ ребенком актуального каталога?

    if( history.isFill() ){
      return this.getParentFolderPath(path) == history.actual(folders.folders).path
    }else{
      return false
    }
  },

  isCommonParent:function(path){

    if( history.isFill() ){
      return this.getParentFolderPath(path) == this.getParentFolderPath( history.actual(folders.folders).path )
    }else{
      return false
    }
  },

  isParent:function(path){

    if( history.isFill() ){
      return path == this.getParentFolderPath( history.actual(folders.folders).path )
    }else{
      return false
    }
  },

  validate:function(path){

    console.log('validate path: ' + path)

    path = path.replaceAll(settings.win32separator, settings.actualSeparator)

    if( path.startsWith('//') )
      return path.substring(1)

    if( path.startsWith('///') )
      return path.substring(2)

    return path.replaceAll(settings.win32separator, settings.actualSeparator)
    // return path
  },

  folderIsSystem(path, cnst){

    if( cnst == undefined)
      return this.getFolderName(path).startsWith('.')

    if( cnst == 'soft')
      return settings.excludedFolders.includes( this.getFolderName(path) )
  },

  pathIsSystem(path, params){   //  params = 'safe' mode serch nearest non-sys folder

    path = this.validate(path)

    if(params == undefined)
      return path.split(settings.actualSeparator).some(folderName => folderName.startsWith('.'))

    //  Search nearest non-sys parent folder
    // if(params = 'safe')
    //   return path.
  },
}

const helpers = {
  
  validateFolderAndFileName:function(name){
    
    if ( !name ) return false
    
    let _name = name.trim()
    _name = _name.replace(settings.folderNameRegexp, '')
    //
    if( settings.excludedFolders.includes(_name) ) return false
    //
    if( (_name.length == 0) && (_name.split(' ').length == _name.length) ) return false
    
    return _name
  },

  shrinkName:function(name, maxLength){

    if( maxLength == undefined ) return name
    if( maxLength < (settings.lengthOfTheLastPartOfTheFolderName + 3) ) return name

    if( maxLength >= name.length ) return name

    let lastWord = name.indexOf(' ') > 0 ? name.split(' ')[name.split(' ').length - 1] : name.slice(-1 * settings.lengthOfTheLastPartOfTheFolderName)
    let index = maxLength - lastWord.length - 2

    return `${name.slice(0, index)}...${lastWord}`
  },
}

export const folders = {

  folders: null,
  localState: null,
  parameters: null,

  deletingQueue: new Set(),
  copyCutQueue: [],
  isDeleteSrcFolder: null,

  init:function(dat){   //  {folders, localState}

    //  Reset all states before re-initialization
    this.deletingQueue = new Set()
    this.copyCutQueue= []
    this.isDeleteSrcFolder= null
    navigation.init()
    history.init()

    //  Get source
    this.folders = dat.folders
    this.localState = dat.localState
    this.parameters = dat.parameters

    //      -- AT LEAST ONE FOLDER MUST BE ADDED TO THE DB ! 

    //  Open at least one folder
    let activeFolder
    //  & .folder-name
    //    'safe' mode will open first folder if all folders are closed
    // if( this.parameters.showFoldersStartingWithDot || (this.parameters.showFoldersStartingWithDot == undefined) )
      activeFolder = db_foldersCollectionMethods.getOpenedFolder(this.folders, 'safe')
    //  ! .folder-name
    // if( !this.parameters.showFoldersStartingWithDot )
    //   activeFolder = db_foldersCollectionMethods.getOpenedFolder(this.folders, 'exclude dot')

    this.clickToFolder( activeFolder.folder )

    db_folderMethods.set_(this.folders[this.localState.activeFolderIndex], 'pin on bar')
    
    foldersCollectionMethods.refreshFolders( history.actual(this.folders).path, 'refresh' )
  },

  clickOnTheDirectoryInTheFolderTree:function(folderName, LEVEL){

    // console.log(folderName)
    // console.log(LEVEL)
    // console.log(history.actual(this.folders).path)

    if(LEVEL == 'child level')
      this.clickToFolder( {path: `${history.actual(this.folders).path}${settings.actualSeparator}${folderName}`} )

    if(LEVEL == 'this level')
      this.clickToFolder( {path: `${paths.getParentFolderPath( history.actual(this.folders).path )}${settings.actualSeparator}${folderName}`} )
  },

  clickToFolder:function(folder, cnst){

    let params

    if(cnst =='go to a created child') params = 'folder exists'

    this.localState.activeFolderIndex = navigation.switchTo(this.folders, folder.path, cnst, params)
  },

  clickToSpecialFolder:function(folderName){

    let specialFoldersPath = window.api.getPathSpecialFolder()

    specialFoldersPath = paths.validate(specialFoldersPath)
    // specialFoldersPath = specialFoldersPath.replaceAll(settings.win32separator, settings.actualSeparator).substring(2)
    
    this.clickToFolder( {path: `${specialFoldersPath}${settings.actualSeparator}${folderName}`} )
  },
  
  copyPastFolder:function(dat){        //  the folder isn't copied to the clipboard!
    // console.log('copyPast state:' + dat.state)
    
    if(dat.state == 'copy folder'){

      this.isDeleteSrcFolder = false
      this.copyCutQueue.push( history.actual(this.folders).path )
    }
    
    if(dat.state == 'cut folder'){

      this.isDeleteSrcFolder = true
      this.copyCutQueue.push( history.actual(this.folders).path )
    }
    
    if( dat.state == 'past folder' ){

      //  if now deletion of external folder does not occur
      if( this._isDeletionOfExternalFolder() ) return

      let pathTo = window.api.checkUniqueFolderName( history.actual(this.folders).path )
      // console.log('path to: ')
      // console.log(pathTo)
      
      window.api.copyFolder( this.copyCutQueue.pop(), pathTo )   //  folderSrcPath, folderDestPath
        .then(
          (pathFrom)=>{

            db_foldersCollectionMethods.rename( this.folders, pathFrom, paths.getFolderName(pathTo) )

            foldersCollectionMethods.refreshFolders( pathTo, 'copy folder' )
            
            // this.copyCutQueue.delete( pathFrom )

            if(this.isDeleteSrcFolder){
              
              this.copyPastFolder( {state: 'delete src folder', path: pathFrom} )
            }  
          }
        )
    }
    
    if( (dat.state == 'delete src folder') && this.isDeleteSrcFolder ){
      
      this.isDeleteSrcFolder = null
      
      this.deleteFolder( dat.path )
    }

    if( dat.state == 'get copy-folder name'){

      if( this.copyCutQueue.length > 0 ){
        //  For only one folder pull
        return  paths.getFolderName( this.copyCutQueue[0] )
      }
    }

  },

  deleteFolder:function(path){

    //
    if( paths.folderIsSystem(path, 'soft') ) return

    this.deletingQueue.add( path || history.actual(this.folders).path )

    window.api.deleteFolder( path || history.actual(this.folders).path )
      .then(
        (deletingPath)=>{

          deletingPath = paths.validate(deletingPath)
          
          if( history.actual(this.folders).path == deletingPath ){

            console.log('delete actual: ')
            console.log(deletingPath)

            this.clickToFolder( { path: paths.getParentFolderPath(deletingPath) }, 'go parent' )

            //  Delete folder from subFoldersList
            navigation.deleteFromList(deletingPath)
          }
          
          //  Check active folders path. if the active folder path is nested in the deleted one, go to nearest parent path 
          if( paths.AisNestedInB(history.actual(this.folders).path, deletingPath) ){

            console.log('nested: ')
            console.log(deletingPath)

            this.clickToFolder( {path: foldersCollectionMethods.getNearestParentFolder( this.folders, deletingPath ).folder.path}, 'forced' )
          }

          db_foldersCollectionMethods.delete( this.folders, deletingPath )

          this.deletingQueue.delete(deletingPath)
        }
      )
  },

  renameSelectedFolder:function(dat){

    //  if now deletion of external folder does not occur
    if( this._isDeletionOfExternalFolder() ) return false
    
    let newName = helpers.validateFolderAndFileName(dat.newName)

    if(!newName) return false

    let oldPath = history.actual(this.folders).path
    //  Проверяем на совпадение нового имени с уже имеющимися и меняем его
    newName = window.api.checkUniqueFolderName( `${paths.getParentFolderPath(oldPath)}${settings.actualSeparator}${newName}` )
    newName = paths.getFolderName( newName )

    let newPath = window.api.renameFolder( {fullpath: oldPath, newName: newName} )

    if(newPath){

      db_foldersCollectionMethods.rename( this.folders, oldPath, paths.getFolderName(newPath) )
      
      foldersCollectionMethods.refreshFolders( oldPath, 'rename folder', newName )

      // console.log( history.actual(this.folders) )

      return true
    }
  },

  createNewFolder:function(newFolderName){

    //  if now deletion of external folder does not occur
    if( this._isDeletionOfExternalFolder() ) return false
    
    let newName = helpers.validateFolderAndFileName(newFolderName)

    if(!newName) return false

    let newFolderPath = window.api.createFolder( history.actual(this.folders).path, newName )

    if(newFolderPath){

      //  go to the created folder (settings)
      this.clickToFolder( {path: newFolderPath}, 'go to a created child' )

      return true
    }
  },

  pinFolder:function(){

    let openedFolder = history.actual(this.folders)

    openedFolder.isPinned = !openedFolder.isPinned
  },

  newTab:function(){
    
    if( tabs.countTabs(this.folders) < settings.maxTabs )
      this.localState.activeFolderIndex = tabs.showNew(this.folders)
    console.log('new tab')
  },

  closeTab:function(){

    if( tabs.countTabs(this.folders) < 2 ) return

    this.localState.activeFolderIndex = tabs.close(this.folders)
  },

  openClosedTab:function(){

    this.localState.activeFolderIndex = tabs.openClosedTab(this.folders)
  },

  clickOnTab:function(path){

    this.localState.activeFolderIndex = tabs.clickOnTab(this.folders, path)
  },

  abortCopyCutOperation:function(){   //  Before starting process !

    this.isDeleteSrcFolder = null
    this.copyCutQueue = []
  },

  _isDeletionOfExternalFolder:function(){

    this.deletingQueue.forEach(deletingPath => {
  
      if( paths.AisNestedInB(history.actual(this.folders), deletingPath) ) return true
    })

    return false
  },

  treeNavigate:function(cnst){
    // console.log(cnst)
    
    switch (cnst){

      case 'parent folder':
        this.localState.activeFolderIndex = navigation.parent(this.folders)
      break

      case 'first child folder':
        this.localState.activeFolderIndex = navigation.nextFirst(this.folders)
      break

      case 'adjacent folder: down':
        this.localState.activeFolderIndex = navigation.adjacent(this.folders, 'down')
      break

      case 'adjacent folder: up':
        this.localState.activeFolderIndex = navigation.adjacent(this.folders, 'up')
      break
      
      case 'previous folder in history':
        this.localState.activeFolderIndex = navigation.previous(this.folders)
      break
    }
  },

  countTabs:function(){   //  numberOfFoldersDisplayedOnTheBar
    return tabs.countTabs(this.folders)
  },

  refreshDisplayedFolders:function(){

    // navigation._refreshDisplayedFolders(this.folders)
    foldersCollectionMethods.refreshFolders( history.actual(this.folders).path, 'refresh' )
  },

  getActiveFolderName:function(){

    return paths.getFolderName( history.actual(this.folders).path )
  },

  validateFolderAndFileName:function(name){

    return helpers.validateFolderAndFileName(name)
  },

  getFolderName:function(path){
    
    return paths.getFolderName( path, 'safe' )
  },

  getFoldersList:function(){

    return navigation.foldersList
  },

  getSubfoldersList:function(){

    return navigation.subfoldersList
  },

  refreshFiles:function(){

    filesCollectionMethods.refreshFilesInActualFolder()
  },

  // getFolderName:function(path){

  //   return paths.getFolderName(path)
  // },

  showFoldersStartingWithDot:function(){

    //
    this.parameters.showFoldersStartingWithDot = !this.parameters.showFoldersStartingWithDot
    //
    this.refreshDisplayedFolders()
  },

  shrinkName:function(name, maxLength){

    return helpers.shrinkName(name, maxLength)
  },

  // recordNewFileInActualFolder:function(file){

  //   filesCollectionMethods.recordNewFileInActualFolder( `${file.name}.${file.format}` )
  // },
}

const navigation = {

  foldersList: null,
  subfoldersList: null,

  init:function(){
    
    //  reset
    this.foldersList = null
    this.subfoldersList = null
  },
  
  switchTo:function(folders, path, cnst, params, mode){   //  return opened folder index
    
    let result = foldersCollectionMethods.checkFolderAndPushNewRecordOrResetNonExistent(folders, path, params)
    
    if(result){
      //  Refresh folders list
      foldersCollectionMethods.refreshFolders( path, cnst )
      //
      if( history.isFill() ){

        if(mode == undefined){

          db_folderMethods.set_(history.actual( folders ), 'unpin on bar')
          db_folderMethods.set_(result.folder, 'pin on bar')
        }
      }
      // 
      history.add(result.folder)
      //  Close all
      db_foldersCollectionMethods.closeAll(folders)
      //  Open
      db_folderMethods.set_(result.folder, 'open')
      //
      if( cnst != 'go to a created child' )
        filesCollectionMethods.refreshFilesInActualFolder()
  
      return result.index

    }else{
      //  Search nearest parent folders path
      let _nearestParentPath = foldersCollectionMethods.getNearestParentFolder(folders, path).folder.path
      //  Go to nearest parent folder
      this.switchTo( folders, _nearestParentPath, cnst, 'folder exists', mode )
    }
  },
  
  nextFirst:function(folders){
    
    let futurePath = paths.nextFirstChild( history.actual(folders).path, this.subfoldersList, 'safe' )

    return this.switchTo(folders, futurePath)
  },

  previous:function(folders){
    
    let previousPath = history.previous(folders).path

    console.log('prev: ')
    console.log(previousPath)

    if(previousPath) 
      return this.switchTo(folders, previousPath, 'forced')   //
  },

  parent:function(folders){

    let parentPath = paths.getParentFolderPath( history.actual(folders).path, 'safe' )
    
    return this.switchTo(folders, parentPath)
  },
  
  adjacent:function(folders, cnst){   //  cnst = 'up'/'down'
    
    let _path = history.actual(folders).path
    
    let adjacentUpPath = paths.getAdjacent(cnst, _path, this.foldersList, 'safe')

    return this.switchTo(folders, adjacentUpPath)
  },

  deleteFromList:function(path){

    path = paths.validate(path)

    console.log('delete from list: path: ')
    console.log(path)

    let folderName = paths.getFolderName( paths.getParentFolderPath(path) )
    let subFolderName = paths.getFolderName(path)

    if( this.foldersList.includes(folderName) && this.subfoldersList.includes(subFolderName) ){

      this.subfoldersList = this.subfoldersList.filter(name=> name != subFolderName )
      console.log(this.subfoldersList)
      return this.subfoldersList
    }

    if( this.foldersList.includes(folderName) && (this.subfoldersList.length == 0) ){

      this.foldersList = this.foldersList.filter(name=> name != folderName )
      console.log(this.foldersList)
      return this.foldersList
    }
  },

  replaceInTheList:function(oldName, newName){

    // console.log(oldName)
    // console.log(newName)

    let index = this.foldersList.indexOf( oldName )
    
    if(this.foldersList.length > 1)
      if(index >= 0)
        this.foldersList[index] = newName

    if(this.foldersList.length == 1)
      this.foldersList = [newName]
  },

  addInTheFoldersList:function(name){

    this.foldersList.push( name )
  },
}

const tabs = {

  close:function(folders){

    if(this.countTabs(folders) < 1) return navigation.switchTo(folders, folders[0].path)    //  safe mode
  
    let openedFolder = history.actual(folders)

    let displayedOnBarFolder = folders.findLast( folder => folder.displayedOnBar && !folder.isOpened )

    // console.log('last tabs path:')
    // console.log(openedFolder)
    // console.log(displayedOnBarFolder)
    let nextFolderIndex = navigation.switchTo(folders, displayedOnBarFolder.path, null, null, 'tab')

    db_folderMethods.set_( openedFolder, 'unpin on bar' )

    return nextFolderIndex
  },

  showNew:function(folders, folder){

    if(folder == undefined)
      folder = foldersCollectionMethods.getNearestParentFolder(folders, history.actual(folders).path).folder   //  PARENT PATH

    // console.log('add in pull: ')
    // console.log(this.id_pull)
    if(folder){
      db_folderMethods.set_( folder, 'pin on bar' )

      return navigation.switchTo(folders, folder.path, null, null, 'tab')
    }
  },

  clickOnTab:function(folders, path){

    return navigation.switchTo(folders, path, null, null, 'tab')
  },
  
  openClosedTab:function(folders){

    if( history.isFill() )
    
      return this.showNew( folders, history.previous(folders) )
  },
  
  countTabs:function(folders){

    let result = 0

    folders.forEach(folder => {
      if(folder.displayedOnBar) result++
    })

    return result
  },
}

const history = {

  id_pull: [],

  init:function(){

    //  reset
    this._clear()
  },

  previous:function(folders){

    let result = 0  //  'safe' mode

    let _flag = true

    do {

      this.id_pull.pop()
      
      folders.forEach( (folder, index) => {

        if( folder.id == this.id_pull[this.id_pull.length - 1] ){
          
          result = index
          
          _flag = false
        }
      })
      
    } while ( _flag && (this.id_pull.length > 1) )

    // console.log( this.id_pull )

    return folders[result]
  },

  actual:function(folders){   //  get last opened folder

    if( this.id_pull.length == 0 ) return

    let result = folders.find( folder => folder.id == this.id_pull[this.id_pull.length - 1] )

    if(result){
      return result
    }else{
      this.id_pull.pop()
      this.actual(folders)
    }
  },

  add:function(folder){

    if(this.id_pull.length == 0){
      //  If first
      this.id_pull.push(folder.id)
    }else{
      //
      if( folder.id != this.id_pull[this.id_pull.length - 1] ){
        this.id_pull.push(folder.id)
      }
    }
  },

  _clear:function(){
    this.id_pull = []
  },

  isFill:function(){

    return this.id_pull.length
  },
}

const db_foldersCollectionMethods = {
  
    clearNonExistFolders:function(folders){

      let arrSize = folders.length

      for(let ch = 0; ch < arrSize; ch++){
        if( !folders[ch].isExist ){
          folders.splice(ch, 1)
          ch--
          arrSize--
        }
      }
    },
    
    pushNew:function(folders, path){

        folders.push(
            {
                id: 'folder_' + Math.floor(Math.random()*10000000000000),
                path: paths.validate(path), 
                files: [],
                isOpened: false,
                isPinned: false,
                displayedOnBar: false,
            }
        )

        return {folder: folders[folders.length - 1], index: folders.length - 1}
    },
    
    searchPathAndGetFolderID:function(folders, path){

      let res = false

      folders.forEach((folder, index) => {

        res = db_folderMethods.is_( folder, 'are the paths the same', path )
        if( res ) 
          return {id: folder.id, index: index}
      })

      if( !res ) return {id: null, index: null}
    },

    searchFolderByPath:function(folders, path){

      let result = {folder: null, index: null}

      folders.forEach((folder, index) => {
        // console.log(folder.path + ':  ' + path)
        if( db_folderMethods.is_( folder, 'are the paths the same', {path: path} ) )
          result =  {folder: folder, index: index}
      })

      return result
    },

    rename:function(folders, oldPath, newName){
      //
      folders.forEach(folder => {
        //
        if(folder.path == oldPath){
          db_folderMethods.set_( folder, 'rename', {name: newName} )
        }
        //  If the found path is longer than current path
        if( folder.path.split( settings.actualSeparator ).length > oldPath.split( settings.actualSeparator ).length ){
          //  If parent directories are the same, change
          if( folder.path.startsWith( oldPath ) ){
            let newSubpath = `${oldPath.substring( 0, oldPath.lastIndexOf(settings.actualSeparator) )}${settings.actualSeparator}${newName}${folder.path.split( oldPath )[1]}`
            //
            db_folderMethods.set_( folder, 'rewrite path', {path: newSubpath} )
            // console.log('other folders: ')
            // console.log(folder)
          }
        }
      })
    },

    delete:function(folders, path){
      
      folders = folders.filter(i=>!i.path.startsWith(path))
      // folders.forEach(folder => {
      //   //  this
      //   if(folder.path == path){
      //     folder.isExist = false
      //   }
      //   //  sub
      //   if( folder.path.startsWith(path) ){
      //     folder.isExist = false
      //   }else{
      //     folder.isExist = true
      //   }
      // })
      // //
      // this.clearNonExistFolders(folders)
    },

    getOpenedFolder:function(folders, cnst){

      let result = {folder: null, index: null}

      if(cnst == 'safe')
        result = {folder: folders[0], index: 0}

      folders.forEach((folder, index) => {
        if(folder.isOpened)

          // if(!folders.parameters.showFoldersStartingWithDot)
          //   if( paths.folderIsSystem(folder.path) )

              result = {folder: folder, index: index}
      })

      // if() //  TO DO

      return result
    },
    
    closeAll:function(folders){
      
      folders.forEach(folder => {
        folder.isOpened = false
      })
    },
}

const foldersCollectionMethods = {

    folderIsExist:function(path){
      
      return window.api.folderIsExist(path)
    },

    checkFolderAndPushNewRecordOrResetNonExistent:function(folders, path, params){    //  returned {folder, index} or null
        //
        let folderIsExist = params == 'folder exists' ? true : this.folderIsExist(path)
        //
        let folderIsRecorded = db_foldersCollectionMethods.searchFolderByPath(folders, path)

        // console.log( 'path: ' )
        // console.log( path )
        // console.log( 'folderIsExist: ' )
        // console.log( folderIsExist )
        // console.log( 'folderIsRecorded: ' )
        // console.log( folderIsRecorded )

        if( folderIsRecorded.folder ){
          
          //  if exist, return a record from the db
          if( folderIsExist )
            return folderIsRecorded

          //  if non-existent, erase from db
          if( !folderIsExist ){
            
            db_foldersCollectionMethods.delete(folders, path)
            return null
          }
        }

        if( !folderIsRecorded.folder ){
          
          //  if exist but the database does not contain a record, create new entry
          if( folderIsExist )
            return db_foldersCollectionMethods.pushNew(folders, path)
  
          //  if non-existent and the database does not contain a record, return null
          if( !folderIsExist ){
            return null
          }
        }
    },

    refreshFolders:function(path, cnst, data){

      // console.log('refreshing path: ')
      // console.log(path)
      // console.log(cnst)

      function sublist(path, cnst){

        navigation.subfoldersList = window.api.getFolderNames(path, cnst) || []
        // console.log(navigation.subfoldersList)

        //  Filter folders to starting '.' (hide or system folders)
        if(!folders.parameters.showFoldersStartingWithDot)
          if( !paths.getFolderName(path).startsWith('.') )
            navigation.subfoldersList = navigation.subfoldersList.filter(folderName => !folderName.startsWith('.'))

        // console.log(navigation.subfoldersList)
      }
      
      function list(path, cnst){

        navigation.foldersList =  window.api.getFolderNames( paths.getParentFolderPath(path), cnst ) || []
        //  exclude hidden (system) folders
        navigation.foldersList = navigation.foldersList.filter( i=>!settings.excludedFolders.includes(i) ) || []
        // console.log(navigation.foldersList)
        
        //  Filter folders to starting '.' (hide or system folders)
        if(!folders.parameters.showFoldersStartingWithDot)
          if( !( paths.getFolderName( paths.getParentFolderPath(path) ).startsWith('.') ) )
            navigation.foldersList = navigation.foldersList.filter(folderName => ( !folderName.startsWith('.') || (folderName == paths.getFolderName(path)) ) )

        // console.log(navigation.foldersList)
      }

      if( cnst == undefined ){
        //
        if( !paths.isImmediateChild(path) )
          cnst = 'forced'
        //
        if( paths.isCommonParent(path) )
          cnst = 'common parent'
        //
        if( paths.isParent(path) )
          cnst = 'go parent'
      }

      //
      if( (cnst == 'forced') || (navigation.foldersList == null) || (navigation.subfoldersList == null) || (cnst == 'refresh') || settings.forcedFolderUpdate ){

        console.log(cnst)
        
        sublist(path)
        list(path)
        return
      }

      //  Для уменьшения нагрузки на диск
      //
      if( (cnst != 'forced') && (cnst == undefined) ){

        // console.log('starting clone done')
        if( Array.isArray(navigation.subfoldersList) ){
          
          if( navigation.subfoldersList.length > 0 ){

            //  Копируем список под-каталогов в список каталогов
            navigation.foldersList = []
            navigation.foldersList = structuredClone( navigation.subfoldersList )

            // console.log('clone done')
            
            sublist(path, 'dont check for existence')
          }else{
            //  Если общий родитель у активного и будущего каталогов, не проверяем существование будущего каталога
            // console.log('dont')
            // if( paths.isCommonParent(path) ){
            //   console.log('dont check')
              
              // list(path, 'dont check for existence')
            // }else{
            //   console.log('check')

              list(path)
            // }
          }
        }
      }
      
      //
      if( cnst == 'common parent'){

        sublist(path, 'dont check for existence')
      }
      
      //
      if( cnst == 'go parent'){

        navigation.subfoldersList = []
        navigation.subfoldersList = structuredClone( navigation.foldersList )

        list(path, 'dont check for existence')
      }
      
      //
      if( cnst == 'go to a created child'){

        navigation.foldersList = structuredClone( navigation.subfoldersList )
        navigation.foldersList.push( paths.getFolderName(path) )
        navigation.subfoldersList = []
      }

      //
      if( cnst == 'rename folder' ){

        // list(path, 'dont check for existence')
        navigation.replaceInTheList( paths.getFolderName(path), data )
      }

      //
      if( cnst == 'copy folder'){

        navigation.addInTheFoldersList( paths.getFolderName(path) )
      }
    },

    getNearestParentFolder:function(folders, path){    //  returned {folder, index} or null
      let result = null
      let _path = path
      do {
        
        _path = paths.getParentFolderPath(_path)

        result = this.checkFolderAndPushNewRecordOrResetNonExistent(folders, _path)

      } while ( (result == null) && (_path != settings.actualSeparator) )

      return result
    },
}

const db_folderMethods = {
    
    set_:function(folder, cnst, params){
      switch(cnst){
        case 'open':
          folder.isOpened = true
        break
        case 'close':
          folder.isOpened = false
        break
        case 'pin / unpin':
          folder.isPinned = !folder.isPinned
        break
        case 'pin on bar':
          folder.displayedOnBar = true
        break
        case 'unpin on bar':
          folder.displayedOnBar = false
        break
        case 'rename':
          let _newName = helpers.validateFolderAndFileName(params.name)
          if( _newName  ){
            let newPath = `${paths.getParentFolderPath(folder.path)}${settings.actualSeparator}${_newName}`
            //
            folder.path = newPath
            //
            folder.files.forEach(file => {
              file.path = newPath
            })
          }
        break
        case 'rewrite path':
          if(params.path){
            //
            folder.path = params.path
            //
            folder.files.forEach(file => {
              file.path = params.path
            })
          }
        break

      }
    },
    
    get_:function(folder, cnst, params){
      switch(cnst){

        case 'path':
          return folder.path

        case 'parent path':
          return paths.getParentFolderPath( folder.path )

        case 'is opened':
          return folder.isOpened

      }
    },
    
    is_:function(childFolder, cnst, params){    //  doc/garb 'nested in' doc
      switch(cnst){
        
        // case 'nested in':
        //   if( == '/') return
        //   return ParentFolder.path.startsWith(childFolder.path)
          // if( folder.path.startsWith(params.path) || params.path.startsWith(folder.path) ){
          //   return params.path.includes(folder.path)
          // }

        case 'are the paths the same':
          return childFolder.path == params.path

      }
    },
}

const filesCollectionMethods = {

    refreshFilesInActualFolder:function(){

      let readDirResult = window.api.getFileFullnames( history.actual(folders.folders).path )

      readDirResult = readDirResult.filter( filename => !settings.excludedFiles.includes(filename) )

      // console.log('readDirResult')
      // console.log(readDirResult)

      //  Оставляет в базе совпадающие с обновленным списком readDirResult файлы

      history.actual(folders.folders).files = history.actual(folders.folders).files.filter(file => readDirResult.includes(`${file.name}.${file.format}`))

      //  Update metadata

      history.actual(folders.folders).files.forEach(file => {
        file.meta = window.api.getFileMeta( history.actual(folders.folders).path, `${file.name}.${file.format}` )
      })

      //  record new files ib db

      readDirResult.forEach(fullname => {
        this.recordNewFileInActualFolder(fullname)
      })
    },

    recordNewFileInActualFolder:function(fullname){
      // console.log('fullname')
      // console.log(fullname)

      if( history.actual(folders.folders).files.find(file => `${file.name}.${file.format}` == fullname) ) return false

      history.actual(folders.folders).files.push(
        {
          id: 'fileID_' + Math.floor(Math.random()*100000000000000),
          name: fullname.slice( 0, fullname.lastIndexOf('.') ),       //      To Do
          format: fullname.slice( fullname.lastIndexOf('.') + 1 ), 
          markID: defaults.unmarkedMarkID, 
          // markID: defaults.defaulMarkID, 
          isPinned: false, 
          path: paths.validate( history.actual(folders.folders).path ), 
          meta: window.api.getFileMeta( history.actual(folders.folders).path, fullname ), 
        }
      )

      return true
    },
}