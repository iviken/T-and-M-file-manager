//////////////
export const fakeData_tree = {
    folders:[
        'up-folder one',
        'up-folder two',
        'up-folder free',
        'up-folder four',
        'Storage',
        'AppData',
    ],
    upFolders:[
        'folder one',
        'folder two',
        'folder free',
        'folder four',
    ]
}
//////////////
//  FILE 1

export const projects = {
    proj_001: {
        id: 'proj_001', 
        headerPicture: {},
        meta:{
            name: 'project first',
            created: 1742744761272,
            lastModified: 1742744761272,
            lastOpened: 1742744761272,
            isPinned: true,
            description: 'Descrtiption first of project',
            status: 'opened'
        },
        tasks: {
            task_001:{
                id: 'task_001',
                name: 'some task one',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
            task_002:{
                id: 'task_002',
                name: 'some task two',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: true,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
            task_003:{
                id: 'task_003',
                name: 'some task free',
                descr: '',
                status: 'undone',
                isPinned: false,
                isFolded: false,
                subtasksAvailability: true,
                subtasks: {
                    subtask_001:{
                        id: 'subtask_001',
                        name: 'some sub-task one',
                        descr: 'Lorem ipsum ... description',
                        status: 'active',
                        subtasksAvailability: false,
                    },
                    subtask_002:{
                        id: 'subtask_002',
                        name: 'some sub-task two',
                        descr: 'Lorem ipsum ... description',
                        status: 'undone',
                        subtasksAvailability: false,
                    },
                    subtask_003:{
                        id: 'subtask_003',
                        name: 'some sub-task free',
                        descr: '',
                        status: 'done',
                        subtasksAvailability: false,
                    }
                }
            }
        },
        marks: {
            mark_1000: {id: 'mark_1000', color: 'red', descr: 'Some text red mark', isFolded: {text: true, imgs: false}, show: true },
            mark_1001: {id: 'mark_1001', color: 'green', descr: 'Some text green mark', isFolded: {text: true, imgs: false}, show: true },
            mark_1002: {id: 'mark_1002', color: 'yellow', descr: 'Some text yellow mark 2', isFolded: {text: true, imgs: false}, show: true },
            mark_1003: {id: 'mark_1003', color: 'ocean', descr: 'Some text ocean mark 3', isFolded: {text: true, imgs: false}, show: false },
            mark_1004: {id: 'mark_1004', color: 'default-color', descr: 'Some text mark 4', isFolded: {text: true, imgs: false}, show: true },
            mark_1005: {id: 'mark_1005', color: 'default-color', descr: 'Some text mark 5', isFolded: {text: true, imgs: false}, show: false },
            mark_1006: {id: 'mark_1006', color: 'ocean', descr: 'Some text mark 6', isFolded: {text: true, imgs: false}, show: false },
            mark_1007: {id: 'mark_1007', color: 'default-color', descr: 'Some text mark 7', isFolded: {text: true, imgs: false}, show: false },
            mark_1008: {id: 'mark_1008', color: 'default-color', descr: 'Some text mark 8', isFolded: {text: true, imgs: false}, show: false },
            mark_unmarked: {id: 'mark_unmarked', color: 'default-color', descr: '--unmarked--', isFolded: {text: true, imgs: false}, show: true }
        },
        folders:[
            {
                id: 'proj_001__fold_001',
                path: 'C:/Users/LocalHost/Storage',
                files: [
                    {id: 100, name: 'file (1)', format: 'js',   markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 101, name: 'file (2)', format: 'ini',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 102, name: 'file (3)', format: 'vue',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 103, name: 'file (4)', format: 'scss', markID: 'mark_1001',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156445, lastEdited: 165489, size: 1004256}},
                    {id: 104, name: 'file (5)', format: 'scss', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 164489, size: 100256}},
                    {id: 105, name: 'file (6)', format: 'scss', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    // {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/Nike/Documents/myDevApps/fileManager5/FM5/src/renderer/src/assets/gallery/', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 108, name: 'file (9)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 109, name: 'file (10)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 110, name: 'file (11)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 111, name: 'file (12)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                    {id: 112, name: 'file (13)', format: 'png', markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 1002}},
                    {id: 113, name: 'file (14)', format: 'png', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10256}},
                    {id: 106, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 114, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 115, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 116, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 117, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 118, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 119, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 120, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 121, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 122, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 123, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 124, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 125, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 126, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 127, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 128, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 129, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 140, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 141, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 142, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 143, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 144, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 145, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 146, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 147, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 148, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 149, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 160, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 161, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 162, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 163, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 164, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 165, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 166, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 167, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 168, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 169, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 150, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 131, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 132, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                    {id: 133, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}},
                ],
                isOpened: true,
            },
            {
                id: 'proj_001__fold_002',
                // path: 'https://get.wallhere.com/photo',
                path: 'C:/Users/LocalHost/AppData',
                files: [
                    {id: 200, name: 'file (31)',  format: 'js',   markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 201, name: 'file (32)',  format: 'ini',  markID: 'mark_1000',      isPinned: true,  path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 202, name: 'file (33)',  format: 'vue',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 203, name: 'file (34)',  format: 'scss', markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156445, lastEdited: 165489, size: 1004256}},
                    {id: 204, name: 'file (35)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 164489, size: 100256}},
                    {id: 205, name: 'file (36)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 207, name: 'file (38)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 208, name: 'file (39)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 209, name: 'file (310)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 210, name: 'file (311)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 211, name: 'file (312)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                ],
                isOpened: false,
            }
        ],
    },

    proj_002: {
        id: 'proj_002', 
        headerPicture: {},
        meta:{
            name: 'project second',
            created: 1742744761272,
            lastModified: 1742744761272,
            lastOpened: 1742744761272,
            isPinned: false,
            description: 'Descrtiption of second project',
            status: 'closed'
        },
        tasks: {
            task_001:{
                id: 'task_001',
                name: 'some task one',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
            task_002:{
                id: 'task_002',
                name: 'some task two',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: true,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
        },
        marks: {
            mark_1000: {id: 'mark_1000', color: 'red', descr: 'Some text red mark', isFolded: {text: true, imgs: false}, show: true },
            mark_1002: {id: 'mark_1002', color: 'yellow', descr: 'Some text yellow mark 2', isFolded: {text: true, imgs: false}, show: true },
            mark_1103: {id: 'mark_1103', color: 'ocean', descr: 'Some text ocean mark 3', isFolded: {text: true, imgs: false}, show: false },
            mark_unmarked: {id: 'mark_unmarked', color: 'default-color', descr: '--unmarked--', isFolded: {text: true, imgs: false}, show: true }
        },
        folders:[
            {
                id: 'proj_002__fold_001',
                path: 'C:/Users/LocalHost/Storage',
                files: [
                    {id: 100, name: 'file (1)', format: 'js',   markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 101, name: 'file (2)', format: 'ini',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 102, name: 'file (3)', format: 'vue',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 105, name: 'file (6)', format: 'scss', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    // {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/Nike/Documents/myDevApps/fileManager5/FM5/src/renderer/src/assets/gallery/', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 108, name: 'file (9)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 109, name: 'file (10)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 110, name: 'file (11)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 111, name: 'file (12)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                    {id: 112, name: 'file (13)', format: 'png', markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 1002}},
                    {id: 113, name: 'file (14)', format: 'png', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10256}},
                    {id: 106, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}}
                ],
                isOpened: true,
            },
            {
                id: 'proj_002__fold_002',
                path: 'C:/Users/LocalHost/AppData',
                files: [
                    {id: 200, name: 'file (31)',  format: 'js',   markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 201, name: 'file (32)',  format: 'ini',  markID: 'mark_1000',      isPinned: true,  path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 202, name: 'file (33)',  format: 'vue',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 203, name: 'file (34)',  format: 'scss', markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156445, lastEdited: 165489, size: 1004256}},
                    {id: 204, name: 'file (35)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 164489, size: 100256}},
                    {id: 205, name: 'file (36)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 207, name: 'file (38)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 208, name: 'file (39)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 209, name: 'file (310)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 210, name: 'file (311)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 211, name: 'file (312)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                ],
                isOpened: false,
            }
        ],
    },  

    proj_003: {
        id: 'proj_003', 
        headerPicture: {},
        meta:{
            name: 'project third',
            created: 1742744761272,
            lastModified: 1742744761272,
            lastOpened: 1742744761272,
            isPinned: false,
            description: 'Descrtiption of third project',
            status: 'closed'
        },
        tasks: {
            task_001:{
                id: 'task_001',
                name: '3 - some task one',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
            task_002:{
                id: 'task_002',
                name: 'some task two',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: true,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
        },
        marks: {
            mark_1000: {id: 'mark_1000', color: 'red', descr: 'Some text red mark', isFolded: {text: true, imgs: false}, show: true },
            mark_1002: {id: 'mark_1002', color: 'yellow', descr: 'Some text yellow mark 2', isFolded: {text: true, imgs: false}, show: true },
            mark_1103: {id: 'mark_1103', color: 'ocean', descr: 'Some text ocean mark 3', isFolded: {text: true, imgs: false}, show: false },
            mark_unmarked: {id: 'mark_unmarked', color: 'default-color', descr: '--unmarked--', isFolded: {text: true, imgs: false}, show: true }
        },
        folders:[
            {
                id: 'proj_002__fold_001',
                path: 'C:/Users/LocalHost/Storage',
                files: [
                    {id: 100, name: 'file (1)', format: 'js',   markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 101, name: 'file (2)', format: 'ini',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 102, name: 'file (3)', format: 'vue',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 105, name: 'file (6)', format: 'scss', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    // {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/Nike/Documents/myDevApps/fileManager5/FM5/src/renderer/src/assets/gallery/', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 108, name: 'file (9)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 109, name: 'file (10)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 110, name: 'file (11)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 111, name: 'file (12)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                    {id: 112, name: 'file (13)', format: 'png', markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 1002}},
                    {id: 113, name: 'file (14)', format: 'png', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10256}},
                    {id: 106, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}}
                ],
                isOpened: true,
            },
            {
                id: 'proj_002__fold_002',
                path: 'C:/Users/LocalHost/AppData',
                files: [
                    {id: 200, name: 'file (31)',  format: 'js',   markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 201, name: 'file (32)',  format: 'ini',  markID: 'mark_1000',      isPinned: true,  path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 202, name: 'file (33)',  format: 'vue',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 203, name: 'file (34)',  format: 'scss', markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156445, lastEdited: 165489, size: 1004256}},
                    {id: 204, name: 'file (35)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 164489, size: 100256}},
                    {id: 205, name: 'file (36)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 207, name: 'file (38)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 208, name: 'file (39)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 209, name: 'file (310)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 210, name: 'file (311)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 211, name: 'file (312)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                ],
                isOpened: false,
            }
        ],
    },  

    proj_004: {
        id: 'proj_004', 
        headerPicture: {},
        meta:{
            name: 'project fourth',
            created: 1742744731272,
            lastModified: 1742744731272,
            lastOpened: 1742744731272,
            isPinned: false,
            description: 'Descrtiption of fourth project',
            status: 'closed'
        },
        tasks: {
            task_001:{
                id: 'task_001',
                name: '4 - some task one',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
            task_002:{
                id: 'task_002',
                name: 'some task two',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: true,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
        },
        marks: {
            mark_1000: {id: 'mark_1000', color: 'red', descr: 'Some text red mark', isFolded: {text: true, imgs: false}, show: true },
            mark_1002: {id: 'mark_1002', color: 'yellow', descr: 'Some text yellow mark 2', isFolded: {text: true, imgs: false}, show: true },
            mark_1103: {id: 'mark_1103', color: 'ocean', descr: 'Some text ocean mark 3', isFolded: {text: true, imgs: false}, show: false },
            mark_unmarked: {id: 'mark_unmarked', color: 'default-color', descr: '--unmarked--', isFolded: {text: true, imgs: false}, show: true }
        },
        folders:[
            {
                id: 'proj_002__fold_001',
                path: 'C:/Users/LocalHost/Storage',
                files: [
                    {id: 100, name: 'file (1)', format: 'js',   markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 101, name: 'file (2)', format: 'ini',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 102, name: 'file (3)', format: 'vue',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 105, name: 'file (6)', format: 'scss', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    // {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/Nike/Documents/myDevApps/fileManager5/FM5/src/renderer/src/assets/gallery/', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 108, name: 'file (9)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 109, name: 'file (10)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 110, name: 'file (11)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 111, name: 'file (12)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                    {id: 112, name: 'file (13)', format: 'png', markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 1002}},
                    {id: 113, name: 'file (14)', format: 'png', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10256}},
                    {id: 106, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}}
                ],
                isOpened: true,
            },
            {
                id: 'proj_002__fold_002',
                path: 'C:/Users/LocalHost/AppData',
                files: [
                    {id: 200, name: 'file (31)',  format: 'js',   markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 201, name: 'file (32)',  format: 'ini',  markID: 'mark_1000',      isPinned: true,  path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 202, name: 'file (33)',  format: 'vue',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 203, name: 'file (34)',  format: 'scss', markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156445, lastEdited: 165489, size: 1004256}},
                    {id: 204, name: 'file (35)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 164489, size: 100256}},
                    {id: 205, name: 'file (36)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 207, name: 'file (38)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 208, name: 'file (39)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 209, name: 'file (310)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 210, name: 'file (311)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 211, name: 'file (312)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                ],
                isOpened: false,
            }
        ],
    },  

    proj_005: {
        id: 'proj_005', 
        headerPicture: {},
        meta:{
            name: 'project fifth',
            created: 1742744741272,
            lastModified: 1742744741272,
            lastOpened: 1742744741272,
            isPinned: false,
            description: 'Descrtiption of fifth project',
            status: 'closed'
        },
        tasks: {
            task_001:{
                id: 'task_001',
                name: '5 - some task one',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
            task_002:{
                id: 'task_002',
                name: '5 - some task two',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: true,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            },
        },
        marks: {
            mark_1000: {id: 'mark_1000', color: 'red', descr: 'Some text red mark', isFolded: {text: true, imgs: false}, show: true },
            mark_1002: {id: 'mark_1002', color: 'yellow', descr: 'Some text yellow mark 2', isFolded: {text: true, imgs: false}, show: true },
            mark_1103: {id: 'mark_1103', color: 'ocean', descr: 'Some text ocean mark 3', isFolded: {text: true, imgs: false}, show: false },
            mark_unmarked: {id: 'mark_unmarked', color: 'default-color', descr: '--unmarked--', isFolded: {text: true, imgs: false}, show: true }
        },
        folders:[
            {
                id: 'proj_002__fold_001',
                path: 'C:/Users/LocalHost/Storage',
                files: [
                    {id: 100, name: 'file (1)', format: 'js',   markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 101, name: 'file (2)', format: 'ini',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 102, name: 'file (3)', format: 'vue',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 105, name: 'file (6)', format: 'scss', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    // {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/Nike/Documents/myDevApps/fileManager5/FM5/src/renderer/src/assets/gallery/', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 108, name: 'file (9)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 109, name: 'file (10)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 110, name: 'file (11)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 111, name: 'file (12)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                    {id: 112, name: 'file (13)', format: 'png', markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 1002}},
                    {id: 113, name: 'file (14)', format: 'png', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 10256}},
                    {id: 106, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Storage', meta:{created: 156456, lastEdited: 165489, size: 140256}}
                ],
                isOpened: true,
            },
            {
                id: 'proj_002__fold_002',
                path: 'C:/Users/LocalHost/AppData',
                files: [
                    {id: 200, name: 'file (31)',  format: 'js',   markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 201, name: 'file (32)',  format: 'ini',  markID: 'mark_1000',      isPinned: true,  path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 202, name: 'file (33)',  format: 'vue',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 203, name: 'file (34)',  format: 'scss', markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156445, lastEdited: 165489, size: 1004256}},
                    {id: 204, name: 'file (35)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 164489, size: 100256}},
                    {id: 205, name: 'file (36)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 207, name: 'file (38)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 208, name: 'file (39)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 209, name: 'file (310)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 210, name: 'file (311)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 211, name: 'file (312)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/AppData', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                ],
                isOpened: false,
            }
        ],
    },  
}
/////////////
//  FILE 2
export const freeBrowse = {
    proj_default:{
        id: 'proj_default', 
        meta:{
            name: 'default',
            created: 1742744161272,
            lastModified: 1742744161272,
            lastOpened: 1742744161272,
            isPinned: false,
            description: 'default',
            status: 'opened'
        },
        tasks: {
            task_001:{
                id: 'task_001',
                name: 'some task one',
                descr: 'Lorem ipsum ... description',
                status: 'undone',
                isPinned: false,
                isFolded: true,
                subtasksAvailability: false,
                subtasks: {}
            }
        },
        marks: {
            mark_1000: {id: 'mark_1000', color: 'ocean', descr: 'Some text red mark', isFolded: {text: true, imgs: false}, show: true },
            mark_1002: {id: 'mark_1002', color: 'yellow', descr: 'Some text yellow mark 2', isFolded: {text: true, imgs: false}, show: true },
            mark_1103: {id: 'mark_1103', color: 'ocean', descr: 'Some text ocean mark 3', isFolded: {text: true, imgs: false}, show: false },
            mark_unmarked: {id: 'mark_unmarked', color: 'default-color', descr: '--unmarked--', isFolded: {text: true, imgs: false}, show: true }
        },
        folders:[
            {
                id: 'default__fold_001',
                path: 'C:/Users/LocalHost/Homeworld',
                files: [
                    {id: 100, name: 'file (1)', format: 'js',   markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 101, name: 'file (2)', format: 'ini',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 102, name: 'file (3)', format: 'vue',  markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 105, name: 'file (6)', format: 'scss', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    // {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/Nike/Documents/myDevApps/fileManager5/FM5/src/renderer/src/assets/gallery/', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 107, name: 'file (8)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 108, name: 'file (9)', format: 'png',  markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 109, name: 'file (10)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 110, name: 'file (11)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 111, name: 'file (12)', format: 'png', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                    {id: 112, name: 'file (13)', format: 'png', markID: 'mark_1000',     isPinned: true,  path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165489, size: 1002}},
                    {id: 113, name: 'file (14)', format: 'png', markID: 'mark_unmarked', isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165489, size: 10256}},
                    {id: 106, name: 'file (7)', format: 'scss', markID: 'mark_1000',     isPinned: false, path: 'C:/Users/LocalHost/Homeworld', meta:{created: 156456, lastEdited: 165489, size: 140256}}
                ],
                isOpened: true,
            },
            {
                id: 'default__fold_002',
                path: 'C:/Users/LocalHost/Skate park',
                files: [
                    {id: 200, name: 'file (31)',  format: 'js',   markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156456, lastEdited: 165447, size: 100256}},
                    {id: 201, name: 'file (32)',  format: 'ini',  markID: 'mark_1000',      isPinned: true,  path: 'C:/Users/LocalHost/Skate park', meta:{created: 156456, lastEdited: 165489, size: 10024436}},
                    {id: 202, name: 'file (33)',  format: 'vue',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156779, lastEdited: 165342, size: 100223456}},
                    {id: 203, name: 'file (34)',  format: 'scss', markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156445, lastEdited: 165489, size: 1004256}},
                    {id: 204, name: 'file (35)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156456, lastEdited: 164489, size: 100256}},
                    {id: 205, name: 'file (36)',  format: 'scss', markID: 'mark_unmarked',  isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 207, name: 'file (38)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156456, lastEdited: 165489, size: 100256}},
                    {id: 208, name: 'file (39)',  format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156455, lastEdited: 162489, size: 100556}},
                    {id: 209, name: 'file (310)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156422, lastEdited: 165489, size: 100256}},
                    {id: 210, name: 'file (311)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156421, lastEdited: 161489, size: 10356}},
                    {id: 211, name: 'file (312)', format: 'png',  markID: 'mark_1000',      isPinned: false, path: 'C:/Users/LocalHost/Skate park', meta:{created: 156456, lastEdited: 165489, size: 104556}},
                ],
                isOpened: false,
            }
        ],
    }
}