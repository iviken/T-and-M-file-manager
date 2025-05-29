import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// import trash from "trash"

import { settings, defaults } from '../renderer/src/lib/settings.js'
import { sessionProjectsDefaultData } from '../renderer/src/lib/sessionProjects.js'
import { sessionBrowserDefaultData } from '../renderer/src/lib/sessionBrowser.js'

const { platform } = require('node:process')

const { pathToFileURL } = require('node:url')

let child = require('child_process').execFile

const { shell } = require('electron')

let path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

let os = require("os")
let root = (os.platform() == "win32") ? process.cwd().split(path.sep)[0] : "/"

let userFolder = process.env.USERPROFILE.replaceAll(settings.win32separator, settings.actualSeparator)
let appsSettingsFolder = path.join( userFolder, 'AppData', 'Roaming' )

const sessionProjectsFilePath = () => path.resolve( path.join(appsSettingsFolder, settings.developer, settings.productName, settings.sessionProjectsFile) )
const sessionBrowserFilePath = () => path.resolve(  path.join(appsSettingsFolder, settings.developer, settings.productName, settings.sessionBrowserFile) )

const projectsData = {dataType: 'PROJECT' ,data: {}, state: 'not opened' }
const browserData =  {dataType: 'BROWSER' ,data: {}, state: 'not opened' }

let sessionProjectClone       = null
let sessionProjectClone_json  = null
let sessionBrowserClone       = null
let sessionBrowserClone_json  = null

function getActiveData(typeSession){

  //  check folder is exist (iviken)
  let parentPath = path.join( appsSettingsFolder, settings.developer )
  if( !api.folderIsExist( parentPath ) )
    fs.mkdirSync( path.resolve(parentPath) )

  //  check folder is exist (product name)
  let libPath = path.join( appsSettingsFolder, settings.developer, settings.productName )
  if( !api.folderIsExist(libPath) )
    fs.mkdirSync( path.resolve(libPath) )

  //  Read project session file
  if(typeSession == 'PROJECT'){
    if(projectsData.state == 'not opened'){

      //  check file is exist and create new JSON project file
      if( !fs.existsSync( sessionProjectsFilePath() ) )
        fs.writeFileSync( sessionProjectsFilePath(), JSON.stringify(sessionProjectsDefaultData, null, '\t'), {encoding: 'utf8'} )

      projectsData.data = JSON.parse( fs.readFileSync( sessionProjectsFilePath(), 'utf8' ) )
      projectsData.state = 'opened'
    }
  }

  //  Read browser session file
  if(typeSession == 'BROWSER'){
    if(browserData.state == 'not opened'){

      //  check file is exist and create new JSON project file
      if( !fs.existsSync( sessionBrowserFilePath() ) )
        fs.writeFileSync( sessionBrowserFilePath(), JSON.stringify(sessionBrowserDefaultData, null, '\t'), {encoding: 'utf8'} )

      browserData.data = JSON.parse( fs.readFileSync( sessionBrowserFilePath(), 'utf8' ) )
      browserData.state = 'opened'
    }
  }
}

function compressSession(projects){  //  sessionProjectClone / 
  // console.log('compressSession in: ')
  // console.log(projects)
  //
  for (const key in projects) {

    projects[key].folders.forEach((folder) => {

      //  Clear unmarks & unpin files
      folder.files = folder.files.filter( (file) => ( (file.markID != defaults.unmarkedMarkID) || file.isPinned ) )

      //  Clear empty folder (marking)
      if(folder.files.length == 0){

        //  Save open folder to open it next time on startup.
        if(!folder.isOpened)
          folder.isEmpty = true

        //  Save opened tab to showing on folders tab bar
        if(folder.displayedOnBar)
          folder.isEmpty = false
      }else{

        //  Erase others.
        folder.isEmpty = false
      }
    })

    //  AND leave the folder if it is the only one
    if(projects[key].folders.length == 1){
      projects[key].folders[0].isEmpty = false
    }

    //  Clear empty folder
    if( projects[key].folders.length > 1 ){
      projects[key].folders = projects[key].folders.filter( (folder) => !folder.isEmpty )
    }
  }
  //
  // console.log('compressSession out: ')
  // console.log(projects)
  return JSON.stringify(projects, null, '\t')
}

