"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const { platform } = require("node:process");
const { shell } = require("electron");
require("child_process").execFile;
let path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
let os = require("os");
os.platform() == "win32" ? process.cwd().split(path.sep)[0] : "/";
const sessionProjectsFilePath = () => path.join(__dirname, "..", "JSON", settings.sessionProjectsFile);
const sessionBrowserFilePath = () => path.join(__dirname, "..", "JSON", settings.sessionBrowserFile);
const projectsData = { data: {}, state: "not opened" };
const browserData = { data: {}, state: "not opened" };
let sessionProjectClone = null;
let sessionProjectClone_json = null;
let sessionBrowserClone = null;
let sessionBrowserClone_json = null;
const settings = {
  fileImgMask: ["jpg", "png", "gif", "bmp", "jpeg", "svg"],
  sessionProjectsFile: "sessionProjects.json",
  sessionBrowserFile: "sessionBrowser.json",
  defaults: {
    defaulMarkID: "mark_unmarked"
  }
};
function getActiveData(typeSession) {
  if (typeSession == "PROJECT") {
    if (projectsData.state == "not opened") {
      projectsData.data = JSON.parse(fs.readFileSync(sessionProjectsFilePath(), "utf8"));
      projectsData.state = "opened";
    }
  }
  if (typeSession == "BROWSER") {
    if (browserData.state == "not opened") {
      browserData.data = JSON.parse(fs.readFileSync(sessionBrowserFilePath(), "utf8"));
      browserData.state = "opened";
    }
  }
}
function compressSession(projects) {
  for (const key in projects) {
    projects[key].folders.forEach((folder) => {
      folder.files = folder.files.filter((file) => file.markID != settings.defaults.defaulMarkID || file.isPinned);
      if (!folder.files.length) {
        folder.isEmpty = true;
      }
    });
    projects[key].folders = projects[key].folders.filter((folder) => !folder.isEmpty);
  }
  return JSON.stringify(projects, null, "	");
}
const api = {
  writeFile: (filePath, data) => {
    return fs.writeFile(path.resolve(filePath), data, { encoding: "utf8" });
  },
  getFileFullnames: (folderPath) => {
    if (api.folderIsExist(folderPath)) {
      return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name);
    }
  },
  getFilenames: (InPath) => {
    if (api.folderIsExist(InPath)) {
      let files = fs.readdirSync(path.resolve(InPath));
      let result = [];
      files.forEach((element) => {
        result.push({
          name: path.extname(path.join(InPath, element)),
          format: path.basename(path.join(InPath, element), path.extname(path.join(InPath, element)))
        });
      });
      return result;
    }
  },
  renameFile: (folderPath, oldFileName, newFileName) => {
    return fsPromises.rename(path.resolve(path.join(folderPath, oldFileName)), path.resolve(path.join(folderPath, newFileName)));
  },
  deleteFile: (filePath) => {
    fs.stat(path.resolve(filePath), (error, stats) => {
      if (error) {
        return error;
      } else {
        if (stats.isFile()) {
          return fsPromises.unlink(path.resolve(filePath));
        }
        if (stats.isDirectory()) return "directory";
      }
    });
  },
  getFolderNames: (folderPath) => {
    if (api.folderIsExist(folderPath)) {
      if (folderPath == "") {
        return fs.readdirSync(path.parse(process.cwd()).root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
      } else {
        return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
      }
    }
  },
  getPathSpecialFolder: (folderName) => {
    if (process.platform === "win32") {
      return process.env.USERPROFILE;
    } else {
      return process.env.HOME;
    }
  },
  getImgFileFullnames: (folderPath) => {
    return fs.readdirSync(path.resolve(folderPath), (err, files) => {
      if (err) {
        console.log(err);
        return [];
      } else {
        files.forEach((file, index) => {
          if (!settings.fileImgMask.includes(path.extname(file)))
            files.splice(index, 1);
        });
        return files;
      }
    });
  },
  createFolder: (InPath, folderName) => {
    if (folderName == void 0) folderName = "";
    if (!api.folderIsExist(path.join(InPath, folderName))) {
      return fs.mkdirSync(path.resolve(path.join(InPath, folderName)), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Directory created successfully.");
        }
      });
    }
  },
  renameFolder: (dat) => {
    let newPath = path.join(dat.fullpath.substring(0, dat.fullpath.lastIndexOf("/")), dat.newName);
    try {
      fs.renameSync(path.resolve(dat.fullpath), path.resolve(newPath));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  deleteFolder: (folderPath) => {
    if (api.folderIsExist(folderPath)) {
      return fsPromises.rmdir(path.resolve(folderPath), { recursive: true, force: true });
    } else {
      console.log(`${folderPath} is not exist`);
      return false;
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
  copyFolder: (folderPathSrc, folderPathDest) => {
    if (api.folderIsExist(folderPathSrc)) {
      return fsPromises.cp(folderPathSrc, folderPathDest, { recursive: true });
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
  folderIsExist: (folderPath) => {
    return fs.existsSync(path.resolve(folderPath));
  },
  getFileMeta: (InPath, fileFullname) => {
    let fileStats = {
      created: null,
      createdMS: null,
      lastEdited: null,
      lastEditedMS: null,
      size: null
    };
    fs.stat(path.resolve(InPath, fileFullname), (error, stats) => {
      if (error) {
        return;
      } else {
        if (stats.isFile()) {
          fileStats.created = stats.atime;
          fileStats.createdMs = stats.atimeMs;
          fileStats.lastEdited = stats.mtime;
          fileStats.lastEditedMS = stats.mtimeMs;
          fileStats.size = stats.size;
        }
        if (stats.isDirectory()) return;
      }
    });
    return fileStats;
  },
  // child(executablePath, function(err, data) {
  //     if(err){
  //       console.error(err);
  //       return;
  //     }
  //     console.log(data.toString());
  // })
  openFileInExternalApp: (InPath, fileFullname) => {
    console.log(InPath);
    shell.openPath(path.resolve(path.join(InPath, fileFullname)));
  },
  // someRun:()=>{
  //   shell.showItemInFolder(somePath)
  // },
  getProjectData: () => {
    getActiveData("PROJECT");
    return projectsData.data;
  },
  getSessionData: () => {
    getActiveData("BROWSER");
    return browserData.data;
  },
  closeProject: function() {
    for (const key in projectsData.data) {
      if (projectsData.data[key].meta.status == "opened") {
        projectsData.data[key].meta.lastModified = Date.now();
        projectsData.data[key].meta.lastOpened = Date.now();
        projectsData.data[key].meta.status = "closed";
      }
    }
  },
  openProject: function(proj_id) {
    projectsData.data[proj_id].meta.status = "opened";
  },
  close: function() {
    let result1 = null;
    let result2 = null;
    if (projectsData.state == "opened") {
      this.closeProject();
      sessionProjectClone = structuredClone(projectsData.data);
      sessionProjectClone_json = compressSession(sessionProjectClone);
    }
    if (browserData.state == "opened") {
      sessionBrowserClone = structuredClone(browserData.data);
      sessionBrowserClone_json = compressSession(sessionBrowserClone);
    }
    by();
    async function by() {
      try {
        if (sessionProjectClone_json) {
          result1 = await fsPromises.writeFile(path.join(__dirname, "..", "JSON", settings.sessionProjectsFile), sessionProjectClone_json, { encoding: "utf8" });
        } else {
          result1 = void 0;
        }
        if (sessionBrowserClone_json) {
          result2 = await fsPromises.writeFile(path.join(__dirname, "..", "JSON", settings.sessionBrowserFile), sessionBrowserClone_json, { encoding: "utf8" });
        } else {
          result2 = void 0;
        }
        if (result1 == void 0) {
          if (result2 == void 0) {
            electron.ipcRenderer.send("app/close");
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  minimize: () => electron.ipcRenderer.send("app/minimize"),
  maximize: () => electron.ipcRenderer.send("app/maximize")
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
