<script>
import { RouterLink } from 'vue-router'

export default {

  components:{
    RouterLink
  },

  methods: {

    changeState(stateConst){

        switch (stateConst){
            case 'CLOSE_PROJ':
                this.state.active = 'BROWSER'

                this.state.atLeastOneProjectOpen = false

                window.api.closeProject()
                // this.$router.push({name: 'ProjectsList'})
            break
            case 'GO_BROWS/PROJ':    
                //
                if(this.state.active == 'PROJECTS'){
                    this.$router.push({name: 'Browser-session' })
                }
                //
                if(this.state.active == 'BROWSER'){
                    //
                    this.checkIfAtLeastOneProjectOpen()
                    //
                    if(this.state.atLeastOneProjectOpen){
                        this.$router.push({name: 'Browser-projects' })
                    }else{
                        this.$router.push({name: 'ProjectsList' })
                    }
                }

                this.state.active = this.state.active == 'BROWSER' ? 'PROJECTS' : 'BROWSER'
            break   
        }
        // console.log(this.$route.name)
    },
    closeApp() {
        window.api.close()
    },

    minimizeApp() {
        window.api.minimize()
    },

    maximizeApp() {
        window.api.maximize()
    },

    getActualProjectName(){
        for (const key in this.fullData) {
            if(this.fullData[key].meta.status == 'opened'){
                // console.log(this.fullData[key].meta.name)
                return this.fullData[key].meta.name
            }
        }
    },

    checkIfAtLeastOneProjectOpen(){
        for (const key in this.fullData) {
            if( this.fullData[key].meta.status == 'opened' ){
                this.state.atLeastOneProjectOpen = true
                break
            }
        }
    },
  },

  beforeMount() {
    
    this.fullData = window.api.getProjectData()
    //
    this.projectName =  this.getActualProjectName()
    //
    this.checkIfAtLeastOneProjectOpen()
    //
    if(this.state.atLeastOneProjectOpen){
        this.state.active = 'PROJECTS'
    }else{
        this.state.active = 'BROWSER'
    }
  },

  beforeUpdate() {
    //
    this.projectName =  this.getActualProjectName()
    //
    this.checkIfAtLeastOneProjectOpen()
  },

  mounted(){
    this.$nextTick(function () {
        window.addEventListener('resize', (e) => {
            if(window.outerWidth == window.screen.width){
                this.state.windowIsMaximized = true
            }else{
                this.state.windowIsMaximized = false
            }
        })

        // this.projectName = window.api.getProjectName()  //  TO DO
    })
  },

  computed:{
  },

  data(){
    return{
        projectName: 'project Name',
        fullData: null,
        state: {
            active: null,
            // active: 'BROWSER',
            windowIsMaximized: true,
            atLeastOneProjectOpen: true,
        },
    }
  },
}
</script>

