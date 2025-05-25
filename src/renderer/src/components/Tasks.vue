<script>
import TaskItem from './TasksItem.vue'

export default {

  components:{
    TaskItem
  },

  props:{
    tasks:{
        type: Object,
        required: true
    }
  },

  methods:{

    createNewTask:function(){

        if(this.newTaskValue.length > 0){

            let taskID = 'task_' + Math.floor(Math.random()*10000000)
            
            this.tasks[taskID] = {
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

        if( Object.hasOwn(this.tasks, task.id) ){

            delete this.tasks[task.id]
        }else{

            for (const key in this.tasks) {
                
                if( Object.hasOwn(this.tasks[key], 'subtasks') ){            
                    if( Object.hasOwn(this.tasks[key].subtasks, task.id) ){
                        //
                        if( Object.keys(this.tasks[key].subtasks).length == 1)
                            this.tasks[key].subtasksAvailability = false
                        //
                        delete this.tasks[key].subtasks[task.id]
                    }
                }
            }
        }
    },
},

computed:{
    
    isThereAtLeastOneAttachedTask(){

        return Object.values(this.tasks)
            .find(task=>task.isPinned == true)
    },
  },

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
        
            <!-- pin block -->

            <div v-if="isThereAtLeastOneAttachedTask" class="pin-block on-row">

                <!-- left field -->

                <div class="left-field">
                    <img src="../assets/pin.svg" alt="" class="pix-btn">
                </div>

                <div class="scrollY on-col w100">

                    <label v-for="task in tasks" :key="task.id">
                        <div v-if="task.isPinned">
    
                            <!-- tasks -->

                            <div class="on-row">
                                <input type="radio" v-model="selectedTaskId" :value="task.id" class="hide radio">
                
                                <TaskItem :task="task" :selected="task.id == selectedTaskId" :class="{selected: (!task.isDone && task.isSelected)}" @deleteTask="deleteTask"/>
                            </div>

                            <!-- subtasks -->
            
                            <div v-if="!task.isFolded" v-for="subtask in task.subtasks" class="sub on-col">
                                <TaskItem :task="subtask" :selected="subtask.id == selectedSubTaskId" :class="{selected: (!subtask.isDone && subtask.isSelected)}" @deleteTask="deleteTask"/>
                            </div>
            
                        </div>
                    </label>

                </div>

            </div>

            <div class="empty1"></div>

            <!-- unpin block -->

            <div class="block on-row">

                <!-- left field -->

                <div class="left-field"></div>
            
                <div class="scrollY on-col w100">
                    
                    <label v-for="task in tasks" :key="task.id">
                        <div v-if="!task.isPinned" class="on-col">

                            <!-- tasks -->
    
                            <div class="on-row">
                                <!-- &#9724; &#9723;s -->
                                <input type="radio" v-model="selectedTaskId" :value="task.id" class="hide radio">
                                
                                <TaskItem :task="task" :selected="task.id == selectedTaskId" :class="{selected: (!task.isDone && task.isSelected)}" @deleteTask="deleteTask"/>
                            </div>

                            <!-- sub-tasks -->
                            
                            <div v-if="!task.isFolded" v-for="subtask in task.subtasks" class="sub on-col">
                                <TaskItem :task="subtask" :selected="subtask.id == selectedSubTaskId" :class="{selected: (!subtask.isDone && subtask.isSelected)}" @deleteTask="deleteTask"/>
                            </div>
                            
                        </div>
                    </label>
                    
                </div>

            </div>

            
            <div class="empty1"></div>
            
            <!-- create new task btn -->

            <div class="create on-row">
                <div class="left-field"></div>
                <input type="text" placeholder="new task" v-model="newTaskValue" @keyup.enter="createNewTask()" class="create-input t-task uppercase w100 focus"></input>
            </div>

        </div>
        
    </div>

</template>

<style scoped lang="scss">

    .task-component{
        padding-top: var(--content-indent);
    }
    .section{
        // height: calc( 100vh - var(--header-heigth) - var(--content-indent) - var(--pin-indent-bottom) + 10px );
    }

    .left-field{
        width: 10px;
    }

    .pix-btn{
        opacity: .6;
        width: 10px;
        height: 10px;
    }

    .empty1{
        height: 50px;
    }
    .empty2{
        height: 200px;
    }
    .pin-block, .block{
        max-height: 30vh;
    }
    .radio{
        padding-right: 5px;
    }
    .sub{
        margin-left: 20px;
    }

    .create{
        padding-left: 20px;
    }
    .create-input{
        padding-top: 4px;
        padding-bottom: 4px;
        opacity: .8;
        background-color: rgba(0,0,0,0);
        border: solid 0px;
    }
    .create-input:focus{
        opacity: 1;
        background: var(--grad-renaming);
    }

    .selected{
        background: var(--grad-selected);
    }

    .focus:focus{
        outline: none;
    }
</style>