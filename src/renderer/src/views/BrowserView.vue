<script>
import Tree from '../components/Tree.vue'
import Tasks from '../components/Tasks.vue'
import Files from '../components/Files.vue'
import Bar from '../components/Bar.vue'

export default {
    components: {
        Tree, Tasks, Bar, Files
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
                files: {},      //  files:{ID: 'SELECTED/...'}
                defaults:{
                    unmarkedMarkID: 'mark_unmarked'
                },
                metadata: '',
                onFocusFile:{
                    name: '',
                    format: '',
                },
                setCmd: function(cmd){     
                    console.log(cmd)
                    switch(cmd.cmd){

                        case 'clickToFile':                 //  {cmd: 'clickToFile', fileID: file_ID}
                            if(this.files[cmd.fileID] == 'SELECTED') {
                                this.files[cmd.fileID] = ''
                            } else {
                                if( (this.files[cmd.fileID] == '') || (this.files[cmd.fileID] == undefined) ){
                                    this.files[cmd.fileID] = 'SELECTED'
                                }
                            }
                        break

                        case 'pinFiles':                    //  {cmd: 'pinFiles', allFiles: allFiles}
                            cmd.allFiles.forEach(element => {
                                for(let key in this.files){
                                    if( (element.id == key) && (this.files[key] == 'SELECTED') ){
                                        element.isPinned = !element.isPinned
                                        this.files[key] = ''
                                    }
                                }
                            })
                        break

                        case 'unselectAllFiles':            //  {cmd: 'unselectAllFiles'}
                            this.files = {}
                        break

                        case 'startRenameSelectedFiles':    //  {cmd: 'tartRenameSelectedFiles'}
                            for(let key in this.files){
                                this.files[key] = 'RENAME'
                            }
                        break

                        case 'endRenameSelectedFiles':      //  {cmd: 'tartRenameSelectedFiles', name: 'File name'}
                            for(let key in this.files){
                                this.files[key] = ''
                                console.log('cmd: rename files at <BrowserView> : ' + cmd.name)
                            }
                        break

                        case 'setMarkToFiles':             //  {cmd: 'setMarkForFiles', allFiles: allFiles, mark_ID: 'mark_NNN'}
                            cmd.allFiles.forEach(element => {
                                for(let key in this.files){
                                    if( (element.id == key) && (this.files[key] == 'SELECTED') ){
                                        element.markID = cmd.mark_ID
                                        this.files[key] = ''
                                    }
                                }
                            })
                        break

                        case 'deleteMark':                  //  {cmd: 'deleteMark', allFiles: allFiles, marks: marks, mark_ID: markID}
                            if(cmd.mark_ID != this.defaults.unmarkedMarkID){
                                cmd.allFiles.forEach(element => {
                                    if(element.markID == cmd.mark_ID){element.markID = this.defaults.unmarkedMarkID}
                                })
                                delete cmd.marks[cmd.mark_ID]
                            }
                        break

                        case 'switchFolderInTree':          //  {cmd: 'switchFolderInTree', name: dat.name, path: dat.path}
                            //  Обработка и чтение файлов в новом каталоге
                            
                        break

                        case 'renameMark - end':            //  {cmd: 'renameMark - end', descr: 'Some text...' marks: marks, mark_ID: markID}
                            cmd.marks[cmd.mark_ID].descr = cmd.descr
                        break
                    }
                }
            },
            localState:{
                showTreePanel: false,
                showTasksPanel: true,
                activeFolderIndex: 0,
                metadataIsHidden: true,
                showFilesFromAllFoldersOption: false,
            },
            tree:{},
            data: {},
            fullData: {},
            sessionData: {},
        }
    },
    methods: {
        ctrlKey:function(dat){
            // console.log("CTRL")
            this.localState.metadataIsHidden = dat == 'CTRL_down' ? false : this.localState.metadataIsHidden
            this.localState.metadataIsHidden = dat == 'CTRL_up' ? true : this.localState.metadataIsHidden
        },
        getAllFiles(){
            let allFiles_ = []
            for (const key in this.data.folders) {
                allFiles_ = allFiles_.concat(this.data.folders[key].files)
            }
            return allFiles_
        }
    },
    beforeMount() {
        this.getProject()

        this.tree = window.api.getTree()
    },
    mounted(){
        this.$nextTick(function () {
            window.addEventListener("keydown", e => {
                if(e.key=='Control'){ this.ctrlKey('CTRL_down') }
            })
            window.addEventListener("keyup", e => {
                if(e.key=='Control'){ this.ctrlKey('CTRL_up') }
            })
        })
    },
    beforeUpdate(){
            this.getProject()
    },
    methods:{
        getProject(){
            if(this.sessionType == 'SESSION'){
                this.fullData = window.api.getSessionData()
            }
            if(this.sessionType == 'PROJECTS'){
                this.fullData = window.api.getData()
            }
            //  Searching in project status 'opened' for open project
            for (const key in this.fullData) {
                //  Open project
                if(this.fullData[key].meta.status == 'opened'){
                    this.data = this.fullData[key]
                    //  Search opened folder in project
                    this.fullData[key].folders.forEach((element, index) => {
                        if(element.isOpened == 'opened'){this.localState.activeFolderIndex = index}
                    })
                    break
                }
                // }else{
                //     //  Or open folders session (id: proj_default)
                //     this.data = window.api.getSessionData()
                // }
            }
        },
    }
}
</script>

<template>

    <div class="on-col component">

        <!-- <div v-if="sessionType == 'PROJECTS'" class="header-name uppercase">
            <span class="header">{{ data.meta.name }}</span>
        </div>
        
        <div v-if="sessionType == 'SESSION'" class="header-name uppercase">
            <span class="header uppercase">BROWS</span>
            {{ data.folders[localState.activeFolderIndex].path.split('/')[ data.folders[localState.activeFolderIndex].path.split('/').length - 1 ] }}
        </div> -->

        <Bar :stateFiles="stateFiles" :localState="localState" :marks="data.marks" :folders="data.folders" />

        <div class="page on-row h100">

            <div class="section-left h100">
                <Tasks v-if="localState.showTasksPanel" :data="data.tasks" />
                <Tree v-if="localState.showTreePanel && !localState.showFilesFromAllFoldersOption" :tree="tree" :path="data.folders[localState.activeFolderIndex].path" />
            </div>

            <div class="section-right">
                <div v-if="!localState.showFilesFromAllFoldersOption" class="h100">
                    <Files :files="data.folders[localState.activeFolderIndex].files" :marks="data.marks" :state="stateFiles" />
                </div>
                <div v-else class="h100">
                    <Files :files="getAllFiles()" :marks="data.marks" :state="stateFiles" />
                </div>
            </div>

        </div>

    </div>
    
</template>

<style scoped lang="scss">
    $left-indent: 200px;
    $width-tasks-and-marks-field: 620px;
    
    .page{
        background: var(--grad-center);
    }
    .section-left{
        width: calc( $width-tasks-and-marks-field - $left-indent );
        padding-left: $left-indent;
    }
    // .component{
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

<style>
  :root{
      --top-indent: 80px;
      --width-tasks-and-marks-field: 620px;
  }
</style>