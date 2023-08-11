import { TimeSpan } from '@hello.nrfcloud.com/proto/hello/history'
import { type Static } from '@sinclair/typebox'

export const timeSpans: {
	id: Static<typeof TimeSpan>
	title: string
}[] = [
	{ id: 'lastHour', title: 'last hour' },
	{ id: 'lastDay', title: 'last day' },
	{ id: 'lastWeek', title: 'last week' },
	{ id: 'lastMonth', title: 'last month' },
]
