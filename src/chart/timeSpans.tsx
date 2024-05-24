import { TimeSpan } from '#api/api.js'

export const timeSpans: {
	id: TimeSpan
	title: string
}[] = [
	{ id: TimeSpan.lastHour, title: 'last hour' },
	{ id: TimeSpan.lastDay, title: 'last day' },
	{ id: TimeSpan.lastWeek, title: 'last week' },
	{ id: TimeSpan.lastMonth, title: 'last month' },
]
