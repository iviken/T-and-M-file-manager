"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
let path = require("path");
const fs = require("fs");
const sessionProjectsFilePath = () => path.join(__dirname, "..", "JSON", "sessionProjects.json");
const sessionBrowserFilePath = () => path.join(__dirname, "..", "JSON", "sessionBrowser.json");
const projectsData = { data: {}, state: "not opened" };
const browserData = { data: {}, state: "not opened" };
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
const api = {
  getFileFullnames: (InPath) => {
    return fs.readdirSync(path.resolve(InPath), { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name);
  },
  getFilenames: (InPath) => {
    let files = fs.readdirSync(path.resolve(InPath));
    let result = [];
    files.forEach((element) => {
      result.push({
        name: path.extname(path.join(InPath, element)),
        format: path.basename(path.join(InPath, element), path.extname(path.join(InPath, element)))
      });
    });
    return result;
  },
  getFolderNames: (folderPath) => {
    return fs.readdirSync(path.resolve(folderPath), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  },
  createFolder: (InPath) => {
    fs.mkdir(path.resolve(path.join(InPath, "new folder")), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Directory created successfully.");
      }
    });
  },
  renameFolder: (InPath, previousName, newName) => {
    fs.rename(path.resolve(path.join(InPath, previousName)), path.resolve(path.join(InPath, newName)), (err) => {
      if (err) {
        console.error(err);
      }
    });
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
  getData: () => {
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
  close: () => electron.ipcRenderer.send("app/close"),
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
