<script>
export default {
  components:{},
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
                this.filesMethods.unselectAllFiles()
            }else{
                let _allFiles = []
                for (const key in this.folders) {
                    _allFiles = _allFiles.concat(this.folders[key].files)
                }
                this.marksMethods.setMarkToFiles( _allFiles, markID )
                //
                this.filesMethods.unselectAllFiles()
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
            AvailableMarkColors: ['red', 'green', 'yellow', 'ocean', 'blue', 'orange'],
            rootFolderTabName: 'root C'
        },
        state:{
            marksBoxIsFolded: true,
            markNewName: 'mark name',
            // markRenameID: null,
            showTextarea: false,
            showColorPicker: false,
            selectedColorOnColorPicker: null,
            // renamigMark: false,
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

    <div @keyup.esc="pressEscOnBar()" @keyup.ctrl.t="foldersMethods2.openClosedTab()" tabindex="0" class="bar on-center focus">

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
                                <div @click="setMarkToFiles(item.id)" @dblclick="dblclickOnMarkItem()" :class="{hiddenMark: !item.show}">
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
                            <input type="text" v-model="state.markNewName" @keyup.enter="newMark({state: 'end create new mark', newName: state.markNewName, color: state.selectedColorOnColorPicker})" :class="`${state.selectedColorOnColorPicker}-text`" class="input">
                        </div>
                    </div>

                </div>
            </div>

            <div class="btns on-row">
                <div class="item show-tree" v-if="localState.showTasksPanel" @click="switchPannels()">Tree</div>
                <div class="item show-tree" v-if="localState.showTreePanel" @click="switchPannels()">Tasks</div>
                <div class="item pin-this" @click="filesMethods.pinSelectedFiles()">Pin</div>
            </div>

            <div class="folders on-row">
                <div v-if="numberOfFoldersDisplayedOnTheBar > 1" :class="{activeTab: localState.showFilesFromAllFoldersOption}">
                    <span class="item" @click="filesFromAllFolders()">ALL</span>
                </div>
                <div v-for="(item, index) in folders" class="on-row">
                    <div v-if="item.displayedOnBar" @click="clickOnTab({id: item.id, index: index, path: item.path})" @dblclick="foldersMethods2.closeTab()" :class="{activeTab: item.isOpened}">
                        <span v-if="item.path != ''" class="item">{{ item.path.split('/')[ item.path.split('/').length - 1 ] }}</span>
                        <span v-else class="item">{{ settings.rootFolderTabName }}</span>
                    </div>
                </div>
                <div v-if="numberOfFoldersDisplayedOnTheBar < settings.maxFoldersOnBar" @click="foldersMethods2.newTab()" class="item">+</div>
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

    <div @keyup.esc="abortMarkEdit()" @mouseleave="state.marksBoxIsFolded = true" :class="{HIDE: state.marksBoxIsFolded}" class="_marks-unfolded-block on-col focus" tabindex="0">
        <div v-for="item in marks" class="on-row w100 marks-box__item">
            <!-- <div class="checkbox" @click="showMarkFilesEverywhere(item.id)"> -->
            <div>
                <input type="checkbox" v-model="item.show" class="checkbox-mark-item">
            </div>
            <div>
                <div v-if="marksMethods.state.markRenameID != item.id" @click="setMarkToFiles(item.id)" @dblclick="renameMark({state: 'start rename', markID: item.id})" :class="{hiddenMark: !item.show}">
                    <span :class="`${item.color}-text text-nowrap`">{{ item.descr }}</span>
                </div>
                <div v-else>
                    <input type="text" v-model="state.markNewName" @keyup.enter="renameMark({state: 'end rename', newName: state.markNewName})" :class="`${state.selectedColorOnColorPicker}-text`" class="input">
                </div>
            </div>
            <div class="on-row">
                <input type="checkbox" v-model="state.showColorPicker" id="picker" name="picker" class="checkbox">
                <label for="picker">
                    <div v-if="item.id != stateFiles.defaults.unmarkedMarkID" @click="marksMethods.state.markRenameID = item.id" class="set-color">=</div>
                </label>
                <div v-if="state.showColorPicker && (marksMethods.state.markRenameID == item.id)" @click="state.showColorPicker = false" class="color-pic on-row">
                    <div v-for="clr in settings.AvailableMarkColors" @click="marksMethods.state.markRenameID = null">
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