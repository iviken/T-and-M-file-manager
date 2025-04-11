<script>
import Tree from '../components/Tree.vue'
import Tasks from '../components/Tasks.vue'
import Bar from '../components/Bar.vue'
import AccordionFiles from '../components/Accordion.vue'

import { filesMethods } from '../lib/files.js'
import { marksMethods } from '../lib/marks.js'
import { foldersMethods } from '../lib/folders.js'

export default {
    components: {
        Tree, Tasks, Bar, AccordionFiles
    },
    props:{
        sessionType:{    
            type: String,
            required: true
        }
    },
    data(){
        return{
            stateFiles:{
                files: {},                  //  {ID_file_1: 'SELECTED', ID_file_12: 'SELECTED'}
                imageViewerPullFiles: {},   //  pull images files for viewer
                pathsOfOpenedFolders: [],   //
                defaults:{
                    unmarkedMarkID: 'mark_unmarked'
                },
                onFocusFile:{
                    metadata: '',               //  metadata hovered file
                    name: '',
                    format: '',
                },
                atLeastOneFileSelected: false,
                numberOfSelectedFiles: 0,
            },
            localState:{
                showTreePanel: false,
                showTasksPanel: true,
                activeFolderIndex: 0,
                previousFolderIndex: 0,
                metadataIsHidden: true,
                showFilesFromAllFoldersOption: false,
                showImageViewer: false,
                actualSessionType: '',                  //
                renamigMark: false,
            },
            data: {},
            fullData: {},
            refreshFilesQueueLOG: {deletedIrrelevant: [], foundAndAdded: []},
            settings:{
                SESSION:{
                    // allowClosingFoldersWithMarkedFiles: true,
                    showPinFolders: true,
                    showCloudsStorageBtns: true,
                    showSpecialFoldersBtns: true,
                    showSessionFolders: false,
                    openPreviousFolderAfterClosingActiveOne: false,
                    resettingSelectedFilesAfterSwitchingToAnotherFolder: true,
                },
                PROJECTS:{
                    // allowClosingFoldersWithMarkedFiles: true,
                    showPinFolders: false,
                    showCloudsStorageBtns: true,
                    showSpecialFoldersBtns: true,
                    showSessionFolders: true,
                    openPreviousFolderAfterClosingActiveOne: false,
                    resettingSelectedFilesAfterSwitchingToAnotherFolder: true,
                },
                imageZoomStep: 25,
                minimumImagePreviewSize: 50,
                maximumImagePreviewSize: 175,
            },
            filesMethods: null,
            marksMethods: null,
            foldersMethods: null,
        }
    },
    methods: {
        showMeta:function(dat){
            // console.log("CTRL")
            this.localState.metadataIsHidden = dat == 'show meta' ? false : this.localState.metadataIsHidden
            this.localState.metadataIsHidden = dat == 'hide meta' ? true : this.localState.metadataIsHidden
        },
        getAllFiles(){
            let allFiles_ = []
            //
            this.localState.pathsOfOpenedFolders = []
            for (const key in this.data.folders) {
                allFiles_ = allFiles_.concat(this.data.folders[key].files)
                //
                this.localState.pathsOfOpenedFolders.push(this.data.folders[key].path)
            }
            return allFiles_
        },
        refreshFiles(){
            //  Is folder exist? Y:
            if( window.api.folderIsExist(this.data.folders[this.localState.activeFolderIndex].path) ){
                //  Get actual files from folder
                let actualFilenamesInTheActiveFolder =  window.api.getFileFullnames( this.data.folders[this.localState.activeFolderIndex].path )
                // console.log(actualFilenamesInTheActiveFolder)
                //  Если есть файлы в (отсканированном) каталоге
                if (actualFilenamesInTheActiveFolder.length > 0 ){
                    //
                    let doesTheFileExist = false
                    //  Сравниваем найденные файлы в каталоге с файлами в базе
                    //      Файлы базы
                    this.data.folders[this.localState.activeFolderIndex].files.forEach( data_element => {
                        doesTheFileExist = false
                        //      Файлы каталога
                        actualFilenamesInTheActiveFolder.forEach( (element, index) => {
                            //  И сравниваем
                            if( `${data_element.name}.${data_element.format}` == element ){
                                //  При совпадении убираем найденный файл каталога из очереди для уменьшения вычислит. нагрузки
                                actualFilenamesInTheActiveFolder.splice( index, 1 )
                                //  Файл существует
                                //      Variable for LOG
                                doesTheFileExist = true
                                //      Undeletion flag
                                data_element.isExist = true
                            }
                        })
                        //  Если не существует
                        if( !doesTheFileExist ) {
                            //  Add to LOG
                            this.refreshFilesQueueLOG.deletedIrrelevant.push( data_element.name.slice() )
                            //
                            data_element.isExist = false
                        }
                    })
                    //  Delete marked files (isExist == false)
                    let arrSize = Number( this.data.folders[this.localState.activeFolderIndex].files.length )
                    //
                    if(arrSize){
                        for(let ch=0; ch<arrSize; ch++){
                            if( !this.data.folders[this.localState.activeFolderIndex].files[ch].isExist ){
                                this.data.folders[this.localState.activeFolderIndex].files.splice( ch, 1 )
                                ch--
                                arrSize--
                            }
                        }
                    }
                    //  Заносим найденные файлы в каталоге в базу
                    actualFilenamesInTheActiveFolder.forEach(element => {
                        this.data.folders[this.localState.activeFolderIndex].files.push(
                            {
                                id: 'fileID_' + Math.floor(Math.random()*10000000), 
                                name: element.slice( 0, element.lastIndexOf('.') ),       //      To Do
                                format: element.slice( element.lastIndexOf('.') + 1 ), 
                                markID: 'mark_unmarked',     
                                isPinned: false, 
                                path: this.data.folders[this.localState.activeFolderIndex].path, 
                                meta: window.api.getFileMeta( this.data.folders[this.localState.activeFolderIndex].path, element )
                            }
                        )
                        //  Add to LOG
                        this.refreshFilesQueueLOG.foundAndAdded.push( element )
                    })
                }else{
                    //  Если нету файлов в каталоге, стираем все из базы
                    this.data.folders[this.localState.activeFolderIndex].files = []
                }
                //
            }else{
                //
                
                //  N:, delete from db
                this.data.folders.splice(this.localState.activeFolderIndex, 1)
            }
            // console.log( this.refreshFilesQueueLOG )
        },
        getProject(){
            if(this.sessionType == 'SESSION'){
                this.fullData = window.api.getSessionData()
                //
                this.localState.actualSessionType = 'SESSION'       //  browser session
            }
            if(this.sessionType == 'PROJECTS'){
                this.fullData = window.api.getProjectData()
                //
                this.localState.actualSessionType = 'PROJECTS'       //  browser session
            }
            // console.log('session type: ' + this.sessionType)
            // console.log(this.fullData)
            //  Searching in project status 'opened' for open project
            for (const key in this.fullData) {
                //  Open project
                if(this.fullData[key].meta.status == 'opened'){
                    //  Set actual project data (one opened project)
                    this.data = this.fullData[key]
                    //
                    let isAtLeatOneFolderOpen = false
                    //  Search opened folder in project
                    this.fullData[key].folders.forEach((folder, index) => {
                        if(folder.isOpened){
                            //  Opened folder index for Accordion component :files
                            this.localState.activeFolderIndex = index
                            //
                            isAtLeatOneFolderOpen = true
                            // console.log('folder opened: ' + folder.path)
                            // this.localState.pathsOfOpenedFolders = [element.path]
                        }
                    })
                    //  Reset opened folder index if is all folders closed
                    if( !isAtLeatOneFolderOpen ){
                        this.localState.activeFolderIndex = 0
                        this.fullData[key].folders[0].isOpened = true
                    }
                    break
                }
                // }else{
                //     //  Or open folders session (id: proj_default)
                //     this.data = window.api.getSessionData()
                // }
            }
            //
            this.refreshFiles()
            //
            this.resetStateFiles()
        },
        imageViewer(){
            //
            this.stateFiles.imageViewerPullFiles = {}
            //
            let filePullIsEmpty = true
            //
            this.data.folders.forEach(folder => {
                folder.files.forEach(file => {
                    for(let key in this.stateFiles.files){
                        if( (file.id == key) && (this.stateFiles.files[key] == 'SELECTED') ){
                            this.stateFiles.imageViewerPullFiles[key] = file
                            //
                            filePullIsEmpty = false
                        }
                    }
                })
            })
            //
            if(!filePullIsEmpty){
                this.localState.showImageViewer = !this.localState.showImageViewer
            }
        },
        resetStateFiles(){
            this.stateFiles.files = {}
            this.stateFiles.pathsOfOpenedFolders = []
            this.stateFiles.atLeastOneFileSelected = false
            this.stateFiles.numberOfSelectedFiles = 0
        },
    },
    beforeMount() {
        //
        this.getProject()
        //
        this.filesMethods = filesMethods
        this.filesMethods.localState = this.localState
        this.filesMethods.stateFiles = this.stateFiles
        this.filesMethods.init( this.data )
        //
        this.marksMethods = marksMethods
        this.marksMethods.stateFiles = this.stateFiles
        this.marksMethods.marks = this.data.marks
        //
        this.foldersMethods = foldersMethods
        this.foldersMethods.folders = this.data.folders
        this.foldersMethods.localState = this.localState
        this.foldersMethods.inputSettings = this.settings
        this.foldersMethods.projectID = this.projectID
    },
    mounted(){
        this.$nextTick(function () {

            window.addEventListener("keydown", e => {
                //  show metadata file
                if(e.key == 'Shift'){
                    if(!this.localState.renamigMark) this.showMeta('show meta') 
                }
            })

            window.addEventListener("keyup", e => {
                //  show metadata file
                if(e.key == 'Shift'){ 
                    if(!this.localState.renamigMark) this.showMeta('hide meta') }
                //  zoom image preview
                if( (e.key == '+') || (e.key == '=')){
                    if(this.data.parameters.imagesHeight < (this.settings.maximumImagePreviewSize - this.settings.imageZoomStep) )
                      this.data.parameters.imagesHeight += this.settings.imageZoomStep 
                }
                if(e.key == '-'){
                    if(this.data.parameters.imagesHeight > (this.settings.minimumImagePreviewSize + this.settings.imageZoomStep) )
                      this.data.parameters.imagesHeight -= this.settings.imageZoomStep 
                }
            })
        })
    },
    beforeUpdate(){
        //
        if( this.localState.actualSessionType != this.sessionType ) this.getProject()
        //
        if( this.localState.activeFolderIndex != this.localState.previousFolderIndex ){
            //
            this.refreshFiles()
            //  Clear selection files queue
            if(this.settings.resettingSelectedFilesAfterSwitchingToAnotherFolder){
                this.stateFiles.files = {}
                this.stateFiles.numberOfSelectedFiles = 0
            }
        }
    },
}
</script>

