<script>
export default {

  props:{
    stateFiles:{
        type: Object,
        required: true
    },
    filesMethods:{
        type: Object,
        required: true
    },
    marksMethods:{
        type: Object,
        required: true
    },
    foldersMethods2:{
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
      // unfoldMarks:function(){
        //     this.state.marksBoxIsFolded = !this.state.marksBoxIsFolded
        // },
    // setSizeMarksBlock:function(){
        //         document.querySelector('._marks-unfolded-block').style.width = document.querySelector('._marks').offsetWidth + 'px'
        //         document.querySelector('._marks-unfolded-block').style.left = document.querySelector('._marks').getBoundingClientRect().left + 'px'
        //     },
    switchPannels:function(){
        if(!this.localState.showFilesFromAllFoldersOption){
            this.localState.showTreePanel = !this.localState.showTreePanel
            this.localState.showTasksPanel = !this.localState.showTasksPanel
        }
    },
    clickOnTab(dat){
        //
        this.foldersMethods2.clickOnTab(dat.path)
        //
        this.filesMethods.countSelectedFiles()
        //  For 'ALL (folders)' tab
        this.localState.showFilesFromAllFoldersOption = false 
    },
    shrinkMarkDescription:function(name){
        if(name.length > this.settings.MaxLenghtOfMarkName){
            return `${name.split(' ')[0]} ...${name.split(' ')[ name.split(' ').length - 1 ]}`
        }else{
            return name
        }
    },
    pressEscOnBar:function(){
        this.state.showTextarea = false
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

        this.filesMethods.countSelectedFiles('all')

        //  Отменяет переключение между вкладками задач и маркировки при нахождении в режиме отображ. всех файлов
        if(this.localState.showFilesFromAllFoldersOption){
            this.localState.showTreePanel = false
            this.localState.showTasksPanel = true
        }
    },
    deleteMark:function(markID){
        //
        this.filesMethods.deleteMark(markID)
        //
        this.marksMethods.deleteMark(markID)
    },
    newMark:function(dat){
        if(dat.state == 'start create new mark'){
            //
            this.state.showTextarea = true
        }
        if(dat.state == 'end create new mark'){
            //
            this.state.markNewName = this.state.markNewName.trim()
            //
            this.marksMethods.newMark(dat)
            //
            this.state.showTextarea = false
            //
            this.state.selectedColorOnColorPicker = null
        }
    },
    setMarkToFiles:function(markID){
        //
        if( this.marksMethods.checkIfAtLeastOneFileSelected() ){
            // console.log('click to mark: ' + markID)
            if(!this.localState.showFilesFromAllFoldersOption){
                this.marksMethods.setMarkToFiles( this.folders[this.localState.activeFolderIndex].files, markID )
                //
                this.filesMethods.resetStateFiles()
            }else{
                let _allFiles = []
                for (const key in this.folders) {
                    _allFiles = _allFiles.concat(this.folders[key].files)
                }
                this.marksMethods.setMarkToFiles( _allFiles, markID )
                //
                this.filesMethods.deselectAllFiles()
            }
        }
    },
    abortMarkEdit(){
        this.state.showColorPicker = false
        //
        this.marksMethods.abortMarkEdit()
    },
    renameMark(dat){
        this.localState.renamigMark = this.marksMethods.renameMark(dat)
        //  End rename and hide input
        if( this.localState.renamigMark ) this.state.showTextarea = false
    },
    dblclickOnMarkItem(){},
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
            availableMarkColors: ['red', 'green', 'yellow', 'ocean', 'blue', 'orange'],
            rootFolderTabName: 'root C',
            tabsFolderNameMaxLength: 16,
        },
        state:{
            marksBoxIsFolded: true,
            markNewName: 'mark name',
            showTextarea: false,
            showColorPicker: false,
            selectedColorOnColorPicker: null,
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
  },

  beforeUpdate(){

    this.filesMethods.countSelectedFiles()
  },
}
</script>

<template>

    <div @keyup.esc="pressEscOnBar()" @keyup.ctrl.t="foldersMethods2.openClosedTab()" tabindex="0" class="bar on-center focus">

        <div class="info h100 on-center">
            <div v-if="stateFiles.numberOfSelectedFiles > 0" class="on-row">
                <span class="info-text">{{ stateFiles.numberOfSelectedFiles }}</span>
                <span v-if="stateFiles.numberOfSelectedFiles == 1" class="info-text">&nbsp;file selected</span>
                <span v-if="stateFiles.numberOfSelectedFiles > 1" class="info-text">&nbsp;files selected</span>
            </div>
        </div>

        <div v-if="localState.metadataIsHidden" class="bar-block on-row h100">

            <div class="_marks marks-block on-row h100">
                <!-- marks menu -->
                <div @click="state.marksBoxIsFolded = !state.marksBoxIsFolded" class="item hover-item h100 on-center">
                    <img src="../assets/arc dawn.svg" alt="choose mark" class="arrow-1">
                </div>

                <div class="on-row h100">
                    <!-- new mark - plus -->
                    <div @click="newMark({state: 'start create new mark'})" class="item hover-item h100 on-center">
                        <img src="../assets/plus.svg" alt="create new mark" class="pix-btn-plus-1">
                    </div>
                    <!-- new mark - input -->
                    <div v-if="!state.showTextarea" class="item-box on-row">
                        <div v-for="(item, value, index) in marks" class="menu h100">
                            <div v-if="index < settings.maxMarksOnBar" class="item h100 on-center">
                                <div @click="setMarkToFiles(item.id)" @dblclick="dblclickOnMarkItem()" :class="{hiddenMark: !item.show}">
                                    <span :class="`${item.color}-text`" class="menu-item uppercase t-bar-marks text-nowrap">
                                        {{ shrinkMarkDescription(item.descr) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- new mark - pic color -->
                    <div v-else class="item-box on-row h100">
                        <!-- arrow -->
                        <input type="checkbox" v-model="state.showColorPicker" id="picker" name="picker" class="checkbox">
                        <label for="picker">
                            <div class="set-color-btn vertical-center on-center h100">
                                <img src="../assets/arrow2.svg" alt="set color" class="arrow-3">
                            </div>
                        </label>
                        <!-- color picker -->
                        <div v-if="state.showColorPicker" @click="state.showColorPicker = false" class="color-pic on-row">
                            <div v-for="clr in settings.availableMarkColors">
                                <div @click="state.selectedColorOnColorPicker = clr" :class="`color-pic-${clr}`" class="clr-pic-item clr-pic-box-bar h100"></div>
                            </div>
                        </div>
                        <!-- input -->
                        <div v-else class="input-text-box on-center w100">
                            <input type="text" v-model="state.markNewName" @keyup.enter="newMark({state: 'end create new mark', newName: state.markNewName, color: state.selectedColorOnColorPicker})" :class="`${state.selectedColorOnColorPicker}-text`" class="input bar-new-mark on-center w100 focus">
                        </div>
                    </div>

                </div>

            </div>

            <div class="btns on-row h100">
                <div class="item show-tree h100 on-center" v-if="localState.showTasksPanel" @click="switchPannels()">
                    <img src="../assets/tree.svg" alt="Folders tree" class="pix-btn">
                </div>
                <div class="item show-tree h100 on-center" v-if="localState.showTreePanel" @click="switchPannels()">
                    <img src="../assets/tasks.svg" alt="Tasks" class="pix-btn">
                </div>
                <div class="item pin-this h100 on-center" @click="filesMethods.pinSelectedFiles()">
                    <img v-if="filesMethods.checkIsAtLeastOneSelectedFilePinned()" src="../assets/unpin.svg" alt="Pin / Unpin selected files" class="pix-btn">
                    <img v-if="!filesMethods.checkIsAtLeastOneSelectedFilePinned()" src="../assets/pin.svg" alt="Pin / Unpin selected files" class="pix-btn">
                </div>
            </div>

            <div class="folders on-row h100">
                <div v-if="numberOfFoldersDisplayedOnTheBar > 1" class="item h100 on-center">
                    <span :class="{activeTab: localState.showFilesFromAllFoldersOption}" @click="filesFromAllFolders()" class="uppercase t-bar-folders no-wrap text-nowrap">ALL</span>
                </div>
                <div v-for="(item, index) in folders" class="menu on-row h100">
                    <div v-if="item.displayedOnBar" @click="clickOnTab({id: item.id, index: index, path: item.path})" @dblclick="foldersMethods2.closeTab()" class="item on-center h100">
                        <span v-if="item.path != ''" :class="{activeTab: item.isOpened}" class="menu-item uppercase t-bar-folders no-wrap text-nowrap">
                            {{ foldersMethods2.shrinkName( foldersMethods2.getFolderName(item.path), settings.tabsFolderNameMaxLength ) }}
                        </span>
                        
                        <span v-else :class="{activeTab: item.isOpened}" class="menu-item uppercase t-bar-folders no-wrap text-nowrap">{{ settings.rootFolderTabName }}</span>
                    </div>
                </div>
                <div v-if="numberOfFoldersDisplayedOnTheBar < settings.maxFoldersOnBar" @click="foldersMethods2.newTab()" class="item h100 on-center">
                    <img src="../assets/plus.svg" alt="new tab" class="pix-btn-plus-2">
                </div>
            </div>

        </div>

        <div v-else class="bar-block on-center h100">
            <div class="on-row">
                <span class="meta-item">{{ stateFiles.onFocusFile.name }}</span>
                <span class="meta-item">Created:&nbsp;</span>
                <span class="meta-item">{{ stateFiles.onFocusFile.metadata.created.toLocaleString() }}</span>
                <span class="meta-item">Last edited:&nbsp;</span>
                <span class="meta-item">{{ stateFiles.onFocusFile.metadata.lastEdited.toLocaleString() }}</span>
                <span class="meta-item">{{ convertFileSize(stateFiles.onFocusFile.metadata.size) }}</span>
                <span class="meta-item">{{ stateFiles.onFocusFile.format }}</span>
            </div>
        </div>

        <div class="search"></div>

    </div>

    <!-- marks menu -->

    <div @keyup.esc="abortMarkEdit()" @mouseleave="state.marksBoxIsFolded = true" :class="{HIDE: state.marksBoxIsFolded}" class="_marks-unfolded-block on-col focus" tabindex="0">

        <div :class="`${localState.actualSessionType}-menu-back`" class="marks-menu-box h100 w100">

            <div v-for="item in marks" class="marks-box__item menu on-row w100">
    
                <div class="vertical-center checkbox-block menu-item h100">
                    <input type="checkbox" v-model="item.show" class="checkbox-mark-item">
                </div>
    
                <div v-if="marksMethods.state.markRenameID != item.id" @click="setMarkToFiles(item.id)" @dblclick="renameMark({state: 'start rename', markID: item.id})" :class="{hiddenMark: !item.show}" class="menu-item">
                    <!-- marks -->
                    <span :class="`${item.color}-text text-nowrap uppercase`">{{ item.descr }}</span>
                </div>
                <div v-else class="on-center">
                    <!-- input -->
                    <div v-if="!state.showColorPicker">
                        <input type="text" v-model="state.markNewName" @keyup.enter="renameMark({state: 'end rename', newName: state.markNewName})" :class="`${state.selectedColorOnColorPicker}-text`" class="input marks-box-rename focus w100">
                    </div>
                </div>
    
                <div class="on-row h100 marks-menu-clr-pic">
                    <!-- color picker -->
                    <div v-if="state.showColorPicker && (marksMethods.state.markRenameID == item.id)" @click="state.showColorPicker = false" class="color-pic on-row">
                        <div v-for="clr in settings.availableMarkColors" @click="marksMethods.state.markRenameID = null" class="h100">
                            <div @click="item.color = clr" :class="`color-pic-${clr}`" class="clr-pic-item clr-pic-box-menu-bar h100"></div>
                        </div>
                    </div>
                    <!-- arrow -->
                    <div v-if="item.id != stateFiles.defaults.unmarkedMarkID" class="on-row">
                        <input type="checkbox" v-model="state.showColorPicker" id="picker" name="picker" class="checkbox">
                        <label for="picker" class="vertical-center">
                            <div @click="marksMethods.state.markRenameID = marksMethods.state.markRenameID == null ? item.id : null" class="vertical-center set-color hover-item">
                                <img src="../assets/arrow2.svg" alt="Set marks color" class="marks-menu-arrow rotate180">
                            </div>
                        </label>
                    </div>
                </div>
                <!-- delete mark -->
                <div v-if="!state.showColorPicker" class="vertical-center h100">
                    <div v-if="item.id != stateFiles.defaults.unmarkedMarkID" @click="deleteMark(item.id)" class="delete hover-item">
                        <img src="../assets/x.svg" alt="delete mark" class="marks-menu-x">
                    </div>
                </div>
                
            </div>
            
        </div>

    </div>

</template>

<style scoped lang="scss">
    // @use '../scss/bar.scss' as *;

    $bar-height: 37px;

    .pix-btn{
        opacity: .6;
        width: 14px;
        height: 14px;
    }
    .pix-btn-plus-1{
        width: 10px;
        height: 10px;
    }
    .pix-btn-plus-2{
        opacity: .6;
        width: 10px;
        height: 10px;
        // fill: var(--cold-pale);
        // stroke: var(--cold-pale);
    }
    .pix-btn:hover{}
    .btn-set-color{
        width: 10px;
    }

    .bar{
        height: $bar-height;
        position: relative;
        background: var(--grad-bar);
    }

    .bar-block{
        background: var(--grad-bar-block);
    }

    .marks-block{
    }
    .input-text-box{
        margin-left: 10px;
        margin-right: 10px;
    }
    .bar-new-mark{
        margin-top: auto;
        margin-bottom: auto;
        height: 28px;
        background: var(--grad-bar-mark-input);
        border: solid 1px var(--grad-bar-mark-input-border);
        color: var(--pure-white);   //  ?
    }

    .menu .menu-item{
        opacity: .75;
    }
    .menu:hover .menu-item{
        opacity: 1;
    }

    .info, .search{
        width: 200px;
        max-width: 200px;
    }
    .info-text{
        color: var(--text);
    }
    .item-box{
        width: 500px;
        max-width: 550px;   //  !!
        overflow-x: hidden;
    }
    .item, .gap{
        padding-left: 12px;
        padding-right: 12px;
    }
    .item:hover{
        background: var(--grad-mark-button);
    }
    .item:hover>img, .item:hover span{
        opacity: 1;
    }
    .hover-item{
        opacity: .6;
    }
    .hover-item:hover{
        opacity: 1;
    }

    .show-tree, .pin-this{
        padding-left: 8px;
        padding-right: 8px;
    }
    //  BARS ACCORDION
    .set-color-btn{
        padding-left: 10px;
        padding-right: 10px;
    }

    .arrow-1{
        width: 10px;
        height: 10px;
    }
    .marks-menu-arrow, .marks-menu-x{
        width: 8px;
        height: 8px;
    }
    .arrow-3{
        opacity: .6;
        width: 8px;
        height: 8px;
    }

    .marks-menu-clr-pic{
        margin-left: 20px;
    }
    .checkbox{
        visibility: hidden;
    }
    .clr-pic-item{
        opacity: .7;
        -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
        mask-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    }
    .clr-pic-item:hover{
        opacity: 1;
    }
    .clr-pic-box-bar{
        width: 40px;
    }
    .clr-pic-box-menu-bar{
        width: 25px;
    }

    // .activeTab{
    //     opacity: 1;
    //     color: var(--cold-pale);
    // }

    .hiddenMark{
        opacity: .7;
    }

    ._marks-unfolded-block{
        position: absolute;
        top: 140px;
        // top: calc( var(--bar-height) + var(--header-height) );
        width: 400px;
        z-index: 1000;
        box-shadow: var(--shadow-bar-menu);
    }
    .marks-menu-box{
        padding-top: 14px;
        padding-bottom: 14px;
    }
    .SESSION-menu-back{
        background: var(--grad-mark-menu-SESSION-1), var(--grad-mark-menu-2);
    }
    .PROJECTS-menu-back{
        background: var(--grad-mark-menu-PROJECTS-1), var(--grad-mark-menu-2);
    }
    .marks-box-rename{
        height: 26px;
        background: var(--grad-mark-menu-input);
        border: solid 1px var(--border-mark-menu-input);
        color: var(--pure-white);
    }

    @media screen and (min-width: 1501px) { //  fullscreen

        .bar-block{
            width: 1000px;
        }

        ._marks-unfolded-block{
            left: 230px;
            // right: 1290px;
        }
    }
    
    @media screen and (max-width: 1500px) and (min-width: 1001px) {

        .bar-block{
            width: 1000px;
        }

        ._marks-unfolded-block{
            left: 100px;
            // right: 800px;
        }  
    }
    
    @media screen and (max-width: 1000px) {

        .bar-block{
            width: auto;
        }

        ._marks-unfolded-block{
            left: 0px;
        }
    }
    // .marks-box__item:hover{
    //     background-color: aquamarine;
    // }
    .marks-box__item{
        margin-top: 7px;
        margin-bottom: 7px;
    }
    .marks-box__item:hover .delete, .marks-box__item:hover .set-color{
        // opacity: 1;
        visibility: visible;
    }
    .delete, .set-color{
        // opacity: 0;
        padding-left: 10px;
        padding-right: 10px;
        visibility: hidden;
    }
    .checkbox-block{
        margin-right: 10px;
    }

    .checkbox-mark-item{
        padding: 4px;
        appearance: none;
        width: 6px;
        height: 6px;
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

    .vertical-center{
        margin-top: auto;
        margin-bottom: auto;
    }
    .vertical-center img{
        display: block;
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