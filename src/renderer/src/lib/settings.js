export const settings = {

    //  FOLDERS

    folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
    win32separator: '\\',
    actualSeparator: '/',
    excludedFolders: ['Recovery', 'System Volume Information', 'PerfLogs', 'Config.Msi', '$SysReset', '$Recycle.Bin', 'OneDriveTemp'],
    excludedFiles: ['desktop.ini'],
    maxTabs: 10,                                //  max Folders On Bar
    forcedFolderUpdate: false,                  //  Принудительное обновление каталогов при каждом переходе или операции
    lengthOfTheLastPartOfTheFolderName: 6,      //  Длинна последней части имени каталога, если его имя слишком длинное и вылезает за границу
    
    //  TREE

    replacedSymbolPath: ' > ',
    folderNameMaxLength: 30,
    addressBarFolderNameMaxLength: 10,    //  pick up

    //  FILES

    fileImgMask: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'bmp', 'BMP', 'svg', 'SVG', 'ico', 'ICO', 'tiff', 'TIFF', 'webp', 'eps', 'EPS'],
    fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,

    //  FILE COMPONENT

    fileNameMaxLength: 25,
    lengthOfTheLastPartOfTheFileName: 8,    //  Длинна последней части имени файла, если его имя слишком длинное и вылезает за границу

    //  BAR

    MaxLenghtOfMarkName: 15,
    maxMarksOnBar: 5,
    maxFoldersOnBar: 6,
    availableMarkColors: ['red', 'green', 'yellow', 'ocean', 'blue', 'orange'],
    rootFolderTabName: 'root C',
    tabsFolderNameMaxLength: 16,
    searchFilesByFormatMask: '.',

    //  <BROWSER VIEW>

    imageZoomStep: 25,
    minimumImagePreviewSize: 50,
    maximumImagePreviewSize: 375,
    SESSION:{
        showPinFolders: true,
        showCloudsStorageBtns: true,
        showSpecialFoldersBtns: true,
        showSessionFolders: false,
        openPreviousFolderAfterClosingActiveOne: false,
        resettingSelectedFilesAfterSwitchingToAnotherFolder: true,
    },
    PROJECTS:{
        showPinFolders: false,
        showCloudsStorageBtns: true,
        showSpecialFoldersBtns: true,
        showSessionFolders: true,
        openPreviousFolderAfterClosingActiveOne: false,
        resettingSelectedFilesAfterSwitchingToAnotherFolder: true,
    },
}

//  

export const defaults = {
    defaultMarksColor: 'default-color',
    unmarkedColor: 'unmarked-color',
    unmarkedMarkID: 'mark_unmarked',
}