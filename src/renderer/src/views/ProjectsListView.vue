<script>
export default {
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

        //  Copy opened folders session in to projects bd from browser session
        let newProjectId = 'proj_' + Math.floor(Math.random()*100000000000)

        this.fullData[newProjectId] = structuredClone( window.api.getSessionData().proj_default )
        // console.log(this.fullData[newProjectId])
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
            mark_unmarked: {
                id: 'mark_unmarked', 
                color: this.defaults.defaultMark.color, 
                descr: this.defaults.defaultMark.descr, 
                isFolded: {text: false, imgs: false}, show: true 
            }
        }
        //  Clear folders in browser session
        let session = window.api.getSessionData().proj_default       //  Browser session
        
        //  Delete all folders except for the open folder
        session.folders.filter(folder => folder.isOpened)
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

                this.renamedValue.trim()
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

    this.fullData = window.api.getProjectData()
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
        defaults:{
            defaultMark:{
                color: 'default-color',
                descr: '--unmarked--',
            },
        },
    }
  }
}
</script>

<template>

   <div @keyup.f2="renameProject({state: 'input-start'})" @keyup.esc="cancelRenaiming()" tabindex="0" class="focus projects-list-component on-row h100 w100">

        <div class="fill on-row w100 h100">

            <div class="left-block left-side h100"></div>
             
            <div class="right-block right-side h100"></div>

        </div>

        <div class="content on-col w100 h100">

            <div class="pin-block on-row w100">

                <div class="pin-list left-side on-row">

                    <div class="w100"></div>

                    <div v-if="hoverOnProject_ID != null" class="info">
                        <div v-if="fullData[hoverOnProject_ID].meta.isPinned">
                            <span class="t-project-descr project-description">
                                {{ fullData[hoverOnProject_ID].meta.description }}
                            </span>
                        </div>
                    </div>

                </div>
                
                <div class="pin-list right-side">
                
                    <div class="w100 on-col">
                        <div v-for="(item, index) in sortProjects" class="w100">
                            <div v-if="item.meta.isPinned">

                                <div v-if="item.id != renamingProjectID" :class="{active: item.id == selectedProjectID}" class="projects-list__item on-row">

                                    <div class="pin-logo">
                                        <!-- <span v-if="!index"> -->
                                            <img src="../assets/pin.svg" class="pix-btn">
                                        <!-- </span> -->
                                    </div>
                                    <div @mouseleave="hoverOnProject_ID = null" @mouseenter="hoverOnProject_ID = item.id" class="projects-list__name on-row item">
                                        <span @click="selectedProjectID = renamingProjectID ? selectedProjectID : item.id" @dblclick="openProject(item.id)" class="item-name t-project-name uppercase">{{ item.meta.name }}</span>
                                        <!-- <span><img src="../assets/up dawn.svg" class="item__icon"></span> -->
                                         <div class="btn on-center">
                                             <span @click="deleteProject(item.id)"><img src="../assets/x.svg" class="item__icon"></span>
                                        </div>
                                        <div class="btn on-center">
                                            <span @click="pinProject(item.id)"><img src="../assets/unpin.svg" class="item__icon"></span>
                                        </div>
                                    </div>

                                </div>
                                
                                <div v-if="item.id == renamingProjectID" class="rename-box">
                                    <input type="text" v-model="renamedValue" :id="`${item.id}`" @keyup.enter="renameProject({state: 'input-end'})" class="item-name t-project-name t-project-renaming rename-inputbox focus w100" />
                                </div>

                            </div>
                        </div>
                    </div>
                
                </div>

            </div>

            <div class="unpin-block on-row w100">

                <div class="unpin-list left-side on-row">

                    <div class="w100"></div>

                    <div v-if="hoverOnProject_ID != null" class="info">
                        <div v-if="!fullData[hoverOnProject_ID].meta.isPinned">
                            <span class="t-project-descr project-description">
                                {{ fullData[hoverOnProject_ID].meta.description }}
                            </span>
                        </div>
                    </div>

                </div>

                <div class="unpin-list right-side">
            
                    <div class="w100 on-col">
                        <div v-for="(item, index) in sortProjects" class="w100">
                            <div v-if="!item.meta.isPinned">

                                <div v-if="item.id != renamingProjectID" :class="{active: item.id == selectedProjectID}" class="projects-list__item on-row">

                                    <!-- <div class="pin-logo"><span v-if="!index"><img src="../assets/pin.svg" class=""></span></div> -->
                                    <div class="pin-logo"><span></span></div>
                                    <div @mouseleave="hoverOnProject_ID = null" @mouseenter="hoverOnProject_ID = item.id" class="projects-list__name item on-row">
                                        <span class="item-name t-project-name uppercase" @click="selectedProjectID = renamingProjectID ? selectedProjectID : item.id" @dblclick="openProject(item.id)">{{ item.meta.name }}</span>
                                        <!-- <span><img src="../assets/up dawn.svg" class="item__icon"></span> -->
                                        <div class="btn on-center">
                                            <span @click="deleteProject(item.id)"><img src="../assets/x.svg" class="item__icon"></span>
                                        </div>
                                        <div class="btn on-center">
                                            <span @click="pinProject(item.id)"><img src="../assets/pin.svg" class="item__icon"></span>
                                        </div>
                                    </div>

                                </div>
                                
                                <div v-if="item.id == renamingProjectID" class="rename-box">
                                    <input type="text" v-model="renamedValue" :id="`${item.id}`" @keyup.enter="renameProject({state: 'input-end'})" class="item-name t-project-name t-project-renaming uppercase rename-inputbox focus w100" />
                                </div>

                            </div>
                        </div>
                    </div>
        
                </div>

            </div>

            <div class="create-block on-row w100">

                <div class="new-list left-side on-row">

                    <div class="w100"></div>

                    <div v-if="hoverOnCreateNewProject" class="info">
                        <span class="t-project-descr project-description">Create new project from opened folders. Your marks and tasks will remain.</span>
                    </div>

                </div>

                <div class="new-list right-side">
                    <div class="w100">
                        <div @mouseleave="hoverOnCreateNewProject = false" @mouseenter="hoverOnCreateNewProject = true" class="w100 on-row">
                            <div class="new-proj-logo"><img src="../assets/plus.svg" class="pix-btn"></div>
                            <div class="create w100" @click="createNewProjectFromOpenedFolders()">
                                <span class="t-project-name uppercase">Create new project</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

   </div>

