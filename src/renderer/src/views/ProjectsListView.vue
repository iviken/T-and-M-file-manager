<script>

export default {
  components:{},
  methods: {
    openProject:function(proj_id){
        window.api.openProject(proj_id)
        this.$router.push({name: 'Browser-projects'})
    },
    deleteProject:function(proj_id){
        delete this.fullData[proj_id]
        this.hoverOnProject_ID = null
    },
    pinProject:function(proj_id){
        this.fullData[proj_id].meta.isPinned = !this.fullData[proj_id].meta.isPinned
    },
    createNewProjectFromOpenedFolders(){
        //  Copy opened fokders session in to projects bd
        let newProjectId = 'proj_' + Math.floor(Math.random()*10000000)
        this.fullData[newProjectId] = structuredClone( window.api.getSessionData() )
        //  Assign a metadata
        this.fullData[newProjectId].id = newProjectId
        this.fullData[newProjectId].meta.name = this.nameOfNewProject
        this.fullData[newProjectId].meta.created = Date.now()
        this.fullData[newProjectId].meta.lastModified = Date.now()
        this.fullData[newProjectId].meta.lastOpened = Date.now()
        this.fullData[newProjectId].meta.isPinned = false
        this.fullData[newProjectId].meta.description = this.descriptionOfNewProject
        this.fullData[newProjectId].meta.status = 'closed'

        //  !!  For new project from session marks and tasks is empty

        this.fullData[newProjectId].tasks = {}
        this.fullData[newProjectId].marks = {
            mark_unmarked: {id: 'mark_unmarked', color: 'default-color', descr: '--unmarked--', isFolded: {text: false, imgs: false}, show: true }
        }
        //  Clear folders in session
        let session = window.api.getSessionData()
        session.folders = []
    },
    renameProject:function(dat){
        if(dat.state == 'input-start'){
            if(this.selectedProjectID){
                this.renamingProjectID = this.selectedProjectID
                this.renamedValue = this.fullData[this.renamingProjectID].meta.name
            }
        }
        if(dat.state == 'input-end'){
            if(this.selectedProjectID){
                if(this.renamedValue.length > 1){
                    this.fullData[this.renamingProjectID].meta.name = this.renamedValue
                }
                this.selectedProjectID = null
                this.renamingProjectID = null
            }
        }
    },
    cancelRenaiming:function(){
        this.selectedProjectID = null
        this.renamingProjectID = null
    },
  },
  beforeMount() {
    this.fullData = window.api.getData()
    // console.log(this.fullData)
  },
  computed:{
    sortProjects(){
        return Object.fromEntries(Object.entries(this.fullData).sort(
                (a, b) => b[1].meta.lastOpened - a[1].meta.lastOpened
            )
        )
    },
  },
  data(){
    return{
        fullData: {},
        hoverOnProject_ID: null,
        hoverOnCreateNewProject: false,
        nameOfNewProject: 'give a name to your project',
        descriptionOfNewProject: '',
        renamedValue: '',
        selectedProjectID: null,
        renamingProjectID: null,
    }
  }
}
</script>

