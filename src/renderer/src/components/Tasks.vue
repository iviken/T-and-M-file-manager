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
                status: 'undone',
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            }
        }
    }
  },
  beforeUpdate(){
    for (const key in this.data) {

        let isEmpty = true;
        
        for (let subkey in this.data[key].subtasks) {
            isEmpty = false;
            break;
        }
        
        if (isEmpty) {
        // Объект пуст
            this.data[key].subtasksAvailability = false
            this.data[key].isFolded = true
        } else {
        // Объект не пуст
        }
    }
  },
  data(){
    return{
        newTaskValue: 'new task'
    }
  }
}
</script>

<template>
<div class="on-col this">

    <div class="pin-block on-col">
        <div v-for="task in data">
            <div v-if="task.isPinned">

                <TaskItem :task="task" :data="data" />
                <div v-for="subtask in task.subtasks" class="sub" v-if="!task.isFolded">
                    <TaskItem :task="subtask" :data="task.subtasks" />
                </div>

            </div>
        </div>
    </div>

    <div v-for="task in data">
        <div v-if="!task.isPinned">

            <TaskItem :task="task" :data="data" />
            <div v-for="subtask in task.subtasks" class="sub" v-if="!task.isFolded">
                <TaskItem :task="subtask" :data="task.subtasks" />
            </div>
            
        </div>
    </div>

    <div>
        <input type="text" v-model="newTaskValue" class="rename" @keyup.enter="createNewTask()"></input>
    </div>

</div>
</template>

<style scoped lang="scss">
    // @use '../scss/tasks.scss' as *;
    .this{
        padding-top: var(--top-indent);
    }

    .pin-block{
        margin-bottom: 50px;
    }
    .sub{
        margin-left: 20px;
    }
    .rename{
        background-color: antiquewhite;
        padding-left: 20px;
    }
</style>