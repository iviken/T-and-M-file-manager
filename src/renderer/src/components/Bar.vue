<script>
export default {
  components:{},
  props:{
    stateFiles:{
        type: Object,
        required: true
    },
    localState:{
        type: Object,
        required: true
    },
    folders:{
        type: Array,
        required: true
    },
    marks:{
        type: Object,
        required: true
    }
  },
  methods: {
    pinFiles: function(){
        if(!this.localState.showFilesFromAllFoldersOption){
            this.stateFiles.setCmd( {cmd: 'pinFiles', allFiles: this.folders[this.localState.activeFolderIndex].files} )
        }else{
            let _allFiles = []
            for (const key in this.folders) {
                _allFiles = _allFiles.concat(this.folders[key].files)
            }
            this.stateFiles.setCmd( {cmd: 'pinFiles', allFiles: _allFiles} )
        }
    },
    switchPannel:function(){
        if(!this.localState.showFilesFromAllFoldersOption){
            this.localState.showTreePanel = !this.localState.showTreePanel
            this.localState.showTasksPanel = !this.localState.showTasksPanel
        }
    },
    newFilesBrowserTab:function(){
        let _id = 'folder_' + Math.floor(Math.random()*10000000)
        let _index = this.folders.length

        this.folders.push(
            {
                id: _id,
                // path: this.folders[this.localState.activeFolderIndex].path,
                path: this.folders[this.localState.activeFolderIndex].path.substring(0, this.folders[this.localState.activeFolderIndex].path.lastIndexOf('/') ),
                // files: [],
                files: [
                    {id: 99999, name: 'some file', format: 'js', markID: 'mark_unmarked', isPinned: false, meta:{created: 156456, lastEdited: 165447, size: 100256}}
                ],
                isOpened: true,
            }
        )
        this.switchToFolder({id: _id, index: _index})
    },
    switchToFolder:function(dat){
        this.localState.activeFolderIndex = dat.index
        this.folders.forEach(element=>{element.isOpened = false})
        this.folders[dat.index].isOpened = true

        this.localState.showFilesFromAllFoldersOption = false
    },
    closeFolder:function(dat){
        if(this.folders.length > 1){
            let checkMarksFilesCounter = 0
            let isDeleteFolder = false
            //  check files to unmarked (--unmarked--)
            this.folders[dat.index].files.forEach(element => {
                if(element.markID != this.stateFiles.defaults.unmarkedMarkID){
                    checkMarksFilesCounter ++
                }
            });
            //  if marked files not found?
            if(checkMarksFilesCounter == 0){
                console.log('folder is empty of marked files. Delete')
                // this.folders.splice(dat.index, 1)
                isDeleteFolder = true
                // console.log(this.folders)
            }
            //  If the paths are the same?
            this.folders.forEach((element, index) => {
                if(element.path == this.folders[dat.index].path){
                    if(dat.index != index){
                        console.log(element.path + ' : ' + this.folders[dat.index].path)
                        console.log('folders match. Delete')
                        isDeleteFolder = true
                    }
                }
            })
            if(isDeleteFolder){
                //  delete folder rom bd
                this.folders.splice(dat.index, 1)
                //  Set focus on first filder
                this.localState.activeFolderIndex = 0
                this.folders[0].isOpened = true
            }
        }
    },
    setMarkToFiles:function(markID){
        // console.log('click to mark: ' + markID)
        if(!this.localState.showFilesFromAllFoldersOption){
            this.stateFiles.setCmd( {cmd: 'setMarkToFiles', allFiles: this.folders[this.localState.activeFolderIndex].files, mark_ID: markID} )
        }else{
            let _allFiles = []
            for (const key in this.folders) {
                _allFiles = _allFiles.concat(this.folders[key].files)
            }
            this.stateFiles.setCmd( {cmd: 'setMarkToFiles', allFiles: _allFiles, mark_ID: markID} )
        }
    },
    newMark:function(dat){},
    unfoldMarks:function(){
        this.state.marksBoxIsFolded = !this.state.marksBoxIsFolded
    },
    shrinkMarkDescription:function(name){
        if(name.length > this.settings.MaxLenghtOfMarkName){
            return `${name.split(' ')[0]} ...${name.split(' ')[ name.split(' ').length - 1 ]}`
        }else{
            return name
        }
    },
    // setSizeMarksBlock:function(){
    //     document.querySelector('._marks-unfolded-block').style.width = document.querySelector('._marks').offsetWidth + 'px'
    //     document.querySelector('._marks-unfolded-block').style.left = document.querySelector('._marks').getBoundingClientRect().left + 'px'
    // },
    deleteMark:function(markID){
        this.stateFiles.setCmd( {cmd: 'deleteMark', allFiles: this.folders[this.localState.activeFolderIndex].files, marks: this.marks, mark_ID: markID} )
    },
    renameMark:function(dat){
        if(dat.state == 'start rename'){
            // this.stateFiles.setCmd( {cmd: 'renameMark - end', descr: dat.descr, marks: this.marks, mark_ID: dat.markID} )
            console.log('ren: '+this.state.markNewName)
        }
        if(dat.state == 'end rename' ){
            console.log('ren:'+dat.data)
            this.state.markNewName = dat.data       //
        }
    },
    converFileSize:function(num){
        let _size = 0
        if( num < 1000000 ){ _size = Math.floor(Number(num) / 1024) + 'Kb' }
        if( num >= 1000000 ){ _size = Math.floor(Number(num) / 1024 / 1024) + 'Mb' }
        
        return _size
    },
    filesFromAllFolders:function(){
        this.localState.showFilesFromAllFoldersOption = true
        this.folders.forEach(element=>{element.isOpened = false})

        //  Отменяет переключение между вкладками задач и маркировки при нахождении в режиме отображ. всех файлов
        if(this.localState.showFilesFromAllFoldersOption){
            this.localState.showTreePanel = false
            this.localState.showTasksPanel = true
        }
    }
    // showMarkFilesEverywhere:function(markID){
    //     this.marks[markID].show = 
    // },
  },
  mounted(){
    this.$nextTick(function () {
        // Проверка ширины элемента после обновления
        // this.setSizeMarksBlock()
    });
  },
  data(){
    return{
        settings:{
            MaxLenghtOfMarkName: 15,
            maxMarksOnBar: 5,
        },
        state:{
            marksBoxIsFolded: true,
            markNewName: 'create new mark',
            showTextarea: false,
        },
    }
  }
}
</script>