<template>

    <div class="header w100 drag">
        <div class="header__box w100 h100">

            <!-- custom title bar -->

            <div class="header__btns w100 on-row">

                <!-- left btns -->

                <div class="header__btns-left on-row no-drag">

                    <!-- Left btns: logo -->

                    <button class="btn-logo btn-logo1 header__btn bold" @click="changeState('GO_BROWS/PROJ')">M&T</button>

                    <!-- Left btns: close session -->

                    <RouterLink v-if="state.active == 'PROJECTS'" :to="{name: 'ProjectsList'}" active-class="">
                        <button class="header__btn header__btns-close-project" @click="changeState('CLOSE_PROJ')">
                            <title>Close project</title>
                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px"
                                fill="#000000">
                                <path
                                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                            </svg>
                        </button>
                    </RouterLink>

                    <!-- Left btns: help (F1) -->

                    <RouterLink :to="{name: 'Help'}" active-class="">
                        <button class="header__btns-go-help header__btn bold">F1</button>
                    </RouterLink>

                    <!-- Left btns: Unsplash -->

                    <RouterLink :to="{name: 'Unsplash'}" active-class="">
                        <button class="header__btn-unsplash header__btn">
                            <svg fill="#000000" width="18px" height="18px" viewBox="0 0 24 24" role="img"
                                xmlns="http://www.w3.org/2000/svg">
                                <title>Unsplash icon</title>
                                <path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z" />
                            </svg>
                        </button>
                    </RouterLink>

                </div>

                <!-- project title -->

                <div class="header__name w100 text-center on-center">
                    <div class="no-drag">

                        <!-- project name -->

                        <span v-if="state.active == 'PROJECTS'" class="t-header uppercase text-nowrap">
                            {{ projectName }}
                        </span>

                        <!-- free browse title -->

                        <span v-if="state.active == 'BROWSER'" class="t-header uppercase text-nowrap">
                            BROWSE
                        </span>
                        <!-- <input type="text" value="dfds" class="text-center header__name-input"> -->
                        <!-- <input type="text" v-model="projectName" class="text-center header__name-input"> -->
                    </div>
                </div>

                <!-- right btns -->

                <div class="header__btns-right on-row no-drag">

                    <!-- Right btns: minimize -->

                    <button class="header__btns-minimize header__btn" @click="minimizeApp()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                            <path d="m 5.7298514,24.930294
                        c -0.1570778,-0.409338 -0.1570778,-1.079165 0,-1.488503
                        C 5.978912,22.79275 8.3624396,22.714048 24.361752,22.826584
                        l 18.346304,0.129045
                        v 1.230414 1.230413
                        L 24.361752,25.545501
                        C 8.3624396,25.658037 5.978912,25.579336 5.7298514,24.930294
                        Z" />
                        </svg>
                    </button>

                    <!-- Right btns: maximize / restore -->

                    <button class="header__btns-resize header__btn" @click="maximizeApp()">
                        <svg v-if="!state.windowIsMaximized" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                            <path d="M 9.2094529,41.205509
                                C 6.5094146,39.740484 6.35316,38.806775 6.35316,24.137547
                                c 0,-14.7633639 0.1518753,-15.6410061 2.9577533,-17.0919821 2.1455297,-1.1094963 27.6266977,-1.1094963 29.7722267,0 2.805878,1.450976 2.957754,2.3286182 2.957754,17.0919821 0,14.763364 -0.151876,15.641007 -2.957754,17.091983 -2.118159,1.095342 -27.848833,1.074653 -29.8736871,-0.02402
                                z
                                
                                M 38.288017,38.228537
                                c 1.169901,-1.169901 1.169901,-27.012079 0,-28.18198 -1.169901,-1.1699007 -27.012079,-1.1699007 -28.18198,0 -1.1699012,1.169901 -1.1699012,27.012079 0,28.18198 1.169901,1.169901 27.012079,1.169901 28.18198,0
                                z" />
                        </svg>
                        <svg v-if="state.windowIsMaximized" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                            <path d="M 9.5176628,40.450425
                                C 7.0856222,39.130792 6.8873929,38.083843 6.8873929,26.558595
                                c 0,-8.531682 0.1321261,-10.799161 0.6923853,-11.882608 1.3072373,-2.527959 2.3074139,-2.723752 13.9137138,-2.723752 15.334616,0 14.606097,-0.728532 14.606097,14.60636 0,15.350649 0.741561,14.614611 -14.697541,14.588081
                                C 12.88678,41.13205 10.518108,40.993273 9.5176628,40.450425
                                Z

                                M 32.643682,37.708982
                                c 1.073063,-1.073082 1.073063,-21.227697 0,-22.300779 -1.073063,-1.073082 -21.227318,-1.073082 -22.300382,0 -1.0730626,1.073082 -1.0730626,21.227697 0,22.300779 1.073064,1.073081 21.227319,1.073081 22.300382,0
                                z

                                m 6.194552,-14.997596
                                c 0,-10.358031 -0.101396,-12.164684 -0.717267,-12.7805678 -0.615868,-0.6158827 -2.422494,-0.7172753 -12.780335,-0.7172753 -7.854244,0 -12.063071,-0.1615961 -12.063071,-0.4631562 0,-0.2547337 0.667545,-0.8701751 1.483433,-1.3676412 1.366528,-0.8332043 2.321512,-0.9046168 12.11834,-0.9061882 15.451175,-0.00248 14.698314,-0.7553529 14.695836,14.6960957 -0.0015,9.797007 -0.07298,10.752002 -0.906173,12.118556 -0.497452,0.815901 -1.112883,1.483461 -1.367616,1.483461 -0.301552,0 -0.463147,-4.208902 -0.463147,-12.063284
                                z" />
                        </svg>
                    </button>

                    <!-- Right btns: close app -->

                    <button class="header__btns-close header__btn" @click="closeApp()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                            <path
                                d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z" />
                        </svg>
                    </button>

                </div>

            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
    @use '../scss/header.scss' as *;

    button:focus{
        outline: none;
    }

    .header__btns-left, .header__btns-right{
        width: 160px;
    }
    .header__btns-right{
        justify-content: right;
    }
</style>