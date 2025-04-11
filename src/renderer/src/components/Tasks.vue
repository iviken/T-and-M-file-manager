<script>
import TaskItem from './TasksItem.vue'

export default {
  components:{
    TaskItem
  },
  props:{
    data:{
        type: Object,
        required: true
    }
  },
  methods: {
    createNewTask:function(){
        if(this.newTaskValue.length > 0){
            let taskID = 'task_' + Math.floor(Math.random()*10000000)
            
            this.data[taskID] = {
                id: taskID,
                name: this.newTaskValue,
                descr: '',
                isDone: false,
                isSelected: false,
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            }
        }
    },
    moveTask:function(dat){
        console.log('task: ' + dat)
    },
    deleteTask(task){
        if( Object.hasOwn(this.data, task.id) ){
            delete this.data[task.id]
        }else{
            for (const key in this.data) {
                if( Object.hasOwn(this.data[key], 'subtasks') ){            
                    if( Object.hasOwn(this.data[key].subtasks, task.id) ){
                        //
                        if( Object.keys(this.data[key].subtasks).length == 1)
                            this.data[key].subtasksAvailability = false
                        //
                        delete this.data[key].subtasks[task.id]
                    }
                }
            }
        }
    }
  },
  beforeUpdate(){},
  beforeMount(){},
  data(){
    return{
        newTaskValue: 'new task',
        selectedTaskId: null,
        selectedSubTaskId: null,
    }
  }
}
</script>

<template>

    <div @keyup.up="moveTask('up')" @keyup.down="moveTask('down')" class="task-component focus" tabindex="0">
        <div class="section on-col">
        
            <div class="pin-block scrollY on-col">
                <label v-for="task in data" :key="task.id">
                    <div v-if="task.isPinned">

                        <input type="radio" v-model="selectedTaskId" :value="task.id">
        
                        <TaskItem :task="task" :selected="task.id == selectedTaskId" :class="{selected: (!task.isDone && task.isSelected)}" @deleteTask="deleteTask"/>
        
                        <div v-for="subtask in task.subtasks" class="sub" v-if="!task.isFolded">
                            <TaskItem :task="subtask" :selected="subtask.id == selectedSubTaskId" :class="{selected: (!subtask.isDone && subtask.isSelected)}" @deleteTask="deleteTask"/>
                        </div>
        
                    </div>
                </label>
            </div>

            <div class="empty1"></div>
        
            <div class="block scrollY">
                <label v-for="task in data" :key="task.id">
                    <div v-if="!task.isPinned" class="on-col">

                        <div class="on-row">
                            <input type="radio" v-model="selectedTaskId" :value="task.id">
                            
                            <TaskItem :task="task" :selected="task.id == selectedTaskId" :class="{selected: (!task.isDone && task.isSelected)}" @deleteTask="deleteTask"/>
                        </div>
                        
                        <div v-for="subtask in task.subtasks" class="sub" v-if="!task.isFolded">
                            <TaskItem :task="subtask" :selected="subtask.id == selectedSubTaskId" :class="{selected: (!subtask.isDone && subtask.isSelected)}" @deleteTask="deleteTask"/>
                        </div>
                        
                    </div>
                </label>
                
            </div>
            
            <div class="empty1"></div>
            
            <div>
                <input type="text" v-model="newTaskValue" class="rename" @keyup.enter="createNewTask()"></input>
            </div>

        </div>
    </div>

</template>

<style scoped lang="scss">
    // @use '../scss/tasks.scss' as *;
    // .task-component{
    //     padding-bottom: 210px;
    //     height: auto;
    // }
    .task-component{
        // -webkit-mask-image: -webkit-gradient(linear, left 90%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
    }

    // @media screen and (min-height: 100vh) {
        .section{
            // height: calc( 100vh - var(--header-heigth) - var(--content-indent) - var(--pin-indent-bottom) + 10px );
        }
        .empty1{
            height: 50px;
        }
        .empty2{
            height: 200px;
        }
    // }

    // .pin-block{
    //     padding-bottom: var(--pin-indent-bottom);
    // }
    .pin-block, .block{
        max-height: 30vh;
    }
    .sub{
        margin-left: 20px;
    }
    .rename{
        background-color: antiquewhite;
        padding-left: 20px;
    }

    .selected{
        background-color: aquamarine;
    }

    .focus:focus{
        outline: none;
    }
</style>