// Custom APIs for renderer
const api = {

  validate:(path)=>{

    return path.replaceAll(settings.win32separator, settings.actualSeparator)
  },

  choosingAFileName:(file)=>{

    let postfix = `${settings.dublicateFilePostfix} ${new Date().toLocaleString().replaceAll(/[:.]/g, '-').replaceAll(/[,]/g, '')}`
    let fileNewName = file.name.slice(0, 255 - 5 - postfix.length - file.format.length)

    return { name: `${fileNewName} ${postfix}`, format: `${file.format}`, fullName: `${fileNewName} ${postfix}.${file.format}` }
  },

  writeFile:(filePath, data)=>{
    
    return fs.writeFile( path.resolve(filePath), data, {encoding: 'utf8'} )
  },

  getFileFullnames:(folderPath)=>{
    if( !api.folderIsExist(folderPath) ) return

    // console.log('get fullnames')
    return fs.readdirSync( path.resolve(folderPath), { withFileTypes: true } )
    .filter(d => d.isFile())
    .map(d => d.name)

    // if( folderPath == '' ){
    //   //  root
    //   return fs.readdirSync(path.parse(process.cwd()).root, { withFileTypes: true })
    //   .filter(d => d.isFile())
    //   .map(d => d.name)
    // }else{
    //   //  others
    //   return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true })
    //   .filter(d => d.isFile())
    //   .map(d => d.name)
    // }
  },

  getFilenames:(InPath)=>{

    if( !api.folderIsExist(InPath) ) return

    let files = fs.readdirSync( path.resolve(InPath) )
    let result = []
    
    files.forEach(file => {

      result.push({
        name: path.basename(path.join( InPath, file) , path.extname(path.join( InPath, file) )),
        format: path.extname(path.join( InPath, file) )
      })
    })

    return result
  },

  renameFile:( folderPath, oldFileName, newFileName )=>{

    return fsPromises.rename( path.resolve(path.join(folderPath, oldFileName)), path.resolve(path.join(folderPath, newFileName)) )
      .then(
        resolve=>{
          return newFileName
        }
      ).catch(
        error=>{
          return false
        }
      )
  },

  deleteFile:(folderPath, fileFullname)=>{
    
    return fsPromises.stat( path.resolve( path.join(folderPath, fileFullname) ) )
      .then(

        stats=>{

          console.log('stats: ')
          console.log(stats)
          
          if(stats.isFile())
            return fsPromises.unlink( path.resolve( path.join(folderPath, fileFullname) ) )
            // return trash( [path.resolve( path.join(folderPath, fileFullname) )] )
            // return shell.trashItem( path.resolve( path.join(folderPath, fileFullname) ) )
              .then(
                resolve=>{
                  return fileFullname
                }
              ).catch(
                error=>{
                  // alert(error)
                  return false
                }
              )

          if(stats.isDirectory())
            return false
        }
      ).catch(

        error=>{
          console.log('error: ')
          console.log(error)
          return false
        }
      )
  },

  copyFile:(srcFolderPath, destFolderPath, file)=>{

    let fileSrcFullname = `${file.name}.${file.format}`

    let fileNewFullName = api.choosingAFileName(file)

    // let postfix = `${settings.dublicateFilePostfix} ${new Date().toLocaleString().replaceAll(/[:.]/g, '-').replaceAll(/[,]/g, '')}`
    // let fileNewName = file.name.slice(0, 255 - 5 - postfix.length - file.format.length)
    // let fileNewFullName = `${fileNewName} ${postfix}.${file.format}`
      
    // while ( fs.existsSync( path.resolve(path.join(destFolderPath, fileNewName)) ) ) 
    //   fileNewName = `${fileNewName.slice()}${settings.dublicateFilePostfix}.${file.format}`

    return fsPromises.copyFile( path.resolve(path.join(srcFolderPath, fileSrcFullname)), path.resolve(path.join(destFolderPath, fileNewFullName.fullName)),  fs.constants.COPYFILE_EXCL )
      .then(resolve => {
          return fileNewFullName
          // return {name: `${fileNewName} ${postfix}`, format: file.format}
        }).catch(err => {
          return false
        })
  },

  moveFileTo:(folderPathSrc, folderPathDest, file)=>{

    if(folderPathSrc == folderPathDest) return false

    // api.isFileAsync(folderPathSrc, fileFullname)
    //   .then(
    //     result_fileFullname=>{

    //       if(result_fileFullname){

            file.fullName = `${file.name}.${file.format}`
            let fileNewFullname = `${file.name}.${file.format}`

            if( fs.existsSync( path.resolve(path.join(folderPathDest, file.fullName)) ) )
              fileNewFullname = api.choosingAFileName(file)

            // while ( fs.existsSync( path.resolve(path.join(folderPathDest, fileNewName)) ) ) 
            //   fileNewName = fileFullname + ' ' + settings.dublicateFilePostfix

            return fsPromises.rename( path.resolve(path.join(folderPathSrc, file.fullName)), path.resolve(path.join(folderPathDest, fileNewFullname)) )
              .then(
        
                resolve=>{
                  return fileNewFullname
                }
              ).catch(
        
                error=>{
                  return false
                }
              )
        //   }else{
        //     return false
        //   }
        // }
      // )
  },

  isFileAsync:function(folderPath, fileFullname){

    return fsPromises.stat( path.resolve( path.join(folderPath, fileFullname) ) )
      .then(

        stats=>{

          // console.log('stats: ')
          // console.log(stats)
          if( stats.isFile() )
            return fileFullname

          if( stats.isDirectory() )
            return false
        }
      ).catch(

        error=>{
          console.log('error: ')
          console.log(error)
          return false
        }
      )
  },

  convertPathToUrl:(path)=>{

    console.log( pathToFileURL(path, {windows: true}).href )
    return pathToFileURL(path, {windows: true})
  },

  getFolderNames:(folderPath, cnst)=>{

    if( (cnst != 'dont check for existence') || (cnst == undefined) )
      if( !api.folderIsExist(folderPath) )
        return

    if( folderPath == '' ){
      //  root
      return fs.readdirSync(path.parse(process.cwd()).root, { withFileTypes: true })
      .filter(d => d.isDirectory())
      // .filter(d => !fs.stat(path.resolve(folderPath, d)).isHidden())
      .map(d => d.name)
    }else{
      //  others
      return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
    }
  },

  getPathSpecialFolder:()=>{
    //Поддерживаются следующие имена:

    // home - Домашняя папка (например /home/<Username>, c:\Users\<Username>, /Users/<Username>)
    // appData - Каталог приложений для каждого пользователя (например, /home/<Username>/.local/share, c:\Users\<Username>\AppData\Roaming, /Users/<Username>/Library/Application Support)
    // userData - Каталог для хранения файлов конфигурации (например /home/<Username>/.config, c:\Users\<Username>\AppData\Roaming, /Users/<Username>/Library/Application Support)
    // desktop - Каталог рабочего стола (например, /home/<Username>/Schreibtisch(по немецкой системе), c:\Users\<Username>\Desktop, /Users/<Username>/Desktop)
    // documents - Каталог документов (например /home/<Username>/Dokumente(по немецкой системе), c:\Users\<Username>\Documents, /Users/<Username>/Documents)
    // Downloads - Каталог загрузок (например /home/<Username>/Downloads, c:\Users\<Username>\Downloads, /Users/<Username>/Downloads)
    // music - Музыкальный каталог (например /home/<Username>/Musik(по немецкой системе), c:\Users\<Username>\Music, /Users/<Username>/Music)
    // pictures - Каталог изображений (например /home/<Username>/Bilder(по немецкой системе), c:\Users\<Username>\Pictures, /Users/<Username>/Pictures)
    // videos - Каталог видео (например /home/<Username>/Videos, c:\Users\<Username>\Videos, /Users/<Username>/Videos)
    // cache - Каталог кэша (например /home/<Username>/.cache, c:\Users\<Username>\AppData\Local, /Users/<Username>/Library/Caches)
    // state - Государственный каталог (например /home/<Username>/.local/state, c:\Users\<Username>\AppData\Local, /Users/<Username>/Library/Application Support)
    // savegames - Каталог для сохраненных игр (например /home/<Username>/.local/share, c:\Users\<Username>\SavedGames, /Users/<Username>/Library/Application Support)

    // return specialPath(dat)

    if (process.platform === 'win32') {
      // console.log(homeDir); // Выведет домашнюю директорию пользователя в Windows
      return api.validate( process.env.USERPROFILE ).substring(2)
    } else {
      // console.log(homeDir); // Выведет домашнюю директорию пользователя в Unix-подобных системах
      return process.env.HOME
    }
  },

  getImgFileFullnames:(folderPath)=>{

    return fs.readdirSync(path.resolve(folderPath), (err, files) => {

      if (err){
        console.log(err)
        return []

      }else {
        // console.log("imgs files: ")
        files.forEach( (file, index) => {
          if ( !settings.fileImgMask.includes( path.extname(file) ) )
            // console.log(file);
            files.splice(index, 1)
        })
        
        return files
      }
    })
  },

  createFolder:(InPath, folderName)=>{

    if(folderName == undefined) folderName = ''   //  overload*
    
    if( api.folderIsExist(path.join( InPath, folderName )) ){     //  returned udefined if !{recursice: true}

      if( folderName == '' )  InPath += Math.floor(Math.random()*10000000)
      if( folderName )  folderName += Math.floor(Math.random()*10000000)
    }

    try{
      fs.mkdirSync( path.resolve(path.join( InPath, folderName )) )

      if(folderName == '') return api.validate( InPath )
      if(folderName) return api.validate( path.join( InPath, folderName ) )
    }catch(error){

      console.log(error)
      return false
    }
  },

  renameFolder:(dat)=>{

    let newPath = path.join( dat.fullpath.substring(0, dat.fullpath.lastIndexOf('/') ), dat.newName )

    try{

      fs.renameSync( path.resolve( dat.fullpath ), path.resolve( newPath ) )
      return api.validate( newPath )
    }catch(error){

      console.log(error)
      return false
    }
  },

  deleteFolder:(folderPath)=>{
    console.log(`${folderPath} is deleting`)

    // return shell.trashItem( path.resolve(folderPath) )
    return fsPromises.rmdir(path.resolve(folderPath), { recursive: true, force: true })
      .then(

        resolve=>{
          return api.validate( folderPath )
        }
      ).catch(

        error=>{
          console.log(error)
          
          return false
        }
      )
  },

  copyFolder:(folderPathSrc, folderPathDest)=>{
    //
    if( !api.folderIsExist(folderPathSrc) && (folderPathSrc == folderPathDest) ) return false
    // console.log('copy folder')
    return fsPromises.cp(folderPathSrc, folderPathDest, {recursive: true})
      .then(

        resolve=>{
          return api.validate( folderPathSrc )
        }
      ).catch(

        error=>{
          return false
        }
      )
  },

  moveFolder:(folderPathSrc, folderPathDest)=>{

    if(folderPathSrc == folderPathDest) return false

    return fsPromises.rename(folderPathSrc, folderPathDest)
      .then(

        resolve=>{
          return api.validate( folderPathSrc )    //
        }
      ).catch(

        error=>{
          return false
        }
      )
  },

  folderIsExist:(folderPath)=>{
    // console.log('check folder isExist: ' + folderPath)
    return fs.existsSync(path.resolve(folderPath))
  },

  checkUniqueFolderName:(path)=>{

    let result = api.folderIsExist(path)
    
    let today = new Date().toLocaleString().replaceAll(/[:.]/g, '-').replaceAll(/[,]/g, '')

    if( !result ){
      return api.validate( path )
    }else{
      return api.validate( path.slice(0, 255 - 3 - today.length) + ' ' + today )
    }
  },

  getFileMeta:(InPath, fileFullname)=>{
    
    let fileStats = {
      // created: null, 
      // createdMS: null, 
      // lastEdited: null, 
      // lastEditedMS: null, 
      // size: null
    }
    
    fs.stat( path.resolve( InPath, fileFullname ), (error, stats) => {  
      if (error){
        return
      }else{
        
        if(stats.isFile()){
          fileStats.created = stats.atime
          fileStats.createdMs = stats.atimeMs
          fileStats.lastEdited = stats.mtime
          fileStats.lastEditedMS = stats.mtimeMs
          fileStats.size = stats.size
        }
        
        if(stats.isDirectory()) return
      }
    })

    return fileStats
  },

  openFileInExternalApp:(InPath, fileFullname)=>{
    console.log(InPath)
    shell.openPath( path.resolve( path.join(InPath, fileFullname)) )
  },

  // openInWindowsFileManager:()=>{
  //   shell.showItemInFolder(somePath)
  // },

  getProjectData:()=>{
    getActiveData('PROJECT')
    return projectsData.data
  },
  getSessionData:()=>{
    getActiveData('BROWSER')
    return browserData.data
  },

  closeProject:function(){
    for (const key in projectsData.data) {
      if(projectsData.data[key].meta.status == 'opened'){

        projectsData.data[key].meta.lastModified = Date.now()
        projectsData.data[key].meta.lastOpened = Date.now()
        projectsData.data[key].meta.status = 'closed'
      }
    }

    //  And save?
  },
  openProject:function(proj_id){
    projectsData.data[proj_id].meta.status = 'opened'
  },

  close:function(){
    //
    let result1 = null
    let result2 = null
    //
    if(projectsData.state == 'opened'){
      //
      this.closeProject()
      //
      sessionProjectClone = structuredClone(projectsData.data)
      //
      sessionProjectClone_json = compressSession( sessionProjectClone )
    }
    //
    if(browserData.state == 'opened'){
      //
      sessionBrowserClone = structuredClone(browserData.data)
      //
      sessionBrowserClone_json = compressSession( sessionBrowserClone )
    }
    //
    by()
    //
    async function by() {
      //
      try{
        //
        if(sessionProjectClone_json){
          result1 = await fsPromises.writeFile( sessionProjectsFilePath(), sessionProjectClone_json, {encoding: 'utf8'} )
        }else{
          result1 = undefined
        }
        //
        if(sessionBrowserClone_json){
          result2 = await fsPromises.writeFile( sessionBrowserFilePath(), sessionBrowserClone_json, {encoding: 'utf8'} )
        }else{
          result2 = undefined
        }
        // console.log(result)
        if(result1 == undefined){
          if(result2 == undefined){
            // console.log('closing')
            ipcRenderer.send('app/close')
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

  },
  minimize: () => ipcRenderer.send('app/minimize'),
  maximize: () => ipcRenderer.send('app/maximize'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
