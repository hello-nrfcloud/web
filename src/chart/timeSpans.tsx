import { TimeSpan } from '#api/api.js'

export type TimeSpanInfo = {
	id: TimeSpan
	title: string
}
export const timeSpans: Array<TimeSpanInfo> = [
	{ id: TimeSpan.lastHour, title: 'last hour' },
	{ id: TimeSpan.lastDay, title: 'last day' },
	{ id: TimeSpan.lastWeek, title: 'last week' },
	{ id: TimeSpan.lastMonth, title: 'last month' },
]
