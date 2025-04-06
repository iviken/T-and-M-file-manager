import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const { platform } = require('node:process');

// import { specialPath } from 'platform-folders'

const { shell } = require('electron')

let child = require('child_process').execFile;

let path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises;

let os = require("os")
let root = (os.platform() == "win32") ? process.cwd().split(path.sep)[0] : "/"

// const sep = '\\'
// const win32sep = '/'

const sessionProjectsFilePath = () => path.join(__dirname, '..', 'JSON', settings.sessionProjectsFile)
const sessionBrowserFilePath = () => path.join(__dirname, '..', 'JSON', settings.sessionBrowserFile)

const projectsData = {dataType: 'PROJECT' ,data: {}, state: 'not opened' }
const browserData = {dataType: 'BROWSER' ,data: {}, state: 'not opened' }

// let openProjectId = null
let sessionProjectClone = null
let sessionProjectClone_json = null
let sessionBrowserClone = null
let sessionBrowserClone_json = null

const settings = {
  fileImgMask: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'svg'],
  sessionProjectsFile: 'sessionProjects.json',
  sessionBrowserFile: 'sessionBrowser.json',
  defaults: {
    defaulMarkID: 'mark_unmarked',
  }
}

function getActiveData(typeSession){
  //
  if(typeSession == 'PROJECT'){
    if(projectsData.state == 'not opened'){
      projectsData.data = JSON.parse( fs.readFileSync( sessionProjectsFilePath(), 'utf8' ) )
      projectsData.state = 'opened'
    }
  }
  //
  if(typeSession == 'BROWSER'){
    if(browserData.state == 'not opened'){
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
    projects[key].folders.forEach(folder => {
      //  Clear unmarks & unpin files
      folder.files = folder.files.filter( (file) => ( (file.markID != settings.defaults.defaulMarkID) || file.isPinned ) )
      //  Clear empty folder (marking)
      if(!folder.files.length){
        folder.isEmpty = true
      }
    })
    //  Clear empty folder
    projects[key].folders = projects[key].folders.filter( (folder) => !folder.isEmpty )
  }
  //
  // console.log('compressSession out: ')
  // console.log(projects)
  return JSON.stringify(projects, null, '\t')
}

// function writeSession(data){
//   // return api.writeFile( sessionProjectsFilePath, data )
//   // return fs.writeFile( sessionProjectsFilePath(), data, {encoding: 'utf8'} )
//   return fs.writeFile( path.join(__dirname, '..', 'JSON', 'sessionProjects.json'), data, {encoding: 'utf8'} )
// }
// Custom APIs for renderer
const api = {
  writeFile:(filePath, data)=>{
    //
    return fs.writeFile( path.resolve(filePath), data, {encoding: 'utf8'} )
  },

  getFileFullnames:(folderPath)=>{
    if( api.folderIsExist(folderPath) ){
      // console.log('get fullnames')
      return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true })
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
    }
  },

  getFilenames:(InPath)=>{
    if( api.folderIsExist(InPath) ){
      let files = fs.readdirSync( path.resolve(InPath) )
      let result = []
      //
      files.forEach(element => {
        result.push({
          name: path.extname(path.join( InPath, element) ),
          format: path.basename(path.join( InPath, element) , path.extname(path.join( InPath, element) ))
        })
      })
      return result
    }
  },

  renameFile:( folderPath, oldFileName, newFileName )=>{
    return fsPromises.rename( path.resolve(path.join(folderPath, oldFileName)), path.resolve(path.join(folderPath, newFileName)) )
    // return fs.renameSync( path.resolve(path.join(folderPath, oldFileName)), path.resolve(path.join(folderPath, newFileName)) )
  },

  deleteFile:(filePath)=>{
    fs.stat( path.resolve( filePath ), (error, stats) => {  
      if (error){
        return error
      }else{
        if(stats.isFile()){
          return fsPromises.unlink( path.resolve(filePath) )
        }
        //
        if(stats.isDirectory()) return 'directory'
      }
    })
  },

  getFolderNames:(folderPath)=>{
    if( api.folderIsExist(folderPath) ){
      // console.log('path: ' + folderPath)
      // console.log('path.replaceAll: ' + folderPath.replaceAll(path.sep, path.win32.sep))
      // console.log('join(path): ' + path.join(folderPath) )
      // console.log('join(path).replaceAll: ' + path.join(folderPath).replaceAll(path.sep, path.win32.sep) )
      // console.log('resolve(path): ' + path.resolve(folderPath) )
      // console.log('resolve(path).replaceAll: ' + path.resolve(folderPath).replaceAll(path.sep, path.win32.sep) )
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
    }
  },

  getPathSpecialFolder:(folderName)=>{
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
      return process.env.USERPROFILE
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
    
    if( !api.folderIsExist(path.join( InPath, folderName )) ){    //  returned udefined if !{recursice: true}
      return fs.mkdirSync(path.resolve( path.join( InPath, folderName ) ), (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log('Directory created successfully.')
        }
      })
    }
  },

  renameFolder:(dat)=>{
    // if( !api.folderIsExist(dat.fullpath) ) return false
    //
    // let result = null
    let newPath = path.join( dat.fullpath.substring(0, dat.fullpath.lastIndexOf('/') ), dat.newName )
    //
    // console.log('old path: ' + dat.fullpath)
    // console.log('new path: ' + newPath.replaceAll(sep, win32sep))
    // console.log('input data: ')
    // console.log(dat.folderObj)
    // console.log('new path: ' + newPath.replaceAll(path.sep, path.win32.sep))
    try{
      fs.renameSync( path.resolve( dat.fullpath ), path.resolve( newPath ) )
      return true
    }catch(error){
      console.log(error)
      return false
    }
    // return result
    
  },

  deleteFolder:(folderPath)=>{
    if( api.folderIsExist(folderPath) ){
      // console.log(`${folderPath} is deleted!`)
      return fsPromises.rmdir(path.resolve(folderPath), { recursive: true, force: true })
    }else{
      console.log(`${folderPath} is not exist`)
      return false
    }
  },

  // deleteFolder:(folderPath)=>{
  //   if( api.folderIsExist(folderPath) ){
  //     return fs.rmdir(path.resolve(folderPath), { recursive: true, force: true }, err => {
  //       if (err) {
  //         throw err
  //       }
  //       console.log(`${folderPath} is deleted!`)
  //     })
  //   }else{
  //     console.log(`${folderPath} is not exist`)
  //     return false
  //   }
  // },

  // copyFolder:(folderPathSrc, folderPathDest)=>{
  //   //
  //   if( api.folderIsExist(folderPathSrc) ){
  //     // if( api.folderIsExist(folderPathDest) ){}
  //     //
  //     console.log('copy folder')
  //     return copy(folderPathSrc, folderPathDest)
  //     async function copy(folderPathSrc, folderPathDest){
  //       try{
  //         await fsPromises.cp(folderPathSrc, folderPathDest, {recursive: true})
  //       }catch{
  //         console.log('error copy')
  //       }
  //     }
  //   }
  // },

  copyFolder:(folderPathSrc, folderPathDest)=>{
    //
    if( api.folderIsExist(folderPathSrc) ){
      // console.log('copy folder')
      return fsPromises.cp(folderPathSrc, folderPathDest, {recursive: true})
    }
  },

  // copyFolder:(folderPathSrc, folderPathDest)=>{
  //   //
  //   if( api.folderIsExist(folderPathSrc) ){
  //     // if( api.folderIsExist(folderPathDest) ){
  //       //
  //       console.log('copy folder')
  //       let result = null
  //       return copy(folderPathSrc, folderPathDest)
  //       async function copy(folderPathSrc, folderPathDest){
  //         try{
  //           await fsPromises.cp(folderPathSrc, folderPathDest, {recursive: true})
  //           if(result == undefined) {
  //             console.log('try success')
  //             return undefined
  //           }
  //         }catch{
  //           console.log('error copy')
  //           return 'error'
  //         }
  //       }
  //     // }
  //   }
  // },

  folderIsExist:(folderPath)=>{
    return fs.existsSync(path.resolve(folderPath))
  },

  getFileMeta:(InPath, fileFullname)=>{
    //
    let fileStats = {
      created: null, 
      createdMS: null, 
      lastEdited: null, 
      lastEditedMS: null, 
      size: null
    }
    //
    fs.stat( path.resolve( InPath, fileFullname ), (error, stats) => {  
      if (error){
        return
      }else{
        //
        if(stats.isFile()){
          fileStats.created = stats.atime
          fileStats.createdMs = stats.atimeMs
          fileStats.lastEdited = stats.mtime
          fileStats.lastEditedMS = stats.mtimeMs
          fileStats.size = stats.size
        }
        //
        if(stats.isDirectory()) return
      }
    })

    return fileStats
  },

  // child(executablePath, function(err, data) {
  //     if(err){
  //       console.error(err);
  //       return;
  //     }
  
  //     console.log(data.toString());
  // })

  openFileInExternalApp:(InPath, fileFullname)=>{
    console.log(InPath)
    shell.openPath( path.resolve( path.join(InPath, fileFullname)) )
  },

  // someRun:()=>{
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
        //
        // openProjectId = projectsData.data[key].id
        //
        projectsData.data[key].meta.lastModified = Date.now()
        projectsData.data[key].meta.lastOpened = Date.now()
        projectsData.data[key].meta.status = 'closed'
      }
    }
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
          result1 = await fsPromises.writeFile( path.join(__dirname, '..', 'JSON', settings.sessionProjectsFile), sessionProjectClone_json, {encoding: 'utf8'} )
        }else{
          result1 = undefined
        }
        //
        if(sessionBrowserClone_json){
          result2 = await fsPromises.writeFile( path.join(__dirname, '..', 'JSON', settings.sessionBrowserFile), sessionBrowserClone_json, {encoding: 'utf8'} )
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
