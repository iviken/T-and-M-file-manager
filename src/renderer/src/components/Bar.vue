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
        // function pin(){
            this.folders[this.localState.activeFolderIndex].files.forEach(file => {
                for(let key in this.stateFiles.files){
                    if( (file.id == key) && (this.stateFiles.files[key] == 'SELECTED') ){
                        file.isPinned = !file.isPinned
                        this.stateFiles.files[key] = ''
                    }
                }
            })
        // }

        // if(!this.localState.showFilesFromAllFoldersOption){
        //     // this.stateFiles.setCmd( {cmd: 'pinFiles', allFiles: this.folders[this.localState.activeFolderIndex].files} )
        //     this.pin()
        // }else{
        //     let _allFiles = []
        //     for (const key in this.folders) {
        //         _allFiles = _allFiles.concat(this.folders[key].files)
        //     }
        //     this.stateFiles.setCmd( {cmd: 'pinFiles', allFiles: _allFiles} )
        // }
    },
    switchPannel:function(){
        if(!this.localState.showFilesFromAllFoldersOption){
            this.localState.showTreePanel = !this.localState.showTreePanel
            this.localState.showTasksPanel = !this.localState.showTasksPanel
        }
    },
    newBrowserTab:function(){
        if( this.folders[this.localState.activeFolderIndex].path.split('/').length > 2 ){
            //
            let path = this.folders[this.localState.activeFolderIndex].path.substring(0, this.folders[this.localState.activeFolderIndex].path.lastIndexOf('/') )
            //
            console.log('to path: ' + path)
            if( this.folders.find(folder=>folder.path == path) == undefined ){
                let _id = 'folder_' + Math.floor(Math.random()*10000000)
                let _index = this.folders.length
                //
                this.folders.push(
                    {
                        id: _id,
                        path: path,
                        files: [],
                        isOpened: false,
                        // isOpened: true,
                        isPinned: false,
                        displayedOnBar: true,
                    }
                )
                //
                this.switchToFolder({id: _id, index: _index})
            }else{
                //
                this.folders.forEach((folder, index) => {
                    if( folder.path == path ){
                        this.switchToFolder( {id: folder.id, index: index} )
                    }
                })
            }
        }
    },
    switchToFolder:function(dat){       //  {index}
        console.log('switch to folder: ')
        console.log(dat)
        console.log(this.folders[dat.index].displayedOnBar)
        //  Change folder indexes
        if( dat.index != this.localState.activeFolderIndex ){
            //
            this.localState.previousFolderIndex = this.localState.activeFolderIndex
        }
        //
        this.localState.activeFolderIndex = dat.index
        //
        this.folders.forEach(element=>{element.isOpened = false})
        this.folders[dat.index].isOpened = true
        this.folders[dat.index].displayedOnBar = true
        //  For 'ALL' tab
        this.localState.showFilesFromAllFoldersOption = false
    },
    closeFolderTab:function(dat){
        if(this.folders.length > 1){
            //
            let numberOfOpenFoldersDisplayedOnTheBar = 0
            //  If the indexes math, count index of the fiture open folder after closing opened
            this.folders.forEach( (folder, indexOfTheFutureOpenFolderAfterClosingCurrentFolder) => {
                //
                if( folder.displayedOnBar ) numberOfOpenFoldersDisplayedOnTheBar++
                //
                if( indexOfTheFutureOpenFolderAfterClosingCurrentFolder != dat.index ){
                    //
                    if( folder.displayedOnBar ){
                        //
                        if(numberOfOpenFoldersDisplayedOnTheBar > 1){
                            //
                            if( this.localState.previousFolderIndex == this.localState.activeFolderIndex ){
                                //
                                this.localState.previousFolderIndex = indexOfTheFutureOpenFolderAfterClosingCurrentFolder
                            }
                        }
                    }
                }
            })
            //  Closing folder tab
            if( numberOfOpenFoldersDisplayedOnTheBar > 1 ){
                //  Set focus on first displayed on the bar folder
                this.folders[this.localState.activeFolderIndex].isOpened = false
                //
                this.folders[this.localState.activeFolderIndex].displayedOnBar = false
                // }
                if( this.folders[this.localState.previousFolderIndex].displayedOnBar ){
                    //
                    this.localState.activeFolderIndex = this.localState.previousFolderIndex
                    //
                    this.folders[ this.localState.activeFolderIndex ].isOpened = true

                }
            }
        }
    },
    openClosedTab(){
        //
        if(this.folders.length > this.localState.previousFolderIndex){
            this.switchToFolder( {index: this.localState.previousFolderIndex} )
        }
    },
    setMarkToFiles:function(markID){
        //
        function mark(files, mark_ID, stateFiles){
            console.log(stateFiles.files)
            files.forEach(file => {
                for(let key in stateFiles.files){
                    if( (file.id == key) && (stateFiles.files[key] == 'SELECTED') ){
                        file.markID = mark_ID
                        stateFiles.files[key] = ''
                    }
                }
            })
        }
        //
        this.checkIfAtLeastOneFileSelected()
        //
        if(this.stateFiles.atLeastOneFileSelected){
            // console.log('click to mark: ' + markID)
            if(!this.localState.showFilesFromAllFoldersOption){
                // this.stateFiles.setCmd( {cmd: 'setMarkToFiles', allFiles: this.folders[this.localState.activeFolderIndex].files, mark_ID: markID} )
                mark(  this.folders[this.localState.activeFolderIndex].files, markID, this.stateFiles )
            }else{
                let _allFiles = []
                for (const key in this.folders) {
                    _allFiles = _allFiles.concat(this.folders[key].files)
                }
                // this.stateFiles.setCmd( {cmd: 'setMarkToFiles', allFiles: _allFiles, mark_ID: markID} )
                mark( _allFiles, markID, this.stateFiles )
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
        if(markID != this.stateFiles.defaults.unmarkedMarkID){
            this.folders.forEach(folder => {
                folder.files.forEach(file => {
                    if(file.markID == markID){file.markID = this.stateFiles.defaults.unmarkedMarkID}
                })
            })
            delete this.marks[markID]
        }
    },
    renameMark:function(dat){
        //
        this.checkIfAtLeastOneFileSelected()
        //
        if(!this.stateFiles.atLeastOneFileSelected){
            if(dat.markID != this.stateFiles.defaults.unmarkedMarkID){
                if(dat.state == 'start rename'){
                    this.state.markRenameID = dat.markID
                    //
                    this.state.markNewName = this.marks[this.state.markRenameID].descr
                }

                if(dat.state == 'end rename'){
                    this.marks[this.state.markRenameID].descr = this.state.markNewName
                    //
                    this.state.markRenameID = null
                }
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
    convertFileSize:function(num){
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
        this.stateFiles.atLeastOneFileSelected = false
        for (const key in this.stateFiles.files) {
            if(this.stateFiles.files[key] == 'SELECTED') this.stateFiles.atLeastOneFileSelected = true
        }
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
            rootFolderTabName: 'root C'
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
  },
  computed:{
    numberOfFoldersDisplayedOnTheBar(){
        let count = 0
        this.folders.forEach(folder => {
            if( folder.displayedOnBar ) count++
        })
        return count
    },
  }
}
</script>

<template>

    <div @keyup.esc="pressEscOnBar()" @keyup.ctrl.t="openClosedTab()" tabindex="0" class="bar on-center focus">

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
                <div v-if="numberOfFoldersDisplayedOnTheBar > 1" :class="{activeTab: localState.showFilesFromAllFoldersOption}">
                    <span class="item" @click="filesFromAllFolders()">ALL</span>
                </div>
                <div v-for="(item, index) in folders" class="on-row">
                    <div v-if="item.displayedOnBar" @click="switchToFolder({id: item.id, index: index})" @dblclick="closeFolderTab({id: item.id, index: index})" :class="{activeTab: item.isOpened}">
                        <span v-if="item.path != ''" class="item">{{ item.path.split('/')[ item.path.split('/').length - 1 ] }}</span>
                        <span v-else class="item">{{ settings.rootFolderTabName }}</span>
                    </div>
                </div>
                <div v-if="numberOfFoldersDisplayedOnTheBar < settings.maxFoldersOnBar" @click="newBrowserTab()" class="item">+</div>
            </div>

        </div>

        <div v-else class="on-row">
            <span class="meta-item">{{ stateFiles.onFocusFile.name }}</span>
            <span class="meta-item">Created:&nbsp;</span>
            <span class="meta-item">{{ stateFiles.onFocusFile.metadata.created.toLocaleString() }}</span>
            <span class="meta-item">Last edited:&nbsp;</span>
            <span class="meta-item">{{ stateFiles.onFocusFile.metadata.lastEdited.toLocaleString() }}</span>
            <span class="meta-item">{{ convertFileSize(stateFiles.onFocusFile.metadata.size) }}</span>
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
                    <div v-if="item.id != stateFiles.defaults.unmarkedMarkID" @click="state.markRenameID = item.id" class="set-color">=</div>
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
        width: 400px;
        z-index: 1000;
        background-color: black;
    }

    @media screen and (min-width: 1501px) {
        ._marks-unfolded-block{
            left: 230px;
            // right: 1290px;
        }
    }
    
    @media screen and (max-width: 1500px) and (min-width: 1001px) {  
        ._marks-unfolded-block{
            left: 100px;
            // right: 800px;
        }  
    }
    
    @media screen and (max-width: 1000px) {
        ._marks-unfolded-block{
            left: 0px;
        }
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