<template>

   <div @keyup.f2="renameProject({state: 'input-start'})" @keyup.esc="cancelRenaiming()" tabindex="0" class="on-col focus">

     <div class="on-row">
    
         <div class="left">
             <div v-if="hoverOnProject_ID != null">
                <div v-if="fullData[hoverOnProject_ID].meta.isPinned">
                    <span class="project-description capitalize">
                        {{ fullData[hoverOnProject_ID].meta.description }}
                    </span>
                </div>
             </div>
         </div>
    
         <div class="projects-list w100 h100 on-col right">
         
             <div class="projects-list__box w100 on-col">
                 <div v-for="(item, index) in sortProjects" class="projects-list__item w100">
                     <div v-if="item.meta.isPinned">

                         <div v-if="item.id != renamingProjectID" class="on-row" :class="{active: item.id == selectedProjectID}">

                            <div class="pin-logo"><span v-if="!index"><img src="../assets/pin.svg" class="logo"></span></div>
                            <div @mouseleave="hoverOnProject_ID = null" @mouseenter="hoverOnProject_ID = item.id" class="projects-list__name text-left on-row item">
                                <span class="item-name project-name uppercase" @click="selectedProjectID = renamingProjectID ? selectedProjectID : item.id" @dblclick="openProject(item.id)">{{ item.meta.name }}</span>
                                <!-- <span><img src="../assets/up dawn.svg" class="item__icon"></span> -->
                                <span @click="deleteProject(item.id)"><img src="../assets/x.svg" class="item__icon"></span>
                                <span @click="pinProject(item.id)"><img src="../assets/pin.svg" class="item__icon"></span>
                            </div>

                         </div>
                         
                         <div v-if="item.id == renamingProjectID">
                            <input type="text" v-model="renamedValue" :id="`${item.id}`" @keyup.enter="renameProject({state: 'input-end'})" />
                         </div>

                     </div>
                 </div>
             </div>
         
         </div>
         
     </div>

     <div class="on-row">
    
         <div class="left">
             <div v-if="hoverOnProject_ID != null">
                <div v-if="!fullData[hoverOnProject_ID].meta.isPinned">
                    <span class="project-description capitalize">
                        {{ fullData[hoverOnProject_ID].meta.description }}
                    </span>
                </div>
             </div>
         </div>
    
         <div class="projects-list w100 h100 on-col right">
         
             <div class="projects-list__box w100 on-col">
                 <div v-for="(item, index) in sortProjects" class="projects-list__item w100">
                     <div v-if="!item.meta.isPinned">

                         <div v-if="item.id != renamingProjectID" class="on-row" :class="{active: item.id == selectedProjectID}">

                            <div class="pin-logo"><span v-if="!index"><img src="../assets/pin.svg" class="logo"></span></div>
                            <div @mouseleave="hoverOnProject_ID = null" @mouseenter="hoverOnProject_ID = item.id" class="projects-list__name text-left on-row item">
                                <span class="item-name project-name uppercase" @click="selectedProjectID = renamingProjectID ? selectedProjectID : item.id" @dblclick="openProject(item.id)">{{ item.meta.name }}</span>
                                <!-- <span><img src="../assets/up dawn.svg" class="item__icon"></span> -->
                                <span @click="deleteProject(item.id)"><img src="../assets/x.svg" class="item__icon"></span>
                                <span @click="pinProject(item.id)"><img src="../assets/pin.svg" class="item__icon"></span>
                            </div>

                         </div>
                         
                         <div v-if="item.id == renamingProjectID">
                            <input type="text" v-model="renamedValue" :id="`${item.id}`" @keyup.enter="renameProject({state: 'input-end'})" />
                         </div>

                     </div>
                 </div>
             </div>
         
         </div>
         
     </div>
    
     <div class="on-row">
    
         <div class="left">
             <div v-if="hoverOnCreateNewProject" class="projects-list__description text-left">
                 <span class="project-description capitalize">Create new project from opened folders. Your marks and tasks will remain.</span>
             </div>
         </div>
    
         <div class="projects-list__box w100">
             <div @mouseleave="hoverOnCreateNewProject = false" @mouseenter="hoverOnCreateNewProject = true" class="projects-list__item w100 on-row">
                 <div class="new-proj-logo"><img src="../assets/plus.svg" class="logo"></div>
                 <div class="create w100 text-left" @click="createNewProjectFromOpenedFolders()">
                     <span class="project-name uppercase">Create new project</span>
                 </div>
             </div>
         </div>
    
     </div>

   </div>

</template>

<style scoped lang="scss">
    @use '../scss/projectsList.scss' as *;

    .left{
        width: 600px;
        background-color: black;    //
        color: var(--text);
    }

    .active{
        background-color: aquamarine;
    }

    .item:hover .item-name{
        color: var(--pure-white);
    }
    
    .create{
        color: var(--text);
    }
    .create:hover span{
        color: var(--pure-text);
    }

    .focus:focus{
        outline: none;
    }
</style>