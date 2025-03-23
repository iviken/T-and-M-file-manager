import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {projects, freeBrowse, fakeData_tree} from '../renderer/src/assets/fakedata.js'

let projectsData = null
let browserData = null

function getActiveData(typeSession){
  if(typeSession == 'PROJECT'){projectsData = {dataType: 'PROJECT' ,data: projects}}
  if(typeSession == 'BROWSER'){browserData = {dataType: 'BROWSER' ,data: freeBrowse}}
}

// Custom APIs for renderer
const api = {

  getData:()=>{
    getActiveData('PROJECT')
    return projectsData.data
  },

  getSessionData:()=>{
    getActiveData('BROWSER')
    return browserData.data
  },

  closeProject:function(){
    // if(activeData.dataType == 'PROJECT'){
      for (const key in projectsData.data) {
        if(projectsData.data[key].meta.status == 'opened'){
          projectsData.data[key].meta.lastModified = Date.now()
          projectsData.data[key].meta.lastOpened = Date.now()
          // console.log(Date.now())
          projectsData.data[key].meta.status = 'closed'
        }
      }
    // }
  },

  openProject:function(proj_id){
    projectsData.data[proj_id].meta.status = 'opened'
  },
  
  // getProjectName:function(){
  //   // if(activeData.dataType == 'PROJECT'){
  //     console.log('name is: '+projectsData.data.meta.name)
  //     return projectsData.data.meta.name
  //   // }
  // },

  getTree:()=>{return fakeData_tree},

  close: () => ipcRenderer.send('app/close'),
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
