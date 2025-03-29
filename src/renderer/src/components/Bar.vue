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
    },
    inputSettings:{
        type: Object,
        required: true
    },
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
    newBrowserTab:function(){
        let _id = 'folder_' + Math.floor(Math.random()*10000000)
        let _index = this.folders.length
        //
        if(_index < this.settings.maxFoldersOnBar){
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
                    isPinned: false,
                }
            )
            this.switchToFolder({id: _id, index: _index})
        }
    },
    switchToFolder:function(dat){
        this.localState.activeFolderIndex = dat.index
        this.folders.forEach(element=>{element.isOpened = false})
        this.folders[dat.index].isOpened = true
        //
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
                // console.log('folder is empty of marked files. Delete')
                isDeleteFolder = true
                // console.log(this.folders)
            }
            //  If the paths are the same?
            this.folders.forEach((element, index) => {
                if(element.path == this.folders[dat.index].path){
                    if(dat.index != index){
                        // console.log(element.path + ' : ' + this.folders[dat.index].path)
                        // console.log('folders match. Delete')
                        isDeleteFolder = true
                    }
                }
            })
            //
            isDeleteFolder = isDeleteFolder || this.inputSettings[ this.localState.actualSessionType ].allowClosingFoldersWithMarkedFiles
            //
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
        //
        this.checkIfAtLeastOneFileSelected()
        //
        if(this.stateFiles.atLeastOneFileSelected){
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
        }
    },
    newMark:function(dat){
        if(dat.state == 'start create new mark'){
            this.state.showTextarea = true
        }
        if(dat.state == 'end create new mark'){
            if(this.state.markNewName.length > 1){
                let newMarkId = 'mark_' + Math.floor(Math.random()*10000000)
                this.marks[newMarkId] = {
                    id: newMarkId, 
                    color: this.state.selectedColorOnColorPicker ? this.state.selectedColorOnColorPicker : 'default-color', 
                    descr: this.state.markNewName, 
                    isFolded: {text: true, imgs: true}, 
                    show: true
                }
                this.state.showTextarea = false
            }
        }
    },
    // unfoldMarks:function(){
    //     this.state.marksBoxIsFolded = !this.state.marksBoxIsFolded
    // },
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
        //  Resetting the romovable marking
        this.folders.forEach(folder=>{
            folder.forEach(file => {
                file.mark = this.stateFiles.defaults.unmarkedMarkID
            })
        })
    },
    renameMark:function(dat){
        //
        this.checkIfAtLeastOneFileSelected()
        //
        if(!this.stateFiles.atLeastOneFileSelected){
            if(dat.state == 'start rename'){
                // this.stateFiles.setCmd( {cmd: 'renameMark - end', descr: dat.descr, marks: this.marks, mark_ID: dat.markID} )
                this.state.markRenameID = dat.markID
                //
                this.state.markNewName = this.marks[this.state.markRenameID].descr
            }
            if(dat.state == 'end rename'){
                // console.log('ren')
                this.marks[this.state.markRenameID].descr = this.state.markNewName
                //
                this.state.markRenameID = null
            }
        }
    },
    pressEscOnBar:function(){
        this.state.showTextarea = false
    },
    pressEscOnBarsAccordion:function(){
        this.state.markRenameID = null
        this.state.showColorPicker = false
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
    },
    checkIfAtLeastOneFileSelected:function(){
        this.stateFiles.setCmd( {cmd: 'check files for seletion'} )
    },
    // handleScroll:function (evt, el) {
    //     console.log("SCROLLL")
    //   if (window.scrollX > 50) {
    //     el.setAttribute(
    //       'style',
    //       'transform: translate3d(-30px, 0px, 0)'
    //     )
    //   }
    //   return window.scrollX > 100
    // },
    // showMarkFilesEverywhere:function(markID){
    //     this.marks[markID].show = 
    // },
  },
  mounted(){
    this.$nextTick(function () {
        // Проверка ширины элемента после обновления
        // this.setSizeMarksBlock()
        //
        // let section = document.querySelector('_item-box')[0]
        // section.addEventListener('scroll', (e) => {
        //     console.log("WEE")
        //     section.scrollLeft += e.deltaX;
        // })
    })
  },
  data(){
    return{
        settings:{
            MaxLenghtOfMarkName: 15,
            maxMarksOnBar: 5,
            maxFoldersOnBar: 6,
            AvailableMarkColors: ['red', 'green', 'yellow', 'ocean', 'blue', 'orange'],
        },
        state:{
            marksBoxIsFolded: true,
            markNewName: 'mark name',
            markRenameID: null,
            showTextarea: false,
            showColorPicker: false,
            selectedColorOnColorPicker: null,
            // countFoldersOnBar: 1,
        },
    }
  }
}
</script>

