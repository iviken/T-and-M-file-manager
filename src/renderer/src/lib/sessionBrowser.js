export const sessionBrowserDefaultData = {
	
	proj_default: {
		id: "proj_default",
		headerPicture: {},
		parameters: {
			pinFilesIsFolded: {
				imgs: false,
				text: false
			},
			imagesHeight: 75,
			pinFoldersIsFolded: false,
			foldersIsFolded: false,
			showFoldersStartingWithDot: true
		},
		meta: {
			name: "default",
			created: 1742744761272,
			lastModified: 1742744761272,
			lastOpened: 1742744761272,
			isPinned: false,
			description: "default",
			status: "opened"
		},
		tasks: {
			task_001: {
				id: "task_001",
				name: "start typing a description of a new task",
				descr: "Lorem ipsum ... description",
				isDone: false,
				isSelected: true,
				isPinned: false,
				isFolded: true,
				subtasksAvailability: false,
				subtasks: {}
			}
		},
		marks: {
			mark_unmarked: {
				id: "mark_unmarked",
				color: "unmarked-color",
				descr: "--unmarked--",
				isFolded: {
					text: true,
					imgs: true
				},
				show: true
			}
		},
		folders: [
			{
				id: "default__fold_001",
				path: "/Temp",
				isOpened: true,
				isPinned: true,
				displayedOnBar: true,
				files: [],
				isEmpty: false
			}
		]
	}
}