# Marks and Tasks file manager ( <img src="/src/renderer/src/assets/electron.svg" width="30px" height="30px" style="background: black" /> M&T)

- About
- Possibilities
- Interface
- HotKeys
- Peculiarities
- Project Setup

## About

It is free app file manager with tabs, color tags (marks) and task manager for Windows.

<img src="/md/screen app.jpg" width="100%" />
<img src="/md/screen app2.jpg" width="100%" />

## Possibilities

- Supports two session modes and allows you to switch between them on the fly: last session mode and saved session mode.
- Marking files with color labels.
- Separate display of graphic files and others.
- Supports tabs for folders.
- Drag'n'Drop doesn't exist. Now you don't have to worry about accidentally dragging files or folders to an unknown location!
- Allows you to display multiple photos for comparison.

## Interface

Buttons in lists appear when you hover over an element.

### Header

- LOGO: switch between last session and saved session (or sessions list).
- Close session: exit active (saved) session and show sessions list.
- F1: show help.
- Unsplash: open the window for choosing a background image for the application title.

The session name (in session mode) is displayed in the center.

### Bar panel

The panel consists of 5 levels: info, marks (not all)\*, Buttons\*, folder tabs\*, search.

\* In file metadata display mode, the block disappears. to display the file's metadata, press: <ins>Space</ins>.

#### Info

Count selected files, if at least one file is selected.

#### Marks

- <img src="/src/renderer/src/assets/arc dawn.svg" width="16" height="16" style="background: black" /> show mark menu.
- <img src="/src/renderer/src/assets/plus.svg" width="16" height="16" style="background: black" /> create new mark.

Not all markings are displayed.
If at least one file is selected, you can assign a 'mark' to it.

##### Mark menu

<img src="/md/mark menu.jpg" width="" height="" />

All file markings in the open session are displayed here. You can delete existing ones, create new ones, rename them, or change the color. Marking for unmarked files are not deleted.

- &#9724; If there is such a square to the left of the label name, then files with such a label are displayed in folders. Click on it to turn the display on or off.

- <img src="/src/renderer/src/assets/arrow2 left.svg" width="16" height="16" style="background: black" /> / <img src="/src/renderer/src/assets/arrow2.svg" width="16" height="16" style="background: black" /> set mark color. Press <ins>Esc</ins> or click it to exit.
- <img src="/src/renderer/src/assets/x.svg" width="16" height="16" style="background: black" /> delete mark. All seleced files with this mark will become unmarked.

- To rename a label, double-click it. Only works if no files are selected.

##### Create new mark

<img src="/md/bar - create new mark.jpg" width="" height="" />

Enter a name for the new marking and click the button <img src="/src/renderer/src/assets/arrow2.svg" width="16" height="16" style="background: black" /> if you want to set the color.

#### Buttons on center

- <img src="/src/renderer/src/assets/tasks.svg" width="16" height="16" style="background: black" /> show task panel.
- <img src="/src/renderer/src/assets/tree.svg" width="16" height="16" style="background: black" /> show folder tree panel.

#### Folder tabs

You can freely switch between folder tabs, just like in Windows 11.

- <img src="/src/renderer/src/assets/plus.svg" width="16" height="16" style="background: black" /> create new folder tab. The parent folder will open. Max folders tabs: 6.

#### Search (IN DEV)

If you want to find a file in an open folder by name or format, start typing the name and the found files will be highlighted. You do not need to delete the words from the search bar, they will be deleted by themselves when you click again.

To search for files by format, start typing the name with a dot.

### Tasks panel

The panel consists of 3 levels: pin tasks, tasks and subtasks, new task button.

You can create tasks and subtasks.
Only one level of subtasks is available.
To delete a task or subtask, you must first complete it. A task can only be completed by crossing out and deleting all of its subtasks (if any).
To cross out a task or subtask, click on the square on the left. An x symbol will appear on the right.

- Single click: select task.
- Double click: edit task description.

These buttons appear when the cursor is on a task:

- <img src="/src/renderer/src/assets/pin.svg" width="16" height="16" style="background: black" /> pin / unpin task.
<!-- - ![pin or unpin task](/src/renderer/src/assets/pin.svg?raw=true&sanitize=true): pin / unpin task. -->
- <img src="/src/renderer/src/assets/x.svg" width="16" height="16" style="background: black" /> delete task.
- <img src="/src/renderer/src/assets/plus.svg" width="16" height="16" style="background: black" /> add subtask.
- <img src="/src/renderer/src/assets/arc dawn.svg" width="16" height="16" style="background: black" /> fold / unfold subtasks (if any).
- &#9723; If a task has no subtasks, hovering over it will display a square on the left. Clicking on it will complete the task and remove the selection. Clicking again will make the task active again and restore the selection.
<!-- - ![fold subtasks](/src/renderer/src/assets/arc%20dawn.svg?raw=true&sanitize=true): fold / unfold subtasks (if any). -->

