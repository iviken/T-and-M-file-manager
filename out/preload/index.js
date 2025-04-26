"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const { platform } = require("node:process");
const { pathToFileURL } = require("node:url");
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
  win32separator: "\\",
  actualSeparator: "/",
  dublicateFilePostfix: "copy",
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
  copyFile: (srcFolderPath, destFolderPath, fileFullname) => {
    let fileNewName = fileFullname;
    if (srcFolderPath == destFolderPath)
      fileNewName = fileFullname + " " + settings.dublicateFilePostfix;
    while (fs.existsSync(path.resolve(path.join(destFolderPath, fileNewName))))
      fileNewName = fileFullname + " " + settings.dublicateFilePostfix;
    return fsPromises.copyFile(path.resolve(path.join(srcFolderPath, fileFullname)), path.resolve(path.join(destFolderPath, fileNewName)), constants.COPYFILE_EXCL).then((resolve) => {
      return fileName;
    }).catch((err) => {
      return false;
    });
  },
  moveFileTo: (folderPathSrc, folderPathDest, fileFullname) => {
    if (folderPathSrc == folderPathDest) return false;
    api.isFileAsync(folderPathSrc, fileFullname).then(
      (result_fileFullname) => {
        if (result_fileFullname) {
          let fileNewName = fileFullname;
          while (fs.existsSync(path.resolve(path.join(folderPathDest, fileNewName))))
            fileNewName = fileFullname + " " + settings.dublicateFilePostfix;
          return fsPromises.rename(path.resolve(path.join(folderPathSrc, fileFullname)), path.resolve(path.join(folderPathDest, fileNewName))).then(
            (resolve) => {
              return api.validate(fileFullname);
            }
          ).catch(
            (error) => {
              return false;
            }
          );
        } else {
          return false;
        }
      }
    );
  },
  isFileAsync: function(folderPath, fileFullname) {
    return fsPromises.stat(path.resolve(path.join(folderPath, fileFullname))).then(
      (stats) => {
        console.log("stats: ");
        console.log(stats);
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
      return api.validate(path2 + " " + today);
    }
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
