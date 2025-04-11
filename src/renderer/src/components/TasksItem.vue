<script>
export default {
  props:{
    task:{
        type: Object,
        required: true
    },
    selected:{
        type: Boolean,
        required: true
    }
  },
  methods: {
    selectTask:function(id){
        console.log(this.selected)
    },
    checkToTask: function(id){
        this.task.isDone = !this.task.isDone
        //  Checks all sub-tasks status 'done'. If all sub-tasks are 'done', assign the task status 'done'
        //          TO  DO
        if(this.task.subtasksAvailability){
            let allSubtasksIsDone = true
            for (const key in this.task.subtasks) {
                if(!this.task.subtasks[key].isDone) allSubtasksIsDone = false
            }
            //
            if(allSubtasksIsDone) this.task.isDone = true
        }
    },
    pinTask:function(){
        // console.log('pin!')
        if( Object.hasOwn(this.task, 'subtasks') ){            
            this.task.isPinned = !this.task.isPinned
        }
    },
    renameTask:function(dat){
        if(dat.state == 'input-start') {
            this.isRemaned = true
            this.renamedValue = dat.name
        }
        if(dat.state == 'input-done'){
            if(this.renamedValue.length > 0){
                this.task.name = this.renamedValue
                this.isRemaned = false
            }
        }
    },
    addSubTask:function(){
        if(this.task.id.indexOf('sub')!=0){
            let subID = 'sub' + Math.floor(Math.random()*10000000)

            this.task.subtasksAvailability = true
            this.task.isFolded = false

            this.task.subtasks[subID] = {
                id: subID,
                name: 'new sub-task',
                descr: 'description...',
                isDone: false,
                isSelected: false,
                subtasksAvailability: false,
            }
        }
    },
    foldTask:function(){
        if(this.task.id.indexOf('sub') == -1) this.task.isFolded = !this.task.isFolded
    }
  },
  data(){
    return{
        isRemaned: false,
        renamedValue: '',
    }
  },
  beforeUpdate(){
    this.task.isSelected = this.selected
  },
}
</script>

<template>

        <div v-if="!isRemaned" class="task w100 on-row focus" @keyup.ctrl.d="pinTask(task.id)" tabindex="0">

            <div class="btn check-box" @click="checkToTask(task.id)" v-if="!task.subtasksAvailability"><div class="check"></div></div>
            <div class="btn fold-box" @click="foldTask()" v-if="task.subtasksAvailability"><div>V</div></div>

            <div class="w100 on-row">

                <div @click="selectTask(task.id)" @dblclick="renameTask({state: 'input-start', name: task.name})">
                    <span :class="{done: task.isDone}">{{ task.name }}</span>
                </div>
                <!-- <div class="btn up-dawn" v-if="task.status!='active'">**</div> -->
                <div class="btn pin" v-if="task.id.indexOf('sub') != 0" @click="pinTask()">pin</div>
                <!-- <div class="btn pin" v-if="(task.status=='active')&&(task.id.indexOf('sub')!=0)" @click="pinTask()">pin</div> -->
                <div class="btn delete" v-if="task.isDone" @click="this.$emit('deleteTask', this.task)">x</div>

                <div v-if="task.id.indexOf('sub')!=0">
                    <div class="btn add" v-if="!task.isDone" @click="addSubTask()">+</div>
                </div>
                
            </div>

        </div>

        <div v-else>
            <input type="text" v-model="renamedValue" :id="`${task.id}`" class="rename" @keyup.esc="isRemaned = false" @keyup.enter="renameTask({state: 'input-done'})"></input>
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

    // .active{
    //     background-color: aquamarine;
    // }
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