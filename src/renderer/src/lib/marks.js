import { defaults } from './settings.js'

export const marksMethods = {

    stateFiles: null,
    marks: null,

    state: {
        markRenameID: null,
        newName: null,
    },

    checkIfAtLeastOneFileSelected:function(){
        
        let atLeastOneFileSelected = false
        for (const key in this.stateFiles.files) {
            if(this.stateFiles.files[key] == 'SELECTED') atLeastOneFileSelected = true
        }
        return atLeastOneFileSelected
    },

    renameMark:function(dat){

        if( !this.checkIfAtLeastOneFileSelected() ){

            if(dat.markID != this.stateFiles.defaults.unmarkedMarkID){

                if(dat.state == 'start rename'){
                    this.state.markRenameID = dat.markID
                    //
                    this.state.newName = this.marks[this.state.markRenameID].descr
                    //
                    return false
                }

                if(dat.state == 'end rename'){
                    this.marks[this.state.markRenameID].descr = dat.newName
                    //
                    this.state.markRenameID = null
                    //
                    return true
                }
            }
        }
    },

    deleteMark:function(markID){
        if(markID != this.stateFiles.defaults.unmarkedMarkID){
            // this.folders.forEach(folder => {
            //     folder.files.forEach(file => {
            //         if(file.markID == markID){file.markID = this.stateFiles.defaults.unmarkedMarkID}
            //     })
            // })
            delete this.marks[markID]
        }
    },

    newMark:function(dat){

        if(dat.newName.trim().length == 0) return

        //  for put the mark 'unmarked' at the end of the list
        delete this.marks[defaults.unmarkedMarkID]

        let newMarkId = 'mark_' + Math.floor(Math.random()*10000000)

        this.marks[newMarkId] = {

            id: newMarkId, 
            color: dat.color ? dat.color : defaults.defaultMarksColor, 
            descr: dat.newName, 
            isFolded: {text: true, imgs: true}, 
            show: true,
        }
        
        //  ..put the mark 'unmarked' at the end of the list
        this.marks[defaults.unmarkedMarkID] = {

            id: defaults.unmarkedMarkID,
            color: defaults.unmarkedColor,
            descr: "--unmarked--",
            isFolded: {text: true, imgs: true},
            show: true,
        }
    },

    setMarkToFiles:function(files, mark_ID){

        if( !this.checkIfAtLeastOneFileSelected() ) return
        // console.log(stateFiles.files)
        files.forEach(file => {
            for(let key in this.stateFiles.files){
                if( (file.id == key) && (this.stateFiles.files[key] == 'SELECTED') ){
                    file.markID = mark_ID
                    this.stateFiles.files[key] = ''
                }
            }
        })
    },

    abortMarkEdit:function(){
        this.state.markRenameID = null
    },
}