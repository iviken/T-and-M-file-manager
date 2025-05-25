<script setup>

</script>

<template>

    <div class="help t-help scrollY">

        <!-- video -->

        <!-- <div class="video on-center">video</div> -->

        <!-- about -->

        <div class="about on-center">
            <div class="on-col w100">

                <div class="w100 on-center">
                    <img src="../../../../resources/icon512.png" alt="" class="logo">
                </div>

                <div class="w100 on-center">
                    <span class="t-about uppercase">
                        Marks and Tasks file manager - is a free app with tabs, color tags (marks) and task manager for Windows.
                    </span>
                </div>

            </div>
        </div>

        <!-- hotkeys -->

        <div class="info on-row">

            <!-- hotkeys: common -->

            <div class="info-block on-col">
                <span><span class="t-key">Space</span>: open the comparison window for the selected photos.</span>
                <span><span class="t-key">Space</span> (press): show metadata of the file in focus.</span>
                <span><span class="t-key">F3</span>: show / hide search panel (in unmaximize window only).</span>
                <span><span class="t-key">F5</span>: refresh files in opened folder.</span>
                <span class="on-row">
                    <span class="on-row">
                        <span class="t-key">+</span>  <span class="t-key">-</span>  <span class="t-key">=</span>
                    </span>
                    : increase or decrease the size of image icons.
                </span>

                <span>Some hotkeys only work when the corresponding component has focus.</span>
            </div>

            <!-- hotkeys: bar -->

            <div class="info-block on-col">
                <span class="block-name t-block-name h3 w100 on-center uppercase">Bar panel</span>
        
                <span class="on-row"><span class="t-key">Ctrl + T</span>: open last closed tab folder.</span>
                <span class="on-row"><span class="t-key">Esc</span>: hide the input line for the name of the created 'mark'.</span>
            </div>

            <!-- hotkeys: tasks -->

            <div class="info-block on-col">
                <span class="block-name t-block-name h3 w100 on-center uppercase">Tasks panel</span>
        
                <span class="on-row">
                    <span class="t-key on-row">Arrow Up</span> and <span class="t-key on-row">Arrow Down</span> (IN DEV): move a task up or down in the list.
                </span>
        
                <span class="on-row"><span class="t-click">Single click</span>: select task.</span>
                <span class="on-row"><span class="t-click">Double click</span>: edit task description.</span>
            </div>

            <!-- hotkeys: tree -->

            <div class="info-block on-col">
                <span class="block-name t-block-name h3 w100 on-center uppercase">Folder tree panel</span>
        
                <span class='on-row'><span class="t-key">F2</span>: rename folder.</span>
                <span class='on-row'><span class="t-key">F5</span>: refresh folders.</span>
                <span class='on-row'><span class="t-key">Esc</span>: cancel renaming / copy / cut folder.</span>
                <span class='on-row'><span class="t-key">Ctrl + D</span>: pin / unpin folder.*</span>
                <span class='on-row'><span class="t-key">Ctrl + Shift + N</span> / <span>Ctrl + N</span>: Create new sub-folder.</span>
                <span class='on-row'><span class="t-key">Ctrl + C</span>: start copying folder.</span>
                <span class='on-row'><span class="t-key">Ctrl + X</span>: start moving folder.</span>
                <span class='on-row'><span class="t-key">Ctrl + V</span>: paste folder.</span>
                <span class='on-row'><span class="t-key">Arrow Up</span>: move to next folder (up).</span>
                <span class='on-row'><span class="t-key">Arrow Down</span>: move to next folder (down).</span>
                <span class='on-row'><span class="t-key">Arrow Left</span>: move to parent folder.</span>
                <span class='on-row'><span class="t-key">Ctrl + Arrow Left</span>: move to previous folder.</span>
                <span class='on-row'><span class="t-key">Arrow Right</span>: move to first child folder.</span>
        
                <span class='on-row'><span class="t-click">Single click</span>: move to folder.</span>
            </div>

            <!-- hotkeys: files -->

            <div class="info-block on-col">
                <span class="block-name t-block-name h3 w100 on-center uppercase">Files panel</span>
        
                <span class='on-row'><span class="t-key">F2</span>: rename files.</span>
                <span class='on-row'><span class="t-key">F5</span>: refresh files in opened folder.</span>
                <span class='on-row'><span class="t-key">Esc</span>: cancel selected / renaming / copy / cut files.</span>
                <span class='on-row'><span class="t-key">Ctrl + D</span>: pin / unpin files.</span>
                <span class='on-row'><span class="t-key">Ctrl + C</span>: start copying files.</span>
                <span class='on-row'><span class="t-key">Ctrl + X</span>: start moving files.</span>
                <span class='on-row'><span class="t-key">Ctrl + V</span>: paste files.</span>
        
                <span class='on-row'><span class="t-key">Ctrl + A</span>: select all files in mark block. If you click on the block of 'marked' files.</span>
        
                <span class='on-row'><span class="t-click">Single click</span>: select / unselect file.</span>
                <span class='on-row'><span class="t-click">Double click</span>: open file.</span>
            </div>

        </div>
        
    </div>

</template>

<style scoped lang="scss">
    // @use '../scss/help.scss' as *;

    .help{
        background: var(--grad-page-PROJECTS);
        
        padding-top: var(--content-indent);
        height: calc( 100vh - var(--content-indent) - var(--header-heigth) );
    }

    .about{
        margin: 20px;
    }

    .logo{
        width: 50px;
        height: 50px;
        margin: 10px;
    }

    .block-name{
        padding-bottom: 10px;
    }

    .t-key{
        padding-left: 10px;
        padding-right: 10px;

        text-wrap: nowrap;
    }

    @media screen and (max-width: 1500px) {

        .info{
            // display: flex;
            // flex-direction: column;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
        }

        .info-block{
            width: 60%;

            padding-top: 10px;
            padding-bottom: 10px;

            margin-left: auto;
            margin-right: auto;
        }
    }

    @media screen and (min-width: 1501px) { //  fullscreen

        .info{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }

        .info-block{
            padding: 20px;
        }
    }
</style>