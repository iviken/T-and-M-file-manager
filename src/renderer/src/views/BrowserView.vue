<script>
import Tree from '../components/Tree.vue'
import Tasks from '../components/Tasks.vue'
import Bar from '../components/Bar.vue'
import AccordionFiles from '../components/Accordion.vue'

import { filesMethods } from '../lib/files.js'
import { marksMethods } from '../lib/marks.js'
import { folders } from '../lib/folders.js'

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
            data: {},
            fullData: {},
            // refreshFilesQueueLOG: {deletedIrrelevant: [], foundAndAdded: []},
            filesMethods: null,
            marksMethods: null,
            foldersMethods2: null,
            stateFiles:{
                files: {},                  //  {ID_file_1: 'SELECTED', ID_file_12: 'SELECTED'}
                imageViewerPullFiles: {},   //  pull images files for viewer
                pathsOfOpenedFolders: [],   //
                numberOfSelectedFiles: 0,
                defaults:{
                    unmarkedMarkID: 'mark_unmarked'
                },
                onFocusFile:{
                    metadata: '',               //  metadata hovered file
                    name: '',
                    format: '',
                },
            },
            localState:{
                showTreePanel: false,
                showTasksPanel: true,
                activeFolderIndex: 0,
                metadataIsHidden: true,
                showFilesFromAllFoldersOption: false,
                showImageViewer: false,
                actualSessionType: '',                  //
                renamigMark: false,
            },
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
        }
    },

    methods: {

        showMeta:function(dat){

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

        getProject(){

            console.log('get proj');
            

            if(this.sessionType == 'SESSION'){

                this.fullData = window.api.getSessionData()
                
                this.localState.actualSessionType = 'SESSION'       //  browser session
            }
            if(this.sessionType == 'PROJECTS'){

                this.fullData = window.api.getProjectData()
                
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
                    // let isAtLeatOneFolderOpen = false
                    // //  Search opened folder in project
                    // this.fullData[key].folders.forEach((folder, index) => {
                    //     if(folder.isOpened){
                    //         //  Opened folder index for Accordion component :files
                    //         this.localState.activeFolderIndex = index
                    //         //
                    //         isAtLeatOneFolderOpen = true
                    //         // console.log('folder opened: ' + folder.path)
                    //     }
                    // })
                    // //  Reset opened folder index if is all folders closed
                    // if( !isAtLeatOneFolderOpen ){
                    //     this.localState.activeFolderIndex = 0
                    //     this.fullData[key].folders[0].isOpened = true
                    // }
                    // break
                }
            }
            //
            // this.refreshFiles()
            //
            this.resetStateFiles()
            //
            this.init()
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
            this.stateFiles.pathsOfOpenedFolders = []
        },

        init(){

            this.foldersMethods2 = folders
            this.foldersMethods2.init( {folders: this.data.folders, localState: this.localState} )
            //
            this.filesMethods = filesMethods
            this.filesMethods.localState = this.localState
            this.filesMethods.stateFiles = this.stateFiles

            this.filesMethods.init( this.data )
        
            this.filesMethods.resetStateAllFiles()
            //
            this.marksMethods = marksMethods
            this.marksMethods.stateFiles = this.stateFiles
            this.marksMethods.marks = this.data.marks
        },
    },

    beforeMount() {

        console.log(this.sessionType);
        //
        this.getProject()
        //
        // this.init()

        console.log(this.data)
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
        if( this.localState.actualSessionType != this.sessionType )
            this.getProject()
    },
}
</script>

<template>

    <div class="on-col focus" @keyup.space="imageViewer()" @keyup.f5="foldersMethods2.refreshFiles()" tabindex="0">

        <!-- <div v-if="sessionType == 'PROJECTS'" class="header-name uppercase">
            <span class="header">{{ data.meta.name }}</span>
        </div>
        
        <div v-if="sessionType == 'SESSION'" class="header-name uppercase">
            <span class="header uppercase">BROWS</span>
            {{ data.folders[localState.activeFolderIndex].path.split('/')[ data.folders[localState.activeFolderIndex].path.split('/').length - 1 ] }}
        </div> -->

        <Bar :stateFiles="stateFiles" :localState="localState" :foldersMethods2="foldersMethods2" :marks="data.marks" :marksMethods="marksMethods" :filesMethods="filesMethods" :folders="data.folders" :inputSettings="settings" />

        <div class="page">

            <div :class="{collapse: localState.showImageViewer}" class="on-row">

                <div class="left-field w100"></div>
                
                <div class="page-block on-row w100">
                
                    <div class="section-left">
                        <Tasks v-if="localState.showTasksPanel" :data="data.tasks" class="component" />

                        <Tree v-if="localState.showTreePanel && !localState.showFilesFromAllFoldersOption"  :foldersMethods2="foldersMethods2" :filesMethods="filesMethods" :path="data.folders[localState.activeFolderIndex].path" :folders="data.folders" :inputSettings="settings"  :dataSettings="data.parameters" :localState="localState" :projectID="data.id" class="component" />
                    </div>
                    
                    <div class="section-right h100">
                
                        <div v-if="!localState.showFilesFromAllFoldersOption" class="h100">
                            
                            <div class="w100 h100 on-row">
                                <div>
                                    <AccordionFiles :localState="localState" :filesMethods="filesMethods" :files="data.folders[localState.activeFolderIndex].files" :marks="data.marks" :viewMode="'text'" :state="stateFiles" :inputSettings="data.parameters" class="text-files-component component" />
                                </div>
                                <div>
                                    <AccordionFiles :localState="localState" :filesMethods="filesMethods" :files="data.folders[localState.activeFolderIndex].files" :marks="data.marks" :viewMode="'imgs'" :state="stateFiles" :inputSettings="data.parameters" class="image-files-component component" />
                                </div>
                            </div>
                
                        </div>
                
                        <div v-else class="h100">
                            
                            <div class="w100 h100 on-row">
                                <div>
                                    <AccordionFiles :localState="localState" :filesMethods="filesMethods" :files="getAllFiles()" :marks="data.marks" :viewMode="'text'" :state="stateFiles" :inputSettings="data.parameters" class="text-files-component component" />
                                </div>
                                <div>
                                    <AccordionFiles :localState="localState" :filesMethods="filesMethods" :files="getAllFiles()" :marks="data.marks" :viewMode="'imgs'" :state="stateFiles" :inputSettings="data.parameters" class="image-files-component component" />
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
    .section-left{
        background: var(--grad-section-left1), var(--grad-section-left2);
    }
    .text-files-component{
        background: var(--grad-section-right-text-files);
    }
    .image-files-component{
        background: var(--grad-section-right-image-files);
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