<script>
export default {
  props:{
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
    }
  },
  methods: {
    deleteFolder:function(){
      console.log('DELETE FOLDER')
    },
    refreshFolders:function(){
      console.log('REFRESH FOLDERS')
    },
    renameFolder:function(){
      console.log('RENAME FOLDER')
      // this.state.setCmd( {cmd: 'startRenameSelectedFiles'} )
    },
    clickToFolder:function(dat){
      console.log('SELECT FOLDER')
      // this.state.setCmd( {cmd: 'switchFolderInTree', name: dat.name, path: dat.path} )
    },
    markActiveFolder:function(name){
      return name == this.path.split('/')[ this.path.split('/').length - 1 ]
    },
    createNewFolder:function(){
      console.log('CREATE FOLDER')
    },
    getFolderName:function(pathIn){
      return pathIn.split('/')[ pathIn.split('/').length - 1 ]
    },
    clickToFolder2:function(dat){
      console.log('click to path in tree: ' + dat.path)
      //
      this.selectedFolderID = dat.folderID
      //
    },
    pinFolder:function(){
      //
      if( this.inputSettings[ this.localState.actualSessionType ].showPinFolders ){
        //
        this.folders.forEach(folder => {
          if(folder.id == this.selectedFolderID){
            folder.isPinned = !folder.isPinned
          }
        })
      }
    },
    foldPin:function(){
      this.dataSettings.pinFoldersIsFolded = !this.dataSettings.pinFoldersIsFolded
    },
  },
  beforeMount(){
    this.selectedFolderID = this.folders[ this.localState.activeFolderIndex ].id
    // console.log( this.folders[ this.localState.activeFolderIndex ].path )
    //
    this.folderList =  window.api.getFolderNames( this.folders[this.localState.activeFolderIndex].path.substring(0, this.folders[this.localState.activeFolderIndex].path.lastIndexOf('/') ) )
    //
    this.subfolderList =  window.api.getFolderNames( this.folders[ this.localState.activeFolderIndex ].path )
  },
  data(){
    return{
      settings:{
        replacedSymbolPath: ' > ',
      },
      selectedFolderID: null,
      folderList: null,
      subfolderList: null,
    }
  }
}
</script>

<template>
  <div 
    class="h100 this on-col" 
    tabindex="0" 
    @keyup.f2="renameFolder()" 
    @keyup.f5="refreshFolders()"
    @keyup.delete="deleteFolder()"
    @keyup.ctrl.d="pinFolder()"
    @keyup.shift.ctrl.n="createNewFolder()"
  >

      <div v-if="this.inputSettings[ this.localState.actualSessionType ].showPinFolders" class="pin-block on-row">
        <div @click="foldPin()" class="pin left-field">
          <div :class="{pinActive: dataSettings.pinFoldersIsFolded}">Pin</div>
        </div>
        <div v-if="!dataSettings.pinFoldersIsFolded" class="on-col">
          <div v-for="folder in folders" class="item">
            <div v-if="folder.isPinned">
              <div @click="clickToFolder2({path: folder.path, folderID: folder.id})" :id="folder.id" :class="{active: markActiveFolder( getFolderName( folder.path ) )}">
                <span>{{ getFolderName( folder.path ) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="path"><span>{{ path.replace(/\//g, settings.replacedSymbolPath) }}</span></div>

      <div class="on-col block">
        <div v-for="item in folderList" class="item">
          <div @click="clickToFolder2({name: item, path: path})" :class="{active: markActiveFolder(item)}">
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="on-col block">
        <div v-for="item in subfolderList" class="item">
          <div class="on-row">
            <div>|-</div>
            <div @click="clickToFolder2({name: item, path: `${path}/${item}`})" :class="{active: markActiveFolder(item)}">
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="this.inputSettings[ this.localState.actualSessionType ].showSpecialFoldersBtns" class="on-col block">
        <div class="on-row item">
          <div></div>
          <div>my docs</div>
        </div>
        <div class="on-row item">
          <div></div>
          <div>downloads</div>
        </div>
      </div>

      <div v-if="this.inputSettings[ this.localState.actualSessionType ].showCloudsStorageBtns" class="on-col">
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
  .pinActive{
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
  .path{
    color: var(--text);
  }

  .block{
    margin-bottom: 20px;
  }
  
  .active{
    background-color: aquamarine;
  }
  
  .this{
    padding-top: var(--top-indent);
  }
  .this:focus{
    outline: none;
  }
</style>