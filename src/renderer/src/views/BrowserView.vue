<script>
import Tree from '../components/Tree.vue'
import Tasks from '../components/Tasks.vue'
import Bar from '../components/Bar.vue'
import AccordionFiles from '../components/Accordion.vue'

import { filesMethods } from '../lib/files.js'
import { marksMethods } from '../lib/marks.js'
import { folders } from '../lib/folders.js'

import { settings } from '../lib/settings.js'

export default {
    components: {
        Tree, Tasks, Bar, AccordionFiles
    },

    props:{
        sessionType:{       //  
            type: String,
            required: true
        }
    },

    data(){
        return{
            data: {},
            fullData: {},
            settings: settings,
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
                    unmarkedMarkID: 'mark_unmarked' //
                },
                onFocusFile:{
                    metadata: {
                        created: '',
                        lastEdited: '',
                        size: '',
                    },               //  metadata hovered file
                    name: '',
                    format: '',
                },
            },
            localState:{
                showTreePanel: false,
                showTasksPanel: true,
                activeFolderIndex: 0,
                metadataIsHidden: true,
                showImageProcessor: false,
                showFilesFromAllFoldersOption: false,
                showImageViewer: false,
                actualSessionType: '',                  //
                renamigMark: false,
                hideTabs: false,                        //  Скрывать при нажатии F3 на малых форматах экрана (для отображения строки поиска вместо вкладок)
            },
            imageViewerData:{
                countImages: 0,
                imageBoxClassName: null,
            },
            imageProcessorData:{},          //  show only if image viewer showing
        }
    },

    methods: {

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

            if(this.sessionType == 'SESSION'){

                this.fullData = window.api.getSessionData()
                
                this.localState.actualSessionType = 'SESSION'       //  browser session
            }
            if(this.sessionType == 'PROJECTS'){

                this.fullData = window.api.getProjectData()
                
                this.localState.actualSessionType = 'PROJECTS'       //  project session
            }
            // console.log('session type: ' + this.sessionType)
            // console.log(this.fullData)
            //  Searching in project status 'opened' for open project
            for (const key in this.fullData) {
                //  Open project
                if(this.fullData[key].meta.status == 'opened'){
                    //  Set actual project data (one opened project)
                    this.data = this.fullData[key]
                }
            }
            //
            this.resetStateFiles()
            //
            this.init()
        },

        imageViewer(){
            // console.log('view')
            
            this.stateFiles.imageViewerPullFiles = {}
            
            let filePullIsEmpty = true

            //  reset
            this.imageViewerData.countImages = 0
            
            this.data.folders.forEach(folder => {
                folder.files.forEach(file => {
                    for(let key in this.stateFiles.files){

                        if( (file.id == key) && (this.stateFiles.files[key] == 'SELECTED') && (filesMethods.isAPicture(file)) ){

                            this.stateFiles.imageViewerPullFiles[key] = file

                            this.imageViewerData.countImages++

                            filePullIsEmpty = false
                        }
                    }
                })
            })
            //
            if(!filePullIsEmpty)
                //
                this.imageViewerData.imageBoxClassName = this.imageViewerData.countImages < 3 ? this.imageViewerData.countImages : 'MANY'

            // console.log(filePullIsEmpty)
            // console.log(this.stateFiles.imageViewerPullFiles)
            // console.log(this.imageViewerData.countImages)
                
            return !filePullIsEmpty
                // this.localState.showImageViewer = !this.localState.showImageViewer
            // }
        },

        resetStateFiles(){
            this.stateFiles.pathsOfOpenedFolders = []
        },

        init(){

            this.foldersMethods2 = folders
            this.foldersMethods2.init( {folders: this.data.folders, localState: this.localState, parameters: this.data.parameters} )
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

        showSearchPanel(){

            if(window.outerWidth != window.screen.width)
                this.localState.hideTabs = !this.localState.hideTabs
        },

        spaceKey(cnst, e){
            
            if(e.target.nodeName == 'INPUT') return

            if(this.localState.renamigMark) return

            //  reset default events reaction
            e.preventDefault()

            //      imageViewer
            if(cnst == 'keyup'){

                let selectedImages = this.imageViewer()

                if(selectedImages > 0)
                    this.localState.showImageViewer = !this.localState.showImageViewer

                //  show image processor (for single image only)
                if(selectedImages == 1)
                    this.localState.showImageProcessor = !this.localState.showImageProcessor

                //  hide metadata file
                this.localState.metadataIsHidden = true
            }

            //   show metadata file
            if(!this.localState.showImageViewer)
                if(cnst == 'keydown')
                    if(this.localState.metadataIsHidden)
                        this.localState.metadataIsHidden = false
        },
    },

    beforeMount() {
        // console.log(this.sessionType)
        //
        this.getProject()

        // console.log(this.data)
    },

    mounted(){
        this.$nextTick(function () {

            window.addEventListener('resize', (e) => {

                //  hide folders tabs to show seacrh panel
                if(window.outerWidth == window.screen.width)
                    this.localState.hideTabs = false
            })

            window.addEventListener("keydown", e => {
                
                //  show metadata file
                // if(e.key == 'Shift')

                //     // if(this.imageViewerData.countImages > 0)
                //         // this.localState.showImageViewer =

                //     if(!this.localState.showImageViewer)
                //         if(e.target.nodeName != 'INPUT')
                //             if(!this.localState.renamigMark){
                                
                //                 e.preventDefault()
                //                 this.showMetadata('show meta')
                //                 // console.log('space')
                //             }

                //
                if(e.key == ' ')
                    this.spaceKey('keydown', e)
            })

            window.addEventListener("keyup", e => {
                // console.log(e.target.nodeName)
                //  hide metadata file
                // if(e.key == 'Shift')
                //     if(!this.localState.showImageViewer){
                //         if(e.target.nodeName != 'INPUT')
                //             if(!this.localState.renamigMark){

                //                 e.preventDefault()
                //                 this.showMetadata('hide meta')
                //             }
                //     }else{

                //         e.preventDefault()
                //         this.imageViewer()
                //     }

                //
                if(e.key == ' ')
                    this.spaceKey('keyup', e)

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

    <div 
        @keyup.f5="foldersMethods2.refreshFiles()" 
        @keyup.f3="showSearchPanel()" 
        @keyup.ctrl.f="showSearchPanel()" 
        class="on-col focus" 
        tabindex="0"
    >

        <!-- <div v-if="sessionType == 'PROJECTS'" class="header-name uppercase">
            <span class="header">{{ data.meta.name }}</span>
        </div>
        
        <div v-if="sessionType == 'SESSION'" class="header-name uppercase">
            <span class="header uppercase">BROWS</span>
            {{ data.folders[localState.activeFolderIndex].path.split('/')[ data.folders[localState.activeFolderIndex].path.split('/').length - 1 ] }}
        </div> -->

        <Bar :stateFiles="stateFiles" :localState="localState" :foldersMethods2="foldersMethods2" :marks="data.marks" :marksMethods="marksMethods" :filesMethods="filesMethods" :folders="data.folders" class="bar-component"/>

        <div :class="`${localState.actualSessionType}-page`">

            <div :class="{collapse: localState.showImageViewer}" class="on-row">

                <div class="left-field w100"></div>
                
                <div class="page-block on-row w100">

                    <!-- section left: tasks and folders tree -->
                
                    <div class="tasks-and-tree">
                        <Tasks v-if="localState.showTasksPanel" :data="data.tasks" class="component tasks" />

                        <Tree v-if="localState.showTreePanel && !localState.showFilesFromAllFoldersOption"  :foldersMethods2="foldersMethods2" :filesMethods="filesMethods" :path="data.folders[localState.activeFolderIndex].path" :folders="data.folders"  :dataSettings="data.parameters" :localState="localState" :projectID="data.id" class="component tree" />
                    </div>

                    <!-- section right: files -->
                    
                    <div class="section-right h100">

                        <!-- selected (opened) folder -->
                
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

                        <!-- all folders -->
                
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

            <!-- image viewer -->

            <div v-if="localState.showImageViewer" class="component image-viewer on-center">
                <div :class="`images-block-${imageViewerData.imageBoxClassName}`" class="images-block on-row w100 h100">

                    <div v-for="pix in stateFiles.imageViewerPullFiles" class="image-viewer-box">

                    <!-- <div v-for="pix in stateFiles.imageViewerPullFiles" 
                        :style="`height: ${ 100/() }%; width: ${}%;`" 
                        class="image-viewer-box"> -->

                        <img :src="`${pix.path}/${pix.name}.${pix.format}`" class="w100 h100">

                    </div>

                </div>
            </div>

        </div>

    </div>
    
</template>

<style scoped lang="scss">

    .bar-component{
    }

    .PROJECTS-page{
        background: var(--grad-page-PROJECTS);
    }

    .SESSION-page{
        background: var(--grad-page-SESSION);
    }

    .page-block{
        -webkit-mask-image: -webkit-gradient(linear, left 90%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
    }

    .left-field{
        background: var(--grad-left-field);
    }
    .tasks-and-tree{
        background: var(--grad-tasks-and-tree-2), var(--grad-tasks-and-tree-3);
    }
    .text-files-component{
        background: var(--grad-text-files-1), var(--grad-text-files-2);
    }
    .image-files-component{
        background: var(--grad-images-files-1);
    }
    .right-fiels{
        // background: var(--grad-right-field);
    }

    .component{
        height: calc( 100vh - var(--header-heigth) - var(--content-indent) - var(--pin-indent-bottom) + 10px );
    }

    @media screen and (min-width: 1501px) {     //  fullscreen
        
        .page-block{
            width: 1500px;
        }
        .tasks-and-tree{
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
        .tasks-and-tree{
            width: 300px;
        }
        .text-files-component{
            width: 280px;
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
        .tasks-and-tree{
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

    .image-viewer{}

    .images-block-1 > div{
        height: 100%;
        width: 100%;
    }

    .images-block-2 > div{
        height: auto;
        width: 50%;
    }

    .images-block-3 > div, .images-block-4 > div{
        height: 50%;
        width: auto;
        flex-wrap: wrap;
    }

    .images-block-MANY > div{
        height: 33%;
        width: auto;
        flex-wrap: wrap;
    }
    // .images-block-2, .images-block-3, .images-block-4, .images-block-MANY{
    //     justify-content: space-between;
    // }
    .images-block{
        justify-content: space-between;
    }

    .image-viewer-box{
        margin: 20px;
    }

    .collapse{
        display: none;
    }

    .focus:focus{
        outline: none;
    }
</style>