<script>
export default {
  props:{
    foldersMethods2:{
        type: Object,
        required: true
    },
    inputSettings:{
        type: Object,
        required: true
    },
    dataSettings:{
        type: Object,
        required: true
    },
    folders:{
        type: Object,
        required: true
    },
    localState:{
        type: Object,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    projectID:{
        type: String,
        required: true
    },
  },

  methods: {

    markActiveFolder:function(name){
      return name == this.path.split('/')[ this.path.split('/').length - 1 ]
    },

    markOpenedFolder:function(dat){},

    foldPin:function(){
      this.dataSettings.pinFoldersIsFolded = !this.dataSettings.pinFoldersIsFolded
    },

    foldSessionFolders:function(){
      this.dataSettings.foldersIsFolded = !this.dataSettings.foldersIsFolded
    },

    clickToAddressBarPart:function(dat){
      // console.log('click to address: ' + dat.path)
      //
      this.foldersMethods2.clickToFolder(dat)
    },

    sessionFolderDisplayFilter:function(folder){
      // console.log(folder)
      return folder.files.length > 0 ? !folder.files.every( file => file.markID == this.defaults.defaulMarkID ) : false
      
      // return folder.files.length > 0 ? 
      //   folder.files.every( file => ((file.markID != this.defaults.defaulMarkID) || file.isPinned) ) : 
      //   false
    },

    pressEsc(){
      //
      // this.copyCutFolderID = null
      // this.foldersMethods.copyCutFolderID = null
      // this.isDeleteSrcFolder = false
      // this.foldersMethods.isDeleteSrcFolder = false
      // this.copyCutFolderName = null
      this.foldersMethods2.abortCopyCutOperation()
      //
      this.renameSelectedFolder( {state: 'abort'} )
    },

    renameSelectedFolder:function(dat){
        //
        if(dat.state == 'input-start'){
          this.nameOfTheFolderToBeRenamed = this.foldersMethods2.getActiveFolderName()
          // this.nameOfTheFolderToBeRenamed = this.foldersMethods.getFolderName( this.folders[ this.localState.activeFolderIndex ].path )
        }
        //
        if(dat.state == 'abort'){
          this.nameOfTheFolderToBeRenamed = null
        }
        //
        if(dat.state == 'input-done'){
          // console.log('RENAME FOLDER')
          let result = this.foldersMethods2.renameSelectedFolder( {newName: this.renameValue} )
          // let result = this.foldersMethods.renameSelectedFolder( {newName: this.renameValue, folderList: this.folderList} )
          //
          if(result){
            //
            this.renameValue = ''
            //  For hide input element
            this.nameOfTheFolderToBeRenamed = null
            //  Refresh folders
            // this.foldersMethods.refreshFolders()
          }
            
          }
    },

    createNewFolder:function(dat){
        console.log('CREATE FOLDER')
        
        if(dat.state == 'input-start'){
          
          this.isCreatredNewFolder = true
        }

        if(dat.state == 'input-done'){

          let result = this.foldersMethods2.createNewFolder( this.newFolderName )

          if(result){
            //
            this.isCreatredNewFolder = false
          }
      }
    },
  },

  beforeMount(){
  },

  beforeUpdate(){
  },

  data(){
    return{
      nameOfTheFolderToBeRenamed: null,
      renameValue: '',
      isCreatredNewFolder: false,
      newFolderName: '',
      settings:{
        replacedSymbolPath: ' > ',
        folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
        folderNameMaxLength: 30,
        addressBarFolderNameMaxLength: 10,    //  pick up
      },
      defaults:{
        defaulMarkID: 'mark_unmarked',
      },
    }
  },

  computed:{

    getPathForAddressBar(){
      if( this.path.indexOf('/') >= 0 ) return this.path.split('/')
      if( this.path.indexOf('\\') >= 0 ) return this.path.split('\\')
    },
  }
}
</script>

<template>
    <div 
      @keyup.f2="renameSelectedFolder( {state: 'input-start'} )" 
      @keyup.esc="pressEsc()" 
      @keyup.ctrl.d="foldersMethods2.pinFolder()"
      @keyup.f5="foldersMethods2.refreshDisplayedFolders()"
      @keyup.shift.ctrl.n.exact="createNewFolder( {state: 'input-start'} )"
      @keyup.ctrl.n="createNewFolder( {state: 'input-start'} )"
      @keyup.ctrl.c="foldersMethods2.copyPastFolder( {state: 'copy folder'} )"
      @keyup.ctrl.v="foldersMethods2.copyPastFolder( {state: 'past folder'} )"
      @keyup.ctrl.x="foldersMethods2.copyPastFolder( {state: 'cut folder'} )"
      @keyup.up.exact="foldersMethods2.treeNavigate('adjacent folder: up')"
      @keyup.down.exact="foldersMethods2.treeNavigate('adjacent folder: down')"
      @keyup.right.exact="foldersMethods2.treeNavigate('first child folder')"
      @keyup.left.exact="foldersMethods2.treeNavigate('parent folder')"
      @keyup.ctrl.left="foldersMethods2.treeNavigate('previous folder in history')"
      class="component focus h100 on-col" 
      tabindex="0" 
    >

        <!-- folders with marked files -->

        <div v-if="inputSettings[ localState.actualSessionType ].showSessionFolders" class="folders block on-row">

          <div @click="foldSessionFolders()" class="left-field">
            <div :class="{foldersActive: dataSettings.foldersIsFolded}">[]</div>
          </div>

          <div v-if="dataSettings.foldersIsFolded" class="folders-item on-col w100">
            <div v-for="folder in folders" class="item w100 on-row">
              <div v-if="sessionFolderDisplayFilter(folder)" @click="foldersMethods2.clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( foldersMethods2.getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}" class="list-item w100">
                <span class="t-tree-item text-nowrap uppercase">{{ foldersMethods2.getFolderName( folder.path ) }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- pin folders block -->

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showPinFolders" class="pin-block block on-row focus" tabindex="0" >

          <div @click="foldPin()" class="pin-logo left-field">
            <div :class="{pinActive: dataSettings.pinFoldersIsFolded}">
              <img src="../assets/pin.svg" alt="" class="pix-btn pin">
            </div>
          </div>

          <div v-if="!dataSettings.pinFoldersIsFolded" class="on-col w100">
            <div v-for="folder in folders" class="item w100">
              <div v-if="folder.isPinned" class="w100">
                <div @click="foldersMethods2.clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( foldersMethods2.getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}" class="list-item on-row w100">
                  <div>
                    <span class="t-tree-item text-nowrap uppercase">{{ foldersMethods2.getFolderName( folder.path ) }}</span>
                  </div>
                  <div class="w100"></div>
                  <div @click="foldersMethods2.pinFolder()" class="pin btn-opacity h100 on-center">
                    <img src="../assets/unpin.svg" alt="pin folder" class="pix-btn">
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- adress bar -->

        <div class="address-bar on-row w100">

          <div class="address-box">
            <div class="address-block on-row no-wrap w100">

              <div v-for="(part, index) of getPathForAddressBar" class="on-row no-wrap">
  
                <div @click="clickToAddressBarPart( {path: path.split('/').slice(0, index + 1).join('/')} )" class="address-bar-part">
                  <span class="t-tree-address uppercase text-nowrap">
                    {{ foldersMethods2.shrinkName(part, settings.addressBarFolderNameMaxLength) }}
                  </span>
                </div>
  
                <div>
                  <span class="t-tree-address uppercase text-nowrap">
                    {{ settings.replacedSymbolPath }}
                  </span>
                </div>
  
              </div>
            </div>

          </div>

          <div class="w100"></div>

          <!-- eye - hide files -->

          <div @click="foldersMethods2.showFoldersStartingWithDot()" class="btn-opacity vertical-center h100">
            <img v-if="dataSettings.showFoldersStartingWithDot" src="../assets/eye opened.svg" alt="Show hide & system folders" class="eye">
            <img v-else src="../assets/eye closed.svg" alt="Hide system folders" class="eye">
          </div>
          
        </div>

        <!-- tree -->

        <div class="tree-block focus scrollY on-col" tabindex="0">

          <!-- folders -->

          <div class="block on-col">
            <div v-for="item in foldersMethods2.getFoldersList()" class="">
              <div v-if="nameOfTheFolderToBeRenamed != item" @dblclick="renameSelectedFolder( {state: 'input-start'} )" @click="foldersMethods2.clickOnTheDirectoryInTheFolderTree( item, 'this level' )" :class="{active: markActiveFolder(item), opened: markOpenedFolder(item), 'item-copy-cut': item == foldersMethods2.copyPastFolder( {state: 'get copy-folder name'} )}" class="list-item item on-row w100">
                <div>
                  <span class="t-tree-item uppercase text-nowrap">{{ foldersMethods2.shrinkName(item, settings.folderNameMaxLength) }}</span>
                </div>
                <div class="w100"></div>
                <div @click="createNewFolder( {state: 'input-start'} )"  class="add btn-opacity vertical-center h100">
                  <img src="../assets/plus.svg" alt="create new folder" class="pix-btn">
                </div>
                <div @click="foldersMethods2.pinFolder()" class="pin btn-opacity vertical-center h100">
                  <img src="../assets/pin.svg" alt="pin folder" class="pix-btn">
                </div>
                <div @click="foldersMethods2.deleteFolder()" class="delete btn-opacity vertical-center h100">
                  <img src="../assets/x.svg" alt="delete this folder" class="pix-btn">
                </div>
              </div>
              <div v-else class="rename">
                <input type="text" placeholder="folder name" :v-model="renameValue" @input="event => renameValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`${item}`" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done'})" class="t-tree-item t-tree-renaming rename-input uppercase focus w100"></input>
              </div>
            </div>
          </div>
          
          <!-- sub folders -->

          <div class="block on-col">
            <div v-for="item in foldersMethods2.getSubfoldersList()" class="">
              <div class="list-item item on-row w100">
                <div class="vertical-center h100">
                  <img src="../assets/tree-level.svg" class="tree-level-pix">
                </div>
                <div v-if="nameOfTheFolderToBeRenamed != item" @click="foldersMethods2.clickOnTheDirectoryInTheFolderTree( item, 'child level' )" class="sub-item">
                  <span class="t-tree-item text-nowrap uppercase text-nowrap">{{ foldersMethods2.shrinkName(item, settings.folderNameMaxLength) }}</span>
                </div>
                <div v-else class="rename">
                  <input type="text" placeholder="folder name" :v-model="renameValue" @input="event => renameValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`sub_${item}`" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done'})" class="t-tree-renaming rename-input focus w100"></input>
                </div>
              </div>
            </div>
          </div>

          <!-- create new folder -->

          <div class="new-folder rename w100">
            <input type="text" placeholder="new folder name" v-if="isCreatredNewFolder" :v-model="newFolderName" @input="event => newFolderName = event.target.value.replace(settings.folderNameRegexp, '')" id="newFolderInput" @keyup.esc="isCreatredNewFolder = false" @keyup.enter="createNewFolder({state: 'input-done'})" class="t-tree-item t-tree-renaming rename-input uppercase focus w100"></input>
          </div>

        </div>

        <!-- sptecial folders -->

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showSpecialFoldersBtns" class="special-folders block on-col">
          <div class="on-row item">
            <div class="left-field">
              <img src="../assets/list.svg" alt="my documents" class="pix-btn docs">
            </div>
            <div @click="foldersMethods2.clickToSpecialFolder( 'Documents' )" class="list-item">
              <span class="t-tree-item text-nowrap uppercase">my docs</span>
            </div>
          </div>

          <div class="on-row item">
            <div class="left-field">
              <img src="../assets/load.svg" alt="downloads" class="pix-btn loads">
            </div>
            <div @click="foldersMethods2.clickToSpecialFolder( 'Downloads' )" class="list-item">
              <span class="t-tree-item text-nowrap uppercase">downloads</span>
            </div>
          </div>
        </div>


        <!-- clouds -->

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showCloudsStorageBtns" class="clouds-block block on-col">

          <div class="on-row item">
            <div class="left-field">
              <img src="../assets/cloud.svg" alt="clouds" class="pix-btn cloud">
            </div>
            <div class="list-item">
              <span class="t-tree-item text-nowrap uppercase">one drive</span>
            </div>
          </div>

          <div class="on-row item">
            <div class="left-field"></div>
            <div class="list-item">
              <span class="t-tree-item text-nowrap uppercase">google drive</span>
            </div>
          </div>

        </div>
      
    </div>
    
</template>

<style scoped lang="scss">

  $left-field: 27px;

  .pix-btn{
    width: 10px;
    height: 10px;
  }
  .vertical-center{
    margin-top: auto;
    margin-bottom: auto;
  }
  .vertical-center>img{
    display: block;
  }
  .tree-level-pix{
    opacity: .25;
    height: 10px;
    width: 10px;
  }

  .pinActive, .foldersActive{
    color:aquamarine;   //
  }
  .left-field{
    width: $left-field;
  }
  .item{
    // color: var(--text);
  }
  .item:hover{
    color: var(--pure-white);
  }

  .folders-item{
    // flex: 1 1 100%;
  }

  .delete, .pin, .add{
    padding-left: 8px;
    padding-right: 8px;
    visibility: hidden;
  }
  .btn-opacity{
    opacity: .6;
  }
  .btn-opacity:hover{
    opacity: 1;
  }
  
  .address-bar{
    margin-top: 44px;
    margin-bottom: 20px;
    opacity: .6;
  }
  .address-box{
    width: 90%;
    // flex-direction: row-reverse;
  }
  .address-block{
    overflow: hidden;
  }
  .address-bar-part{
    padding-left: 3px;
    padding-right: 3px;
  }
  .eye{
    width: 16px;
    height: 16px;
    padding-left: 8px;
    padding-right: 8px;
    margin-top: auto;
    margin-bottom: auto;
    visibility: hidden;
  }
  .address-bar:hover .eye{
    visibility: visible;
  }
  
  .tree-block{
    height: 45vh;
    padding-left: $left-field;
    // margin-top: 10px;
  }
  
  .block{
    margin-left: 10px;
    // margin-top: 10px;
  }
  .list-item{
    padding-top: 2px;
    padding-bottom: 2px;
  }
  
  .active{
    background: var(--grad-selected);
  }
  .active:hover>.delete, .active:hover>.pin, .active:hover>.add{
    visibility: visible;
  }
  .opened{
    color: antiquewhite;
  }
  .item-copy-cut{
    // background-color: bisque;
    background: var(--grad-copy-cut-colder);
  }

  .sub-item{
    padding-left: 14px;
  }
  
  .component{
    padding-top: var(--content-indent);
  }

  .rename-input{
    opacity: .8;
    border: solid 0px;
    background: var(--grad-renaming);
  }
  .rename-input:focus{
    opacity: 1;
  }

  .special-folders{
    margin-top: 41px;
  }
  .clouds-block{
    margin-top: 35px;
  }
  .docs, .loads, .cloud, .pin{
    opacity: .6;
  }

  .focus:focus{
    outline: none;
  }
</style>