<template>

    <div class="on-col focus" @keyup.space="imageViewer()" @keyup.f5="refreshFiles()" tabindex="0">

        <!-- <div v-if="sessionType == 'PROJECTS'" class="header-name uppercase">
            <span class="header">{{ data.meta.name }}</span>
        </div>
        
        <div v-if="sessionType == 'SESSION'" class="header-name uppercase">
            <span class="header uppercase">BROWS</span>
            {{ data.folders[localState.activeFolderIndex].path.split('/')[ data.folders[localState.activeFolderIndex].path.split('/').length - 1 ] }}
        </div> -->

        <Bar :stateFiles="stateFiles" :localState="localState" :marks="data.marks" :foldersMethods="foldersMethods" :marksMethods="marksMethods" :filesMethods="filesMethods" :folders="data.folders" :inputSettings="settings" />

        <div class="page">

            <div :class="{collapse: localState.showImageViewer}" class="on-row">

                <div class="left-field w100"></div>
                
                <div class="page-block on-row w100">
                
                    <div class="section-left">
                        <Tasks v-if="localState.showTasksPanel" :data="data.tasks" class="component" />

                        <Tree v-if="localState.showTreePanel && !localState.showFilesFromAllFoldersOption" :foldersMethods="foldersMethods" :filesMethods="filesMethods" :path="data.folders[localState.activeFolderIndex].path" :folders="data.folders" :inputSettings="settings"  :dataSettings="data.parameters" :localState="localState" :projectID="data.id" class="component" />
                    </div>
                    
                    <div class="section-right h100">
                
                        <div v-if="!localState.showFilesFromAllFoldersOption" class="h100">
                            
                            <div class="w100 h100 on-row">
                                <div>
                                    <AccordionFiles :filesMethods="filesMethods" :files="data.folders[localState.activeFolderIndex].files" :marks="data.marks" :viewMode="'text'" :state="stateFiles" :inputSettings="data.parameters" class="text-files-component component" />
                                </div>
                                <div>
                                    <AccordionFiles :filesMethods="filesMethods" :files="data.folders[localState.activeFolderIndex].files" :marks="data.marks" :viewMode="'imgs'" :state="stateFiles" :inputSettings="data.parameters" class="image-files-component component" />
                                </div>
                            </div>
                
                        </div>
                
                        <div v-else class="h100">
                            
                            <div class="w100 h100 on-row">
                                <div>
                                    <AccordionFiles :filesMethods="filesMethods" :files="getAllFiles()" :marks="data.marks" :viewMode="'text'" :state="stateFiles" :inputSettings="data.parameters" class="text-files-component component" />
                                </div>
                                <div>
                                    <AccordionFiles :filesMethods="filesMethods" :files="getAllFiles()" :marks="data.marks" :viewMode="'imgs'" :state="stateFiles" :inputSettings="data.parameters" class="image-files-component component" />
                                </div>
                            </div>
                
                        </div>
                
                    </div>
                    
                </div>
                
                <div class="right-fiels w100"></div>

            </div>

            <div v-if="localState.showImageViewer" class="imageViewer">
                <div class="component imageViewer on-row wrap w100">
                    <div v-for="pix in stateFiles.imageViewerPullFiles" class="h100">
                        <img :src="`${pix.path}/${pix.name}.${pix.format}`">
                    </div>
                </div>
            </div>

        </div>

    </div>
    