You can save your own tasks for each session.

### Folders panel

The panel consists of 4 levels: session folders / pin folders ,address bar, folder tree, and special folders.

#### Session folders / pin folders

- <img src="/src/renderer/src/assets/favorite-folder.svg" width="16" height="16" style="background: black" /> Session folders list: displayed in free file browsing mode.
- <img src="/src/renderer/src/assets/pin.svg" width="16" height="16" style="background: black" /> Pin folders list: displayed in session mode.

#### Address bar:

Click on a folder name to go to it.

- <img src="/src/renderer/src/assets/eye opened.svg" width="16" height="16" style="background: black" /> hide system folders and folders whose names begin with a dot.
<!-- ![hide system folders](/src/renderer/src/assets/eye%20opened.svg): hide system folders and folders whose names begin with a dot. -->

#### Folder tree:

The folder tree allows you to navigate through the folders on your computer. There are two lists: folders and subfolders.

#### Special folders:

- <img src="/src/renderer/src/assets/list.svg" width="16" height="16" style="background: black" /> my documents.
- <img src="/src/renderer/src/assets/load.svg" width="16" height="16" style="background: black" /> downloads.

- <img src="/src/renderer/src/assets/cloud.svg" width="16" height="16" style="background: black" /> clouds... (IN DEV).

### Files panel

Graphic and other files are displayed separately on the right and left, respectively.

Files are grouped by label. Files without groups are placed last among groups.

- To collapse / expand a group / pin of files, click on the label name or on the field on the left.
- To display only one group of files, double-click the label name.
- To select a file, click its icon. To deselect it, click it again. To deselect all files in an open folder, press <ins>Esc</ins>. To quickly select all files with the same 'mark', select at least one and press <ins>Ctrl + A</ins>.

## HotKeys

- <ins>Space</ins>: open the comparison window for the selected photos.
- <ins>Space</ins> (press): show metadata of the file in focus.
- <ins>F3</ins>: show / hide search panel (in unmaximize window only).
- <ins>F5</ins>: refresh files in opened folder.
<!-- - F11: maximize / restore window. -->
- <ins>\+</ins>  <ins>\-</ins>  <ins>=</ins>: increase or decrease the size of image icons.

Some hotkeys only work when the corresponding component has focus.

### Bar panel:

- <ins>Ctrl + T</ins>: open last closed tab folder.
- <ins>Esc</ins>: hide the input line for the name of the created 'mark'.

### Tasks panel:

- <ins>Arrow Up</ins> and <ins>Arrow Down</ins> (IN DEV): move a task up or down in the list.

Single click: select task.
Double click: edit task description.

### Folder tree panel:

- <ins>F2</ins>: rename folder.
- <ins>F5</ins>: refresh folders.
- <ins>Esc</ins>: cancel renaming / copy / cut folder.
- <ins>Ctrl + D</ins>: pin / unpin folder.*
- <ins>Ctrl + Shift + N</ins> / <ins>Ctrl + N</ins>: Create new sub-folder.
- <ins>Ctrl + C</ins>: start copying folder.
- <ins>Ctrl + X</ins>: start moving folder.
- <ins>Ctrl + V</ins>: paste folder.
- <ins>Arrow Up</ins>: move to next folder (up).
- <ins>Arrow Down</ins>: move to next folder (down).
- <ins>Arrow Left</ins>: move to parent folder.
- <ins>Ctrl + Arrow Left</ins>: move to previous folder.
- <ins>Arrow Right</ins>: move to first child folder.

Single click: move to folder.

### Files panel

- <ins>F2</ins>: rename files.
- <ins>F5</ins>: refresh files in opened folder.
- <ins>Esc</ins>: cancel selected / renaming / copy / cut files.
- <ins>Ctrl + D</ins>: pin / unpin files.
- <ins>Ctrl + C</ins>: start copying files.
- <ins>Ctrl + X</ins>: start moving files.
- <ins>Ctrl + V</ins>: paste files.

- <ins>Ctrl + A</ins>: select all files in mark block. If you click on the block of 'marked' files.

Single click: select / unselect file.
Double click: open file.

## Peculiarities

- All changes are saved before closing.
- Renaming a folder won't work if it's open in explorer.

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
