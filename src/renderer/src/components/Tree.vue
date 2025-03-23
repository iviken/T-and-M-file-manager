<script>
export default {
  props:{
    tree:{
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
      this.state.setCmd( {cmd: 'switchFolderInTree', name: dat.name, path: dat.path} )
    },
    checkFolderForActive:function(name){
      return name == this.path.split('/')[ this.path.split('/').length - 1 ]
    }
  },
  data(){
    return{
      settings:{
        replacedSymbolPath: ' > ',
      }
    }
  }
}
</script>

<template>
  <div 
    class="h100 this" 
    tabindex="0" 
    @keyup.f2="renameFolder()" 
    @keyup.f5="refreshFolders()"
    @keyup.delete="deleteFolder()"
  >

      <div class="path"><span>{{ path.replace(/\//g, settings.replacedSymbolPath) }}</span></div>

      <div class="on-col block">
        <div v-for="item in tree.upFolders" class="item">
          <div @click="clickToFolder({name: item, path: path})" :class="{active: checkFolderForActive(item)}">
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="on-col block">
        <div v-for="item in tree.folders" class="item">
          <div class="on-row">
            <div>|-</div>
            <div @click="clickToFolder({name: item, path: path})" :class="{active: checkFolderForActive(item)}">
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="on-col block">
        <div class="on-row item">
          <div></div>
          <div>my docs</div>
        </div>
        <div class="on-row item">
          <div></div>
          <div>downloads</div>
        </div>
      </div>

      <div class="on-col">
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