</template>

<style scoped lang="scss">

    .page{
        background: var(--grad-center);
        padding-top: var(--content-indent);
    }

    .page-block{
        -webkit-mask-image: -webkit-gradient(linear, left 90%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
    }
    .text-files-component{
        background: var(--grad-text-files-and-tasks);
    }

    .component{
        height: calc( 100vh - var(--header-heigth) - var(--content-indent) - var(--pin-indent-bottom) + 10px );
    }

    @media screen and (min-width: 1501px) {
        
        .page-block{
            width: 1500px;
        }
        .section-left{
            width: 420px;
        }
        .text-files-component{
            width: 280px;
        }
        .image-files-component{
            width: 800px;
            max-width: 800px;
        }
    }
    
    @media screen and (max-width: 1500px) and (min-width: 1001px) {
        
        .page-block{
            width: 1200px;
        }
        .section-left{
            width: 300px;
        }
        .text-files-component{
            width: 200px;
        }
        .image-files-component{
            width: 700px;
            max-width: 700px;
        }
    }
    
    @media screen and (max-width: 1000px) {
        
        .page-block{
            width: 1000px;
        }
        .section-left{
            width: 300px;
        }
        .text-files-component{
            width: 200px;
        }
        .image-files-component{
            width: 100%;
            // max-width: 700px;
        }
        .left-field, .right-fiels{
            width: 0px;
        }
    }

    .imageViewer{
        color:red;
    }

    .collapse{
        // visibility:hidden;
        // visibility: collapse;
        display: none;
    }

    .focus:focus{
        outline: none;
    }

    // ._component{
    //     position: relative;
    // }
    // .header-name{
    //     position: absolute;
    //     z-index: 9999999;
    //     width: 80%;
    //     top: -100px;
    //     left: 160px;
    //     text-align: center;
    // }
</style>