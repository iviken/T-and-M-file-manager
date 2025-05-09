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

        <div v-if="!isRemaned" @keyup.ctrl.d="pinTask(task.id)" class="task-block list-item w100 on-row focus" tabindex="0">

            <!-- done -->

            <div v-if="!task.subtasksAvailability" @click="checkToTask(task.id)" class="btn check-box"><div class="check"></div></div>

            <!-- fold / unfold -->

            <div v-if="task.subtasksAvailability" @click="foldTask()" class="btn fold-box on-center">
                <div>
                    <img src="../assets/arc dawn.svg" alt="fold task" class="pix-btn">
                </div>
            </div>

            <div class="w100 on-row">

                <!-- task text -->
                
                <div @click="selectTask(task.id)" @dblclick="renameTask({state: 'input-start', name: task.name})" class="task">
                    <span :class="{done: task.isDone}" class="uppercase t-task">{{ task.name }}</span>
                </div>

                <!-- pin -->

                <div v-if="(task.id.indexOf('sub') != 0)&&(!task.isDone)" @click="pinTask()" class="pin btn-opacity on-center">
                    <img v-if="!task.isPinned" src="../assets/pin.svg" alt="Pin this task" class="btn pix-btn">
                    <img v-if="task.isPinned" src="../assets/unpin.svg" alt="Pin this task" class="btn pix-btn">
                </div>

                <!-- x -->

                <div v-if="task.isDone" @click="this.$emit('deleteTask', this.task)" class="delete btn-opacity">
                    <span class="btn">x</span>
                </div>

                <!-- + -->

                <div v-if="task.id.indexOf('sub')!=0" class="btn-opacity">
                    <div v-if="!task.isDone" @click="addSubTask()" class="btn add">+</div>
                </div>
                
            </div>

        </div>

        <!-- rename -->

        <div v-else class="list-item rename-box w100">
            <input type="text" placeholder="task description" v-model="renamedValue" :id="`${task.id}`" @keyup.esc="isRemaned = false" @keyup.enter="renameTask({state: 'input-done'})" class="rename-input t-task t-task-renaming uppercase focus w100"></input>
        </div>

</template>

<style scoped lang="scss">
    .list-item{
        padding-top: 2px;
        padding-bottom: 2px;
    }
    .pix-btn{
        width: 12px;
        height: 12px;
    }
    .pix-btn:hover{
        opacity: .8;
    }
    .btn{
        opacity: 0;
        color: var(--text);
        width: 20px;
    }
    .delete, .pin, .add{
        padding-left: 6px;
        padding-right: 6px;
    }
    .btn-opacity{
        opacity: .6;
    }
    .btn-opacity:hover{
        opacity: 1;
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
        margin-right: 20px;
    }
    .task-block:hover .btn{
        opacity: 1;
    }

    // .active{
    //     background-color: aquamarine;
    // }
    .done{
        text-decoration:line-through;
    }
    .rename-box{
        padding-left: 20px;
    }
    .rename-input{
        opacity: .8;
        border: solid 0px;
        background: var(--grad-renaming);
    }
    .rename-input:focus{
        opacity: 1;
    }

    .focus:focus{
        outline: none;
    }
</style>