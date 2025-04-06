<script>
export default {
  props:{
    data:{
        type: Object,
        required: true
    },
    task:{
        type: Object,
        required: true
    }
  },
  methods: {
    selectTask:function(id){
        if(this.data[id].status == 'undone') {
            for (const key in this.data) {
                if(this.data[key].status == 'active') this.data[key].status = 'undone'
                for(const subkey in this.data[key].subtasks) {
                    if(this.data[key].subtasks[subkey].status == 'active') this.data[key].subtasks[subkey].status = 'undone'
                }
            }
            this.data[id].status = 'active'
        }else{
            if(this.data[id].status == 'active') this.data[id].status = 'undone'
        }
    },
    checkToTask: function(id){
        this.data[id].status = this.data[id].status == 'done' ? 'undone' : 'done'
        //  Checks all sub-tasks status 'done'. If all sub-tasks are 'done', assign the task status 'done'
        //          TO  DO
        if(this.data[id].subtasksAvailability){
            let allSubtasksIsDone = true
            for (const key in this.data[id].subtasks) {
                if(this.data[id].subtasks[key].status != 'done') allSubtasksIsDone = false
            }
            //
            if(allSubtasksIsDone) this.data[id].status = 'done'
        }
    },
    pinTask:function(id){
        if(this.data[id].status == 'active'){
            this.data[id].isPinned = !this.data[id].isPinned
        }
    },
    deleteTask:function(id){
        delete this.data[id]
    },
    renameTask:function(dat){
        if(dat.state == 'input-start') {
            this.isRemaned = true
            this.renamedValue = dat.name
            // console.log(dat.name)
        }
        if(dat.state == 'input-done'){
            if(this.renamedValue.length > 0){
                this.data[dat.id].name = this.renamedValue
                this.isRemaned = false
            }
        }
    },
    addSubTask:function(id){
        if(id.indexOf('sub')!=0){
            let subID = 'sub' + Math.floor(Math.random()*10000000)

            this.data[id].subtasksAvailability = true
            this.data[id].isFolded = false

            this.data[id].subtasks[subID] = {
                id: subID,
                name: 'new sub-task',
                descr: 'description...',
                status: 'undone',
                subtasksAvailability: false,
            }
        }
    },
    foldTask:function(id){
        this.data[id].isFolded = !this.data[id].isFolded
    }
  },
  data(){
    return{
        isRemaned: false,
        renamedValue: '',
    }
  }
}
</script>

<template>

        <div v-if="!isRemaned" class="task w100 on-row focus" @keyup.ctrl.d="pinTask(task.id)" :class="`${task.status}`" tabindex="0">

            <div class="btn check-box" @click="checkToTask(task.id)" v-if="!task.subtasksAvailability"><div class="check"></div></div>
            <div class="btn fold-box" @click="foldTask(task.id)" v-if="task.subtasksAvailability"><div>V</div></div>

            <div class="w100 on-row">

                <div @click="selectTask(task.id)" @dblclick="renameTask({state: 'input-start', name: task.name})"><span>{{ task.name }}</span></div>
                <!-- <div class="btn up-dawn" v-if="task.status!='active'">**</div> -->
                <div class="btn pin" v-if="(task.status=='active')&&(task.id.indexOf('sub')!=0)" @click="pinTask(task.id)">pin</div>
                <div class="btn delete" v-if="task.status=='done'" @click="deleteTask(task.id)">x</div>

                <div v-if="task.id.indexOf('sub')!=0">
                    <div class="btn add" v-if="task.status!='done'" @click="addSubTask(task.id)">+</div>
                </div>
                
            </div>

        </div>

        <div v-else>
            <input type="text" v-model="renamedValue" :id="`${task.id}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameTask({state: 'input-done', id: task.id})"></input>
        </div>

</template>

<style scoped lang="scss">
    // @use '../scss/tasks.scss' as *;
    .btn{
        color: var(--text);
        opacity: 0;
        width: 20px;
    }
    .check-box:hover .check{
        border: solid 2px var(--pure-white);
    }
    .check{
        width: 10px;
        height: 10px;
        margin: 3px;
        border: solid 2px var(--text);
    }
    .task{
        color: var(--text);
    }
    .task:hover{
        color: var(--pure-white);
    }
    .task:hover .btn{
        opacity: 1;
    }

    .active{
        background-color: aquamarine;
    }
    .done{
        text-decoration:line-through;
    }
    .rename{
        background-color: antiquewhite;
        padding-left: 20px;
    }

    .focus:focus{
        outline: none;
    }
</style>