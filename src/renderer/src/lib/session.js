export const sessionMethods = {

    openProject:function(proj_id){

        window.api.openProject(proj_id)
        // this.$router.push({name: 'Browser-projects'})
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
}