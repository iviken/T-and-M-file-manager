"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const settings = {
  sessionProjectsFile: "sessionProjects.json",
  sessionBrowserFile: "sessionBrowser.json",
  sessionsPath: "C:/Users/Nike/AppData/Roaming/iviken/TandM file manager",
  // sessionsPath: `'C:/Users/Nike/AppData/Roaming/'${settings.productName.replace(settings.folderNameRegexp, '')}`,
  dublicateFilePostfix: "copy",
  win32separator: "\\",
  actualSeparator: "/",
  //  FILES
  fileImgMask: ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "gif", "GIF", "bmp", "BMP", "svg", "SVG", "ico", "ICO", "tiff", "TIFF", "webp", "eps", "EPS"]
};
const defaults = {
  unmarkedMarkID: "mark_unmarked"
};
const sessionProjectsDefaultData = {
  proj_001: {
    id: "proj_001",
    headerPicture: {},
    parameters: {
      pinFilesIsFolded: {
        imgs: false,
        text: false
      },
      imagesHeight: 100,
      pinFoldersIsFolded: false,
      foldersIsFolded: true,
      showFoldersStartingWithDot: false
    },
    meta: {
      name: "project first",
      created: 1742744761272,
      lastModified: 1746799698177,
      lastOpened: 1746799698177,
      isPinned: false,
      description: "Descrtiption first of project",
      status: "closed"
    },
    tasks: {
      task_9636617: {
        id: "task_9636617",
        name: "start typing a description of a new task",
        descr: "",
        status: "undone",
        isPinned: false,
        isFolded: false,
        subtasksAvailability: false,
        subtasks: {},
        isSelected: true,
        isDone: false
      }
    },
    marks: {
      mark_unmarked: {
        id: "mark_unmarked",
        color: "unmarked-color",
        descr: "--unmarked--",
        isFolded: {
          text: true,
          imgs: true
        },
        show: true
      }
    },
    folders: [
      {
        id: "folder_2334256",
        path: "/Temp",
        files: [],
        isOpened: true,
        isPinned: false,
        displayedOnBar: true,
        isEmpty: false
      }
    ]
  }
};
const sessionBrowserDefaultData = {
  proj_default: {
    id: "proj_default",
    headerPicture: {},
    parameters: {
      pinFilesIsFolded: {
        imgs: false,
        text: false
      },
      imagesHeight: 75,
      pinFoldersIsFolded: false,
      foldersIsFolded: false,
      showFoldersStartingWithDot: true
    },
    meta: {
      name: "default",
      created: 1742744761272,
      lastModified: 1742744761272,
      lastOpened: 1742744761272,
      isPinned: false,
      description: "default",
      status: "opened"
    },
    tasks: {
      task_001: {
        id: "task_001",
        name: "start typing a description of a new task",
        descr: "Lorem ipsum ... description",
        isDone: false,
        isSelected: true,
        isPinned: false,
        isFolded: true,
        subtasksAvailability: false,
        subtasks: {}
      }
    },
    marks: {
      mark_unmarked: {
        id: "mark_unmarked",
        color: "unmarked-color",
        descr: "--unmarked--",
        isFolded: {
          text: true,
          imgs: true
        },
        show: true
      }
    },
    folders: [
      {
        id: "default__fold_001",
        path: "/Temp",
        isOpened: true,
        isPinned: true,
        displayedOnBar: true,
        files: [],
        isEmpty: false
      }
    ]
  }
};
const { platform } = require("node:process");
const { pathToFileURL } = require("node:url");
require("child_process").execFile;
const { shell } = require("electron");
let path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
let os = require("os");
os.platform() == "win32" ? process.cwd().split(path.sep)[0] : "/";
const sessionProjectsFilePath = () => path.resolve(path.join(settings.sessionsPath.slice(2), settings.sessionProjectsFile));
const sessionBrowserFilePath = () => path.resolve(path.join(settings.sessionsPath.slice(2), settings.sessionBrowserFile));
const projectsData = { data: {}, state: "not opened" };
const browserData = { data: {}, state: "not opened" };
let sessionProjectClone = null;
let sessionProjectClone_json = null;
let sessionBrowserClone = null;
let sessionBrowserClone_json = null;
function getActiveData(typeSession) {
  let parentPath = settings.sessionsPath.slice(0, settings.sessionsPath.lastIndexOf(settings.actualSeparator)).slice(2);
  if (!api.folderIsExist(parentPath))
    fs.mkdirSync(path.resolve(parentPath));
  if (!api.folderIsExist(settings.sessionsPath.slice(2)))
    fs.mkdirSync(path.resolve(settings.sessionsPath.slice(2)));
  if (typeSession == "PROJECT") {
    if (projectsData.state == "not opened") {
      if (!fs.existsSync(sessionProjectsFilePath()))
        fs.writeFileSync(sessionProjectsFilePath(), JSON.stringify(sessionProjectsDefaultData, null, "	"), { encoding: "utf8" });
      projectsData.data = JSON.parse(fs.readFileSync(sessionProjectsFilePath(), "utf8"));
      projectsData.state = "opened";
    }
  }
  if (typeSession == "BROWSER") {
    if (browserData.state == "not opened") {
      if (!fs.existsSync(sessionBrowserFilePath()))
        fs.writeFileSync(sessionBrowserFilePath(), JSON.stringify(sessionBrowserDefaultData, null, "	"), { encoding: "utf8" });
      browserData.data = JSON.parse(fs.readFileSync(sessionBrowserFilePath(), "utf8"));
      browserData.state = "opened";
    }
  }
}
function compressSession(projects) {
  for (const key in projects) {
    projects[key].folders.forEach((folder) => {
      folder.files = folder.files.filter((file) => file.markID != defaults.unmarkedMarkID || file.isPinned);
      if (folder.files.length == 0) {
        if (!folder.isOpened)
          folder.isEmpty = true;
      } else {
        folder.isEmpty = false;
      }
    });
    if (projects[key].folders.length == 1) {
      projects[key].folders[0].isEmpty = false;
    }
    if (projects[key].folders.length > 1) {
      projects[key].folders = projects[key].folders.filter((folder) => !folder.isEmpty);
    }
  }
  return JSON.stringify(projects, null, "	");
}
const api = {
  validate: (path2) => {
    return path2.replaceAll(settings.win32separator, settings.actualSeparator);
  },
  choosingAFileName: (file) => {
    let postfix = `${settings.dublicateFilePostfix} ${(/* @__PURE__ */ new Date()).toLocaleString().replaceAll(/[:.]/g, "-").replaceAll(/[,]/g, "")}`;
    let fileNewName = file.name.slice(0, 255 - 5 - postfix.length - file.format.length);
    return { name: `${fileNewName} ${postfix}`, format: `${file.format}`, fullName: `${fileNewName} ${postfix}.${file.format}` };
  },
  writeFile: (filePath, data) => {
    return fs.writeFile(path.resolve(filePath), data, { encoding: "utf8" });
  },
  getFileFullnames: (folderPath) => {
    if (!api.folderIsExist(folderPath)) return;
    return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name);
  },
  getFilenames: (InPath) => {
    if (!api.folderIsExist(InPath)) return;
    let files = fs.readdirSync(path.resolve(InPath));
    let result = [];
    files.forEach((file) => {
      result.push({
        name: path.basename(path.join(InPath, file), path.extname(path.join(InPath, file))),
        format: path.extname(path.join(InPath, file))
      });
    });
    return result;
  },
  renameFile: (folderPath, oldFileName, newFileName) => {
    return fsPromises.rename(path.resolve(path.join(folderPath, oldFileName)), path.resolve(path.join(folderPath, newFileName))).then(
      (resolve) => {
        return newFileName;
      }
    ).catch(
      (error) => {
        return false;
      }
    );
  },
  deleteFile: (folderPath, fileFullname) => {
    return fsPromises.stat(path.resolve(path.join(folderPath, fileFullname))).then(
      (stats) => {
        console.log("stats: ");
        console.log(stats);
        if (stats.isFile())
          return fsPromises.unlink(path.resolve(path.join(folderPath, fileFullname))).then(
            (resolve) => {
              return fileFullname;
            }
          ).catch(
            (error) => {
              return false;
            }
          );
        if (stats.isDirectory())
          return false;
      }
    ).catch(
      (error) => {
        console.log("error: ");
        console.log(error);
        return false;
      }
    );
  },
  copyFile: (srcFolderPath, destFolderPath, file) => {
    let fileSrcFullname = `${file.name}.${file.format}`;
    let fileNewFullName = api.choosingAFileName(file);
    return fsPromises.copyFile(path.resolve(path.join(srcFolderPath, fileSrcFullname)), path.resolve(path.join(destFolderPath, fileNewFullName.fullName)), fs.constants.COPYFILE_EXCL).then((resolve) => {
      return fileNewFullName;
    }).catch((err) => {
      return false;
    });
  },
  moveFileTo: (folderPathSrc, folderPathDest, file) => {
    if (folderPathSrc == folderPathDest) return false;
    file.fullName = `${file.name}.${file.format}`;
    let fileNewFullname = `${file.name}.${file.format}`;
    if (fs.existsSync(path.resolve(path.join(folderPathDest, file.fullName))))
      fileNewFullname = api.choosingAFileName(file);
    return fsPromises.rename(path.resolve(path.join(folderPathSrc, file.fullName)), path.resolve(path.join(folderPathDest, fileNewFullname))).then(
      (resolve) => {
        return fileNewFullname;
      }
    ).catch(
      (error) => {
        return false;
      }
    );
  },
  isFileAsync: function(folderPath, fileFullname) {
    return fsPromises.stat(path.resolve(path.join(folderPath, fileFullname))).then(
      (stats) => {
        if (stats.isFile())
          return fileFullname;
        if (stats.isDirectory())
          return false;
      }
    ).catch(
      (error) => {
        console.log("error: ");
        console.log(error);
        return false;
      }
    );
  },
  convertPathToUrl: (path2) => {
    return pathToFileURL(path2, { windows: true });
  },
  getFolderNames: (folderPath, cnst) => {
    if (cnst != "dont check for existence" || cnst == void 0) {
      if (!api.folderIsExist(folderPath))
        return;
    }
    if (folderPath == "") {
      return fs.readdirSync(path.parse(process.cwd()).root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    } else {
      return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    }
  },
  getPathSpecialFolder: () => {
    if (process.platform === "win32") {
      return api.validate(process.env.USERPROFILE).substring(2);
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
    if (api.folderIsExist(path.join(InPath, folderName))) {
      if (folderName == "") InPath += Math.floor(Math.random() * 1e7);
      if (folderName) folderName += Math.floor(Math.random() * 1e7);
    }
    try {
      fs.mkdirSync(path.resolve(path.join(InPath, folderName)));
      if (folderName == "") return api.validate(InPath);
      if (folderName) return api.validate(path.join(InPath, folderName));
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  renameFolder: (dat) => {
    let newPath = path.join(dat.fullpath.substring(0, dat.fullpath.lastIndexOf("/")), dat.newName);
    try {
      fs.renameSync(path.resolve(dat.fullpath), path.resolve(newPath));
      return api.validate(newPath);
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  deleteFolder: (folderPath) => {
    return fsPromises.rmdir(path.resolve(folderPath), { recursive: true, force: true }).then(
      (resolve) => {
        return api.validate(folderPath);
      }
    ).catch(
      (error) => {
        return false;
      }
    );
  },
  copyFolder: (folderPathSrc, folderPathDest) => {
    if (!api.folderIsExist(folderPathSrc) && folderPathSrc == folderPathDest) return false;
    return fsPromises.cp(folderPathSrc, folderPathDest, { recursive: true }).then(
      (resolve) => {
        return api.validate(folderPathSrc);
      }
    ).catch(
      (error) => {
        return false;
      }
    );
  },
  moveFolder: (folderPathSrc, folderPathDest) => {
    if (folderPathSrc == folderPathDest) return false;
    return fsPromises.rename(folderPathSrc, folderPathDest).then(
      (resolve) => {
        return api.validate(folderPathSrc);
      }
    ).catch(
      (error) => {
        return false;
      }
    );
  },
  folderIsExist: (folderPath) => {
    return fs.existsSync(path.resolve(folderPath));
  },
  checkUniqueFolderName: (path2) => {
    let result = api.folderIsExist(path2);
    let today = (/* @__PURE__ */ new Date()).toLocaleString().replaceAll(/[:.]/g, "-").replaceAll(/[,]/g, "");
    if (!result) {
      return api.validate(path2);
    } else {
      return api.validate(path2.slice(0, 255 - 3 - today.length) + " " + today);
    }
  },
  getFileMeta: (InPath, fileFullname) => {
    let fileStats = {
      // created: null, 
      // createdMS: null, 
      // lastEdited: null, 
      // lastEditedMS: null, 
      // size: null
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
          result1 = await fsPromises.writeFile(sessionProjectsFilePath(), sessionProjectClone_json, { encoding: "utf8" });
        } else {
          result1 = void 0;
        }
        if (sessionBrowserClone_json) {
          result2 = await fsPromises.writeFile(sessionBrowserFilePath(), sessionBrowserClone_json, { encoding: "utf8" });
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
