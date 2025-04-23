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
    deleteFolder(){
      //
      this.foldersMethods2.deleteFolder()
      //
      // this.foldersMethods.refreshFolders()
    },
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
      settings:{
        replacedSymbolPath: ' > ',
        folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
      },
      defaults:{
        defaulMarkID: 'mark_unmarked',
      },
      nameOfTheFolderToBeRenamed: null,
      renameValue: '',
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
    >

        <div v-if="inputSettings[ localState.actualSessionType ].showSessionFolders" class="folders block on-row">
          <div @click="foldSessionFolders()" class="left-field">
            <div :class="{foldersActive: dataSettings.foldersIsFolded}">Folders</div>
          </div>
          <div v-if="dataSettings.foldersIsFolded" class="on-col">
            <div v-for="folder in folders" class="item">
              <div v-if="sessionFolderDisplayFilter(folder)" @click="foldersMethods2.clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( foldersMethods2.getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}">
                <span>{{ foldersMethods2.getFolderName( folder.path ) }}</span>
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
                <div @click="foldersMethods2.clickToFolder({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( foldersMethods2.getFolderName( folder.path ) ), opened: markOpenedFolder(folder.path)}">
                  <span>{{ foldersMethods2.getFolderName( folder.path ) }}</span>
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
            <div v-for="item in foldersMethods2.getFoldersList()">
              <div v-if="nameOfTheFolderToBeRenamed != item" @dblclick="renameSelectedFolder( {state: 'input-start'} )" @click="foldersMethods2.clickToFolder( {name: item, path: `${path.substring(0, path.lastIndexOf('/'))}/${item}`} )" :class="{active: markActiveFolder(item), opened: markOpenedFolder(item), 'item-copy-cut': item == foldersMethods2.copyPastFolder( {state: 'get copy-folder name'} )}" class="on-row item w100">
                <div>
                  <span class="text-nowrap">{{ item }}</span>
                </div>
                <div class="w100"></div>
                <div @click="createNewFolder( {state: 'input-start'} )"  class="add">New</div>
                <div @click="pinFolder()" class="pin">Pin</div>
                <div @click="deleteFolder()" class="delete">X</div>
              </div>
              <div v-else>
                <input type="text" :v-model="renameValue" @input="event => renameValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`${item}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done'})"></input>
              </div>
            </div>
          </div>
          
          <div class="on-col block">
            <div v-for="item in foldersMethods2.getSubfoldersList()">
              <div class="on-row item w100">
                <div>|-</div>
                <div v-if="nameOfTheFolderToBeRenamed != item" @click="foldersMethods2.clickToFolder( {name: item, path: `${path}/${item}`} )">
                  <span>{{ item }}</span>
                </div>
                <div v-else>
                  <input type="text" :v-model="renameValue" @input="event => renameValue = event.target.value.replace(settings.folderNameRegexp, '')" :id="`sub_${item}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameSelectedFolder({state: 'input-done'})"></input>
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
            <div @click="foldersMethods2.clickToSpecialFolder( 'Documents' )">my docs</div>
          </div>
          <div class="on-row item">
            <div></div>
            <div @click="foldersMethods2.clickToSpecialFolder( 'Downloads' )">downloads</div>
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
  .item-copy-cut{
    background-color: bisque;
    font-weight: bold;
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