<template>

    <div @keyup.esc="pressEscOnBar()" tabindex="0" class="bar on-center focus">

        <div class="info on-center">
            <div v-if="stateFiles.numberOfSelectedFiles > 0" class=" on-row">
                <span class="info-text">{{ stateFiles.numberOfSelectedFiles }}</span>
                <span class="info-text">&nbsp;files selected</span>
            </div>
        </div>

        <div v-if="localState.metadataIsHidden" class="on-row">

            <div class="_marks on-row">
                <div @click="state.marksBoxIsFolded = !state.marksBoxIsFolded" class="item">V</div>
                <div class="on-row horizontal-scroll-wrapper">
                    <div @click="newMark({state: 'start create new mark'})" class="item">+</div>
                    <!-- <div v-if="!state.showTextarea" class="on-row item-box _item-box" tabindex="0" v-scroll="handleScroll"> -->
                    <div v-if="!state.showTextarea" class="on-row item-box">
                        <div v-for="(item, value, index) in marks" class="item mark">
                            <div v-if="index < settings.maxMarksOnBar">
                                <div @click="setMarkToFiles(item.id)" :class="{hiddenMark: !item.show}">
                                    <span :class="`${item.color}-text text-nowrap`">{{ shrinkMarkDescription(item.descr) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="on-row item-box">
                        <input type="checkbox" v-model="state.showColorPicker" id="picker" name="picker" class="checkbox">
                        <label for="picker">
                            <div class="set-color">=</div>
                        </label>
                        <div v-if="state.showColorPicker" @click="state.showColorPicker = false" class="color-pic on-row">
                            <div v-for="clr in settings.AvailableMarkColors">
                                <div @click="state.selectedColorOnColorPicker = clr" :class="`color-pic-${clr}`" class="clr-pic-item h100"></div>
                            </div>
                        </div>
                        <div v-else>
                            <input type="text" v-model="state.markNewName" @keyup.enter="newMark({state: 'end create new mark'})" :class="`${state.selectedColorOnColorPicker}-text`" class="input">
                        </div>
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
                <div v-if="folders.length < settings.maxFoldersOnBar" @click="newBrowserTab()" class="item">+</div>
            </div>

        </div>

        <div v-else class="on-row">
            <span class="meta-item">{{ stateFiles.onFocusFile.name }}</span>
            <span class="meta-item">Created:&nbsp;</span>
            <span class="meta-item">{{ stateFiles.onFocusFile.metadata.created }}</span>
            <span class="meta-item">Last edited:&nbsp;</span>
            <span class="meta-item">{{ stateFiles.onFocusFile.metadata.lastEdited }}</span>
            <span class="meta-item">{{ converFileSize(stateFiles.onFocusFile.metadata.size) }}</span>
            <span class="meta-item">{{ stateFiles.onFocusFile.format }}</span>
        </div>

    </div>

    <div @keyup.esc="pressEscOnBarsAccordion()" @mouseleave="state.marksBoxIsFolded = true" :class="{HIDE: state.marksBoxIsFolded}" class="_marks-unfolded-block on-col focus" tabindex="0">
        <div v-for="item in marks" class="on-row w100 marks-box__item">
            <!-- <div class="checkbox" @click="showMarkFilesEverywhere(item.id)"> -->
            <div>
                <input type="checkbox" v-model="item.show" class="checkbox-mark-item">
            </div>
            <div>
                <div v-if="state.markRenameID != item.id" @click="setMarkToFiles(item.id)" @dblclick="renameMark({state: 'start rename', markID: item.id})" :class="{hiddenMark: !item.show}">
                    <span :class="`${item.color}-text text-nowrap`">{{ item.descr }}</span>
                </div>
                <div v-else>
                    <input type="text" v-model="state.markNewName" @keyup.enter="renameMark({state: 'end rename'})" :class="`${state.selectedColorOnColorPicker}-text`" class="input">
                </div>
            </div>
            <div class="on-row">
                <input type="checkbox" v-model="state.showColorPicker" id="picker" name="picker" class="checkbox">
                <label for="picker">
                    <div @click="state.markRenameID = item.id" class="set-color">=</div>
                </label>
                <div v-if="state.showColorPicker && (state.markRenameID == item.id)" @click="state.showColorPicker = false" class="color-pic on-row">
                    <div v-for="clr in settings.AvailableMarkColors" @click="state.markRenameID = null">
                        <div @click="item.color = clr" :class="`color-pic-${clr}`" class="clr-pic-item h100"></div>
                    </div>
                </div>
            </div>
            <div v-if="item.id != stateFiles.defaults.unmarkedMarkID" @click="deleteMark(item.id)" class="delete item">X</div>
        </div>
    </div>

</template>

<style scoped lang="scss">
    @use '../scss/bar.scss' as *;

    $bar-height: 45px;

    .bar{
        height: $bar-height;
        position: relative;
    }

    .info{
        position: absolute;
        top: 0px;
        left: 400px;
        height: $bar-height;
    }
    .info-text{
        color: var(--text);
    }

    // .horizontal-scroll-wrapper {
    //     width: 100px;
    //     height: 300px;
    //     overflow-y:scroll;
    //     overflow-x: hidden;
    //     scroll-behavior: smooth;
    //     transform: rotate(-90deg);
    //     transform-origin: right top;
    // }
    // .horizontal-scroll-wrapper > div {
    //     width: 100px;
    //     height: 100px;
    //     transform: rotate(90deg);
    //     transform-origin: right top;
    // }
    .item-box{
        width: 500px;
        max-width: 550px;   //  !!
        // overflow-y: hidden;
        overflow-x: hidden;
        // overflow-x: auto;
    }
    .mark{
        opacity: .7;
    }
    .mark:hover{
        opacity: 1;
    }
    .item, .gap{
        color: var(--text);
    }
    .item:hover{
        color: var(--pure-white);
        background-color: aquamarine;
    }

    // .mark-rename-box{
    //     position: relative;
    // }
    // .mark-rename-box>.details, .mark-rename-box>input{
    //     position: absolute;
    //     top:0px;
    //     left:0px;
    // }
    // .details[open] .summary{
    //     transform: rotate(90deg);
    // }
    // .summary{
    //     color: aquamarine;
    // }

    //  BARS ACCORDION
    .set-color{
        color:antiquewhite;
    }
    .checkbox{
        visibility: hidden;
    }
    .clr-pic-item{
        width: 40px;
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
    // .marks-box__item:hover{
    //     background-color: aquamarine;
    // }
    .marks-box__item:hover .delete{
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

    .focus:focus{
        outline: none;
    }
</style>