</template>

<style scoped lang="scss">
    @use '../scss/projectsList.scss' as *;
    
    .pix-btn{
        opacity: .6;
        width: 10px;
        height: 10px;
    }
    // .btn:hover{
    //     opacity: 1;     
    // }

    .projects-list-component{
        height: 90vh;
        position: relative;
    }
    .fill{
        position: absolute;
        top: 0px;
        left: 0px;
        background: var(--grad-projects-list-back);
    }
    .left-block{
        background: var(--grad-projects-list-left-1), var(--grad-projects-list-left-2);
    }
    .right-block{
        background: var(--grad-projects-list-right-shadow);
    }

    .content{
        z-index: 1;
    }

    .left-side{
        width: 35%;
        padding-right: 140px;
    }
    .right-side{
        width: 65%;
    }

    .projects-list__item{
        padding-top: 3px;
        padding-bottom: 3px;
    }

    .new-proj-logo{
        margin-top: auto;
        margin-bottom: auto;
    }

    .pin-block{
        padding-top: 115px;
    }
    .unpin-block{
        margin-top: 70px;
    }
    .create-block{
        margin-top: 97px;
    }

    .info{
        width: 350px;
    }

    .rename-box{
        padding-left: 65px;
        background: var(--grad-projects-list-rename);
    }
    .rename-inputbox{
        border: solid 0px;
        background-color: rgba(0,0,0,0);
    }

    @media screen and (min-width: 1501px) {     //  fullscreen

    }
    
    @media screen and (max-width: 1500px) and (min-width: 1001px) {

    }
    
    @media screen and (max-width: 1000px) {

    }

    .active{
        background: var(--grad-projects-list-selected);
    }

    .item:hover .item-name{
        margin-right: 20px;
    }

    .focus:focus{
        outline: none;
    }
</style>