export const settings = {

    //  backend

    productName: 'M and T file manager',

    sessionsPath: 'C:/Users/Nike/AppData/Roaming/iviken/MandT file manager',
    sessionProjectsFile: 'sessionProjects.json',
    sessionBrowserFile: 'sessionBrowser.json',
    // sessionsPath: `'C:/Users/Nike/AppData/Roaming/'${settings.productName.replace(settings.folderNameRegexp, '')}`,
    dublicateFilePostfix: 'copy',               //  filename after copy / move: SrcName [dublicateFilePostfix] [today]

    //  defaut sessions

    initPath: '/Temp',                          //  First opened folder during initialization (first starting app)

    //  FOLDERS

    excludedFolders: ['Recovery', 'System Volume Information', 'PerfLogs', 'Config.Msi', '$SysReset', '$Recycle.Bin', 'OneDriveTemp'],
    folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,     //  Folder name filter
    win32separator: '\\',
    actualSeparator: '/',
    excludedFiles: ['desktop.ini'],
    maxTabs: 10,                                //  max Folders On Bar
    forcedFolderUpdate: false,                  //  Принудительное обновление каталогов при каждом переходе или операции
    lengthOfTheLastPartOfTheFolderName: 6,      //  Длинна последней части имени каталога, если его имя слишком длинное и вылезает за границу
    
    //  TREE

    replacedSymbolPath: ' > ',                  //  Separator in address bar (in folders tree)
    folderNameMaxLength: 30,                    //
    addressBarFolderNameMaxLength: 10,          //  Folder name max length in tab

    //  FILES

    fileImgMask: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'bmp', 'BMP', 'ico', 'ICO', 'tiff', 'TIFF', 'webp', 'WEBP', 'eps', 'EPS'],
    futureFileImgMask: ['svg', 'SVG'],          //  TO DO
    fileVideoMask: [],
    fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,       //  Filename filter

    //  FILE COMPONENT

    fileNameMaxLength: 25,                      //  File name max length
    lengthOfTheLastPartOfTheFileName: 8,        //  Длинна последней части имени файла, если его имя слишком длинное и вылезает за границу

    //  BAR

    availableMarkColors: ['default', 'red', 'green', 'yellow', 'ocean', 'blue', 'orange'],
    MaxLenghtOfMarkName: 15,                    //  
    maxMarksOnBar: 5,
    maxFoldersOnBar: 6,
    rootFolderTabName: 'root C',
    tabsFolderNameMaxLength: 16,
    searchFilesByFormatMask: '.',

    //  <BROWSER VIEW>

    imageZoomStep: 25,                          //  step size (px) for image preview
    minimumImagePreviewSize: 50,
    maximumImagePreviewSize: 350,
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
    defaultMarksColor: 'default',               //  Цвет вновь созданной маркировки
    unmarkedColor: 'unmarked-color',            //  Цвет нулевой маркировки (группа непромаркированных файлов)
    unmarkedMarkID: 'mark_unmarked',            //  id ~
}