<template>
    <div class="bar on-center">

        <div v-if="localState.metadataIsHidden" class="on-row">

            <div class="_marks on-row">
                <div @click="unfoldMarks()" class="item">V</div>
                <div class="on-row">
                    <div @click="newMark({type: 'uncolored'})" class="item">+</div>
                    <div @click="newMark({type: 'colored'})" class="item">+</div>
                    <div v-if="!state.showTextarea" v-for="(item, value, index) in marks" class="item task">
                        <div v-if="index < settings.maxMarksOnBar">
                            <div @click="setMarkToFiles(item.id)" :class="{hiddenMark: !item.show}">
                                <span :class="`${item.color}-text`">{{ shrinkMarkDescription(item.descr) }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <input type="text" v-model="state.markNewName">
                    </div>
                </div>
            </div>

            <div class="btns on-row">
                <div class="item show-tree" v-if="localState.showTasksPanel" @click="switchPannel()">Tree</div>
                <div class="item show-tree" v-if="localState.showTreePanel" @click="switchPannel()">Tasks</div>
                <div class="item pin-this" @click="pinFiles()">Pin</div>
            </div>

            <div class="folders on-row">
                <div v-if="folders.length > 1" :class="{activeTab: localState.showFilesFromAllFoldersOption}">
                    <span class="item" @click="filesFromAllFolders()">ALL</span>
                </div>
                <div v-for="(item, index) in folders" class="on-row">
                    <div @click="switchToFolder({id: item.id, index: index})" @dblclick="closeFolder({id: item.id, index: index})" :class="{activeTab: item.isOpened}">
                        <span class="item">{{ item.path.split('/')[ item.path.split('/').length - 1 ] }}</span>
                    </div>
                </div>
                <div @click="newFilesBrowserTab()" class="item">+</div>
            </div>

        </div>

        <div v-else class="on-row">
            <span class="meta-item">{{ stateFiles.onFocusFile.name }}</span>
            <span class="meta-item">Created:&nbsp;</span>
            <span class="meta-item">{{ stateFiles.metadata.created }}</span>
            <span class="meta-item">Last edited:&nbsp;</span>
            <span class="meta-item">{{ stateFiles.metadata.lastEdited }}</span>
            <span class="meta-item">{{ converFileSize(stateFiles.metadata.size) }}</span>
            <span class="meta-item">{{ stateFiles.onFocusFile.format }}</span>
        </div>

    </div>

    <div :class="{HIDE: state.marksBoxIsFolded}" class="_marks-unfolded-block on-col" @keyup.f2="renameMark({state: 'start rename'})" tabindex="0">
        <div v-for="item in marks" class="item task on-row w100 task-box__item">
            <!-- <div class="checkbox" @click="showMarkFilesEverywhere(item.id)"> -->
            <div>
                <input type="checkbox" v-model="item.show" class="checkbox-mark-item">
            </div>
            <div @click="setMarkToFiles(item.id)" @mouseenter="renameMark({state: 'end rename', data: item.id})" :class="{hiddenMark: !item.show}">
                <span :class="`${item.color}-text text-nowrap`">{{ item.descr }}</span>
            </div>
            <div class=""></div>
            <div v-if="item.id != stateFiles.defaults.unmarkedMarkID" @click="deleteMark(item.id)" class="delete item">X</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use '../scss/bar.scss' as *;
    .bar{
        height: 45px;
        position: relative;
    }

    .task{
        opacity: .7;
    }
    .task:hover{
        opacity: 1;
    }
    .item, .gap{
        color: var(--text);
    }
    .item:hover{
        color: var(--pure-white);
        background-color: aquamarine;
    }
    .activeTab{
        background-color: aquamarine;
    }

    .hiddenMark{
        opacity: .7;
    }

    ._marks-unfolded-block{
        position: absolute;
        top: 140px;
        // top: calc( var(--bar-height) + var(--header-height) );
        // left: 0px;
        right: calc( 1920px - var(--width-tasks-and-marks-field) );
        z-index: 1000;
        background-color: black;        //      TO DO
    }
    .task-box__item:hover .delete{
        opacity: .6;
    }
    .delete{
        opacity: 0;
    }

    .checkbox-mark-item{
        appearance: none;
        width: 10pt;
        height: 10pt;
        opacity: 0;
        // accent-color: var(--text);
        background: var(--text);
    }
    // .checkbox-mark-item:disabled{
    // }
    .checkbox-mark-item:checked{
        opacity: .3;
        background: var(--pure-white);
    }
    .checkbox-mark-item:hover{
        background: var(--text);
        opacity: .3;
    }

    .meta-item{
        color: var(--text);
        padding-right: 10px;
        padding-left: 10px;
    }
</style>