<script>
export default {
  props:{
    foldersMethods:{
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
    deleteFolder(){
      //
      this.foldersMethods.deleteFolder()
      //
      // this.foldersMethods.refreshFolders()
    },
    // deleteFolder:function(){
    //   console.log('DELETE FOLDER')
    //   //
    //   let res = false
    //   const oldPath = this.folders[ this.localState.activeFolderIndex ].path
    //   const upPath = oldPath.slice( 0, oldPath.lastIndexOf(this.getFolderName(oldPath)) - 1 )
    //   const prevFoldersIndex = this.localState.previousFolderIndex
    //   const deletedFoldersIndex = this.localState.activeFolderIndex
    //   //
    //   res = window.api.deleteFolder( oldPath )
    //   //
    //   if(res == undefined){
    //     //
    //     if( this.inputSettings[this.localState.actualSessionType].openPreviousFolderAfterClosingActiveOne ){
    //       //
    //       if( !prevFoldersIndex || (prevFoldersIndex == this.localState.activeFolderIndex) ){
    //         //
    //         this.clickToFolder( {path: upPath, folderID: ''} )
    //       }else{
    //         //
    //         this.localState.activeFolderIndex = this.localState.previousFolderIndex
    //         //
    //         this.clickToFolder( {path: this.folders[ this.localState.activeFolderIndex ].path, folderID: this.folders[ this.localState.activeFolderIndex ].id} )
    //       }
    //     }else{
    //       //
    //       // console.log('up-path: ' + this.getFolderName(oldPath))
    //       // console.log('up-path: ' + (oldPath.lastIndexOf(this.getFolderName(oldPath)) - 1) )
    //       console.log('up-path: ' + upPath)
    //       this.clickToFolder( {path: upPath, folderID: ''} )
    //     }
    //     //  Delete folder in db
    //     this.folders.splice( deletedFoldersIndex, 1 )
    //     //
    //     console.log('refresh after deleting')
    //     this.refreshFolders()
    //   }
    // },
    markActiveFolder:function(name){
      return name == this.path.split('/')[ this.path.split('/').length - 1 ]
    },
    markOpenedFolder:function(dat){},
    pinFolder:function(){
      //
      if( this.inputSettings[ this.localState.actualSessionType ].showPinFolders ){
        //
        this.foldersMethods.pinFolder()
        // this.foldersMethods.pinFolder(this.selectedFolderID)
      }
    },
    foldPin:function(){
      this.dataSettings.pinFoldersIsFolded = !this.dataSettings.pinFoldersIsFolded
    },
    foldSessionFolders:function(){
      this.dataSettings.foldersIsFolded = !this.dataSettings.foldersIsFolded
    },
    clickToAddressBarPart:function(dat){
      // console.log('click to address: ' + dat.path)
      //
      this.foldersMethods.clickToFolder(dat)
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
      this.foldersMethods.bortCopyCutOperation()
      //
      this.renameSelectedFolder( {state: 'abort'} )
    },
    renameSelectedFolder:function(dat){
        //
        if(dat.state == 'input-start'){
          this.remanedFolderName = this.foldersMethods.getFolderName( this.folders[ this.localState.activeFolderIndex ].path )
        }
        //
        if(dat.state == 'abort'){
          this.remanedFolderName = null
        }
        //
        if(dat.state == 'input-done'){
          //  Check input new folder name on spaces
          if( this.foldersMethods.validateFolderAndFileName(this.renamedValue) ){
            //
            this.renamedValue = this.renamedValue.trim()
            // console.log('RENAME FOLDER')
            let result = this.foldersMethods.renameSelectedFolder( {newName: this.renamedValue, folderList: this.folderList} )
            //
            if(result){
              //
              this.renamedValue = ''
              //  For hide input element
              this.remanedFolderName = null
              //  Refresh folders
              this.foldersMethods.refreshFolders()
            }
          }
        }
    },
    createNewFolder:function(dat){
        console.log('CREATE FOLDER')
        //
        if(dat.state == 'input-start'){
          //
          this.isCreatredNewFolder = true
        }
        if(dat.state == 'input-done'){

          if( this.foldersMethods.validateFolderAndFileName(newFolderName) ){

            let result = this.foldersMethods.createNewFolder( this.newFolderName )

            if(result){
              //
              this.isCreatredNewFolder = false
            }
          }
        }
    },
  },
  beforeMount(){
    this.foldersMethods.selectedFolderID = this.folders[ this.localState.activeFolderIndex ].id
    // this.selectedFolderID = this.folders[ this.localState.activeFolderIndex ].id
    //
    this.foldersMethods.folderNavigationHistory.push( this.folders[ this.localState.activeFolderIndex ].path )
    //
    this.foldersMethods.clearNonExistFoldersInDB()
    //
    this.foldersMethods.refreshFolders()
  },
  beforeUpdate(){
    //
    if( this.localState.activeFolderIndex != this.localState.previousFolderIndex ) this.foldersMethods.refreshFolders()

    
    // if(this.lastFolderIndex != this.localState.activeFolderIndex){
    //   this.refreshFolders()
    //   //
    //   this.lastFolderIndex = this.localState.activeFolderIndex
    // }
  },
  data(){
    return{
      settings:{
        replacedSymbolPath: ' > ',
        folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
      },
      defaults:{
        defaulMarkID: 'mark_unmarked',
      },
      remanedFolderName: null,
      renamedValue: '',
      isCreatredNewFolder: false,
      newFolderName: '',
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
      class="component focus h100 on-col" 
      tabindex="0" 
      @keyup.f2="renameSelectedFolder( {state: 'input-start'} )" 
      @keyup.esc="pressEsc()" 
      @keyup.ctrl.d="pinFolder()"
      @keyup.f5="foldersMethods.refreshFolders()"
      @keyup.shift.ctrl.n="createNewFolder( {state: 'input-start'} )"
      @keyup.ctrl.n="createNewFolder( {state: 'input-start'} )"
      @keyup.ctrl.c="foldersMethods.copyPastFolder( {state: 'copy folder'} )"
      @keyup.ctrl.v="foldersMethods.copyPastFolder( {state: 'past folder'} )"
      @keyup.ctrl.x="foldersMethods.copyPastFolder( {state: 'cut folder'} )"
      @keyup.up="foldersMethods.treeNavigate('adjacent folder: up')"
      @keyup.down="foldersMethods.treeNavigate('adjacent folder: down')"
      @keyup.right="foldersMethods.treeNavigate('first child folder')"
      @keyup.left="foldersMethods.treeNavigate('parent folder')"
      @keyup.backspace="foldersMethods.treeNavigate('previous folder in history')"
    >

        <div v-if="inputSettings[ localState.actualSessionType ].showSessionFolders" class="folders block on-row">
          <div @click="foldSessionFolders()" class="left-field">
            <div :class="{foldersActive: dataSettings.foldersIsFolded}">Folders</div>
          </div>
          <div v-if="dataSettings.foldersIsFolded" class="on-col">
            <div v-for="folder in folders" class="item">
              <div v-if="sessionFolderDisplayFilter(folder)" @click="foldersMethods.clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( foldersMethods.getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}">
                <span>{{ foldersMethods.getFolderName( folder.path ) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showPinFolders" class="pin-block block on-row focus" tabindex="0" >
          <div @click="foldPin()" class="pin-logo left-field">
            <div :class="{pinActive: dataSettings.pinFoldersIsFolded}">Pin</div>
          </div>
          <div v-if="!dataSettings.pinFoldersIsFolded" class="on-col">
            <div v-for="folder in folders" class="item">
              <div v-if="folder.isPinned">
                <div @click="foldersMethods.clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( foldersMethods.getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}">
                  <span>{{ foldersMethods.getFolderName( folder.path ) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="address-bar on-row">
          <div v-for="(part, index) of getPathForAddressBar" class="on-row">
            <div @click="clickToAddressBarPart( {path: path.split('/').slice(0, index + 1).join('/')} )" class="address-part">
              {{ part }}
            </div>
            <div>
              {{ settings.replacedSymbolPath }}
            </div>
          </div>
        </div>

        <div class="tree on-col focus scrollY" tabindex="0">

          <div class="on-col block">
            <div v-for="item in foldersMethods.folderList">
              <div v-if="remanedFolderName != item" @dblclick="renameSelectedFolder( {state: 'input-start'} )" @click="foldersMethods.clickToFolder( {name: item, path: `${path.substring(0, path.lastIndexOf('/'))}/${item}`} )" :class="{active: markActiveFolder(item), opened: markOpenedFolder(item), 'item-copy-cut': item == foldersMethods.copyCutFolderName}" class="on-row item w100">
                <div>
                  <span class="text-nowrap">{{ item }}</span>
                </div>
                <div class="w100"></div>
                <div @click="createNewFolder( {state: 'input-start'} )"  class="add">New</div>
                <div @click="pinFolder()" class="pin">Pin</div>
                <div @click="deleteFolder()" class="delete">x</div>
              </div>
              <div v-else>
                <input type="text" :v-model="renamedValue" @input="event => renamedValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`${item}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done'})"></input>
              </div>
            </div>
          </div>
          
          <div class="on-col block">
            <div v-for="item in foldersMethods.subfolderList">
              <div class="on-row item w100">
                <div>|-</div>
                <div v-if="remanedFolderName != item" @click="foldersMethods.clickToFolder( {name: item, path: `${path}/${item}`} )">
                  <span>{{ item }}</span>
                </div>
                <div v-else>
                  <input type="text" :v-model="renamedValue" @input="event => renamedValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`sub_${item}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done'})"></input>
                </div>
              </div>
            </div>
          </div>
          
          <div class="new-folder w100">
            <input type="text" v-if="isCreatredNewFolder" :v-model="newFolderName" @input="event => newFolderName = event.target.value.replace(settings.folderNameRegexp, '')" id="newFolderInput" class="rename" @keyup.esc="isCreatredNewFolder = false" @keyup.enter="createNewFolder({state: 'input-done'})"></input>
          </div>

        </div>

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showSpecialFoldersBtns" class="special-folders on-col block">
          <div class="on-row item">
            <div></div>
            <div @click="foldersMethods.clickToSpecialFolder( 'Documents' )">my docs</div>
          </div>
          <div class="on-row item">
            <div></div>
            <div @click="foldersMethods.clickToSpecialFolder( 'Downloads' )">downloads</div>
          </div>
        </div>

        <div v-if="this.inputSettings[ this.localState.actualSessionType ].showCloudsStorageBtns" class="clouds on-col">
          <div class="on-row item">
            <div></div>
            <div>one drive</div>
          </div>
          <div class="on-row item">
            <div></div>
            <div>google drive</div>
          </div>
        </div>
      
    </div>
</template>

<style scoped lang="scss">
  // @use '../scss/tree.scss' as *;
  .pinActive, .foldersActive{
    color:aquamarine;   //
  }
  .left-field{
    width: 50px;
    opacity: .4;
  }
  .item{
    color: var(--text);
  }
  .item:hover{
    color: var(--pure-white);
  }
  .item-copy-cut{
    background-color: bisque;
  }
  .delete, .pin, .add{
    visibility: hidden;
  }
  
  .address-bar{
    color: var(--text);
  }
  .address-part:hover{
    color: var(--pure-white);
  }
  
  .tree{
    height: 50vh;
  }
  
  .block{
    margin-top: 20px;
  }
  
  .active{
    background-color: aquamarine;
  }
  .active:hover>.delete, .active:hover>.pin, .active:hover>.add{
    visibility: visible;
  }
  .opened{
    color: antiquewhite;
  }
  
  .component{
    padding-top: var(--top-indent);
  }

  .rename{
    background-color: antiquewhite;
  }

  .focus:focus{
    outline: none;
  }
</style>