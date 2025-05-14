import { settings } from "./settings"

export const sessionProjectsDefaultData = {

	proj_001: {
		id: "proj_001",
		headerPicture: {},
		parameters: {
			pinFilesIsFolded: {
				imgs: false,
				text: false
			},
			imagesHeight: 100,
			pinFoldersIsFolded: false,
			foldersIsFolded: true,
			showFoldersStartingWithDot: false
		},
		meta: {
			name: "project first",
			created: 1742744761272,
			lastModified: 1746799698177,
			lastOpened: 1746799698177,
			isPinned: false,
			description: "Descrtiption first of project",
			status: "closed"
		},
		tasks: {
			task_9636617: {
				id: "task_9636617",
				name: "start typing a description of a new task",
				descr: "",
				status: "undone",
				isPinned: false,
				isFolded: false,
				subtasksAvailability: false,
				subtasks: {},
				isSelected: true,
				isDone: false
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
				id: "folder_2334256",
				path: settings.initPath,
				files: [],
				isOpened: true,
				isPinned: false,
				displayedOnBar: true,
				isEmpty: false
			}
		]
	}
}